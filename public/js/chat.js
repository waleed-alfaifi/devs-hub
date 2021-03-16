const msgsContainer = document.getElementById("chat-messages-container");
const msgInput = document.getElementById("msg");
const sendForm = document.getElementById("chat-form");
const usersList = document.getElementById("users");
const socket = io();

msgsContainer.scrollTop = msgsContainer.scrollHeight; // Scroll down to most recent messages

// Get topic id
const segments = location.pathname.split("/");
const topicId = segments[segments.length - 1];

socket.emit("join_topic", { topicId });

socket.on("online_users", (onlineUsers) => {
  displayOnlineUsers(onlineUsers);
});

socket.on("welcome_msg", (message) => {
  displayMessage(message, true);
});

socket.on("receive_message", (message) => {
  displayMessage(message);
});

sendForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = msgInput.value;
  socket.emit("send_message", { message });
  msgInput.value = "";
});

function displayMessage({ message, user, date }, isWelcome = false) {
  const div = document.createElement("div");
  const content = `
    <p class="meta has-text-link">${user} <span>${date}</span></p>
    <p class="text">
      ${message}
    </p>
  `;

  div.classList = `message ${
    isWelcome ? "has-background-secondary" : "has-background-link-light"
  }`;
  div.setAttribute("dir", "auto");
  div.innerHTML = content;

  msgsContainer.appendChild(div);
  msgsContainer.scrollTop = msgsContainer.scrollHeight;
}

function displayOnlineUsers(users = []) {
  usersList.innerHTML = "";

  users.forEach((user) => {
    const { name, profileImg, profileUrl } = user;
    const li = document.createElement("li");
    li.innerHTML = user.name;
    li.innerHTML = `
      <a href="${profileUrl}" target="_blank" rel="noopenner" class="has-text-white">
        <figure class="image is-32x32 mr-3">
          <img src="${profileImg}" alt="${name}" class="is-rounded">
        </figure>
        <span>${name}</span>
      </a>
    `;

    usersList.appendChild(li);
  });
}
