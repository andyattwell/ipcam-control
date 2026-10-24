<template>
  <div>
    <form @submit.prevent="submitForm">

      <div class="mb-3 row" v-if="currentStep === 1">
        <div class="col-8 input-group">
          <!-- <label for="hostnameInput" class="form-label">Host</label> -->
          <input v-model="camera.hostname" type="text" required class="form-control" id="hostnameInput" placeholder="Nombre de host / IP" title="Nombre de host / IP">
          <!-- <label for="portInput" class="form-label">Puerto</label> -->
          <input v-model="camera.port" type="number" required class="form-control" id="portInput" placeholder="Puerto" title="Puerto">
          <div class="input-group-append">
            <button class="btn btn-primary" @click.prevent="discover">Buscar</button>
          </div>
        </div>
        <div class="col-4">
        </div>
      </div>

      <div class="mb-3 row" v-if="currentStep === 2">
        <div class="col-6">
          <label for="usernameInput" class="form-label">Usuario</label>
          <input v-model="camera.username" type="text" required class="form-control" ref="usernameInput" placeholder="Enter username">
        </div>
        <div class="col-6">
          <label for="passwordInput" class="form-label">Contraseña</label>
          <input v-model="camera.password" type="password" required class="form-control" id="passwordInput" placeholder="Enter password">
        </div>
      </div>
      
      <div class="mb-3 row" v-if="currentStep === 3">
        <div class="col-4" v-if="snapshotUrl !== ''">
          <img :src="snapshotUrl" alt="" id="snap">
        </div>
        <div class="col-8">
          <label for="nameInput" class="form-label">Nombre</label>
          <input v-model="camera.name" type="text" required class="form-control" id="nameInput" placeholder="Enter name">
        </div>
      </div>

      <div class="btn-group float-end">

        <button class="btn btn-secondary" v-if="currentStep > 1" @click.prevent="prevStep">Anterior</button>
        <button class="btn btn-secondary" v-if="currentStep < 3" @click.prevent="nextStep">Siguiente</button>

        <button type="submit" class="btn btn-primary" v-if="currentStep === 3">Guardar</button>

        <button type="cancel" class="btn btn-secondary" @click.prevent="close">Cancelar</button>
      </div>

    </form>
    
    <Modal :title="'Buscar cámaras'" :show="showDiscover" @close="showDiscover = false">
      <div class="mt-6 mb-3 discovery-list">
        <table v-if="discoverDevices.length" class="table table-sm table-hover table-dark">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Ip</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="device in discoverDevices" :key="device.ip">
              <td :class="{'text-muted' : device.connected }">
                {{ device.connected ? device.connected : device.name }}
              </td>
              <td>
                <a :href="'http://' + device.ip" target="_blank" class="text-white" :class="{'text-muted' : device.connected }">{{ device.ip }}</a>
              </td>
              <td>
                <a v-if="!device.connected" href="#" class="btn btn-sm btn-primary" @click.prevent="selectCamera(device)">+</a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Modal>
  </div>
</template>
<style>
#snap {
  width: 100%;
}
</style>
<script>
import CameraService from '@/frontend/services/CameraService'
import Modal from '@/frontend/components/Partials/Modal.vue'

export default {
  props: ['inputData'],
  components: {
    Modal
  },
  data () {
    return {
      currentStep: 1,
      camera: {
        name: '',
        hostname: '',
        port: 8899,
        username: '',
        password: '',
      },
      discoverDevices: [],
      showDiscover: false,
      snapshotUrl: ''
    }
  },
  watch: {
    inputData(val) {
      this.camera = {...val}
    }
  },
  mounted() {
    this.camera = {
      ...this.camera,
      ...this.inputData
    }
  },
  methods: {
    nextStep () {
      if (this.currentStep === 1 && !this.camera.hostname || !this.camera.port) {
        return false;
      }
      if (this.currentStep === 2) {
        return this.connectToCamera()
      }
      this.currentStep++;
    },
    prevStep () {
      this.currentStep--;
    },
    connectToCamera () {
      // this.camera.hostname = device.ip
      return CameraService.testConnection({
        name: this.camera.name,
        hostname:  this.camera.hostname,
        port: this.camera.port,
        username: this.camera.username,
        password: this.camera.password
      })
      .then((response) => {
        const camera = response.camera;
        const onvifData = camera.onvifData;

          if (camera.connectionStatus) {
            if (onvifData && onvifData.OSDs && onvifData.OSDs.length > 0) {
              this.camera.name = onvifData.OSDs[0].textString.plainText
            }
            this.snapshotUrl = onvifData.snapUri
            this.currentStep = 3
          }
          
        })
        .catch((error) => {
          alert('Error conectando a la cámara')
          console.log({error})
        })
    },
    selectCamera(device) {
      this.camera.hostname = device.ip
      this.showDiscover = false
      this.currentStep = 2
      this.$nextTick(() => {
        this.$refs.usernameInput.focus()
      })
    },
    submitForm() {
      let prom;
      if (this.camera.id) {
        prom = CameraService.save(this.camera.id, this.camera)
      } else {
        prom = CameraService.create(this.camera)
      }
      prom.then((response) => {
        let storeAction = this.camera.id ? 'updateCamera' : 'addCamera'
        this.$store.commit('camera/' + storeAction, response)
        this.$emit('close')
      })
      .catch((error) => {
        let errorMsg = 'Error guardando cámara'
        alert({errorMsg})
        console.log(error)
      })
    },
    discover() {
      this.showDiscover = true
      CameraService.discover()
        .then((response) => {
          this.discoverDevices = response
        })
        .catch((error) => {
          console.log({error})
        })
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>
