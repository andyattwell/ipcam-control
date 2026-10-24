require('dotenv').config()
const { promisify } = require("util");
const db = require ('../utils/db');
const tableName = 'config'

const fields = [{
  name: 'group_type',
  type: 'text' 
},{
  name: 'name',
  type: 'text' 
},{
  name: 'value',
  type: 'text'
},{
  name: 'type',
  type: 'text'
},{
  name: 'extra',
  type: 'text'
}]

async function dropCreate() {
  // await db.dropTable(tableName)
  db.createTable(tableName, fields)
}
dropCreate()

async function dbUpdate() {
  // const query = "UPDATE "+tableName+" SET group_type='search-targets' WHERE group_type='search-engines';";
  const query = "ALTER TABLE " + tableName + " ADD COLUMN type TEXT default null"
  await db.run(query);
}

// dbUpdate();

class Config {
  constructor (id = null, group_type = 'root', name = '', value = '', extra = null){
    this.id = id
    this.group_type = group_type
    this.name = name
    this.value = value
    this.extra = extra
  }

  /**
   * Static method to retrieve all cameras in database
   *
   * @returns {Array} - Returns an array of database rows
   */
  static async all (field = null, operator = '=', value = null) {
    return new Promise ((resolve, reject) => {
      db.all(tableName, field, operator, value)
        .then((response) => {
          resolve(response)
        })
        .catch((error) => {
          console.log(error)
          reject(error)
        })
    })
  }
  
  /**
   * Find camera by id in database and instanciate a new Camera object
   *
   * @param {number} id - Database Id of the camera.
   * @returns {Camera} - If found returns a Camera object. Null otherwise
   */
  static async find (id, field = 'id') {
    return new Promise ((resolve, reject) => {
      db.find(tableName, id, field)
        .then((result) => {
          resolve(result)
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  static async remove(id) {
    return new Promise ((resolve, reject) => {
      db.remove(tableName, id)
        .then((result) => {
          resolve(result)
        })
        .catch(error => {
          reject(error)
        })
    })
  }

  /**
   * Insert new config
   *
   * @async
   */
  static async insert (group_type = 'root', name, value, type = null, extra = null) {
    if (!name || !value) {
      return false;
    }
    if(extra) {
      extra = JSON.stringify(extra)
    }
    try {
      await db.insert(tableName, { group_type, name, value, type, extra }) 
      return db.last(tableName)
    } catch (error) {
      return error
    }
  }   
  /**
   * Update config
   *
   * @async
   */
  static async update (id, group_type, name, value, type = null, extra = null) {
    if(extra) {
      extra = JSON.stringify(extra)
    }
    try {
      await db.update(tableName, { id, group_type, name, value, type, extra })
      return Config.find(id)
    } catch (error) {
      return error
    }
  }
}

module.exports = Config