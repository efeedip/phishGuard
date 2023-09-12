chrome.notifications.onButtonClicked.addListener(
  (notificationId, buttonIndex) => {
    if (buttonIndex === 0) {
      // Check if the first button was clicked
      // Send a message to the content script to close the tab
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          chrome.tabs.remove(tabs[0].id);
        }
      });
    }
  }
);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.whoisQuery) {
    whoisQuery(message.domain_url);
  }

  if (message.showPhishingPageNotification) {
    // Create and show the notification
    showPhishingDetectedNotification(message.url);
  }

  if (message.showRealPageNotification) {
    // Create and show the notification
    showRealSiteNotification(message.url);
  }

  if (message.showWarningPageNotification) {
    showWarningNotification(message.url);
  }
});

function whoisQuery(domain_url) {
  const currentUrl = domain_url;
  const apiUrl = `https://www.whois.com/whois/${domain_url}`;

  fetch(apiUrl)
    .then((response) => response.text())
    .then((html) => {
      // Send the HTML content to the content script
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        const activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, { htmlContent: html });
      });
    })
    .catch((error) => {
      console.error("Error:", error.message);
    });
}

function showPhishingDetectedNotification(url) {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "images/icon-48-phishing.png",
    title: `PhishGuard Notification\nPhishing Site Detected!`,
    message: `${url}`,
    buttons: [{ title: "Close Page" }],
    requireInteraction: true,
    priority: 0,
  });
}

function showRealSiteNotification(url) {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "images/icon-48-success.png",
    title: `PhishGuard Notification\nSafe to Log In`,
    message: `This site appears to be safe.\n${url}`,
    priority: 0,
  });
}

function showWarningNotification(url) {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "images/icon-48-warning.png",
    title: `PhishGuard Notification\nHigh risk of data theft `,
    message: `It is not recommended to enter your banking information on this page.\n${url}`,
    buttons: [{ title: "Close Page" }],
    requireInteraction: true,
    priority: 0,
  });
}
