import axios from '@/frontend/utils/http-common'

const getCameras = () => {
  return axios.get('/config')
    .then((response) => {
      return response.data
    })
}

const findCamera = (id, reload = false) => {
  return axios.get('/camera/' + id + '?reload=' + reload)
    .then((response) => {
      return response.data
    })
}

const create = (data) => {
  return axios.put('/camera', data)
    .then((response) => {
      return response.data
    })
}

const save = (id, data) => {
  return axios.post('/camera/' + id, data)
    .then((response) => {
      return response.data
    })
}

const deleteCamera = (id) => {
  return axios.delete('/camera/' + id)
}

const move = (id, dir, step) => {
  return axios.post('/camera/'+ id + '/move', {dir, step})
}
const stop = (id) => {
  return axios.post('/camera/'+ id + '/stop')
}
const image = (id) => {
  return axios.post('/camera/'+ id + '/image')
}
const discover = () => {
  return axios.get('/discover')
  .then((response) => {
    return response.data
  })
}

const testConnection = (device) => {
  return axios.post('/testConnection', {device})
  .then((response) => {
    return response.data
  })
}

const saveOSD = (id, osdSettings) => {
  return axios.post('/camera/' + id + '/osd', osdSettings)
    .then((response) => {
      return response.data
    })
}

export default {
  getCameras,
  findCamera,
  save,
  deleteCamera,
  move,
  stop,
  image,
  create,
  discover,
  testConnection,
  saveOSD
}