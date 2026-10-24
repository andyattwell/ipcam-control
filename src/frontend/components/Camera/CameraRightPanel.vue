<template>
  <div>
    <div class="row">

    <!-- PTZ -->
    <div class="col-12 col-md-4 col-lg-12">
      <PTZ :camera="camera" v-if="camera && camera.connectionStatus" />
    </div>
    <div class="col-12 col-md-8 col-lg-12">
      <div class="card">
        <div class="card-header">
          <h4>{{ camera.name }} <button class="btn btn-primary btn-sm float-end" @click="getCameraInfo">R</button></h4>
        </div>
        <div class="card-body">
          <p class="d-block" style="position: relative;">
            Estado: {{ currentStatus }} 
            <span class="badge connection-status" :class="{ 'connected': !loading && camera.connectionStatus, 'disconnected': !loading && !camera.connectionStatus, 'connecting': loading }"></span>
          </p>
          <p><label for="Hostname">Hostname:</label> 
            <input type="text" class="form-control form-control-sm bg-dark text-white" name="Hostname" :value="camera.hostname">
          </p>

          <p v-if="camera.onvifData">
            <label for="SnapUri">Snap Uri:</label>
            <input class="form-control form-control-sm" disabled type="text" name="SnapUri" :value="camera.onvifData.snapUri">
          </p>

          <p v-if="camera.onvifData">
            <label for="SnapUri">RTSP Uri:</label>
            <input class="form-control form-control-sm" disabled type="text" name="streamUrl" :value="camera.onvifData.streamUrl">
          </p>
        </div>
      </div>
    </div>

    <div class="col-12 mt-lg-3">
      <div class="card" v-if="camera.onvifData">
        <div class="card-header">
          <h4>OSDs <button class="btn btn-primary btn-sm float-end" @click="showOSD = true">Crear</button></h4>
        </div>
        <div class="card-body">
          <ul class="list-group ">
            <li v-for="(osd, index) in camera.onvifData.OSDs" :key="index" class="list-group-item bg-dark">
              <a href="#" class="text-decoration-none text-white" @click.prevent="editOSD(osd)">
                <span v-if="osd.textString.type === 'Plain'">Plain Text: {{ osd.textString.plainText }}</span>
                <span v-else-if="osd.textString.type === 'DateAndTime' ">DateAndTime: {{ osd.textString.dateFormat }} {{ osd.textString.timeFormat }}</span>
                <span v-else>{{ osd }}</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- <div class="feed-control mt-2">
      <button class="btn btn-primary" @click="showInfo = true">Información</button>
    </div> -->
    </div>

    <!-- <Modal :title="'Información de cámara'" :show="showInfo" @close="showInfo = false">
      <camera-info v-if="camera && showInfo" v-model="camera" @onReload="getCameraInfo(camera.id, true)"/>
    </Modal> -->

    <Modal :title="'OSD'" :show="showOSD" @close="showOSD = false">
    <OSDForm 
      v-if="camera && camera.onvifData?.OSDOptions"
      :OSDOptions="camera.onvifData.OSDOptions"
      :OSD="selectedOSD"
      :camera="camera.id"
      @close="closeOsdForm"
    />
    </Modal>
  </div>
</template>
<script>
import PTZ from './PTZ.vue';
// import CameraInfo from '@/frontend/components/Camera/CameraInfo.vue';
import Modal from '@/frontend/components/Partials/Modal.vue';
import OSDForm from './OSDForm.vue';
export default {
  props: ['camera', 'loading'],
  emits: ['reload'],
  components: {
    Modal, OSDForm, PTZ
  },
  data() {
    return {
      showOSD: false,
      selectedOSD: null
    }
  },
  methods: {
    editOSD(osd) {
      this.selectedOSD = osd
      this.showOSD = true
    },
    getCameraInfo() {
      this.$emit('reload')
    },
    closeOsdForm(reload) {
      this.selectedOSD = null
      this.showOSD = false
      if (reload) {
        this.getCameraInfo (this.camera.id, true)
      }
    },
  },
  computed: {
    currentStatus() {
      if (this.loading) return 'Conectando'
      return this.camera && this.camera.connectionStatus ? 'Conectada' : 'Desconectada'
    }
  }
}
</script>