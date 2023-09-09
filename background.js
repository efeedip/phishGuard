

chrome.webNavigation.onCompleted.addListener(function (details) {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.showPhishingPageNotification) {
      // Create and show the notification
      showPhishingDetectedNotification(message.url);
    }

    if(message.showRealPageNotification) {
      // Create and show the notification
      showRealSiteNotification();
    }
  });
});


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.calculateRisk) {
    calculateRisk(message.domain_url);
  }
});


chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
  if (buttonIndex === 0) { // Check if the first button was clicked
    // Send a message to the content script to close the tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.remove(tabs[0].id);
      }
    });
  }
});


function calculateRisk(domain_url) {
  const currentUrl = domain_url;
  const apiUrl = `https://www.whois.com/whois/${domain_url}`;

  fetch(apiUrl)
    .then(response => response.text())
    .then(html => {
      // Send the HTML content to the content script
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, { htmlContent: html });
      });
    })
    .catch(error => {
      console.error("Error:", error.message);
    });
}

function showPhishingDetectedNotification(url) {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'images/icon-48.png',
    title: `Phishing Detector\nPhishing Site Detected!`,
    message: `${url}`,
    buttons: [
      { title: 'Close Page' }
    ],
    priority: 0
  });
}

function showRealSiteNotification() {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'images/icon-48-success.png',
    title: `Phishing Detector\nSafe to Log In`,
    message: `This site appears to be safe.`,
    priority: 0
  });
}