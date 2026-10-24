// const fetch = require('node-fetch');
const Camera = require('../entities/Camera')
const Config = require('../entities/Config')
const path = require('path');

class ConfigController {
  static async getAll () {
    return await Camera.all()
  }
}

module.exports = ConfigController