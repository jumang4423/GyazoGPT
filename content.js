function checkForGyazoURL() {
  if (window.location.href.startsWith("https://gyazo.com/")) {
    var url = window.location.href;
    var imageUrl =
      url.replace("https://gyazo.com/", "https://i.gyazo.com/") + ".png";
    let conversationHistoriesArr = [
      {
        role: "system",
        content: [
          {
            type: "text",
            text: "your response should be short and concise",
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "image_url",
            image_url: imageUrl,
          },
        ],
      },
    ];
    window.addEventListener("load", function () {
      var descriptionElement = document.querySelector(".metadata-description");

      if (descriptionElement) {
        var gyazoGPTDiv = document.createElement("div");
        gyazoGPTDiv.innerHTML = `
    <div style="margin-top: 10px; margin-bottom: 8px; border: 1px solid #aaa; padding: 10px; border-radius: 8px;">
        <label style="color: #aaa;">GyazoGPT</label>
        <div class="conversation_histories"></div>
        <div class="inferencing" style="color: #7a7; margin-bottom: 8px; display: none;">
            > inferencing...
        </div>
        <div style="display: flex; flex-direction: row; align-items: center;">
            <button id="askAIButton" style="background-color: #484d58; border: 0px solid #aaa; border-radius: 4px; padding: 8px; color: #aaa; margin-right: 4px;">➤</button>
            <textarea placeholder="ex: Explain this image" rows="2" id="gyazoGPTInput" name="gyazoGPTInput" style="background-color: #484d58; border: 0px solid #aaa; border-radius: 4px; padding: 4px; margin-left: 4px; width: 300px; color: #aaa; width: 100%;"></textarea>
        </div>
    </div>
      `;
        descriptionElement.after(gyazoGPTDiv);
        document
          .getElementById("askAIButton")
          .addEventListener("click", function () {
            var userInput = document.getElementById("gyazoGPTInput").value;
            if (userInput.trim() !== "") {
              // loading
              document.querySelector(".inferencing").style.display = "block";
              document.getElementById("askAIButton").disabled = true;
              // append user question to conversation histories
              var conversationHistories = document.querySelector(
                ".conversation_histories"
              );
              var conversationHistory = document.createElement("div");
              conversationHistory.innerHTML = `
                <div style="color: #aaa; margin-bottom: 4px;">
                    user> ${userInput}
                </div>
            `;
              conversationHistories.append(conversationHistory);
              // start asking
              conversationHistoriesArr.push({
                role: "user",
                content: [
                  {
                    type: "text",
                    text: userInput,
                  },
                ],
              });
              chrome.runtime.sendMessage(
                { action: "askOpenAI", conversationHistoriesArr },
                function (response_text) {
                  // append response to conversation histories
                  var conversationHistory = document.createElement("div");
                  conversationHistory.innerHTML = `
                    <div style="color: #afa; margin-bottom: 4px;">
                        gyazoGPT> ${response_text}
                    </div>
                `;
                  conversationHistories.append(conversationHistory);
                  // also data
                  conversationHistoriesArr.push({
                    role: "assistant",
                    content: [
                      {
                        type: "text",
                        text: response_text,
                      },
                    ],
                  });
                  // done loading
                  document.querySelector(".inferencing").style.display = "none";
                  document.getElementById("askAIButton").disabled = false;
                  document.getElementById("gyazoGPTInput").value = "";
                }
              );
            }
          });
      }
    });
  }
}

checkForGyazoURL();
