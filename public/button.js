const addButtonToCommentBoxes = () => {
  const commentBoxes = document.querySelectorAll(".comments-comment-box--cr");

  commentBoxes.forEach((commentBox) => {
    if (!commentBox.querySelector(".fill-comment-button")) {
      const mainButton = document.createElement("button");
      mainButton.innerText = "Generate AI Comment";
      mainButton.className = "fill-comment-button";

      mainButton.style.margin = "10px";
      mainButton.style.padding = "8px 16px";
      mainButton.style.borderRadius = "8px";
      mainButton.style.border = "none";
      mainButton.style.backgroundColor = "#0073e6";
      mainButton.style.color = "#ffffff";
      mainButton.style.fontSize = "14px";
      mainButton.style.fontWeight = "bold";
      mainButton.style.cursor = "pointer";
      mainButton.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
      mainButton.style.transition = "all 0.3s ease";

      mainButton.addEventListener("mouseover", () => {
        mainButton.style.backgroundColor = "#005bb5";
        mainButton.style.boxShadow = "0 6px 10px rgba(0, 0, 0, 0.15)";
      });
      mainButton.addEventListener("mouseout", () => {
        mainButton.style.backgroundColor = "#0073e6";
        mainButton.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
      });

      commentBox.appendChild(mainButton);

      const createOptionButton = (text, wordCount) => {
        const optionButton = document.createElement("button");
        optionButton.innerText = text;
        optionButton.className = "option-button";

        optionButton.style.margin = "10px";
        optionButton.style.padding = "8px 16px";
        optionButton.style.borderRadius = "8px";
        optionButton.style.border = "none";
        optionButton.style.backgroundColor = "#28a745";
        optionButton.style.color = "#ffffff";
        optionButton.style.fontSize = "14px";
        optionButton.style.fontWeight = "bold";
        optionButton.style.cursor = "pointer";
        optionButton.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
        optionButton.style.transition = "all 0.3s ease";

        optionButton.addEventListener("mouseover", () => {
          optionButton.style.backgroundColor = "#218838";
        });
        optionButton.addEventListener("mouseout", () => {
          optionButton.style.backgroundColor = "#28a745";
        });

        optionButton.addEventListener("click", async () => {
          optionButton.innerText = "Loading...";
          optionButton.disabled = true;
          optionButton.style.cursor = "not-allowed";

          const postElement = commentBox.closest(".feed-shared-update-v2");
          const postTextElement =
            postElement?.querySelector(".update-components-text") ||
            postElement?.querySelector(".feed-shared-text__text-view") ||
            postElement?.querySelector(
              ".attributed-text-segment-list__content"
            );
          const postText = postTextElement?.innerText || "No text found";

          try {
            const response = await fetch(
              "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyA9MKbM_FmM_p--BJgNjOuTD-6vA3D1adc",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  contents: [
                    {
                      parts: [
                        {
                          text: `Here's a post to spark your creativity: '${postText}'. Could you craft a thoughtful comment of approximately ${wordCount} words, ensuring it's relevant, engaging, and adds value to the discussion?`,
                        },
                      ],
                    },
                  ],
                }),
              }
            );

            if (!response.ok) {
              throw new Error("Failed to fetch AI response");
            }

            const data = await response.json();
            const generatedText =
              data?.candidates?.[0]?.content?.parts?.[0]?.text ||
              `No response from AI for ${wordCount}-word comment`;

            const commentInput = commentBox.querySelector(".ql-editor");

            if (commentInput) {
              commentInput.innerHTML = "";

              let index = 0;
              const typingSpeed = 5;

              const typeText = () => {
                if (index < generatedText.length) {
                  commentInput.innerHTML = generatedText.slice(0, index + 1);
                  index++;
                  const event = new Event("input", { bubbles: true });
                  commentInput.dispatchEvent(event);

                  setTimeout(typeText, typingSpeed);
                } else {
                  // Remove all option buttons after the response is displayed
                  const optionButtons =
                    commentBox.querySelectorAll(".option-button");
                  optionButtons.forEach((btn) => btn.remove());
                }
              };

              typeText();
            }
          } catch (error) {
            console.error("Error:", error);
          } finally {
            optionButton.innerText = text;
            optionButton.disabled = false;
            optionButton.style.cursor = "pointer";
          }
        });

        return optionButton;
      };

      mainButton.addEventListener("click", () => {
        mainButton.remove();

        const button50 = createOptionButton("50-word Comment", 50);
        const button100 = createOptionButton("100-word Comment", 100);
        const button200 = createOptionButton("200-word Comment", 200);

        commentBox.appendChild(button50);
        commentBox.appendChild(button100);
        commentBox.appendChild(button200);
      });
    }
  });
};

// Observe DOM changes to dynamically add buttons to new comment boxes
const observer = new MutationObserver(() => {
  addButtonToCommentBoxes();
});

// Start observing the body for child list changes
observer.observe(document.body, { childList: true, subtree: true });

// Initial call to add buttons to already loaded comment boxes
addButtonToCommentBoxes();
