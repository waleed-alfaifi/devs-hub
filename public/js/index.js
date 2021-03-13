const modal = document.getElementById("add-topic-modal");
const createTopicButton = document.getElementById("create-topic-button");

createTopicButton.addEventListener("click", () => {
  modal.classList.add("is-active");

  document.querySelector(".modal-background").addEventListener("click", () => {
    modal.classList.remove("is-active");
  });

  document.querySelector(".modal .delete").addEventListener("click", () => {
    modal.classList.remove("is-active");
  });

  document.getElementById("modal-cancel").addEventListener("click", () => {
    modal.classList.remove("is-active");
  });
});
