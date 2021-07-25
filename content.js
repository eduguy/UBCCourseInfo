var result;

function updateInfo(year) {
  let curLocation = window.location.href;

  let urlParams = new URLSearchParams(curLocation);
  let data = urlParams.get("dept") + "/" + urlParams.get("course");
  JSONRequest = "/v2/grades/UBCV/" + year + "/" + encodeURIComponent(data);
  chrome.runtime.sendMessage({
    method: 'POST',
    action: 'xhttp',
    url: 'https://ubcgrades.com/api' + JSONRequest
}, function(responseText) {
  if (responseText != 'ERROR') {
  var parsedArr = JSON.parse(responseText);

  for (var i = 0; i<parsedArr.length; i++){
    if (parsedArr[i].educators == "") {
      result = parsedArr[i].average;
      result = Math.round(result * 10) / 10;
      break;
    }
  }
  if (!document.getElementById('CourseInfoDivID')) {
  var div = document.createElement("div");
  div.id = 'CourseInfoDivID';
  div.setAttribute("style", "padding-top: 30px")
  div.setAttribute("style", "padding-bottom:30px")
  div.setAttribute("style","font-family: Helvetica");
  div.setAttribute("style","font-weight: bold");
  div.innerHTML = "THIS INFORMATION IS FROM UBCGRADES API AND THE UBC COURSE INFO EXTENSION.<br><br>The course average for " + year + " was: " + ((result)? result + '%':'not available') + ".";

  var elemToAppendTo = document.getElementById('cdfText');
  $(div).insertAfter(elemToAppendTo);
  document.getElementById('CourseInfoDivID').className = "alert alert-info";
  }
}
}
  )
}
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if( request.message === "Navigated" ) {
        let curLocation = window.location.href;
        if (curLocation.includes("dept=") && curLocation.includes("course=")) {
          chrome.runtime.sendMessage({type:'showPageAction'});
          //default
          updateInfo('2020W');
        }
      }
      return true;
    });


chrome.runtime.onMessage.addListener (
  function(request, sender, sendResponse) {
    if (request.message == "Popup Opened") {
    // if (result){
    // document.getElementById('infoDiv').innerText=result;
    // }
    // else {
    //   document.getElementById('infoDiv').innerText = "No info yet."
    // }
  }
  }
);

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.message === 'Year Value Changed') {
       let newVal = request.value;
       updateInfo(newVal);
    }
  });
    