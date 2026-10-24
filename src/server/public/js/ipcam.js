function Ipcam (containerID, camera) {
  this.containerID = containerID
  this.camera = camera
  this.$container = null

  var self = this
  this.init = function () {
    self.$container = $("#"+self.containerID);
    var content = '<div class="panel panel-default panel-camera">'
    content += '<div class="panel-heading"><h3>'+self.camera.name+'</h3></div>'
    content += '<div class="panel-body">'
    content += '<div id="cam-player-'+self.camera.id+'"></div>'
    content += '<div id="cam-ptz-'+self.camera.id+'"></div>'
    content += '</div>'
    content += '</div>'
    self.$container.html(content)
    return self;
  }

  this.getCameras = function(callback) {
    console.log('reloadCameras')
    $.ajax({
      method: 'GET',
      url: '/api/cameras',
      success: function(response, textStatus) {
        console.log(response,textStatus);
        callback(null, response)
      },
      error: function(error) {
        console.log(error)
        callback(error, null)
      }
    })
  }
  
  this.getCamera = function (cameraId, callback) {
    $.ajax({
      method: 'GET',
      url: '/api/camera/' + cameraId + '?reload=true',
      success: function(response) {
        callback(null, response)
      },
      error: function(error) {
        console.log('Error al buscar camara')
        console.log(error)
        callback(error, null)
      }
    })
  }

  this.initPlayer = function () {
    if (!this.camera.onvifData) {
      new IpcamPlayer(this.camera.id, this.camera.onvifData.snapUri);
    } else {
      this.getCamera(this.camera.id, function (error, res) {
        if (res.onvifData) {
          new IpcamPlayer(res.id, res.onvifData.snapUri);
        }
      })
    }
    return self;
  }

  this.initPtz = function () {
    new IPcamPTZ('cam-ptz-'+self.camera.id, this.camera)
    return self;
  }
}

function IPcamPTZ(containerID, camera) {
  this.containerID = containerID;
  this.camera = camera;
  this.$container = $("#"+containerID);
  
  this.$container.addClass('col-xs-12 col-sm-6 col-lg-12 ptz-controls')

  var self = this;

  if (this.camera.onvifData) {
    var buttons = '';
    buttons += '<a href="#" class="up"></a>'
    buttons += '<a href="#" class="down"></a>'
    buttons += '<a href="#" class="left"></a>'
    buttons += '<a href="#" class="right"></a>'
    this.$container.html(buttons)
    setTimeout(function () {
      self.addListeners();
      self.reposition(true, 3, 500);
    }, 500);
  }

  this.reposition = function (retray, times, timeout) {
    console.log('reposition ' + times);
    var self = this;
    timeout = timeout ? timeout : 1000;
    self.$container.css('top', self.$container.parent().find('.image-player > img').height() * -1)
    self.$container.css('height', self.$container.parent().find('.image-player > img').height())
    self.$container.css('width', self.$container.parent().find('.image-player > img').width())
    if (retray && times > 0) {
      setTimeout(function () {
        self.reposition(retray, times-1)
      }, timeout);
    }
  }
  
  this.addListeners = function () {
    this.$container.find("a").on('click', function(e) {
      e.preventDefault();
      self.handleMove(this.className);
      setTimeout(function () {
        self.stopMove();
      }, 1000)
    })
  
    // this.$container.find("a").on('mousedown', function (e) {
    //   e.preventDefault();
    //   self.handleMove(this.className);
    //   return false;
    // })
    
    // this.$container.find("a").on('mouseup', function (e) {
    //   e.preventDefault();
    //   self.stopMove();
    //   return false;
    // })
  
    document.addEventListener('keydown', this.keydownEvent)
    document.addEventListener('keyup', this.keyupEvent)
  }

  var keyDirections = {
    ArrowUp: 'up',
    ArrowDown: 'down',
    ArrowLeft: 'left',
    ArrowRight: 'right'
  }

  this.keydownEvent = function(event) {
    const dir = keyDirections[event.key];
    if (dir) {
      event.preventDefault()
      self.handleMove(dir)
    }
  },
  this.keyupEvent = function(event) {
    const dir = keyDirections[event.key];
    if (dir) {
      event.preventDefault()
      self.stopMove()
    }
  },

  this.handleMove = function(direction) {
    console.log('Move', direction)
    $.ajax({
      method: 'POST',
      url: '/api/camera/'+ self.camera.id + '/move',
      data: { dir: direction, step: 1},
      success: function () {},
      error: function (error) {
        console.log(error)
      }
    })
  }

  this.stopMove = function() {
    $.ajax({
      method: 'POST',
      url: '/api/camera/'+ self.camera.id + '/stop',
      success: function () {},
      error: function (error) {
        console.log(error)
      }
    })
  }
}

function IpcamPlayer (containerId, url, timeout) {
  this.containerId = containerId;
  this.url = url;
  this.$container = null;
  this.playInterval;
  this.timeout = timeout ? timeout : 1000;
  this.doPlay = true

  var self = this;

  setTimeout(function () {
    self.init();
  }, 10);

  this.init = function () {
    this.$container = $("#cam-player-"+this.containerId);
    this.$container.addClass('image-player');
    this.$container.html('<img src="'+this.url+'" class="img-src"><div class="controls"></div>');
    this.addControls();
    this.play();
  }
  
  this.play = function () {
    var self = this;
    if (!this.doPlay) {
      return false;
    }

    setTimeout(function() {
      var millis = new Date().getTime();
      self.$container.children('.img-src')
        .attr("src", '/api/image?uri=' + self.url + '&d=' + millis)
        self.play();
    }, self.timeout)
  }
  
  this.addControls = function () {
    var reproButtons = '<div class="reproduction">';
    reproButtons += '<a href="#" class="play" style="display:none"><img src="/images/icons/play.png"></a>';
    reproButtons += '<a href="#" class="stop"><img src="/images/icons/pause.png"></a>';
    reproButtons += '</div>';
    this.$container.children(".controls").html(reproButtons);
    this.$container.find(".reproduction > a").on('click', this.handleCameraControl)
  }
  
  this.handleCameraControl = function (e) {
    e.preventDefault();
    if (this.className === 'play') {
      self.doPlay = true;
      $(this).hide();
      self.$container.find(" > .controls > .reproduction > a.stop").show();
      self.play();
    } else if (this.className === 'stop') {
      self.doPlay = false;
      self.$container.find(" > .controls > .reproduction > a.play").show();
      $(this).hide();
    }
  }

  // <div class="movement">
  //   <a href="#" class="right">Right</a>
  //   <a href="#" class="left">Left</a>
  //   <a href="#" class="up">Up</a>
  //   <a href="#" class="down">Down</a>
  // </div>

  // this.handleMoveCamera = function (e) {
  //   e.preventDefault();
  //   console.log('handleMoveCamera', this.className)
  //   var dir = this.className;
  //   var step = 1;
  //   $.post('POST',{
  //     url: '/camera/'+ id + '/move',
  //     data:{dir, step}
  //   })
  // }
}