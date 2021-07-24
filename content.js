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
          if (responseText != 'ERROR') {
          var parsedArr = JSON.parse(responseText);
          var result;
          for (var i = 0; i<parsedArr.length; i++){
            if (parsedArr[i].educators == "") {
              //This will be the one that is an average
              result = parsedArr[i].average;
              result = Math.round(result * 10) / 10;
              break;
            }
          }

          var div = document.createElement("div");
          div.id = 'CourseInfoDivID';
          div.setAttribute("style","font-family: Helvetica");
          div.setAttribute("style","font-size: 30px");
          div.textContent = "The course average for 2019W was: " + result;
          var theElement = document.getElementById('cdfText');
          theElement.appendChild(div);

        }
        });
          return true;

        }
      }
    }
  );

