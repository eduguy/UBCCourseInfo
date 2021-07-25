function changeYearInfo() {
    let newYearVal = document.getElementById('yearSessions').value;
    chrome.runtime.sendMessage({"message": "Year Value Changed",
                                "value":    newYearVal});
}