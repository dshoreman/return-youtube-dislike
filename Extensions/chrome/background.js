const apiUrl = "https://return-youtube-dislike-api.azurewebsites.net";

// Security token causes issues if extension is reloaded/updated while several tabs are open
// const securityToken = Math.random().toString(36).substring(2, 15);
//
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   sendResponse(securityToken);
// });

chrome.runtime.onMessageExternal.addListener(
  (request, sender, sendResponse) => {
    if (request.message === "get_auth_token") {
      // chrome.identity.getAuthToken({ interactive: true }, function (token) {
      //   console.log(token);
      //   chrome.identity.getProfileUserInfo(function (userInfo) {
      //     console.log(JSON.stringify(userInfo));
      //   });
      // });
    } else if (request.message === "log_off") {
      // console.log("logging off");
      // chrome.identity.clearAllCachedAuthTokens(() => console.log("logged off"));
    } else if (request.message == "set_state") {
      // console.log(request);
      // chrome.identity.getAuthToken({ interactive: true }, function (token) {
      let token = "";
      fetch(`${apiUrl}/votes?videoId=${request.videoId}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + token,
        },
      })
        .then((response) => response.json())
        .then((response) => {
          sendResponse(response);
        })
        .catch();
      //});
      return true;
    } else if (request.message == "send_links") {
      toSend = toSend.concat(request.videoIds.filter((x) => !sentIds.has(x)));
      if (toSend.length >= 20) {
        fetch(`${apiUrl}/votes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(toSend),
        });
        for (const toSendUrl of toSend) {
          sentIds.add(toSendUrl);
        }
        toSend = [];
      }
    }
  }
);

const sentIds = new Set();
let toSend = [];
