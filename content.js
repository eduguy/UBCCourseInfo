var xhr = new XMLHttpRequest();
var JSONRequest;
xhr.onload = function() {
    var json = xhr.responseText;                         // Response
    json = json.replace(/^[^(]*\(([\S\s]+)\);?$/, '$1'); // Turn JSONP in JSON
    json = JSON.parse(json);                             // Parse JSON\
    alert(JSON);
    // ... enjoy your parsed json...
};
// Example:
// data = 'Example: appended to the query string..';
// xhr.open('GET', 'http://domain/getjson?data=' + encodeURIComponent(data));
// xhr.send();

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if( request.message === "Navigated" ) {
        let curLocation = window.location.href;
        if (curLocation.includes("dept=") && curLocation.includes("course=")) {
          //Then there is a specific course we can get averages for, so let's parse the course name and number
          //and send a json request to UBCGrades API
          // alert('aaa')
          let urlParams = new URLSearchParams(curLocation);
          let data = urlParams.get("dept") + "/" + urlParams.get("course")
          JSONRequest = "/v2/grades/UBCV/2020W/" + encodeURIComponent(data);
          chrome.runtime.sendMessage({
            method: 'POST',
            action: 'xhttp',
            url: 'https://ubcgrades.com/api' + JSONRequest
            // , data: JSONRequest
        }, function(responseText) {
          // console.warn(xhr.responseText)
            // alert('Got the response text');
            // responseText = responseText.replace(/^[^(]*\(([\S\s]+)\);?$/, '$1'); // Turn JSONP in JSON
            // responseText = JSON.parse(responseText);                             // Parse JSON\
            // console.log(responseText);
            /*Callback function to deal with the response*/
        });
          return true;

        }
      }
    }
  );

