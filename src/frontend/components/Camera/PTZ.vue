<template>
  <div class="card bg-none text-white text-start mb-3">
    <div class="card-body">
      <div class="camera-actions">
        <div class="btn-group btn-group-move" role="group" aria-label="Basic example">
          <button type="button" class="btn btn-primary btn-move btn-left" @mousedown.prevent="move('left')" @mouseup.prevent="stop()"><i class="arrow left"></i></button>
          <button type="button" class="btn btn-primary btn-move btn-up" @mousedown.prevent="() => move('up')" @mouseup.prevent="stop()"><i class="arrow up"></i></button>
          <button type="button" class="btn btn-primary btn-move btn-down" @mousedown.prevent="() => move('down')" @mouseup.prevent="stop()"><i class="arrow down"></i></button>
          <button type="button" class="btn btn-primary btn-move btn-right" @mousedown.prevent="() => move('right')" @mouseup.prevent="stop()"><i class="arrow right"></i></button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import CameraService from '@/frontend/services/CameraService';

export default {
  props: ['camera'],
  data() {
    return {
      speed: 1,
      keyDirections: {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right'
      }
    }
  },
  mounted() {
    document.addEventListener('keydown', this.keydownEvent)
    document.addEventListener('keyup', this.keyupEvent)
  },
  beforeUnmount(){
    document.removeEventListener('keydown', this.keydownEvent)
    document.removeEventListener('keyup', this.keyupEvent)
  },
  methods: {
    keydownEvent(event) {
      const dir = this.keyDirections[event.key];
      if (dir) {
        event.preventDefault()
        this.move(dir)
      }
    },
    keyupEvent(event) {
      const dir = this.keyDirections[event.key];
      if (dir) {
        event.preventDefault()
        this.stop()
      }
    },
    move(dir){
      CameraService.move(this.camera.id, dir, this.speed)
    },
    stop() {
      CameraService.stop(this.camera.id)
    }
  }
}
</script>