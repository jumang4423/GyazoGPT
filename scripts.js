// This function will run when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  chrome.storage.local.get(["openaikey"], function (result) {
    if (result.openaikey) {
      document.getElementById("openaiapi").value = result.openaikey;
    }
  });

  // Function to save the API key to localStorage
  function setOpenAIKey() {
    openaikey = document.getElementById("openaiapi").value;
    if (!openaikey) {
      alert("input is empty");
      return;
    }
    if (!openaikey.startsWith("sk-")) {
      alert("this is not openai api key");
      return;
    }

    chrome.storage.local.set({ openaikey: openaikey }, function () {
      alert("OpenAI API Key saved!");
      window.close(); // Closes the popup window
    });
  }

  // Attach the event listener to the 'Save' button
  document
    .getElementById("openaikey_save")
    .addEventListener("click", setOpenAIKey);
});
