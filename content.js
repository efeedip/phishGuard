class NotificationManager {
  constructor() {
    this.phishingNotificationShown = false;
    this.realPageNotificationShown = false;
    this.warningNotificationShown = false;
  }

  showPhishingNotification(url) {
    if (!this.phishingNotificationShown) {
      this.phishingNotificationShown = true;
      chrome.runtime.sendMessage({
        showPhishingPageNotification: true,
        url: url,
      });
    }
  }

  showWarningNotification(url) {
    if (!this.warningNotificationShown) {
      this.warningNotificationShown = true;
      chrome.runtime.sendMessage({
        showWarningPageNotification: true,
        url: url,
      });
    }
  }

  showRealPageNotification(url) {
    if (!this.realPageNotificationShown) {
      this.realPageNotificationShown = true;
      chrome.runtime.sendMessage({ showRealPageNotification: true, url: url });
    }
  }

  resetRealPageNotification() {
    this.realPageNotificationShown = false;
  }
}

const notificationManager = new NotificationManager();

let domainCheckScriptHasRun = false;
let sourceCodeScriptHasRun = false;
let calculateRiskScriptHasRun = false;

const sourceCode = document.documentElement.outerHTML;
const currentUrl = window.location.href;

function getFinalDecision(sourceCode, currentUrl, notificationManager) {
  const final_decision = runChecks(sourceCode, currentUrl, notificationManager);
  return final_decision;
}

runChecks(sourceCode, currentUrl, notificationManager);

function runChecks(sourceCode, currentUrl, notificationManager) {
  let riskScore = 0;
  let decision = "";
  const dataToStore = {};

  // Call the sourceCodeCheck function and handle notifications
  if (!sourceCodeScriptHasRun) {
    const sourceCodeCheck_result = sourceCodeCheck(
      sourceCode,
      currentUrl,
      notificationManager
    );
    if (sourceCodeCheck_result === false) {
      // Send message to background.js to start whoisQuery
      chrome.runtime.sendMessage({
        whoisQuery: true,
        domain_url: currentUrl,
      });

      // Start domainCheck with coming message from background.js
      chrome.runtime.onMessage.addListener(function (
        message,
        _sender,
        _sendResponse
      ) {
        if (!domainCheckScriptHasRun) {
          const domainAge = domainCheck(message);
          domainCheckScriptHasRun = true;

          // Calculate the risk based on source code and add it to the riskScore
          if (!calculateRiskScriptHasRun) {
            const sourceCodeRisk = calculateRisk(sourceCode, currentUrl);
            riskScore += sourceCodeRisk;

            // Add domain age-based risk
            if (domainAge <= 30) {
              riskScore += 50;
            }

            if (riskScore >= 70) {
              decision = "WARNING";
              dataToStore[currentUrl] = decision;
              chrome.storage.local.set({ myData: dataToStore }, function () {
                console.log("Data stored successfully");
              });
              notificationManager.showWarningNotification(currentUrl);
            } else {
              decision = "UNDEFINED";
              dataToStore[currentUrl] = decision;
              chrome.storage.local.set({ myData: dataToStore }, function () {
                console.log("Data stored successfully");
              });
            }
            calculateRiskScriptHasRun = true;
            console.log("Final Risk Score: " + riskScore);
          }
        }
      });
    } else if (sourceCodeCheck_result === true) {
      decision = "PHISHING";
      dataToStore[currentUrl] = decision;
      chrome.storage.local.set({ myData: dataToStore }, function () {
        console.log("Data stored successfully");
      });
    } else if (sourceCodeCheck_result === null) {
      decision = "SAFE";
      dataToStore[currentUrl] = decision;
      chrome.storage.local.set({ myData: dataToStore }, function () {
        console.log("Data stored successfully");
      });
    }
    sourceCodeScriptHasRun = true;
  }

  chrome.storage.local.get(["myData"], function (result) {
    const storedData = result.myData;
    console.log("Retrieved data:", storedData);
  });
  return decision;
}

// Add a listener for messages from the background script

function sourceCodeCheck(sourceCode, currentUrl, notificationManager) {
  const banks = [
    {
      assets: [
        "/assets/img/logo-garantibbva.png",
        "assets.garanti",
        "GT.temporary",
        "logo-garantibbva-2x.png",
        "sube.garantibbva.com.tr/isube/login/login/passwordentrypersonal-tr",
        "sube.garantibbva.com.tr/isube/login/login/passwordentrycorporate-tr",
      ],
      url: "sube.garantibbva.com.tr",
    },
    {
      assets: ["/WebApplication.UI/entrypoint.aspx?T"],
      url: "internetsubesi.akbank.com",
    },
    {
      assets: ["/ibank/static/css"],
      url: "isube.anadolubank.com",
    },
    {
      assets: ["/vendors.bundle.web.92185d4429e4b3c998a3.3.1.7.402.js"],
      url: "internetbankaciligi.fibabanka.com.tr",
    },
    {
      assets: ["sube.sekerbank.com.tr/static"],
      url: "sube.sekerbank.com.tr",
    },
    {
      assets: ["assets/css/teb-style.css"],
      url: "esube.teb.com.tr/",
    },
    {
      assets: ["/Internet/IntSubeJS"],
      url: "isbank.com.tr/Internet/",
    },
    {
      assets: ["inventus.yapikredi"],
      url: "internetsube.yapikredi.com.tr",
    },
    {
      assets: ["styles.f13e9bd3a25ecbd90517.css"],
      url: "acikdeniz.denizbank.com/",
    },
    {
      assets: ["/Content/Themes/FinansbankTheme"],
      url: "internetsubesi.qnbfinansbank.com",
    },
  ];

  const skipPhishingNotificationUrls = [
    "https://www.garantibbva.com.tr/",
    "https://www.akbank.com/tr-tr/sayfalar/default.aspx",
    "https://www.isbank.com.tr/",
    "https://www.yapikredi.com.tr/",
    "https://www.denizbank.com/",
    "https://www.qnbfinansbank.com/",
    "https://www.teb.com.tr/",
    "https://www.sekerbank.com.tr/",
    "https://www.fibabanka.com.tr/",
    "https://www.anadolubank.com.tr/sizin-icin",
    // Add more URLs to skip here
  ];

  const isSpesifiedURL = skipPhishingNotificationUrls.includes(currentUrl);

  for (const bank of banks) {
    const { assets, url } = bank;
    const assetsFound = assets.some((asset) => sourceCode.includes(asset));

    if (assetsFound) {
      if (currentUrl.includes(url)) {
        notificationManager.resetRealPageNotification();
        notificationManager.showRealPageNotification(currentUrl);
        sourceCodeScriptHasRun = true;
        return null;
      } else {
        if (!isSpesifiedURL) {
          notificationManager.showPhishingNotification(currentUrl);
        }
        sourceCodeScriptHasRun = true;
        return true;
      }
    }
  }
  sourceCodeScriptHasRun = true;
  return false;
}

function domainCheck(message) {
  if (message.htmlContent) {
    const html = message.htmlContent;
    const tempElement = document.createElement("div");
    tempElement.innerHTML = html;

    const registryDataBlock = tempElement.querySelector(".whois-data");

    if (registryDataBlock) {
      const registryBlockText = registryDataBlock.textContent;
      const indexofCreation = registryBlockText.indexOf("Creat");
      const createdOn = registryBlockText.substring(
        indexofCreation + 15,
        indexofCreation + 25
      );

      const date1 = new Date();
      const date2 = new Date(createdOn);
      const diffTime = Math.abs(date2 - date1);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      console.log(diffDays + " days");
      console.log("Created on:", createdOn);
      return diffDays;
    } else {
      console.log("#registryData element not found in the HTML.");
      return 0;
    }
  }

  domainCheckScriptHasRun = true;
  return 0;
}

function calculateRisk(sourceCode, currentUrl) {
  // Define your query keywords with associated weights
  const queryKeywords = [
    {
      keywords: [
        { keyword: "Internet Banka", weight: 10 },
        { keyword: "İnternet Banka", weight: 10 },
        { keyword: "İnternet Şube", weight: 10 },
        { keyword: "Internet Sube", weight: 10 },
        { keyword: "custno", weight: 5 },
        { keyword: "loginForm", weight: 3 },
        { keyword: "form", weight: 3 },
        { keyword: "Form", weight: 3 },
        { keyword: "müşteri num", weight: 5 },
        { keyword: "musteri num", weight: 5 },
        { keyword: "T.C. kimlik", weight: 5 },
        { keyword: "T.C. Kimlik", weight: 5 },
        { keyword: "TC Kimlik", weight: 5 },
        { keyword: "TC kimlik", weight: 5 },
        { keyword: "Müşteri Num", weight: 5 },
        { keyword: "password", weight: 5 },
        { keyword: "formField", weight: 3 },
        { keyword: "Parola", weight: 10 },
        { keyword: "parola", weight: 10 },
        { keyword: "Beni Hatırla", weight: 5 },
        { keyword: "Müşteri / T.C", weight: 10 },
        { keyword: "Müşteri/T.C", weight: 10 },
        { keyword: "TCKN", weight: 10 },
        { keyword: "Müşteri/T.C", weight: 10 },
        { keyword: "Müşteri/T.C", weight: 10 },
        // Add more keywords with their weights
      ],
      urls: [
        //"sube.garantibbva.com.tr",
        "internetsubesi.qnbfinansbank.com",
        "acikdeniz.denizbank.com/",
        "internetsube.yapikredi.com.tr",
        "isbank.com.tr/Internet/",
        "esube.teb.com.tr/",
        "sube.sekerbank.com.tr",
        "internetbankaciligi.fibabanka.com.tr",
        "isube.anadolubank.com",
        "internetsubesi.akbank.com",
        // Add more URLs
      ],
    },
    // You can define additional keyword sets here
  ];

  let keywordCatch = 0; // Initialize the keywordCatch variable

  // Check if currentUrl matches any of the specified URLs
  const isUrlSpecified = queryKeywords.some((queryKeyword) =>
    queryKeyword.urls.includes(currentUrl)
  );

  if (!isUrlSpecified) {
    // If the currentUrl is not in the specified list, proceed with keyword analysis
    for (const queryKeyword of queryKeywords) {
      const { keywords, urls } = queryKeyword;

      for (const keywordObj of keywords) {
        const { keyword, weight } = keywordObj;

        // Check if the keyword is found in the sourceCode
        if (sourceCode.includes(keyword)) {
          keywordCatch += weight; // Increase keywordCatch by the keyword's weight
        }
      }
    }
  }
  calculateRiskScriptHasRun = true;
  return keywordCatch; // Return the calculated risk score
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.requestDecision) {
    console.log("message got into content");
    // Get the decision
    const decision = getFinalDecision(
      sourceCode,
      currentUrl,
      notificationManager
    );
    console.log(decision);
    // Send the decision back to the popup
    chrome.runtime.sendMessage({ decision: decision });
  }
});
