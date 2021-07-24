var result;
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if( request.message === "Navigated" ) {
        let curLocation = window.location.href;
        if (curLocation.includes("dept=")) {
          // && curLocation.includes("course=")
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
          if (responseText != 'ERROR') {
          var parsedArr = JSON.parse(responseText);

          for (var i = 0; i<parsedArr.length; i++){
            if (parsedArr[i].educators == "") {
              //This will be the one that is an average
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
          div.setAttribute("style","font-size: 30px");
          div.textContent = "The course average for 2019W was: " + result;
          var elemToAppendTo = document.getElementById('cdfText');
          // elemToAppendTo.appendChild(div);
          $(div).insertAfter(elemToAppendTo);
          }

        }
        });
          return true;

        }
      }
    }
  );

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