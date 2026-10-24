<template>
  <div class="camera-info text-start">
    <div v-if="value.onvifData">
      
      <div class="card bg-dark text-white">
        <div class="card-header bg-primary">
          <h4 data-bs-toggle="collapse" data-bs-target="#imageSettings" aria-expanded="false" aria-controls="imageSettings">Imaging Service Capabilities</h4>
        </div>
        <div class="card-body collapse" id="imageSettings" v-if="value.onvifData.ImagingServiceCapabilities">
          <nested-detail :jsonData="value.onvifData.ImagingServiceCapabilities"/>
        </div>
      </div>

      <div class="card bg-dark text-white">
        <div class="card-header bg-primary">
          <h4 data-bs-toggle="collapse" data-bs-target="#ImagingSettings" aria-expanded="false" aria-controls="ImagingSettings">Imaging Settings</h4>
        </div>
        <div class="card-body collapse" id="ImagingSettings" v-if="value.onvifData.ImagingSettings">
          <nested-detail :jsonData="value.onvifData.ImagingSettings"/>
        </div>
      </div>

      <div class="card bg-dark text-white">
        <div class="card-header bg-primary">
          <h4 data-bs-toggle="collapse" data-bs-target="#OSDOptions" aria-expanded="false" aria-controls="OSDOptions">OSD Options</h4>
        </div>
        <div class="card-body collapse" id="OSDOptions" v-if="value.onvifData.OSDOptions">
          <nested-detail :jsonData="value.onvifData.OSDOptions"/>
        </div>
      </div>

      <div class="card bg-dark text-white">
        <div class="card-header bg-primary">
          <h4 data-bs-toggle="collapse" data-bs-target="#mediaServiceCapabilities" aria-expanded="false" aria-controls="mediaServiceCapabilities">Media Service Capabilities</h4>
        </div>
        <div class="card-body collapse" id="mediaServiceCapabilities">
          <nested-detail :jsonData="value.onvifData.mediaServiceCapabilities"/>
        </div>
      </div>

      <div class="card bg-dark text-white">
        <div class="card-header bg-primary">
          <h4 data-bs-toggle="collapse" data-bs-target="#capabilities" aria-expanded="false" aria-controls="capabilities">Capabilities</h4>
        </div>
        <div class="card-body collapse" id="capabilities">
          <nested-detail :jsonData="value.onvifData.capabilities"/>
        </div>
      </div>

    </div>

  </div>
</template>
<style>
.card.bg-dark {
  background-color: #070707 !important;
}
</style>
<script>
import CameraService from '@/frontend/services/CameraService'
// import NestedForm from '@/frontend/components/Partials/NestedForm'
import NestedDetail from '@/frontend/components/Partials/NestedDetail'
export default {
  props: ['modelValue'],
  emits: ['update:modelValue', 'onReload'],
  components: {
    NestedDetail
  },
  computed: {
    value: {
      get() {
        return this.modelValue
      },
      set(value) {
        this.$emit('update:modelValue', value)
      }
    }
  },
  methods: {
    reloadOnvif() {
      this.$emit('onReload')
    },
    save() {
      CameraService.save(this.value.id, this.value)
        .then(() => {
          console.log('Guardado!')
        })
        .catch((error) => {
          console.log('Error guardando', error)
        })
    }
  }
}
</script>