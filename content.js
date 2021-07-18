var xhr = new XMLHttpRequest();
xhr.onload = function() {
    var json = xhr.responseText;                         // Response
    json = json.replace(/^[^(]*\(([\S\s]+)\);?$/, '$1'); // Turn JSONP in JSON
    json = JSON.parse(json);                             // Parse JSON
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
          const urlParams = new URLSearchParams(curLocation);
          let data = urlParams.get("dept") + "/" + urlParams.get("course")
          let JSONRequest = "https://ubcgrades.com/api/v2/grades/UBCV/2020W/" + encodeURIComponent(data);
          xhr.open('GET', JSONRequest);
          xhr.send();
        }
      }
    }
  );

