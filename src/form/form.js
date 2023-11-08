import "../assets/styles/style.scss";
import "./form.scss";
import { openModal } from "../assets/javascripts/modal";

let errors = [];
let articleId;

const form = document.querySelector("form");
const errorList = document.getElementById("errors");
const cancelBtn = document.querySelector(".btn-secondary");

const initiateForm = async () => {
  const params = new URL(location.href);
  articleId = params.searchParams.get("id");

  if (articleId) {
    const response = await fetch(
      `https://restapi.fr/api/cda_louis/${articleId}`
    );
    const article = await response.json();
    console.log(article);
    fillForm(article);
  }
};

initiateForm();

const fillForm = (article) => {
  const formFields = form.querySelectorAll("input, select, textarea");
  formFields.forEach((field) => {
    field.value = article[field.name];
  });
};

cancelBtn.addEventListener("click", async () => {
  const answer = await openModal(
    "Voulez vous vraiment annuler la rédaction de cet article ?"
  );
  if (answer) {
    location.assign("./index.html");
  }
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const entries = formData.entries();
  const article = Object.fromEntries(entries);

  if (formIsValid(article)) {
    const json = JSON.stringify(article);

    try {
      let response;
      if (articleId) {
        // Mettre a jour l'article
        response = await fetch(
          `https://restapi.fr/api/cda_louis/${articleId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: json,
          }
        );
      } else {
        // On creer un nouvel article
        response = await fetch("https://restapi.fr/api/cda_louis", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: json,
        });
      }

      if (response.status < 300) {
        location.assign("./index.html");
      }
    } catch (error) {
      console.log(error);
    }
  }
});

const formIsValid = (article) => {
  if (!article.author || !article.title || !article.content) {
    errors.push("Vous devez renseigner tous les champs");
  }

  if (article.content.length > 1000) {
    errors.push("Attention l'article ne peut pas exceder 1000 caracteres");
  }

  if (errors.length) {
    let errorHtml = "";
    errors.forEach((error) => {
      errorHtml += `<li>${error}</li>`;
    });
    errorList.innerHTML = errorHtml;
    errors = [];
    return false;
  }

  errorList.innerHTML = "";
  return true;
};
