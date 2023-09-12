console.log("Popup.js is running.");

document.addEventListener("DOMContentLoaded", function () {
  // Listen for the "Lookup" button click
  const lookupButton = document.getElementById("lookupButton");
  const resultElement = document.getElementById("result");

  lookupButton.addEventListener("click", function () {
    // Send a message to the content script to request the decision
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTab = tabs[0];
      const currentUrl = activeTab.url;
      console.log(currentUrl);

      chrome.storage.local.get(["myData"], function (result) {
        const storedData = result.myData;
        const storedDecision = storedData[currentUrl];
        if (storedDecision) {
          resultElement.textContent = "Decision: " + storedDecision;
        } else {
          console.log("sending message to content");
          chrome.tabs.sendMessage(activeTab.id, {
            requestDecision: true,
            url: currentUrl,
          });
        }
      });
    });
  });

  chrome.runtime.onMessage.addListener(function (
    message,
    sender,
    sendResponse
  ) {
    if (message.decision) {
      const decision = message.decision;
      // Display the decision in the popup
      resultElement.textContent = "Decision: " + decision;
    } else {
      resultElement.textContent = "Decision not available.";
      console.log("No decision received from content script.");
    }
  });
});
