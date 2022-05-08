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
    fetch(request.url)
      .then(function (response) {
        response.text()
          .then((res) => {
            callback(res);
          });
      })
    return true;
  }
}
);
chrome.runtime.onMessage.addListener(function (request, sender, callback) {
  if (request.action == 'getRateMyProf') {

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      let activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, { "message": "Loading ratings" });
    });
    fetch("http://54.193.122.205//rate?firstName=" + request.fname + "&lastName=" + request.lname + "")
      .then(function (response) {
        response.text()
          .then((res) => {
            callback(res);
          });

      }).catch(function (error) {
        callback('ERROR');
      });
    return true;
  }
});

// chrome.pageAction.onClicked.addListener(function () {
//   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//     let activeTab = tabs[0];
//     chrome.tabs.sendMessage(activeTab.id, { "message": "Popup Opened" });
//   });
// });

// chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
//   if (message.type === 'showPageAction') {
//     chrome.pageAction.show(sender.tab.id);
//   }
// });
