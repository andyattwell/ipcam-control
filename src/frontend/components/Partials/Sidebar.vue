<template>
  <div id="sidebar" class="d-flex flex-column flex-shrink-0 bg-dark-blue text-white mb-3 mb-md-0 h-100">
    <div class="bg-darker-blue">
      <router-link :to="{ name: 'dashboard' }" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none px-2">
        <Icon name="logo" alt="IP Camera control" width="30" height="30" class="mt-2" />
        <span class="ms-2 fs-4 mt-2">IP Cameras Control</span>
      </router-link>
      <hr>
    </div>
    <ul class="nav nav-pills flex-column mb-auto d-none d-sm-block">
      <li class="nav-item px-2 py-1" :class="{'active': isActive('dashboard') }">
        <router-link :to="{ name: 'dashboard' }" class="nav-link py-0 dashboard">
          <p class="fs-5 mb-0">Dashboard</p>
        </router-link>
      </li>
      <li v-for="cam in cameras" :key="cam.id" class="nav-item px-2 py-1" :class="{'active': isActive(cam.id) }">
        <router-link :to="{ name: 'camera', params: { cameraID: cam.id } }" class="nav-link">
          <div class="snap-thumb" :style="{ backgroundImage: cam.onvifData && cam.onvifData.snapUri ? 'url('+ snapshotEndpoint + cam.onvifData.snapUri+')' : '' }"></div>
          <p class="fs-5 my-0">{{ cam.name }}</p>
          <p class="m-0 lh-1 cam-ip text-secondary">{{ cam.hostname }}</p>
          <span class="badge connection-status" :class="{ 'connected': cam.connectionStatus, 'disconnected': !cam.connectionStatus }"></span>
        </router-link>
        
        <div class="dropdown camera-actions-dropdown">
          <button class="btn btn-sm dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
          </button>
          <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownMenuButton1">
            <li>
              <a class="dropdown-item" href="#" @click="editCamera(cam)">Editar</a>
            </li>
            <li><a class="dropdown-item" href="#" @click="deleteCamera(cam.id)">Eliminar</a></li>
          </ul>
        </div>

      </li>
    </ul>

    <select name="camerasSelect" class="d-block d-sm-none form-control" v-model="activeCamera" @change="goToCamera">
      <option value="">Todas</option>
      <option :value="cam.id" v-for="cam in cameras" :key="cam.id" >{{ cam.name }}</option>
    </select>

    <ul class="nav nav-pills flex-column mx-3">
      <li class="nav-item my-2">
        <a href="#" class="btn btn-primary w-100" @click.prevent="createCamera">Agregar cámara</a>
      </li>
    </ul>
  </div>
</template>
<style>
.nav-item {
  position: relative;
}
.nav-item:hover .camera-actions-dropdown{
  display: block;
}
.camera-actions-dropdown{
  display: none;
  position: absolute !important;
  right: 0;
  top: 0;
}
</style>
<script>
import { mapState } from 'vuex'
import { serverHost } from '@/frontend/utils/helpers'
import CameraService from '@/frontend/services/CameraService';
import { useRouter } from 'vue-router';
import Icon from '@/frontend/components/Partials/Icon.vue';

export default {
  name: "Sidebar-menu",
  components: { Icon },
  data() {
    return {
      activeCamera: "",
      snapshotEndpoint: serverHost + '/api/image?uri='
    }
  },
  computed: {
    ...mapState({
      cameras: state => {
        return state.camera.cameras
      }
    }),
  },
  watch: {
    '$route' (to){
      if (to.params.cameraID) { 
        this.activeCamera = to.params.cameraID
      }
    }
  },
  mounted() {
    this.activeCamera = this.$route.params.cameraID || ""
  },
  methods: {
    isActive(id) {
      const router = useRouter()
      let currentPathObject = router.currentRoute.value;
      return currentPathObject.name === id || (currentPathObject.name === 'camera' && parseInt(currentPathObject.params.cameraID) === parseInt(id))
    },
    createCamera() {
      this.$emit('open', 'camera-form')
    },
    deleteCamera(id) {
      let r = confirm('Eliminar camara?')
      if (!r) { return false }
      CameraService.deleteCamera(id)
        .then(() => {
          this.$store.commit('camera/removeCamera', id)
        })
        .catch((error) => {
          alert('Error eliminando camara')
          console.log(error)
        })
    },
    editCamera(camera) {
      this.$emit('open', 'camera-form', camera)
    },
    goToCamera() {
      console.log('goToCamera', this.activeCamera)
      if (this.activeCamera === "") {
        return this.$router.push({ name: 'dashboard' })
      }
      this.$router.push({ name: 'camera', params: { cameraID: this.activeCamera } })
    }
  }
}
</script>
