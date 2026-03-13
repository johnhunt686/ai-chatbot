const chatLog = document.getElementById("chat-messages");
const chatInput = document.getElementById("text-input");
const sendBtn = document.getElementById("text-confirm");


function addMessage(text, sender, side) {
    const msg = document.createElement("div");
    if (side == "right"){
        msg.classList.add("message");
        msg.classList.add("sender", sender);
        msg.textContent = sender + ": " + text;
    } else {
        msg.classList.add("response");
        msg.classList.add("sender", sender);
        msg.textContent = sender + ": " + text;
    }
    chatLog.appendChild(msg);

    // Auto-scroll to newest message
    chatLog.scrollTop = chatLog.scrollHeight;
}

async function handleSend() {
    const text = chatInput.value.trim();

    if (text === "") return;

    addMessage(text, "user","right");

    const reply = await askAI(text)
    addMessage(reply, "openAI","left");

    chatInput.value = "";
}

async function askAI(message) {
  const response = await fetch("http://localhost:3000/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: message
    })
  });

  const data = await response.json();
  return data.reply;
}

sendBtn.addEventListener("click", handleSend);

// Send when pressing Enter
chatInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        handleSend();
    }
});


sendBtn.onclick = async () => {
  const text = chatInput.value;

  addMessage(text, "user", "right");

  const reply = await askAI(text);

  addMessage(reply, "ai", "left");
};