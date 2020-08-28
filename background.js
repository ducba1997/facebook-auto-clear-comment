// Set defaults on instillation
chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({"autoDelete": false, "keyWordByUserName": "", "keyWordByContentComment": ""});
    var context = "selection";
    var title = 'Thêm "%s" vào danh sách từ khóa trong bình luận cần xóa';
    var id = chrome.contextMenus.create({"title": title, "contexts":[context],"id": "context" + context}); 
});
  
  chrome.contextMenus.onClicked.addListener(onClickHandler);
  
  function onClickHandler(info, tab) {
    var oldKeyWordByContentComment;
    chrome.storage.sync.get(function (data) {
        oldKeyWordByContentComment = data.keyWordByContentComment ? data.keyWordByContentComment : "";
        if(oldKeyWordByContentComment!=="")
            oldKeyWordByContentComment+=", ";
        chrome.storage.sync.set({"keyWordByContentComment":oldKeyWordByContentComment+info.selectionText});
    });
  };
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg.action === "iconRed") {
        if (msg.value) {
            chrome.browserAction.setIcon({path: "/pics/logo128Red.png"});
        }else {
            chrome.browserAction.setIcon({path: "/pics/logo128.png"});
        }
    }
});
