// var results = document.querySelectorAll(".b_algo[data-bm]");
// for (i = 0; i < results.length; i++) results[i].hidden = true;
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
var port = chrome.runtime.connect({ name: "knockknock" });
port.postMessage({ joke: "Knock knock" });
port.onMessage.addListener(function (msg) {
  //MakeRequest();
  if (msg.isAdult == 1) {
    console.log("He's an adult so no filter");
  } else {
    console.log("He's a child so filter");
    //document.getElementById("b_results").style.visibility = "hidden";
    //document.getElementById("b_context").style.visibility = "hidden";
    console.log("Hiding contents of page");
    document.getElementsByTagName("html")[0].style.display = "none";
    console.log("loading");
    window.onload = function () {
      console.log("loaded");
      console.log("Calling Azure Function");
      MakeRequest();
    };
  }
  console.log(msg);
});
function MakeRequest() {
  let currentPageURL = location.href;
  console.log(currentPageURL);
  fetch(
    "https://uploadtoblobstorage.azurewebsites.net/api/FetchHtmlPage?code=u3d7T3jRaPmkatxybHGwn5EXK9xGsSLoB9xdnUCPaqEY2XeYGzTbPQ==",
    {
      method: "POST",
      body: JSON.stringify({
        url: currentPageURL,
      }),
      headers: {
        Accept: "*/*",
        "Accept-Charset": "utf-8",
        "Accept-Encoding": "gzip,deflate,sdch",
        Connection: "keep-alive",
        Origin: "http://javascript.info",
        Referer: "http://javascript.info/some/url",
        "Content-type": "application/json; charset=UTF-8",
      },
    }
  )
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      updateMAINDOM(new Set(json.MAIN.offensive));
      updateASIDEDOM(new Set(json.ASIDE.offensive));
      console.log("Displaying contents of page");
      document.getElementsByTagName("html")[0].style.display = "block"; //to show it all back again
    });
}
function updateMAINDOM(data) {
  let results = document.getElementById("b_results").children;
  console.log("Updating MAIN DOM elements");

  for (i = 0; i < results.length; i++) {
    console.log(results[i]);
    console.log(i + 1);
    if (data.has(i)) results[i].hidden = true;
  }
}
function updateASIDEDOM(data) {
  let results = document.getElementById("b_context").children;
  console.log("Updating ASIDE DOM elements");
  for (i = 0; i < results.length; i++) {
    console.log(results[i]);
    console.log(i + 1);
    if (data.has(i)) results[i].hidden = true;
  }
}
function MakeRequestTest() {
  console.log("Calling Azure Function");
  return JSON.parse(
    '{"MAIN":{"offensive":[0, 1, 2, 3, 4, 5],"safe":[]},"ASIDE":{"offensive":[0],"safe":[]}}'
  );
}
