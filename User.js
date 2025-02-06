const socket = io("http://localhost:4000"); // Connect to your backend server on port 4000
let currentUser = "";

function registerUser() {
  const username = document.getElementById("username").value.trim();
  const errorDiv = document.getElementById("error-message");

  if (username) {
    socket.emit("register-user", username);

    // Handle registration success
    socket.once("registration-success", (username) => {
      currentUser = username;
      document.getElementById("login-box").style.display = "none";
      document.getElementById("chat-box").style.display = "flex";
      console.log("Registration successful:", username);
    });

    // Handle registration error
    socket.once("registration-error", (error) => {
      errorDiv.textContent = error;
      console.error("Registration error:", error);
    });
  } else {
    errorDiv.textContent = "Username cannot be empty.";
  }
}
