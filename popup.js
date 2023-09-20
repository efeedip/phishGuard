document.addEventListener("DOMContentLoaded", function () {
  // Listen for the "Lookup" button click
  const lookupButton = document.getElementById("lookupButton");
  const resultElement = document.getElementById("result");
  const decisionContainer = document.querySelector(".decision-container");
  const decisionImage = document.getElementById("decisionImage");
  const decisionText = document.querySelector(".decision-text");
  const description = document.querySelector(".description");

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
          description.style.display = "none";
          // Set the corresponding image based on the decision (you'll need to have image URLs)
          if (storedDecision === "PHISHING") {
            decisionText.textContent = `Kimlik Avı Sitesi Algılandı!\n \n${currentUrl}\n \nBu web sayfasını derhal kapatın ve bu sayfadaki bankacılık bilgilerinizin hiçbirini kullanmayın.`;
            decisionImage.src = "images/icon-72-phishing.png";
            description.style.display = "none";
          } else if (storedDecision === "SAFE") {
            decisionText.textContent = `Bu siteye giriş yapmak güvenli görünüyor.\n \n${currentUrl}`;
            decisionImage.src = "images/icon-72-success.png";
            description.style.display = "none";
          } else if (storedDecision === "WARNING") {
            decisionText.textContent = `\nBu web sayfasının kimlik avı sayfası olma riskinin yüksek olduğu hesaplandı.\n \n${currentUrl}\n \nBu sayfada hiçbir bankacılık bilginizi kullanmamanızı önemle öneririz.`;
            decisionImage.src = "images/icon-72-warning.png";
            description.style.display = "none";
          } else {
            decisionText.textContent = "Karar alınamadı.\n \nLütfen sekmeyi yeniledikten sonra deneyin.";
            decisionImage.src = "images/icon-72-undefined.png";
            description.style.display = "none";
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
      console.log("test"+decision);
      // Display the decision in the popup
      decisionContainer.style.display = "block";
      decisionImage.style.display = "block";
      description.style.display = "none";
      // Set the corresponding image based on the decision (you'll need to have image URLs)
      if (storedDecision === "PHISHING") {
        decisionText.textContent = `Kimlik Avı Sitesi Algılandı!\n \n${currentUrl}\n \nBu web sayfasını derhal kapatın ve bu sayfadaki bankacılık bilgilerinizin hiçbirini kullanmayın.`;
        decisionImage.src = "images/icon-72-phishing.png";
        description.style.display = "none";
      } else if (storedDecision === "SAFE") {
        decisionText.textContent = `Bu siteye giriş yapmak güvenli görünüyor.\n \n${currentUrl}`;
        decisionImage.src = "images/icon-72-success.png";
        description.style.display = "none";
      } else if (storedDecision === "WARNING") {
        decisionText.textContent = `\nBu web sayfasının kimlik avı sayfası olma riskinin yüksek olduğu hesaplandı.\n \n${currentUrl}\n \nBu sayfada hiçbir bankacılık bilginizi kullanmamanızı önemle öneririz.`;
        decisionImage.src = "images/icon-72-warning.png";
        description.style.display = "none";
      } else {
        decisionText.textContent = "Karar alınamadı.\n \nLütfen sekmeyi yeniledikten sonra deneyin.";
        decisionImage.src = "images/icon-72-undefined.png";
        description.style.display = "none";
      }
      lookupButton.style.display = "none";
    } else {
      decisionText.textContent = "Karar alınamadı.\n \nLütfen sekmeyi yeniledikten sonra deneyin.";
      decisionImage.src = "images/icon-72-undefined.png";
      description.style.display = "none";
      console.log("No decision received from content script.");
      lookupButton.style.display = "none";
    }
  });
});


/*
ENGLISH VERSION
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
            decisionText.textContent = `Phishing Site Detected!\n \n${currentUrl}\n \nClose this web page immediately and do not use any of your banking information on this page.`;
            decisionImage.src = "images/icon-72-phishing.png";
          } else if (storedDecision === "SAFE") {
            decisionText.textContent = `This site appears to be safe to login.\n \n${currentUrl}`;
            decisionImage.src = "images/icon-72-success.png";
          } else if (storedDecision === "WARNING") {
            decisionText.textContent = `\nThis web page has been calculated to be at high risk of being a phishing page.\n \n${currentUrl}\n \nWe strongly recommend that you do not use any of your banking information on this page.`;
            decisionImage.src = "images/icon-72-warning.png";
          } else {
            decisionText.textContent = "Decision not available.\n \nPlease try after refreshing the tab.";
            decisionImage.src = "images/icon-72-undefined.png";
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
      console.log("test"+decision);
      // Display the decision in the popup
      decisionContainer.style.display = "block";
      decisionImage.style.display = "block";
      // Set the corresponding image based on the decision (you'll need to have image URLs)
      if (storedDecision === "PHISHING") {
        decisionText.textContent = `\n${currentUrl}\n\nPhishing Site Detected!\nClose this web page immediately and do not use any of your banking information on this page.`;
        decisionImage.src = "images/icon-72-phishing.png";
      } else if (storedDecision === "SAFE") {
        decisionText.textContent = `\n${currentUrl}\n\This site appears to be safe to login.`;
        decisionImage.src = "images/icon-72-success.png";
      } else if (storedDecision === "WARNING") {
        decisionText.textContent = `\n${currentUrl}\n\nThis web page has been calculated to be at high risk of being a phishing page.\nWe strongly recommend that you do not use any of your banking information on this page.`;
        decisionImage.src = "images/icon-72-warning.png";
      } else {
        decisionImage.src = "images/icon-72-undefined.png";
        decisionText.textContent =
          "Decision not available.\nPlease try after refreshing the tab.";
      }
      lookupButton.style.display = "none";
    } else {
      decisionImage.src = "images/icon-72-undefined.png";
      decisionText.textContent =
        "Decision not available.\nPlease try after refreshing the tab.";
      console.log("No decision received from content script.");
      lookupButton.style.display = "none";
    }
  });
});

*/