require('dotenv').config()
const { promisify } = require("util");
const onvif = require('onvif');
const db = require ('../utils/db');
const tableName = 'cameras'
const findDevices = require('local-devices')

// db.dropTable(tableName)
//   .then(() => {
    // db.createTable(tableName, [{
    //   name: 'name',
    //   type: 'text' 
    // },{
    //   name: 'hostname',
    //   type: 'text' 
    // },{
    //   name: 'port',
    //   type: 'text' 
    // },{
    //   name: 'username',
    //   type: 'text' 
    // },{
    //   name: 'password',
    //   type: 'text' 
    // },{
    //   name: 'onvifData',
    //   type: 'text'
    // },{
    //   name: 'connections',
    //   type: 'number'
    // }])
  // })

/**
 * Hide fields from cameras array
 *
 * @param {Array} cameras - Array of cameras.
 * @param {Array} fieldsToHide - Array of field names to hide.
 * @returns {Array} - Array of cameras with only visible fields 
 */
const hideFields = (cameras, fieldToHide = []) => {
  const hidden = [...fieldToHide]
  return cameras.map((cam) => {
    cam.password = '*'.repeat(cam.password.length);
    let output = {}
    Object.keys(cam).forEach((key) => {
      // console.log(key, hidden.includes(key), cam[key])
      if(!hidden.includes(key)) {
        output[key] = cam[key]
      }
    })
    return output
  })
}

class Camera {
  // id = null;
  // name = '';
  // hostname = '';
  // port = 8899;
  // connectionStatus = false
  // onvif = null
  // connections = 0
  
  // onvifData = null
  // onvifData = {
  //   OSDs: null,
  //   ImagingSettings: null,
  //   ImagingServiceCapabilities: null,
  //   capabilities: null,
  //   OSDOptions: null,
  //   mediaServiceCapabilities: null,
  //   snapUri: null
  // }

  constructor (id = null, name = '', hostname = '', port = 8899, username = '', password = '', onvifData = null) {
    this.id = id
    this.name = name
    this.hostname = hostname
    this.port = port
    this.username = username
    this.password = password
    this.onvifData = onvifData

    if (onvifData && typeof onvifData === 'object'){
      this.onvifData = onvifData
    }else if (onvifData && onvifData !== '') {
      this.onvifData = JSON.parse(onvifData)
    }
  }

/**
 * Static method to retrieve all cameras in database
 *
 * @returns {Array} - Returns an array of database rows
 */
  static async all () {
    return new Promise ((resolve, reject) => {
      db.all(tableName)
        .then((response) => {
          let cameras = response.map((cam) => {
            if (cam.onvifData) {
              let onvifData = JSON.parse(cam.onvifData)
              cam.onvifData = {
                snapUri: onvifData.snapUri,
                streamUrl: onvifData.streamUrl,
                snapTime: onvifData.snapTime || 3
              }
            }
            return new Camera(cam.id, cam.name, cam.hostname, cam.port, cam.username, cam.password, cam.onvifData)
          })
          // cameras = hideFields(response)
          resolve(cameras)
        })
        .catch(error => {
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
          let camera = null
          if (result) {
            camera = new Camera(result.id, result.name, result.hostname, result.port, result.username, result.password, result.onvifData)
          }
          resolve(camera)
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
 * Save camera info to database
 *
 * @async
 */
  async save () {
    let data = {
      name: this.name,
      hostname: this.hostname,
      port: this.port,
      username: this.username,
      password: this.password,
      connections: this.connections
    }
    if(this.onvifData) {
      data.onvifData = JSON.stringify(this.onvifData)
    }

    if (this.id) {
      data.id = this.id
      await db.update(tableName, data)
    } else {
      // console.log('insert', tableName, data)
      await db.insert(tableName, data)
    }

    return Camera.find(data.hostname, 'hostname')
  }

/**
 * Instanciate and connect to Onvif Cam
 *
 * @returns {onvif.Cam} - If the connection is succesfull returns a Cam object, otherwise null
 */
  async connect (rejectOnConnectionError = true, timeout = 25000) {
    let self = this
    return new Promise((resolve, reject) => {
      let ov = new onvif.Cam({
        hostname: this.hostname,
        username: this.username,
        password: this.password,
        port: this.port,
        timeout: timeout
      }, (error) => {
        if (error && rejectOnConnectionError) {
          console.log('connect error', error)
          reject(error)
        } else {
          self.connectionStatus = true
          self.onvif = ov
          resolve(self)
        }
      });
    })
  }

/**
 * Connect to onvif and get OSD, Media, Imaging, Capabilites, Snapshot and Stream info
 *
 * @returns {onvif.Cam} - If the connection is succesfull returns a Cam object, otherwise null
 */
  async getOnvifInfo () {
    const self = this
    const promiseGetSnapshotUri = promisify(this.onvif.getSnapshotUri).bind(this.onvif);
    let gotSnapUri = await promiseGetSnapshotUri()
    let snapUri = ''
    if (gotSnapUri && gotSnapUri.uri) {
      snapUri = gotSnapUri.uri.replaceAll('&amp;', '&')
      snapUri = snapUri.replaceAll(' ', '')
    }

    const promiseGetOSDs = promisify(this.onvif.getOSDs).bind(this.onvif);
    let gotOSDs = await promiseGetOSDs()

    const promiseGetOSDOptions = promisify(this.onvif.getOSDOptions).bind(this.onvif);
    let gotOSDOptions = await promiseGetOSDOptions()

    const promiseGetMediaServiceCapabilities = promisify(this.onvif.getMediaServiceCapabilities).bind(this.onvif);
    let gotMediaServiceCapabilities = await promiseGetMediaServiceCapabilities()

    const promiseGetCapabilities = promisify(this.onvif.getCapabilities).bind(this.onvif);
    let gotCapabilities = await promiseGetCapabilities()

    const promiseGetImagingServiceCapabilities = promisify(this.onvif.getImagingServiceCapabilities).bind(this.onvif);
    let gotImagingServiceCapabilities = await promiseGetImagingServiceCapabilities()
    
    const promiseGetImagingSettings = promisify(this.onvif.getImagingSettings).bind(this.onvif);
    let gotImagingSettings = await promiseGetImagingSettings()

    const promiseGetStreamUri = promisify(this.onvif.getStreamUri).bind(this.onvif);
    let gotSreamUri = await promiseGetStreamUri({protocol: 'RTSP' })

    this.onvifData = {
      OSDs: gotOSDs.getOSDsResponse.OSDs,
      ImagingSettings: gotImagingSettings,
      ImagingServiceCapabilities: gotImagingServiceCapabilities,
      capabilities: gotCapabilities,
      OSDOptions: gotOSDOptions.getOSDOptionsResponse.OSDOptions,
      mediaServiceCapabilities: gotMediaServiceCapabilities,
      snapUri: snapUri,
      streamUrl: gotSreamUri.uri,
      snapTime: this.onvifData ? this.onvifData.snapTime : 3
    }

    return this.onvifData
  }

  // let osdSettings = {
  //   OSDToken: '',
  //   plaintext: 'Text to overlay',
  //   // position: 'UpperLeft, UpperRight, LowerLeft or LowerRight',
  //   position: {
  //     x: '-1 to 1',
  //     y: '-1 to 1',
  //   }
  // }

  async setOSDSettings(osdSettings) {
    return new Promise((resolve, reject) => {
      // Set OSD settings
      this.onvif.setOSD(osdSettings, (err, result) => {
        if (err) {
          console.error(err);
          return reject(err)
        }
        resolve(result)
      });
    })
  }
  
  static async findDevices (address = '192.168.1.1-192.168.1.254') {
    return new Promise((resolve, reject) => {
      findDevices({ address })
        .then((devices) => {
          resolve(devices)
        })
        .catch((error) => {
          console.log('Error buscando dispositivos')
          console.log(error)
          reject(error)
        })
    })
  }

  static async testConnection (device) {
    const camera = new Camera(
      null,
      device.name,
      device.hostname,
      device.port,
      device.username,
      device.password
    )
    
    try {
      await camera.connect()
      await camera.getOnvifInfo()
    } catch (error) {
      return { error }
    }

    // this.searching = false
    return { camera }
  }
}

module.exports = Camera