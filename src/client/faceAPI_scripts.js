function processImage() {
  // Replace <Subscription Key> with your valid subscription key.
  var subscriptionKey = "927e95e2809242439d2c9934c0454631";

  var uriBase =
    "https://faceagedetection.cognitiveservices.azure.com/face/v1.0/detect";

  // Request parameters.
  var params = {
    returnFaceId: "true",
    returnFaceLandmarks: "false",
    returnFaceAttributes:
      "age,gender,headPose,smile,facialHair,glasses,emotion," +
      "hair,makeup,occlusion,accessories,blur,exposure,noise",
  };

  // Display the image.
  // var sourceImageUrl = document.getElementById("inputImage").value;
  document.querySelector("#sourceImage").src = capture.toDataURL("image/jpeg");
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
      $("#responseTextArea").val(JSON.stringify(data, null, 2));
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
      alert(errorString);
    });
}
