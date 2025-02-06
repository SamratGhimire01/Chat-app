// Send Message
function sendMessage() {
  const content = document.getElementById("message-input").value.trim();
  const to = document.getElementById("recipient").value.trim();

  if (!content || !to) {
    alert("Please enter both recipient and message content.");
    return;
  }

  // Create temporary message
  const tempMsg = { from: currentUser, content, to };
  const div = createMessageElement(tempMsg, true);
  document.getElementById("chat-messages").appendChild(div);
  scrollToBottom();

  socket.emit("private-message", { to, content });
  document.getElementById("message-input").value = "";
}

// Create Message Element
function createMessageElement(msg, isCurrentUser) {
  const div = document.createElement("div");
  div.className = isCurrentUser
    ? "message user-message"
    : "message friend-message";

  const timestamp = new Date().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  div.innerHTML = `
    <div>${msg.content}</div>
    <div class="timestamp">${timestamp} • ${msg.from}</div>
  `;

  return div;
}

// Scroll to Bottom
function scrollToBottom() {
  const chatMessages = document.getElementById("chat-messages");
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Listen for new messages
socket.on("new-message", (msg) => {
  const isCurrentUser = msg.from === currentUser;
  const div = createMessageElement(msg, isCurrentUser);
  document.getElementById("chat-messages").appendChild(div);
  scrollToBottom();
});
