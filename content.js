console.log("Content script loaded."); // You can log messages to the console for testing.

const currentUrl = window.location.href;
console.log(`start source code check for url:${currentUrl}`);
// Get the source code of the web page
const sourceCode = document.documentElement.outerHTML;

let phishingDetected = false;

//Garanti source kod check
// Check if the string is present in the source code
const GBassets = "assets.garanti";
if (!phishingDetected) {
  if (sourceCode.includes(GBassets)) {
    // String is found
    if (currentUrl.includes("sube.garantibbva.com.tr")) {
      console.log("Not phishing");
    } else {
      phishingDetected = true;
      console.log("It is phishing")
    }
    // You can perform additional actions here
  } 
  
  //Akbank source kod check
  // Check if the string is present in the source code
  const AKassets = "/WebApplication.UI/entrypoint.aspx?T";
  if (sourceCode.includes(AKassets)) {
    // String is found
    if (currentUrl.includes("internetsubesi.akbank.com")) {
      console.log("Not phishing");
    } else {
      phishingDetected = true;
      console.log("It is phishing")
    }
    // You can perform additional actions here
  }
  
  //Anadolubank source kod check
  // Check if the string is present in the source code
  const ANDassets = "/ibank/static/css";
  if (sourceCode.includes(ANDassets)) {
    // String is found
    if (currentUrl.includes("isube.anadolubank.com")) {
      console.log("Not phishing");
    } else {
      phishingDetected = true;
      console.log("It is phishing")
    }
    // You can perform additional actions here
  }
  
  //FIBA source kod check
  // Check if the string is present in the source code
  const FIBassets = "/vendors.bundle.web.92185d4429e4b3c998a3.3.1.7.402.js";
  if (sourceCode.includes(FIBassets)) {
    // String is found
    if (currentUrl.includes("internetbankaciligi.fibabanka.com.tr")) {
      console.log("Not phishing");
    } else {
      phishingDetected = true;
      console.log("It is phishing")
    }
    // You can perform additional actions here
  }
  
  //SEKERBANK source kod check
  // Check if the string is present in the source code
  const SKBassets = "sube.sekerbank.com.tr/static";
  if (sourceCode.includes(SKBassets)) {
    // String is found
    if (currentUrl.includes("sube.sekerbank.com.tr")) {
      console.log("Not phishing");
    } else {
      phishingDetected = true;
      console.log("It is phishing")
    }
    // You can perform additional actions here
  }
  
  //TEB source kod check
  // Check if the string is present in the source code
  const TEBassets = "assets/css/teb-style.css";
  if (sourceCode.includes(TEBassets)) {
    // String is found
    if (currentUrl.includes("esube.teb.com.tr/")) {
      console.log("Not phishing");
    } else {
      phishingDetected = true;
      console.log("It is phishing")
    }
    // You can perform additional actions here
  }
  
  
  //ISBANK source kod check
  // Check if the string is present in the source code
  const ISBassets = "/Internet/IntSubeJS";
  if (sourceCode.includes(ISBassets)) {
    // String is found
    if (currentUrl.includes("isbank.com.tr/Internet/")) {
      console.log("Not phishing");
    } else {
      phishingDetected = true;
      console.log("It is phishing")
    }
    // You can perform additional actions here
  }
  
  
  //YKB source kod check
  // Check if the string is present in the source code
  const YKBassets = "inventus.yapikredi";
  if (sourceCode.includes(YKBassets)) {
    // String is found
    if (currentUrl.includes("internetsube.yapikredi.com.tr")) {
      console.log("Not phishing");
    } else {
      phishingDetected = true;
      console.log("It is phishing")
    }
    // You can perform additional actions here
  }
  
  //DENIZBANK source kod check
  // Check if the string is present in the source code
  const DNZassets = "styles.f13e9bd3a25ecbd90517.css";
  if (sourceCode.includes(DNZassets)) {
    // String is found
    if (currentUrl.includes("acikdeniz.denizbank.com/")) {
      console.log("Not phishing");
    } else {
      phishingDetected = true;
      console.log("It is phishing")
    }
    // You can perform additional actions here
  }
  
  //QNB source kod check
  // Check if the string is present in the source code
  const QNBassets = "/Content/Themes/FinansbankTheme";
  if (sourceCode.includes(QNBassets)) {
    // String is found
    if (currentUrl.includes("internetsubesi.qnbfinansbank.com")) {
      console.log("Not phishing");
    } else {
      phishingDetected = true;
      console.log("It is phishing")
    }
    // You can perform additional actions here
  }


  if (!phishingDetected) {
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
  }

}

