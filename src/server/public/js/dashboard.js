function Dashboard (containerId, cameras) {
  this.containerId = containerId;
  this.cameras = cameras;
  

  this.init = function () {
    var self = this;

    self.cameras.forEach(function(cam) {
      new Ipcam("camera-"+cam.id, cam)
      .init()
      .initPlayer();
    })
  }

  
  this.init();
}