require('dotenv').config()
const { app } = require('electron') 
const { Database } = require('sqlite3')
const path = require('path')
const fs = require('fs')
const {isDev} = require('./general')
// const dbPath = path.join(__dirname, '../', 'db')
const dbPath = isDev() ? path.join(__dirname, '../', 'db'): app.getPath("userData")
const dbName = path.join(dbPath, 'cameras.db')

/**
 * Checks that the db parent folder exists before creating de database file
 */
function ensureDBPathExists() {
  if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(dbPath, { recursive: true });
    // console.log(`Created path: ${dbPath}`);
  }
}

ensureDBPathExists();

/**
 * Delete the database file
 * @param {String} databasePath Full path to the database file
 * @async
 */
function deleteDatabase (databasePath) {
  return new Promise((resolve, reject) => {
    // Delete the database file
    fs.unlink(databasePath, (error) => {
      if (error) {
        console.error('Error deleting the database:', error);
        reject(error)
      } else {
        console.log('Database deleted successfully.');
        resolve()
      }
    });
  })
}

/**
 * Create a database table
 * Field types: TEXT | INTEGER
 * @param {String} tableName The name of the table to be created
 * @param {Array.<{name: String, type: String}>} cols Columns array for the new table
 * @async
 */
function createTable (tableName = null, cols = []) {
  return new Promise(function(resolve,reject) {
    if (!tableName || !cols.length) {
      return
    }

    let tableCols = [{ name: 'id', type: 'INTEGER PRIMARY KEY AUTOINCREMENT' }]
    tableCols = tableCols.concat(cols)
    const tableFiels = tableCols.map(obj => obj.name + ' ' + obj.type).join(',');

    // console.log(`CREATE TABLE if not exists ${tableName} (${tableFiels})`)
    let db = new Database(dbName);

    db.serialize(() => {
      // db.run("CREATE TABLE1 if not exists examenes (info TEXT)");
      db.run(`CREATE TABLE if not exists ${tableName} (${tableFiels})`,
      function (error) {
        if (error) {
          console.log(`Error creando tabla ${tableName}`)
          console.log(`Values ${tableFiels}`)
          console.log(error)
          return reject(error)
        }
        resolve()
      });
    
    });
    db.close();
  })
}

/**
 * Drop table from database
 * @param {String} tableName The name of the table to be dropped
 * @async
 */
function dropTable(tableName = null) {
  return new Promise(function(resolve,reject) {
    let db = new Database(dbName);
    db.serialize(() => {
      // db.run("CREATE TABLE1 if not exists examenes (info TEXT)");
      db.run(`DROP TABLE if exists ${tableName}`,
      function (error) {
        if (error) {
          console.log(`Error dropeando tabla ${tableName}`)
          console.log(error)
          return reject(error)
        }
        resolve()
      });
    });
    db.close();
  })
}

/**
 * Parses the given data object and organizes its keys and values into separate arrays.
 *
 * @param {object} data - The data object to be parsed.
 * @returns {object} - An object containing three arrays: 'params', 'fields', and 'values'.
 */
function parseFieldsParams (data) {
  let params = [];
  let fields = [];
  let values = [];

  Object.keys(data).forEach(f => {
    params.push(['?'])
    fields.push([f])
    values.push(data[f])
  });
  return {params, fields, values};
}

/**
 * Retrieves all records from a specified table asynchronously.
 * 
 * @param {string} table - The name or identifier of the table.
 * @returns {Array} - An array containing all the records from the table.
 * @async
 */
async function all (table, field = null, operator = '=', value = null) {
  return new Promise(function(resolve,reject) {
    let db = new Database(dbName);
    let results = []
    db.serialize(() => {
      let query = 'SELECT *';
      query += " FROM " + table;

      if (field && value) {
        if (operator === 'IN' && typeof value === 'object') {
          value = "('"+value.join("','")+"')";
        } else {
          value = "'" + value + "'";
        }
        query += " WHERE " + field + " "+operator+" " + value;
      }
      db.each(query, function(err, row) {
        if (err) {
          console.log('Error geting results for ' + table)
          reject(err);
        }
        results.push(row);
      }, function(err) {
        db.close();
        if (err) {
          reject(err);
        }
        resolve(results);
      });
    });
  });
}

/**
 * Get one record filtered by specific value in field
 * @param {String} table The name of the table to look in
 * @param {String} id The the string to match
 * @param {String} field The column to match with. Default id
 * @returns {Object} Record that matches the filters
 * @async
 */
async function find (table, id, field = 'id') {
  return new Promise(function(resolve,reject) {
    let db = new Database(dbName);
    db.serialize(() => {
      let query = "SELECT * FROM " + table
      if (id) {
        query += " WHERE " + field + " = '" + id + "' LIMIT 1";
      }
      console.log(query)

      db.get(query, function (err, result) {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    });
    db.close();
  });
}

/**
 * Retrieves the last record int the specified table
 * @param {String} table The name of the table to look in
 * @returns {Object} Database record
 * @async
 */
async function last (table) {
  return new Promise(function(resolve,reject) {
    let db = new Database(dbName);     
    db.serialize(() => {
      db.get("SELECT * FROM " + table + " ORDER BY id DESC LIMIT 1", function (err, result) {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
      db.close();
    });
  });
}

/**
 * Insert one record into the specified table
 * @param {String} table The name of the table to insert into
 * @param {Object} data Object representing columns:values to be inserted into the table
 * @async
 */
async function insert (table, data) {
  return new Promise(function(resolve,reject) {
    let db = new Database(dbName);
    delete data['id'];
    let fields = "";
    let values = "";
    let insertData = null;
    if(Array.isArray(data)) {
      data.forEach(item => {
        const queryParams = parseFieldsParams(item)
        values = queryParams.params.join(',')
        fields = queryParams.fields.join(',')
        insertData.push(queryParams.values);
      });
    } else {
      const queryParams = parseFieldsParams(data)
      values = queryParams.params.join(',')
      fields = queryParams.fields.join(',')
      insertData = queryParams.values;
    }

    let query = "INSERT INTO " + table + "("+fields+") VALUES (" +values+ ")";

    db.serialize(() => {
      let stmt = db.prepare(query, (state, err) => {
        console.log('prepare', {state, err, query})
        if (err) {
          console.log('Error db prepare', {state, err, query})
          console.log(err)
          reject();
        }
      });
      stmt.run(insertData, (err) => {
        console.log('run')
        if (err) {
          console.log('Error inserting into ' + table, {query})
          console.log(err)
          reject();
        }
      });
      stmt.finalize((err) => {
        console.log('finalize')
        if (err) {
          console.log('Error db finalize', {err})
          reject();
        }
        resolve();
      });
    });
    db.close();
  });
}

/**
 * Insert one record into the specified table
 * @param {String} table The name of the table to update
 * @param {Object} data Object representing columns:values to be updated
 * @async
 */
async function update (table, data) {
  return new Promise(function(resolve,reject) {
    let db = new Database(dbName);
    let id = data['id'];
    
    let setStr = [];
    Object.keys(data).forEach(f => {
      if (f !== 'id') {
        setStr.push(`${f}='${data[f]}'`);
      }
    });

    let query = `UPDATE ${table} SET ${setStr.join(",")} WHERE id = '${id}'`;
    db.run(query, (result, err) => {
      if (err) {
        console.log('Error inserting into ' + table, {query})
        console.log(err)
        reject(err);
      }
      db.close();
      resolve(result)
    });
  });
}

/**
 * Insert one record into the specified table
 * @param {String} table The name of the table to delete from
 * @param {String} id Id of the record to delete
 * @async
 */
async function remove (table, id) {
  return new Promise(function(resolve,reject) {
    let db = new Database(dbName);
    let query = `DELETE FROM ${table} WHERE id = '${id}'`;
    db.run(query, (result, err) => {
      if (err) {
        console.log('Error deleting into ' + table, {query})
        console.log(err)
        reject(err);
      }
      resolve(result)
      db.close();
    });
  });
}


/**
 * Insert one record into the specified table
 * @param {String} table The name of the table to delete from
 * @param {String} id Id of the record to delete
 * @async
 */
async function query (queryStr) {
  return new Promise(function(resolve,reject) {
    let db = new Database(dbName);
    db.run(queryStr, (result, err) => {
      if (err) {
        console.log(err)
        reject(err);
      }
      resolve(result)
      db.close();
    });
  });
}

/**
 * Test basic database operations
 * @param {String} tableName The name of the table to be dropped
 * @async
 */
async function test() {

  const newTableName = 'testTable'
  
  try {
    console.log('[01] - TEST createTable')
    await createTable(newTableName, [
      {
        name: 'test_field',
        type: 'TEXT'
      }
    ])
    console.log('[01] - Tabla creada correctamente!')
  } catch (error) {
    console.log('[01] - ERROR CREATING TABLE')
    console.log({error})
    return false
  }

  try {
    console.log('[02] - TEST insert')
    await insert(newTableName, { test_field: 'Test number uno'})
    console.log('[02] - insert succes!')
  } catch (error) {
    console.log('[02] - ERROR inserting row')
    console.log({error})
    return false
  }

  let results = []
  try {
    console.log('[03] - TEST get all')
    results = await all(newTableName)
    console.log('[03] - get all succes!')
    console.log({results})
    if (results.length < 0) {
      console.log('[03] - ERROR get all, no records found')
      return false
    }
  } catch (error) {
    console.log('[03] - ERROR get all')
    console.log({error})
    return false
  }

  let result = null
  try {
    console.log('[04] - TEST find row for id: ', results[0].id)
    result = await find(newTableName, results[0].id)
    console.log('[04] - get succes!')
    console.log({result})
    if (!result) {
      console.log('[04] - ERROR get row, no records found')
      return false
    }
  } catch (error) {
    console.log('[04] - ERROR get row')
    console.log({error})
    return false
  }

  try {
    console.log('[05] - TEST update id: ', result.id)
    await update(newTableName, { id: result.id, test_field: 'Updated' })
    console.log('[05] - update success!')
  } catch (error) {
    console.log('[05] - ERROR update row')
    console.log({error})
    return false
  }

  try {
    console.log('[06] - TEST delete id: ', result.id)
    await remove(newTableName, result.id)
    console.log('[06] - delete success!')
  } catch (error) {
    console.log('[06] - ERROR delete row')
    console.log({error})
    return false
  }

  try {
    console.log('[06] - TEST dropTable')
    await dropTable(newTableName)
    console.log('[06] - delete success!')
  } catch (error) {
    console.log('[06] - ERROR delete row')
    console.log({error})
    return false
  }

  try {
    console.log('[07] - TEST deleteDatabase')
    await deleteDatabase(dbName)
    console.log('[06] - deleteDatabase success!')
  } catch (error) {
    console.log('[06] - ERROR deleteDatabase')
    console.log({error})
    return false
  }
  
}

function run (query) {
  let db = new Database(dbName);
  console.log('db.run ', query)
  return new Promise ((resolve, reject) => {
    db.serialize(() => {
      db.run(query, function(res, error) {
        if (error) return reject(error);
        console.log('db.res', res)
        resolve(res);

      })
    });
    db.close();
  })
  
}

module.exports = {
  query,
  deleteDatabase,
  createTable,
  dropTable,
  all,
  find,
  last,
  insert,
  update,
  remove,
  test,
  run
}