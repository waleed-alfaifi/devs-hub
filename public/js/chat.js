const msgsContainer = document.getElementById("chat-messages-container");
const msgInput = document.getElementById("msg");
const sendForm = document.getElementById("chat-form");
const usersList = document.getElementById("users");
const reposList = document.getElementById("repos");
const topicName = document.getElementById("topic-name").textContent;
const socket = io();

msgsContainer.scrollTop = msgsContainer.scrollHeight; // Scroll down to most recent messages

// Get topic id
const segments = location.pathname.split("/");
const topicId = segments[segments.length - 1];

fetchGitHubRepos();

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
  const date = new Date().getTime();
  socket.emit("send_message", { message, date });
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

async function fetchGitHubRepos() {
  const res = await fetch(
    `https://api.github.com/search/repositories?q=${topicName}&limit=5`,
  );

  if (!res.ok) {
    reposList.innerHTML = `
    <span class="has-text-warning is-size-6">
      Couldn't fetch repos for ${topicName}
    </span>
    `;
    return;
  }

  const data = await res.json();
  /**
   * @type { Array<{ url: string, name: string, full_name: string }> }
   */
  const repos = data.items.map((item) => ({
    url: item.svn_url,
    name: item.name,
    full_name: item.full_name,
  }));

  reposList.innerHTML = "";

  repos.slice(0, 3).forEach((repo) => {
    const { full_name, url } = repo;
    const li = document.createElement("li");
    li.innerHTML = `
    <a href="${url}" target="_blank" rel="noopenner" class="has-text-white">
        <span>${full_name}</span>
    </a>
    `;

    reposList.appendChild(li);
  });
}
