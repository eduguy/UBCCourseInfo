var result;

function updateCourseInfo(year, isUpdateCall) {
  let urlParams = new URLSearchParams(window.location.href);
  let data = urlParams.get("dept") + "/" + urlParams.get("course");
  JSONRequest = "/v2/grades/UBCV/" + year + "/" + encodeURIComponent(data);
  chrome.runtime.sendMessage({
    action: 'xhttp',
    url: 'https://ubcgrades.com/api' + JSONRequest
  }, function (responseText) {
    if (responseText !== 'ERROR') {
      let parsedArr = JSON.parse(responseText);

      for (let i = 0; i < parsedArr.length; i++) {
        if (parsedArr[i].section === "OVERALL") {
          result = parsedArr[i].average;
          result = Math.round(result * 10) / 10;
          break;
        }
      }
    }
    if (!document.getElementById('CourseInfoDivID')) {
      let div = document.createElement("div");
      div.id = 'CourseInfoDivID';
      div.setAttribute("style", "font-family: Helvetica");
      div.setAttribute("style", "font-weight: bold");
      div.innerHTML = "This information is from UBCGrades API and the UBC Course Info Extension.<br><br>The course average for " + year + ((result && responseText !== 'ERROR') ? ' was ' + result + '%' : ' is not available') + ".";
      let elemToAppendTo = document.getElementById('cdfText');
      $(div).insertAfter(elemToAppendTo);
      document.getElementById('CourseInfoDivID').className = "alert alert-info";
    }
    else if (isUpdateCall) {
      document.getElementById('CourseInfoDivID').innerHTML = "This information is from UBCGrades API and the UBC Course Info Extension.<br><br>The course average for " + year + ((result) ? ' was ' + result + '%' : ' is not available') + ".";
    }


  }
  )
}
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.message === "Navigated") {
      chrome.runtime.sendMessage({ type: 'showPageAction' });
      let curLocation = window.location.href;
      if (curLocation.includes("dept=") && curLocation.includes("course=")) {

        //Default to 2020W since at this time that is the latest
        updateCourseInfo('2020W');
      } else if (curLocation.includes("dept=")) {

        updateDepartmentInfo('2020W');
      }
    }
    return true;
  });

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.message === "Year Value Changed") {
      let newVal = request.value;
      let curLocation = window.location.href;
      if (curLocation.includes("dept=") && curLocation.includes("course=")) {
        updateCourseInfo(newVal, true);
      } else if (curLocation.includes("dept=")) {
        updateDepartmentInfo(newVal, true);
      }
    }
  });

function updateDepartmentInfo(year, isUpdateCall) {
  let tableRows = document.getElementById('mainTable').rows;
  if (tableRows[0].cells.length > 2 && !isUpdateCall) {
    return;
  }
  if (!isUpdateCall) {
    tableRows[0].insertCell(2).innerHTML = "<b> Average Grade </b>";
  }
  let count = 1;
  $('#mainTable').find('a').each(function () {
    let link = ($(this).attr('href'));
    let url = new URLSearchParams(link);
    let data = url.get("dept") + "/" + url.get("course");
    let JSONRequest = "/v2/grades/UBCV/" + year + "/" + encodeURIComponent(data);

    chrome.runtime.sendMessage({
      action: 'xhttp',
      url: 'https://ubcgrades.com/api' + JSONRequest
    }, function (responseText) {
      if (responseText !== 'ERROR') {
        let parsedArr = JSON.parse(responseText);
        for (let i = 0; i < parsedArr.length; i++) {
          if (parsedArr[i].section === "OVERALL") {
            result = parsedArr[i].average;
            result = Math.round(result * 10) / 10;
            break;
          }
        }

        let currentRow = tableRows[count];
        if (isUpdateCall) {
          currentRow.cells[2].innerHTML = "The average grade for " + year + " was: " + result + "%.";
        }
        else {
          var x = currentRow.insertCell(2);
          x.innerHTML = "The average grade for " + year + " was: " + result + "%.";
        }

      }
      else {
        tableRows[count].insertCell(2).innerHTML = ("The average grade was not available.");
      }
      count++;

    });

  });
}

