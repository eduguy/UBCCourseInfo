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
      div.innerHTML = "The course average for " + year + ((result && responseText !== 'ERROR') ? ' was ' + result + '%' : ' is not available') + ".<br><br>" + "This information is from UBCGrades API and the UBC Course Info Extension.";
      let elemToAppendTo = document.getElementById('cdfText');
      $(div).insertAfter(elemToAppendTo);
      document.getElementById('CourseInfoDivID').className = "alert alert-info";
    }
    else if (isUpdateCall) {
      document.getElementById('CourseInfoDivID').innerHTML = "The course average for " + year + ((result) ? ' was ' + result + '%' : ' is not available') + ".<br><br>" + "This information is from UBCGrades API and the UBC Course Info Extension.";
    }

  }
  )
}
chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.message === "Navigated") {
      let curLocation = window.location.href;
      if (curLocation.includes("dept=") && curLocation.includes("course=")) {
        //Default to 2020W since at this time that is the latest
        updateCourseInfo('2020W');
        if (curLocation.includes("section")) {
          //That means we can also get the professor rating
          updateInstructorInfo();
        }
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

    updateTable(JSONRequest, tableRows, count, isUpdateCall, year);
    count++;

  });
}

function updateTable(JSONRequest, tableRows, count, isUpdateCall, year) {
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
      if (!isUpdateCall) {
        tableRows[count].insertCell(2).innerHTML = ("The average grade was not available.");
      } else {
        let currentRow = tableRows[count];
        currentRow.cells[2].innerHTML = "The average grade was not available.";
      }
    }
    count++;
  });

}
const baseSearchQuery = 'https://www.ratemyprofessors.com/search/teachers?query=FIRSTNAME%20LASTNAME&sid=U2Nob29sLTE0MTM='

function updateInstructorInfo() {
  let list = document.getElementsByClassName('table');
  let filtered = Array.from(list).filter( (elem) => elem.className === "table");
  let theTable = filtered[0];
  let profLink = theTable.querySelectorAll('a');
  if (profLink.length > 0) {
    if (document.getElementById('RateMyProfLink')) {
      newAElem.remove();
    }
    let name = profLink[0].innerHTML;
    let lastName = name.substr(0, name.indexOf(','));
    let firstName = name.substr(name.indexOf(',') + 2, name.length);
    let search = baseSearchQuery.replace('FIRSTNAME', firstName).replace('LASTNAME', lastName);
    let newAElem = document.createElement("a");
    newAElem.id = 'RateMyProfLink';
    newAElem.href = search;
    newAElem.target = '_blank';
    newAElem.style.fontSize = '175%';

    newAElem.style.paddingLeft = '65px';
    newAElem.style.textShadow = '1px 0 0 #000, 0 -1px 0 #000, 0 1px 0 #000, -1px 0 0 #000';

    $(newAElem).insertAfter(profLink[0]);
    chrome.runtime.sendMessage({
      action: 'getRateMyProf',
      fname: firstName,
      lname: lastName
    }, function (responseText) {
      let teacherGrade = responseText;
      if (newAElem) {
        if (teacherGrade === "0") {
          newAElem.innerHTML = "Rating wasn't found. Click here to go to the RateMyProfessors page.";
        } else {
          newAElem.innerHTML = 'Rating: ' + teacherGrade + ". Click here to go to the RateMyProfessors page.";

          if (parseFloat(teacherGrade) >= 4.0) {
            newAElem.style.textDecorationColor = '#88FF88';
            newAElem.style.color = '#88FF88';

          } else if (parseFloat(teacherGrade) >= 3.0) {
            newAElem.style.textDecorationColor = '#e5ed00';
            newAElem.style.color = '#e5ed00';

          } else {
            newAElem.style.textDecorationColor = '#cc002c';
            newAElem.style.color = '#cc002c';

          }
        }
      }
    });
    return true;

  }
}

chrome.runtime.onMessage.addListener(
  function (request, sender, sendResponse) {
    if (request.message === "Loading ratings") {
      let aElem = document.getElementById("RateMyProfLink");
      aElem.innerHTML = "Professor ratings are loading..."
      aElem.style.color = "e5ed00!important";
      aElem.style.textDecorationColor = '#e5ed00!important';
      return true;
    }
  });