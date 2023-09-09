console.log("Content script loaded."); // You can log messages to the console for testing.

// Get the source code of the web page
let phishingNotificationShown = false;
let realpageNotificationShown = false;
let scriptHasRun = false

function sourceCodeCheck(sourceCode, currentUrl) {
  const banks = [
    {
      assets: "assets.garanti",
      url: "sube.garantibbva.com.tr",
    },
    {
      assets: "/WebApplication.UI/entrypoint.aspx?T",
      url: "internetsubesi.akbank.com",
    },
    {
      assets: "/ibank/static/css",
      url: "isube.anadolubank.com",
    },
    {
      assets: "/vendors.bundle.web.92185d4429e4b3c998a3.3.1.7.402.js",
      url: "internetbankaciligi.fibabanka.com.tr",
    },
    {
      assets: "sube.sekerbank.com.tr/static",
      url: "sube.sekerbank.com.tr",
    },
    {
      assets: "assets/css/teb-style.css",
      url: "esube.teb.com.tr/",
    },
    {
      assets: "/Internet/IntSubeJS",
      url: "isbank.com.tr/Internet/",
    },
    {
      assets: "inventus.yapikredi",
      url: "internetsube.yapikredi.com.tr",
    },
    {
      assets: "styles.f13e9bd3a25ecbd90517.css",
      url: "acikdeniz.denizbank.com/",
    },
    {
      assets: "/Content/Themes/FinansbankTheme",
      url: "internetsubesi.qnbfinansbank.com",
    },
  ];

  for (const bank of banks) {
    if (sourceCode.includes(bank.assets) && !currentUrl.includes(bank.url)) {
      if (!phishingNotificationShown) {
        phishingNotificationShown = true;
        chrome.runtime.sendMessage({ showPhishingPageNotification: true, url: currentUrl });
      }
      return true;
    }
    if (sourceCode.includes(bank.assets) && currentUrl.includes(bank.url)) {
      if (!realpageNotificationShown) {
        realpageNotificationShown = true;
        chrome.runtime.sendMessage({ showRealPageNotification: true });
      }
      return true;
    }
  }

  return false;
}


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

const sourceCode = document.documentElement.outerHTML;
const currentUrl = window.location.href;
const sourceCodeCheck_result = sourceCodeCheck(sourceCode, currentUrl);

if (!sourceCodeCheck_result) {
  chrome.runtime.sendMessage({ calculateRisk: true , domain_url: currentUrl })
  // Function to process the message and extract data
  // Listen for messages from the background script only if the script hasn't run yet
  if (!scriptHasRun) {
    chrome.runtime.onMessage.addListener(function (message, _sender, _sendResponse) {
      // Check if the script has already run before processing the message
      if (!scriptHasRun) {
        processMessage(message);
      }
    });
  }
};