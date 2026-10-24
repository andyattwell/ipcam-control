<template>
  <div class="container h-100">
    <div class="row h-100">
      <!-- <Navigation :cameras="cameras"/> -->
      <div class="col-12 col-sm-4 col-12-md-4 col-lg-3 h-100 ps-0">
        <Sidebar :cameras="cameras" @open="openModal" />
      </div>
      <div class="col-12  col-sm-8 col-md-8 col-lg-9" id="main-container">
        <router-view />
      </div>
    </div>
    
    <Modal :show="showModal" :title="modalTitle" @close="closeModal">
      <camera-form v-if="modalSection === 'camera-form'" :input-data="editCamera" @close="closeModal"/>
    </Modal>

  </div>
</template>
<script>
import { mapState } from 'vuex'
// import Navigation from '@/frontend/components/Navigation.vue'
import CameraService from "@/frontend/services/CameraService";
import Sidebar from '@/frontend/components/Partials/Sidebar.vue';
import CameraForm from '@/frontend/components/Camera/CameraForm.vue'
import Modal from "@/frontend/components/Partials/Modal.vue";
export default {
  name: "app",
  components: {
    Sidebar,
    CameraForm,
    Modal
  },
  data() {
    return {
      // cameras: [],
      showModal: false,
      modalSection: null,
      editCamera: {}
    }
  },
  computed: {
    modalTitle() {
      return this.modalSection === 'camera-form' ? 'Agregar cámara' : ''
    },
    ...mapState({
      cameras: state => {
        return state.camera.cameras
      }
    }),
  },
  mounted() {
    this.getCameras()
  },
  methods: {
    getCameras() {
      let self = this
      CameraService.getCameras()
        .then((camList) => {
          // self.cameras = camList.cameras
          self.$store.commit('camera/setCameras', camList.cameras)
        })
    },
    openModal(section, camera) {
      this.modalSection = section
      this.showModal = true
      this.editCamera = camera || {}
    },
    closeModal() {
      this.showModal = false
      this.modalSection = null
    }
  }
};
</script>
<style>
.modal {
  background: rgba(0, 0, 0, 0.75);
}
</style>