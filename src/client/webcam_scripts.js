var btnStart = document.getElementById("btn-start");
var btnStop = document.getElementById("btn-stop");
var btnCapture = document.getElementById("btn-capture");

// The stream & capture
var stream = document.getElementById("stream");
var capture = document.getElementById("capture");
//   var snapshot = document.getElementById("snapshot");

// The video stream
var cameraStream = null;

// Attach listeners
btnStart.addEventListener("click", startStreaming);
btnStop.addEventListener("click", stopStreaming);
btnCapture.addEventListener("click", captureSnapshot);

// Start Streaming
function startStreaming() {
  var mediaSupport = "mediaDevices" in navigator;

  if (mediaSupport && null == cameraStream) {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(function (mediaStream) {
        cameraStream = mediaStream;

        stream.srcObject = mediaStream;

        stream.play();
      })
      .catch(function (err) {
        console.log("Unable to access camera: " + err);
      });
  } else {
    alert("Your browser does not support media devices.");

    return;
  }
}

// Stop Streaming
function stopStreaming() {
  if (null != cameraStream) {
    var track = cameraStream.getTracks()[0];

    track.stop();
    stream.load();

    cameraStream = null;
  }
}

function captureSnapshot() {
  if (null != cameraStream) {
    var ctx = capture.getContext("2d");
    ctx.drawImage(stream, 0, 0, capture.width, capture.height);
  }
}
function createBlob(dataURL) {
  var BASE64_MARKER = ";base64,";
  if (dataURL.indexOf(BASE64_MARKER) == -1) {
    var parts = dataURL.split(",");
    var contentType = parts[0].split(":")[1];
    var raw = decodeURIComponent(parts[1]);
    return new Blob([raw], { type: "application/octet-stream" });
  }
  var parts = dataURL.split(BASE64_MARKER);
  var contentType = parts[0].split(":")[1];
  var raw = window.atob(parts[1]);
  var rawLength = raw.length;

  var uInt8Array = new Uint8Array(rawLength);

  for (var i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i);
  }
  //   console.log(uInt8Array);
  //   console.log(new Blob([uInt8Array], { type: "application/octet-stream" }));
  return new Blob([uInt8Array], { type: "application/octet-stream" });
}
