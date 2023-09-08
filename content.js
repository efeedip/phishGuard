// Define the string you want to search for
const searchString = "sube.assets";
const currentUrl = window.location.href;
console.log(currentUrl)

// Get the source code of the web page
const sourceCode = document.documentElement.outerHTML;

// Check if the string is present in the source code
if (sourceCode.includes(searchString)) {
  // String is found
  if (currentUrl.includes("sube.garantibbva.com.tr")) {
    console.log("Not phishing");
  } else {
    console.log("It is phishing")
  }
  
  // You can perform additional actions here
} else {
  // String is not found
  console.log(`"${searchString}" not found in the source code.`);
  // You can perform alternative actions here
}


