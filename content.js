// Message passing for delete/restore (from interactComments.js)
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "delete") {
    changeComments("del");
  }
  if (request.message === "restore") {
    changeComments("restore");
  }
});

var observeDOM = (function () {
  var MutationObserver =
    window.MutationObserver || window.WebKitMutationObserver;
  return function (obj, callback) {
    if (!obj || !obj.nodeType === 1) return; // validation
    if (MutationObserver) {
      // define a new observer
      var obs = new MutationObserver(function (mutations, observer) {
        callback(mutations);
      });
      // have the observer observe foo for changes in children
      obs.observe(obj, { childList: true, subtree: true });
    } else if (window.addEventListener) {
      obj.addEventListener("DOMNodeInserted", callback, false);
      obj.addEventListener("DOMNodeRemoved", callback, false);
    }
  };
})();

/* On page (re)load, load variables from storage and run changeComments(). Then 
   pause 3s to let the rest of the 20+ fb elements to update. This prevents
   changeComments() from running 20+ times. The 'paused' flag prevents autoDelete
   from running due to a refresh-induced DOM change, it is referenced in the 
   function after this one */
var keyWordByUserName;
var autoDelete;
var keyWordByContentComment;
var paused = false;
function go() {
  chrome.storage.sync.get(function (data) {
    keyWordByContentComment = data.keyWordByContentComment;
    autoDelete = data.autoDelete;
    keyWordByUserName = data.keyWordByUserName;
    if (autoDelete) {
      changeComments("del");
      iconRed(true); // set theme red
    } else {
      changeComments("restore");
      iconRed(false); // set theme blue
    }
  });
  //console.log("This page is (re)loading, waiting 3000 ms");
  var paused = true;
  setTimeout(function () {
    paused = false;
  }, 3000);
}
go();

// If the news feed updates (but not refresh), remove comments (if autoDelete on)
var feed = document.querySelector("#mount_0_0");
observeDOM(feed, function () {
    if (!paused && autoDelete) {
        changeComments("del");
    }
});

// Update variables if they change in storage
chrome.storage.onChanged.addListener(function (changes, namespace) {
  for (key in changes) {
    if (key === "keyWordByUserName") {
      chrome.storage.sync.get("keyWordByUserName", function (data) {
        keyWordByUserName = data.keyWordByUserName;
        if (autoDelete) {
            changeComments("del");
        }
        //console.log("keyWordByUserName updated to: " + keyWordByUserName)
      });
    } else if (key === "autoDelete") {
      // update and apply changeComments()
      chrome.storage.sync.get("autoDelete", function (data) {
        autoDelete = data.autoDelete;
        //console.log("autoDelete updated to: " + autoDelete)
        if (autoDelete) {
          changeComments("del");
          iconRed(true);
        } else {
          changeComments("restore");
          iconRed(false);
        }
      });
    } else if (key === "keyWordByContentComment") {
      chrome.storage.sync.get("keyWordByContentComment", function (data) {
        keyWordByContentComment = data.keyWordByContentComment;
        if (autoDelete) {
            changeComments("del");
        }
        //console.log("keyWordByContentComment updated to: " + keyWordByContentComment)
      });
    }
  }
});

// Keyboard shortcuts for delete/restore
document.onkeyup = function (e) {
  if (e.which == 88 && e.altKey) {
    changeComments("del");
  } else if (e.which == 90 && e.altKey) {
    changeComments("restore");
  }
};
function checkContainInArray(keyword, array) {
  if (array[0] === "") return false;
  var i;
  for (i = 0; i < array.length; i++) {
    if (keyword.toLowerCase().includes(array[i].toLowerCase().trim()))
      return true;
  }
  return false;
}
// Delete/restore comments based on settings
function changeComments(option) {
  checkVars();
  if (option == "del") {
    //console.log("Deleting comments with autoDelete: " + autoDelete + ", keyWordByUserName: " + keyWordByUserName + ", keyWordByContentComment: " +  keyWordByContentComment );
  } else if (option == "restore") {
    //console.log("Restoring comments autoDelete: " + autoDelete + ", keyWordByUserName: " + keyWordByUserName + ", keyWordByContentComment: " +  keyWordByContentComment );
  }
  // select all comments by class, then parse through comment and tagged friends
  arrKeyWordByUserName = keyWordByUserName.split(",");
  arrKeyWordByContentComment = keyWordByContentComment.split(",");
  var l = document.querySelectorAll(".ecm0bbzt span.oi732d6d .kvgmc6g5>div[dir=auto]");
  var i;
  console.log(l);
  for (i = 0; i < l.length; i++) {
    var comment = l[i];
    if (checkContainInArray(comment.innerText, arrKeyWordByContentComment)) {
      divSection = comment.closest("li");
      if(divSection){
        if (option === "del") {
          slideOut(divSection);
        } else {
          slideIn(divSection);
        }
      }
      
    }
  }
  var l2 = document.querySelectorAll(".nc684nl6 a.oajrlxb2 span.pq6dq46d span.oi732d6d");
  var k;
  for (k = 0; k < l2.length; k++) {
    var username = l2[k];
    if (checkContainInArray(username.innerText, arrKeyWordByUserName)) {
      divSection2 = username.closest("li");
      if(divSection2){
        if (option === "del") {
          slideOut(divSection2);
        } else {
          slideIn(divSection2);
        }
      }
    }
  }
}

function checkVars() {
  if (
    typeof keyWordByUserName == "undefined" ||
    typeof keyWordByContentComment == "undefined" ||
    typeof autoDelete == "undefined"
  ) {
    chrome.storage.sync.get(function (data) {
      keyWordByUserName = data.keyWordByUserName;
      autoDelete = data.autoDelete;
      keyWordByContentComment = data.keyWordByContentComment;
      if (autoDelete) {
        changeComments("del");
        iconRed(true); // set theme red
      } else {
        changeComments("restore");
        iconRed(false); // set theme blue
      }
    });
  }
}

// Delete/restore animations
function slideOut(divSection) {
  if (divSection.classList.contains("slide-in")) {
    divSection.classList.remove("slide-in");
  }
  divSection.classList.add("slide-out");
  setTimeout(function () {
    divSection.style.display = "none";
  }, 195);
}
function slideIn(divSection) {
  divSection.style.display = "block";
  if (divSection.classList.contains("slide-out")) {
    divSection.classList.remove("slide-out");
  }
  divSection.classList.add("slide-in");
}

function iconRed(set) {
  chrome.runtime.sendMessage({
    action: "iconRed",
    value: set,
  });
}
