<template>
  <div class="video-player">
    <div>
      <div class="float-end">
        <span
          class="badge connected-badge float-end" 
          :class="{'bg-success': connected, 'bg-secondary': !connected }"
          @click="toggleConnection" 
          :title="connected ? 'Conectado. Click para desconectar' : 'Desconectado. Click para conectar'"></span>
          
        <span
          class="badge connected-badge bg-primary float-end"
          @click="toggleShowVideo" 
          title="Recargar video"></span>

      </div>
    </div>
    <video ref="videoPlayer" autoplay controls v-if="showVideo">
      <source :src="videoEndpoint">
    </video>
  </div>
</template>

<script>
import { wsHost } from '@/frontend/utils/helpers'

export default {
  name: ['rstp-video'],
  props: ['camera'],
  emits: ['onEnded'],
  data() {
    return {
      showVideo: false,
      loaded: false,
      duration: 0,
      currentTime: 0,
      status: '',
      connected: false,
      socket: null,
      messages: [],
      videoEndpoint: ''
    };
  },
  mounted() {
    this.connect()
  },
  beforeUnmount() {
    this.disconnect()
  },
  methods: {
    toggleShowVideo() {
      this.showVideo = false
      this.$nextTick(() => {
        this.showVideo = true
      })
    },
    toggleConnection() {
      if (this.connected) {
        return this.disconnect()
      }
      this.connect()
    },
    connect() {
      
      if (!this.camera.onvifData) { return false }
      
      let self = this
      this.loading = true
      this.socket = new WebSocket(this.websocketUri);

      this.socket.addEventListener('open', () => {
        this.connected = true;
        console.log('WebSocket connection established.');
      });

      this.socket.addEventListener('message', event => {
        const data = JSON.parse(event.data);
        if (!data) { return false }

        
        if (data.videoUri) {
          console.log('socket message', data);
          self.videoEndpoint = data.videoUri
          self.$nextTick(() => {
            self.showVideo = true
          })
          
          // fetch(data.videoUri)
          //   .then((response) => {
          //     console.log({response})
          //   })
          //   .catch((error) => {
          //     console.log(error)
          //   })
          // this.$refs.videoPlayer.load()
        }

      });

      this.socket.addEventListener('close', () => {
        this.connected = false;
        this.showVideo = false;
        console.log('WebSocket connection closed.');
      });

    },
    disconnect() {
      console.log({videoPlayer:this.$refs.videoPlayer})
      if (this.$refs.videoPlayer) {
        this.$refs.videoPlayer.pause()
        this.$refs.videoPlayer.load()
      }
      this.videoEndpoint = ''
      this.socket.close();
    },
  },
  computed: {
    realTime() {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();

      return hours + ':' + minutes + ':' + seconds;
    },
    websocketUri () {
      return wsHost +'?id=' + this.camera.id
    }
  },
  watch: {
    // camera(source) {
    //   console.log('New video source', this.mediaSource)
    //   this.$refs.videoPlayer.currentTime = Number.MAX_SAFE_INTEGER
    //   this.$refs.videoPlayer.currentTime = 0
    // }
  }
};
</script>