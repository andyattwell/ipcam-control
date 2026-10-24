<template>
  <div id="cameras-container" class="row">
    <div :key="index" v-for="(cam, index) in cameras" class="col-md-6 col-lg-6 mb-3"> 
      <!-- <Snapshot :camera="cam"/> -->
      <Camera :camId="cam.id"/>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import Camera from './Camera/Camera.vue';
// import Snapshot from './Camera/Snapshot.vue';
export default {
  name: "dashboard-page",
  components: {
    // Snapshot
    Camera
  },
  data() {
    return {
      selectedCamera: null,
    };
  },
  computed: {
    ...mapState({
      cameras: state => {
        return state.camera.cameras
      }
    }),
  },
  methods: {},
  mounted() {}
};
</script>

<style>
</style>