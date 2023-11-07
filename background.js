chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "askOpenAI") {
    chrome.storage.local.get(["openaikey"], function (result) {
      const openaiApiKey = result.openaikey;
      if (!openaiApiKey) {
        sendResponse({ message: "No API key found." });
        return;
      }

      const data = {
        model: "gpt-4-vision-preview",
        messages: request.conversationHistoriesArr,
        max_tokens: 512,
      };

      // Now, make the OpenAI API call
      fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          sendResponse(data.choices[0].message.content);
        })
        .catch((error) => {
          sendResponse(JSON.stringify(error));
        });
    });

    return true;
  }
});
