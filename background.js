chrome.tabs.onUpdated.addListener(function(tab) {
    // Send a message to the active tab
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      var activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, {"message": "Navigated"});
    });
  });

  chrome.runtime.onMessage.addListener(function(request, sender, callback) {
    if (request.action == "xhttp") {
        var xhttp = new XMLHttpRequest();
        xhttp.onload = function() {
            callback(xhttp.responseText);
        };
        xhttp.onerror = function() {
            // Do whatever you want on error. Don't forget to invoke the
            // callback to clean up the communication port.
            callback();
        };
        xhttp.open('GET', request.url);
        // if (method == 'POST') {
            // xhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        // }
        xhttp.send();
        return true; // prevents the callback from being called too early on return
    }
});