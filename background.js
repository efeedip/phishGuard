/* chrome.runtime.onMessage.addListener(function (message, _sender, sendResponse) {
  if (message.domain) {
    const domain = message.domain;
    const apiUrl = `https://www.whois.com/whois/${domain}`;

    fetch(apiUrl)
      .then(response => response.text())
      .then(html => {
        // Log the response.text() value to the console
        console.log("Response text from WHOIS API:", html);

        sendResponse({ result: html });
      })
      .catch(error => {
        sendResponse({ result: `Error: ${error.message}` });
        console.error("Error:", error.message);
      });

    return true; // Indicates that sendResponse will be called asynchronously
  }
}); 



chrome.runtime.onMessage.addListener(function (message, _sender, _sendResponse) {
  if (message.domain) {
    const domain = message.domain;
    const apiUrl = `https://www.whois.com/whois/${domain}`;

    fetch(apiUrl)
      .then(response => response.text())
      .then(html => {
        // Log the response text value to the console
        console.log("Response text from WHOIS API:", html.includes("registryData"));
      })
      .catch(error => {
        console.error("Error:", error.message);
      });

    return true; // Indicates that sendResponse will be called asynchronously
  }
}); */

chrome.runtime.onMessage.addListener(function (message, _sender, sendResponse) {
  if (message.domain) {
    const domain = message.domain;
    const apiUrl = `https://www.whois.com/whois/${domain}`;

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
});




