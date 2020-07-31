/* Plan B 
chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    console.log(details.url);
    return {
      redirectUrl: details.url + "&safe=active",
    };
  },
  {
    urls: [
      "*://google.com/search?*",
      "*://www.google.com/search?*",
      "*://www.google.co.in/search?*",
    ],
    types: [
      "main_frame",
      "sub_frame",
      "stylesheet",
      "script",
      "image",
      "object",
      "xmlhttprequest",
      "other",
    ],
  },
  ["blocking"]
);

chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    console.log(details.url);
    return {
      redirectUrl: details.url + "&adlt=strict",
    };
  },
  {
    urls: [
      "*://bing.com/search?*",
      "*://www.bing.com/search?*",
      "*://www.bing.co.in/search?*",
    ],
    types: [
      "main_frame",
      "sub_frame",
      "stylesheet",
      "script",
      "image",
      "object",
      "xmlhttprequest",
      "other",
    ],
  },
  ["blocking"]
);
*/

let ageGreaterThan18 = 0;
chrome.runtime.onConnect.addListener(function (port) {
  portal = port;
  console.assert(port.name == "knockknock");

  port.onMessage.addListener(function (msg) {
    if (msg.joke == "Knock knock") {
      if (ageGreaterThan18 == 1) port.postMessage({ isAdult: 1 });
      else port.postMessage({ isAdult: 0 });
    } else {
      console.log(ageGreaterThan18);
      if (msg.age > 18) ageGreaterThan18 = 1;
      console.log(ageGreaterThan18);
    }
  });
});
chrome.windows.onCreated.addListener(function () {
  chrome.tabs.create({ url: chrome.extension.getURL("index.html") }, function (
    tab
  ) {});
});
