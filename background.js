chrome.tabs.onUpdated.addListener(function (tab) {
  // Send a message to the active tab
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    let activeTab = tabs[0];
    if (activeTab) {
      chrome.tabs.sendMessage(activeTab.id, { "message": "Navigated" });
    }
  });
});

chrome.runtime.onMessage.addListener(function (request, sender, callback) {
  if (request.action == "xhttp") {
    let xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
      if (xhttp.status != 404) {
        callback(xhttp.responseText);
      } else {
        callback('ERROR');
      }
    };
    xhttp.onerror = function () {
    };
    xhttp.open('GET', request.url);
    xhttp.send();
    return true;
  }
}
);
chrome.runtime.onMessage.addListener(function (request, sender, callback) {
  if (request.action == 'getRateMyProf') {
    let xhttp = new XMLHttpRequest();
    xhttp.onload = function () {
      if (xhttp.status != 404) {
        callback(xhttp.responseText);
      } else {
        callback('ERROR');
      }
    };
    xhttp.onerror = function () {
    };
    xhttp.open('GET', "http://localhost:5000/rate?firstName="+request.fname+"&lastName="+request.lname);
    xhttp.send();
    return true;

  }
});

chrome.pageAction.onClicked.addListener(function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    let activeTab = tabs[0];
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

