console.log("Popup.js is running.");

document.addEventListener("DOMContentLoaded", function () {
  // Listen for the "Lookup" button click
  const lookupButton = document.getElementById("lookupButton");
  const resultElement = document.getElementById("result");
  const decisionContainer = document.querySelector(".decision-container");
  const decisionImage = document.getElementById("decisionImage");
  const decisionText = document.querySelector(".decision-text");

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
          decisionContainer.style.display = "block";
          decisionImage.style.display = "block";

          // Set the corresponding image based on the decision (you'll need to have image URLs)
          if (storedDecision === "PHISHING") {
              decisionText.textContent = `Phishing Site Detected!\n${currentUrl}\nClose this web page immediately and do not use any of your banking information on this page.`;
              decisionImage.src = "images/icon-48.png";
          } else if (storedDecision === "SAFE") {
              decisionText.textContent = `This site appears to be safe to login.\n${currentUrl}`;
              decisionImage.src = "images/icon-48-success.png";
          } else if (storedDecision === "WARNING") {
              decisionText.textContent = `\nThis web page has been calculated to be at high risk of being a phishing page.\n${currentUrl}\nWe strongly recommend that you do not use any of your banking information on this page.}`;
              decisionImage.src = "images/icon-48-warning.png";
          }
          lookupButton.style.display = "none";
        } else {
          try {
            console.log("sending message to content");
            chrome.tabs.sendMessage(activeTab.id, {
              requestDecision: true,
              url: currentUrl,
            });
          } catch (error) {
            console.error("Error sending message to content:", error);
          }
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
      decisionContainer.style.display = "block";
      decisionImage.style.display = "block";
      // Set the corresponding image based on the decision (you'll need to have image URLs)
      if (storedDecision === "PHISHING") {
        decisionText.textContent = `\n${currentUrl}\n\nPhishing Site Detected!\nClose this web page immediately and do not use any of your banking information on this page.`;
        decisionImage.src = "images/icon-48.png";
      } else if (storedDecision === "SAFE") {
          decisionText.textContent = `\n${currentUrl}\n\This site appears to be safe to login.`;
          decisionImage.src = "images/icon-48-success.png";
      } else if (storedDecision === "WARNING") {
          decisionText.textContent = `\n${currentUrl}\n\nThis web page has been calculated to be at high risk of being a phishing page.\nWe strongly recommend that you do not use any of your banking information on this page.`;
          decisionImage.src = "images/icon-48-warning.png";
      }
      lookupButton.style.display = "none";
    } else {
      resultElement.textContent = "Decision not available.\nPlease try after refreshing the tab.";
      console.log("No decision received from content script.");
      lookupButton.style.display = "none";
    }
  });
});