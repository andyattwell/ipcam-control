<template>
  <div>
    <h2>Create OSD</h2>
    <div v-if="maximumNumberOfOSDs && maximumNumberOfOSDs.$">
      <label>Maximum OSDs: {{ maximumNumberOfOSDs.$.Total }}</label>
    </div>
    <div>
      <label>Type:</label>
      <select disabled v-model="selectedType" class="form-control bg-dark text-white">
        <option v-for="tp in types" :key="tp" :value="tp">{{ tp }}</option>
      </select>
    </div>

    <div v-if="selectedType === 'Text'">
      <label>Text Option:</label>
      <select disabled v-model="selectedTextOption" class="form-control bg-dark text-white">
        <option v-for="textOption in textOptions.type" :key="textOption" :value="textOption">{{ textOption }}</option>
      </select>

      <div v-if="selectedTextOption === 'Plain'">
        <label>Text:</label>
        <input type="text" class="form-control bg-dark text-white" v-model="plaintext" />
      </div>
    </div>

    <div v-if="selectedTextOption === 'DateAndTime'">
      <label>Date Format:</label>
      <input v-model="dateFormat" type="text" placeholder="Date Format" class="form-control bg-dark text-white">
      <label>Time Format:</label>
      <input v-model="timeFormat" type="text" placeholder="Time Format" class="form-control bg-dark text-white">
    </div>

    <div>
      <label>Position:</label>
      <select v-model="selectedPosition" class="form-control bg-dark text-white">
        <option v-for="position in positionOptions" :key="position" :value="position">{{ position }}</option>
      </select>

      <div class="row" v-if="selectedPosition === 'Custom'">
        <div class="col-6">
          <label>X</label>
          <input v-model="positionX" type="number" min="-1" max="1" step=".1" placeholder="Position X" class="form-control bg-dark text-white">
        </div>
        <div class="col-6">
          <label>Y</label>
          <input v-model="positionY" type="number" min="-1" max="1" step=".1"  placeholder="Position Y" class="form-control bg-dark text-white">
        </div>
      </div>
    </div>
    
    <button @click="createOSD">Guardar</button>    
  </div>
</template>

<script>
import CameraService from '@/frontend/services/CameraService';
export default {
  props: ['OSDOptions', 'OSD', 'camera'],
  name: 'osd-form',
  data() {
    return {
      maximumNumberOfOSDs: {},
      types: [],
      positionOptions: [],
      textOptions: {},
      selectedType: 'Text',
      selectedPosition: '',
      selectedTextOption: 'Plain',
      dateFormat: '',
      timeFormat: '',
      plaintext: '',
      positionX: '',
      positionY: '',
      OSDToken: ''
    };
  },
  created() {
    this.maximumNumberOfOSDs = this.OSDOptions.maximumNumberOfOSDs.$;
    this.types = this.OSDOptions.type;
    this.positionOptions = this.OSDOptions.positionOption;
    this.textOptions = this.OSDOptions.textOption;
  },
  methods: {
    createOSD() {

      let osd = {
        OSDToken: this.OSDToken,
        videoSourceConfigurationToken: this.videoSourceConfigurationToken,
        plaintext: 'Text to overlay',
      };

      osd.position = this.selectedPosition
      if (this.selectedPosition === 'Custom') {
        osd.position = {
          x: this.positionX,
          y: this.positionY
        }
      }

      if (this.selectedTextOption === 'DateAndTime') {
        osd.dateFormat = this.dateFormat;
        osd.timeFormat = this.timeFormat;
      } else if (this.selectedTextOption === 'Plain') {
        osd.plaintext = this.plaintext
      }

      CameraService.saveOSD(this.camera, osd)
        .then(() => {
          this.$emit('close', true)
        })
        .catch((error) => {
          console.log({error})
        })

    }
  },
  watch: {
    OSD(osdData) {
      if (osdData) {
        this.OSDToken = osdData.$.token
        this.videoSourceConfigurationToken = osdData.videoSourceConfigurationToken
        this.selectedType = osdData.type
        this.selectedPosition = osdData.position.type
        this.selectedTextOption = osdData.textString.type
        if (this.OSD.textString.type === 'DateAndTime') {
          this.dateFormat = osdData.textString.dateFormat
          this.timeFormat = osdData.textString.timeFormat
        } else if (osdData.textString.type === 'Plain') {
          this.plaintext = osdData.textString.plainText
        }
        if (osdData.position.type === 'Custom') {
          this.positionX = osdData.position.pos.$.x
          this.positionY = osdData.position.pos.$.y
        }
      }
    }
  }
};
</script>