
var username = "USER";
var password = "PWD";

chrome.webRequest.onAuthRequired.addListener(
  function handler(details) {    
    if (username == null)
      return {cancel: true};
  
    var authCredentials = {username: username, password: password};
    username = password = null;
    
    return {authCredentials: authCredentials};
  },
  {urls: ["<all_urls>"]},
  ['blocking']
);

