const modal = document.getElementById("add-topic-modal");
const createTopicButton = document.getElementById("create-topic-button");

createTopicButton.addEventListener("click", () => {
  modal.classList.add("is-active");

  document.querySelectorAll(".modal-background, .modal .delete, #modal-cancel").addEventListener("click", () => {
    modal.classList.remove("is-active");
  });
});
