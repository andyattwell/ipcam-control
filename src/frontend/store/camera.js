const state = {
  cameras: []
};

const mutations = {
  setCameras(state, cameras) {
    state.cameras = cameras
  },
  addCamera(state, camera) {
    state.cameras.push(camera);
  },
  updateCamera(state, camera) {
    state.cameras = state.cameras.map((cam) => {
      if (cam.id === camera.id) {
        return camera
      }
      return cam
    })
  },
  removeCamera(state, id) {
    const camIndex = state.cameras.find((cam, index) => {
      return cam.id === id ? index : null
    })
    state.cameras = state.cameras.splice(camIndex, 1)
  }
};

const actions = {
  addCamera(context, camera) {
    context.commit('addCamera', camera);
  },
  setCameras(context, cameras) {
    context.commit('setCameras', cameras);
  },
  updateCamera(context, camera) {
    context.commit('updateCamera', camera);
  },
  removeCamera(context, camera) {
    context.commit('removeCamera', camera);
  }
};

const getters = {
  getCameras: state => {
    return state.cameras;
  },
  getCamera: (state) => (cameraId) => {
    return state.cameras.find((cam) => cam.id === cameraId);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};