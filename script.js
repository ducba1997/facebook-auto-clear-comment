// Set default values from storage
var keyWordByUserName = document.getElementById("keyWordByUserName");
var autoDelete = document.getElementById("autoDelete");
var keyWordByContentComment = document.getElementById("keyWordByContentComment");
chrome.storage.sync.get(function(data) {
    keyWordByUserName.value=data.keyWordByUserName ? data.keyWordByUserName : "";
    autoDelete.checked=data.autoDelete;
    setTheme(data.autoDelete);
    keyWordByContentComment.value=data.keyWordByContentComment ? data.keyWordByContentComment : "";
});

var grad = document.querySelector("html");
function setTheme(set) {
    if (set) {
        grad.style.background = "linear-gradient(to bottom right,rgb(222, 202, 202), rgb(180, 241, 255))";
    }else{
        grad.style.background = "linear-gradient(to bottom right,rgb(199, 255, 219), rgb(180, 241, 255))";
    }
}

// Updating data and autoDelete will save to storage
keyWordByContentComment.onchange = function() {
    chrome.storage.sync.set({"keyWordByContentComment": keyWordByContentComment.value});
}
keyWordByUserName.onchange = function() {
    chrome.storage.sync.set({"keyWordByUserName": keyWordByUserName.value});
}
autoDelete.onchange = function(element) {
    chrome.storage.sync.set({"autoDelete": this.checked});
    setTheme(this.checked);
}

// Delete/restore buttons will send message to content.js
var deleteComments = document.getElementById("deleteComments");
deleteComments.onclick = function(element) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {"message": "delete"});
    });
}
var restoreComments = document.getElementById("restoreComments");
restoreComments.onclick = function(element) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {"message": "restore"});
    });
}
