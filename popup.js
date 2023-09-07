document.addEventListener("DOMContentLoaded", function () {
    const domainInput = document.getElementById("domainInput");
    const lookupButton = document.getElementById("lookupButton");
    const resultDiv = document.getElementById("result");
  
    lookupButton.addEventListener("click", function () {
      const domain = domainInput.value;
      chrome.runtime.sendMessage({ domain }, function (response) {
        resultDiv.innerHTML = response.result;
      });
    });
  });
  