const body = document.querySelector("body");
let calc;
let modal;
let cancelBtn;
let confirmBtn;

const createCalc = () => {
  calc = document.createElement("div");
  calc.classList.add("calc");
};

const createModal = (question) => {
  modal = document.createElement("div");
  modal.classList.add("modal");

  modal.innerHTML = `<p>${question}</p>`;

  cancelBtn = document.createElement("button");
  cancelBtn.classList.add("btn", "btn-danger");
  cancelBtn.innerText = "Annuler";

  confirmBtn = document.createElement("button");
  confirmBtn.classList.add("btn", "btn-primary");
  confirmBtn.innerText = "Confirmer";

  modal.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  modal.append(cancelBtn, confirmBtn);
};

export function openModal(question) {
  createCalc();
  createModal(question);
  calc.append(modal);
  body.append(calc);

  return new Promise((resolve, reject) => {
    calc.addEventListener("click", (event) => {
      calc.remove();
      resolve(false);
    });
    cancelBtn.addEventListener("click", (event) => {
      calc.remove();
      resolve(false);
    });
    confirmBtn.addEventListener("click", (event) => {
      calc.remove();
      resolve(true);
    });
  });
}
