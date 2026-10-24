<template>
  <div class="camera-snap" :class="{'full': fullScreen }">
    <img v-if="tmpSnapUri" :src="tmpSnapUri">

    <div class="snap-timer">
      <div class="row mx-0">
        <div class="col-12">
          <label for="SnapUri">Snapshot timer: </label>
        </div>
        <div class="col-8 pe-1">
          <input class="form-range" 
            type="range" name="snapTime" 
            v-model="snapTimeOut" 
            :min="minTime" :max="maxTime" :step="step" @change="saveSnapTime">
        </div>
        <div class="col-4 ps-1">
          <input class="form-control form-control-sm float-start" 
            type="number" v-model="snapTimeOut" 
            :min="minTime" :max="maxTime" :step="step" @change="saveSnapTime">
        </div>
      </div>
    </div>

  </div>
</template>
<script>
import { serverHost } from '@/frontend/utils/helpers'

export default {
  name: 'camera-snapshot',
  props: ['camera'],
  emits: ['updateTimer'],
  data() {
    return {
      fullScreen: false,
      snapTimer: null,
      snapTimeOut: 3,
      tmpSnapUri: '',
      endpoint: serverHost + '/api/image',
      minTime: 0.1,
      maxTime: 60,
      step: 0.5
    }
  },
  beforeUnmount() {
    this.tmpSnapUri = null
    clearTimeout(this.snapTimer);
  },
  mounted() {
    if (!this.camera.onvifData) return;
    this.snapTimeOut = this.camera.onvifData.snapTime
    this.reloadSnap()
  },
  computed: {
    fullSnapUri () {
      return this.endpoint + `?uri=${this.camera.onvifData.snapUri}`
    }
  },
  methods: {
    saveSnapTime() {
      this.$emit('updateTimer', this.snapTimeOut)
    },
    reloadSnap() {
      if (!this.camera.onvifData || !this.camera.onvifData.snapUri) { 
        this.tmpSnapUri = null
        clearTimeout(this.snapTimer);
        return false 
      }
      let self = this
      let timeout = this.snapTimeOut * 1000
      this.tmpSnapUri = this.fullSnapUri + '&time=' + Date.now().toString().substring(0,10)
        this.snapTimer = setTimeout(() => {
          self.reloadSnap()
        }, timeout)

    }
  }
}
</script>