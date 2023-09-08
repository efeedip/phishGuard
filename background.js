// Listen for the onCompleted event when a page finishes loading
chrome.webNavigation.onCompleted.addListener(function (details) {
  // Check if the URL matches the page you want to target (adjust the URL pattern as needed)

    // Execute your background script logic here
  const currentUrl = window.location.hostname;
  const apiUrl = `https://www.whois.com/whois/${currentUrl}`;

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
});
