chrome.tabs.onUpdated.addListener(function (tab) {
  // Send a message to the active tab
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var activeTab = tabs[0];
    if (activeTab) {
      chrome.tabs.sendMessage(activeTab.id, { "message": "Navigated" });
    }
  });
});

chrome.runtime.onMessage.addListener(function (request, sender, callback) {
  if (request.action == "xhttp") {
    var xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
      callback(xhttp.responseText);
    };
    xhttp.onerror = function () {
      //callback('ERROR');
    };
    xhttp.open('GET', request.url);
    xhttp.send();
    return true;
  }
}
);
chrome.pageAction.onClicked.addListener(function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, { "message": "Popup Opened" });
  });
});

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.type === 'showPageAction') {
    chrome.pageAction.show(sender.tab.id);
  }
});

// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   if (request.message === "Year Value Changed") {
//     let newVal = request.value;
//     updateInfo(newVal);
//   }
// });