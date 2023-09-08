console.log("Content script loaded."); // You can log messages to the console for testing.

const GBassets = "assets.garanti";

// Get the source code of the web page
const sourceCode = document.documentElement.outerHTML;

// Check if the string is present in the source code
if (sourceCode.includes(GBassets)) {
  // String is found
  if (currentUrl.includes("sube.garantibbva.com.tr")) {
    console.log("Not phishing");
  } else {
    console.log("It is phishing")
  }
  
  // You can perform additional actions here
} else {
  // String is not found
  console.log("Not phishing");;
  // You can perform alternative actions here
}

// Define a variable to track whether the script has already run
let scriptHasRun = false;

// Function to process the message and extract data
function processMessage(message) {

  if (message.htmlContent) {
    // Parse the HTML content sent from the background script
    const html = message.htmlContent;

    // Create a temporary element to parse the HTML
    const tempElement = document.createElement('div');
    tempElement.innerHTML = html;

    const registryDataBlock = tempElement.querySelector("#registryData");

    /* registry kontrol - domain age check */
    if (registryDataBlock) {
      // Log the text inside the 'registryData' element to the console
      const registryBlockText = registryDataBlock.textContent;
      const indexofCreation = registryBlockText.indexOf("Creation");
      const createdOn = registryBlockText.substring(indexofCreation + 15, indexofCreation + 25);

      const date1 = new Date();
      const date2 = new Date(createdOn);
      const diffTime = Math.abs(date2 - date1);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      console.log(diffDays + " days");
      console.log("Created on:", createdOn);
    } else {
      console.log("#registryData element not found in the HTML.");
    }
  }

  // Set the scriptHasRun variable to true to indicate that the script has run
  scriptHasRun = true;
}

// Listen for messages from the background script only if the script hasn't run yet
if (!scriptHasRun) {
  chrome.runtime.onMessage.addListener(function (message, _sender, _sendResponse) {
    // Check if the script has already run before processing the message
    if (!scriptHasRun) {
      processMessage(message);
    }
  });
}
