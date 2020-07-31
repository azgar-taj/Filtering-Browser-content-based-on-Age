var x = 0;
function processImage() {
  // Replace <Subscription Key> with your valid subscription key.
  var subscriptionKey = "SubscriptionKEY";

  var uriBase = "FaceAPIEndpoint";

  // Request parameters.
  var params = {
    returnFaceId: "true",
    returnFaceLandmarks: "false",
    returnFaceAttributes: "age", //,gender,headPose,smile,facialHair,glasses,emotion," +
    //"hair,makeup,occlusion,accessories,blur,exposure,noise",
  };

  // Display the image.
  var req_blob = createBlob(capture.toDataURL("image/jpeg"));
  // Perform the REST API call.
  $.ajax({
    url: uriBase + "?" + $.param(params),

    // Request headers.
    beforeSend: function (xhrObj) {
      xhrObj.setRequestHeader("Content-Type", "application/octet-stream");
      xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
    },

    type: "POST",

    // Request body.
    data: req_blob,
    processData: false,
  })

    .done(function (data) {
      // Show formatted JSON on webpage.
      console.log(JSON.stringify(data));
      if (JSON.parse(JSON.stringify(data, null, 2))[0] == null) {
        setTimeout(function () {
          captureSnapshot();
        }, 1000);
        setTimeout(function () {
          processImage();
        }, 1100);
      } else {
        x = JSON.parse(JSON.stringify(data, null, 2))[0].faceAttributes.age;
        $("#responseTextArea")[0].innerText =
          "Your age is determined to be " + x + ". Now you can start exploring";
        stopStreaming();
        var port = chrome.runtime.connect({ name: "knockknock" });
        port.postMessage({ joke: "donot knock", age: x });
        console.log("closing tab");
        setTimeout(function () {
          console.log("inside closing");
          chrome.tabs.query({ active: true, currentWindow: true }, function (
            tabs
          ) {
            console.log(tabs[0]);
            chrome.tabs.remove(tabs[0].id);
          });
        }, 2000);
      }
    })

    .fail(function (jqXHR, textStatus, errorThrown) {
      // Display error message.
      var errorString =
        errorThrown === ""
          ? "Error. "
          : errorThrown + " (" + jqXHR.status + "): ";
      errorString +=
        jqXHR.responseText === ""
          ? ""
          : jQuery.parseJSON(jqXHR.responseText).message
          ? jQuery.parseJSON(jqXHR.responseText).message
          : jQuery.parseJSON(jqXHR.responseText).error.message;
      console.log(errorString);
      setTimeout(function () {
        captureSnapshot();
      }, 1000);
      setTimeout(function () {
        processImage();
      }, 1100);
    });
}
