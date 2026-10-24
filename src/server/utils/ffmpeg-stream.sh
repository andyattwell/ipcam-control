#Working not using nvidia
ffmpeg -i "rtsp://<user>:<password>@<camera-ip>:554/<stream-path>" -c:v libvpx -b:v 800k -vf "scale=800:450" -listen 1 -f webm -header "Access-Control-Allow-Origin: *" http://localhost:8090/video.webm


ffmpeg -i "rtsp://<user>:<password>@<camera-ip>:554/<stream-path>" -c:v libvpx -b:v 800k -vf "scale=800:450" -listen 1 -f webm -header "Access-Control-Allow-Origin: *" http://localhost:8090/video.webm

#not working
#ffmpeg -hwaccel cuvid -hwaccel_output_format cuda -i "rtsp://<user>:<password>@<camera-ip>:554/<stream-path>" -c:v h264_nvenc -preset:v fast -b:v 800k -listen 1 -f mpegts -header "Access-Control-Allow-Origin: *" http://localhost:8181/video.ts

1080      9
1920      16



800       16
450         9