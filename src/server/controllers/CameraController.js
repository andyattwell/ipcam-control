const Camera = require('../entities/Camera')
const path = require('path')
const { promisify } = require("util");

class CameraController {

/**
 * Create Camera
 * @param {object} data Camera information
 * @param {string} data.name Camera display name
 * @param {string} data.hostname Camera ip or hostname
 * @param {string} data.port Camera onvif port
 * @param {string} data.username Camera username
 * @param {string} data.password Camera password
 */
  static async createCamera (data) {

    if (!data.name || !data.hostname || !data.username || !data.password) {
      throw {
        validationError: "Name, hostname, username and password required"
      };
    }

    let camera = new Camera(
      null,
      data.name,
      data.hostname,
      data.port,
      data.username,
      data.password
    )

    try {
      camera = await camera.save()
      
    } catch (error) {
      console.log(error)
      return error
    }
    // .then((response) => {
    //   console.log('ACA', response)
    // })
    // .catch((error) => {
    //   console.log('Error', error)
    // })
    
    //try connection before saving
    try {
      await camera.connect()
      await camera.getOnvifInfo()
    } catch (error) {
      console.log({error})
      
      // return error
    }
    return camera
  }

/**
 * Create Camera
 * @param {string} id Camera id
 * */
static async getCameras () {
  return await Camera.all()
  
}

/**
 * Create Camera
 * @param {string} id Camera id
 * */
  static async getCamera (id, reload) {
    const camera = await Camera.find(id)
  
    if (reload === 'true') {
      await camera.connect()
      await camera.getOnvifInfo()
      await camera.save()
    }

    return camera
    
  }

/**
 * Create Camera
 * @param {number} id Camera display name
 * @param {string} data.name Camera display name
 * @param {string} data.hostname Camera ip or hostname
 * @param {string} data.port Camera onvif port
 * @param {string} data.username Camera username
 * @param {string} data.password Camera password
 * @param {string} data.onvifData Stringyfied Json with onvif information
 * @param {boolean} data.reloadOnvif If true, will connect to camera and get the onvif data
 */
  static async updateCamera (id, data) {
    const camera = await Camera.find(id)
    // const camera = new Camera(req.params.id, req.body.name, req.body.hostname, req.body.port, req.body.username, req.body.password, req.body.onvifData)
    camera.name = data.name
    camera.hostname = data.hostname
    camera.port = data.port
    camera.username = data.username
    camera.password = data.password
    camera.onvifData = data.onvifData
  
    if (data.reloadOnvif) {
      await camera.connect()
      await camera.getOnvifInfo()
    }
  
    await camera.save()
  
    return camera
  }

  /**
   * Delete Camera
   * @param {object} req Express request object
   * @param {string} req.params.id ID of the camera to delete
   * @param {object} res Express response object
   * */
  static async deleteCamera (id) {
    return Camera.remove(id)
  }

  /**
   * Get Camera Recordings
   * @param {object} req Express request object
   * @param {string} req.params.id Camera ID
   * @param {object} res Express response object
   * */
  static async getRecordings (id) {
    const camera = await Camera.find(id)
    if (!camera) {
      return false
    }

    await camera.connect()
    const promiseRecordings = promisify(camera.onvif.getReplayUri).bind(camera.onvif);
    let gotRecordings = await promiseRecordings()
    
    return gotRecordings
  }

  /**
   * Get Camera Recordings
   * @param {number} id Camera ID
   * @param {string} dir Direction to move up|down|rigth|left
   * @param {number} step Amount to move
   * */
  static async moveCamera (id, dir, step) {
    const camera = await Camera.find(id)
    if (!camera) {
      return false
    }
    
    await camera.connect()
  
    let x = 0;
    let y = 0;
    step = parseFloat(step);
  
    switch (dir) {
      case 'up':
        y += step;
        break;
      case 'down':
        y -= step;
        break;
      case 'left':
        x += step;
        break;
      case 'right':
        x -= step;
        break
      default:
        break;
    }
  
    //min x and y -1, max 1
    camera.onvif.continuousMove({x, y}, function(err, data) {
      if (err) {
        return err
      }
      return data
    })
  
  }

  /**
   * Stop camera movement
   * @param {object} req Express request object
   * @param {number} req.params.id Camera ID
   * @param {object} res Express response object
   * */
  static async stopMoveCamera (id) {
    const camera = await Camera.find(id)
    if (!camera) {
      return false
    }
    await camera.connect()
    camera.onvif.continuousMove({speed: 0})
    return true
  }

  static getVideoFile (id, file) {
    const videoFilePath = path.join(__dirname, 'public/video', id.toString(), file)
    return videoFilePath
  }
    
  /**
   * Create Camera
   * @param {object} req Express request object
   * @param {object} res Express response object
   * */
  static async discover() {
    const devices = await Camera.findDevices()
    const cameras = await Camera.all()
    return devices.map((d) => {
      const _c = cameras.find((c) => c.hostname === d.ip)
      d.connected = typeof _c === 'object' ? _c.name : null
      return d
    })
  }

  /**
  * Create Camera
  * @param {object} req Express request object
  * @param {object} res Express response object
  * */
  static async testConnection(camera) {
    return Camera.testConnection(camera)
  }

  /**
  * Create Camera
  * @param {number} id Camera ID
  * @param {object} osdSettings
  * */
  static async saveOSD(id, osdSettings) {
    
    try {
      const camera = await Camera.find(id)
      if (!camera) {
        return false
      }
      await camera.connect()
      return await camera.setOSDSettings(osdSettings)
    } catch (error) {
      return error
    }
  }

}

module.exports = CameraController