
function changeYearInfo() {
    let newYearVal = document.getElementById('yearSessions').value;
    chrome.tabs.query({}, tabs => {
        tabs.forEach(tab => {
            chrome.tabs.sendMessage(tab.id, {
                "message": "Year Value Changed",
                "value": newYearVal
            });
        });
    });
}
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('yearSessions').addEventListener("change", changeYearInfo);
}
);

