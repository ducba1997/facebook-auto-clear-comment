// Set defaults on instillation
chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({"autoDelete": false, "keyWordByUserName": "", "keyWordByContentComment": ""})
});

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.action === "iconRed") {
        if (msg.value) {
            chrome.browserAction.setIcon({path: "/pics/logo128Red.png"});
        }else {
            chrome.browserAction.setIcon({path: "/pics/logo128.png"});
        }
    }
});
