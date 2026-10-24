<template>
  <div :style="{ 'width': w, 'height': h, 'position': 'relative' }">
    <img :src="path" :alt="alt" :style="{ 'width': '100%', 'height': '100%' }">
  </div>
</template>

<script>
export default {
  name: 'ipcc-icon',
  props: ['name', 'alt', 'width', 'height'],
  computed: {
    path () {
      let filename = '';
      switch(this.name) {
        case 'snapshot':
          filename = 'file-earmark-image.svg';
          break;
        case 'live':
          filename = 'camera.svg';
          break;
        case 'logo':
          filename = 'logo.png';
          break;
        default:
          filename = 'default.png';
          break;
      }
      return require('../../assets/' + filename);
    },
    w() {
      const width = this.width ? this.width : 20
      return width + 'px'
    },
    h() {
      const height = this.height ? this.height : 20
      return height + 'px'
    }
  }
}
</script>
