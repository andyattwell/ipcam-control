<template>
  <div :class="isSingle ? 'row' : ''">
    <div v-if="camera" class="bg-gray-700" :class="isSingle ? 'col-md-12 col-lg-9' : ''">

      <div class="camera" :class="{ 'single': isSingle }">
        <div class="video-wrapper">
          <Loader v-if="loading"/>

          <div v-if="!loading && camera && camera.connectionStatus">
            <Video v-if="showFeed" :camera="camera"></Video>
            <CameraSnapshot v-else :camera="camera" @updateTimer="updateTimer" :class="{ 'single': isSingle }"/>
          </div>
          
          <div v-if="!loading && camera && !camera.connectionStatus" class="camera-not-found">
            <div>
              <h4>Cámara no encontrada</h4>
            </div>
          </div>

        </div>

        <div v-if="!loading && camera && camera.connectionStatus" class="mt-3 camera-modes">
          <a href="#" @click.prevent="this.showFeed = false" class="btn camera-mode-btn" :class="{'active': !showFeed}">
            <Icon name="snapshot" alt="Snap mode"/>
          </a>    
          <a href="#" @click.prevent="this.showFeed = true" class="btn camera-mode-btn" :class="{'active': showFeed}">
            <Icon name="live" alt="Live mode"/>
          </a>    
        </div>

      </div>
    </div>
    
    <CameraRightPanel :loading="loading" class="col-md-12 col-lg-3" :camera="camera" v-if="camera && isSingle" @reload="connectToCamera"/>
    
  </div>
</template>
<script>
import CameraService from '@/frontend/services/CameraService';
import CameraRightPanel from './CameraRightPanel.vue';
import Video from '@/frontend/components/Camera/VideoPlayer.vue';
import Loader from '@/frontend/components/Partials/Loader.vue';
import CameraSnapshot from '@/frontend/components/Camera/Snapshot.vue';
import Icon from '@/frontend/components/Partials/Icon.vue';

export default {
  name: 'Camera-player',
  components: { Video, CameraSnapshot, Loader, CameraRightPanel, Icon },
  props: ['camId'],
  data() {
    return {
      cameraID: null,
      loading: true,
      isSingle: false,
      showFeed: false,
    }
  },
  computed: {
    camera() {
      return this.$store.getters['camera/getCameras'].find((cam) => {
        return cam.id == this.cameraID
      })
    }
  },
  watch: {
    '$route' (to, from){
      if (to.params.cameraID === from.params.cameraID) { 
        return false
      }
      this.isSingle = true
      this.showFeed = false
      this.cameraID = null
      this.$nextTick(() => {
        this.cameraID = to.params.cameraID
      })
    },
    cameraID() {
      if (this.camera && !this.camera.connectionStatus) {
        this.connectToCamera()
      } else {
        this.loading = false
      }
    }
  },
  mounted () {
    this.cameraID = this.$route.params.cameraID || this.camId
    this.isSingle = !!this.$route.params.cameraID
  },
  methods: {
    toggleFeed () {
      if (!this.showFeed) {
        this.showFeed = true
      } else {
        this.showFeed = false
      }
    },
    updateTimer(newTimer) {
      this.camera.onvifData.snapTime = newTimer
      CameraService.save(this.camera.id, this.camera)
      .then(() => {})
      .catch((error) => {
        console.log('Error guardando', error)
      })
    },
    connectToCamera() {
      const self = this
      this.loading = true
      CameraService.findCamera(this.camera.id, true)
        .then((camera) => {
          self.loading = false
          self.$store.commit('camera/updateCamera', camera)
        })
        .catch((error) => {
          console.log({error})
          self.loading = false
        })
    }
  }
}
</script>