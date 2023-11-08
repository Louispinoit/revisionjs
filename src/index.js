import { openModal } from "./assets/javascripts/modal";
import "./style.scss";

const articlesContainer = document.querySelector(".articles-container");
const categoriesContainer = document.querySelector(".categories");
const selectElement = document.querySelector("select");

let filter;
let articles;
let sortBy = "desc";

// Fonction qui recupere tous les articles depuis l'API
const fetchArticles = async () => {
  try {
    const response = await fetch(
      `https://restapi.fr/api/cda_louis?sort=createdAt:${sortBy}`
    );
    articles = await response.json();

    if (!(articles instanceof Array)) {
      articles = [articles];
    }

    if (articles.length) {
      createArticlesDOM();
      createMenuCategories();
    } else {
      articlesContainer.innerHTML = "Pas d'articles...";
      categoriesContainer.innerHTML = "Aucune categorie";
    }
    console.log(articles);
  } catch (error) {
    console.log(error);
  }
};

fetchArticles();

const createArticlesDOM = () => {
  const articlesDOM = articles
    .filter((article) => {
      if (filter) {
        return article.category == filter;
      }
      return true;
    })
    .map((article) => {
      const articleNode = document.createElement("div");
      articleNode.classList.add("article");
      articleNode.innerHTML = `
                <img src=${
                  article.image
                    ? article.image
                    : "assets/images/default_profile.jpg"
                } alt="Profile Image">
                <h2>${article.title}</h2>
                <p class="article-author">${article.author} - <span>${new Date(
        article.createdAt
      ).toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      })}</span></p>
                <p class="article-content">${article.content}</p>
                <div class="article-actions">
                    <button class="btn btn-primary" data-id=${
                      article._id
                    }>Editer</button>
                    <button class="btn btn-danger" data-id=${
                      article._id
                    }>Supprimer</button>
                </div>
            `;
      return articleNode;
    });

  articlesContainer.innerHTML = "";
  articlesContainer.append(...articlesDOM);

  const allDeleteBtns = articlesContainer.querySelectorAll(".btn-danger");
  const allEditBtns = articlesContainer.querySelectorAll(".btn-primary");

  allDeleteBtns.forEach((btn) => {
    btn.addEventListener("click", async (event) => {
      try {
        const answer = await openModal(
          "Voulez vous vraiment supprimer cet article ?"
        );
        if (answer) {
          const articleId = event.target.dataset.id;
          const response = await fetch(
            `https://restapi.fr/api/cda_louis/${articleId}`,
            {
              method: "DELETE",
            }
          );
          const data = await response.json();
          fetchArticles();
        }
      } catch (error) {
        console.log(error);
      }
    });
  });

  allEditBtns.forEach((btn) => {
    btn.addEventListener("click", (event) => {
      const articleId = event.target.dataset.id;
      location.assign(`/form.html?id=${articleId}`);
    });
  });
};

const createMenuCategories = () => {
  const categories = articles.reduce((acc, article) => {
    if (acc[article.category]) {
      acc[article.category]++;
    } else {
      acc[article.category] = 1;
    }
    return acc;
  }, {});

  const categoriesArray = Object.keys(categories)
    .map((category) => [category, categories[category]])
    .sort((a, b) => a[0].localeCompare(b[0]));

  displayMenuCategories(categoriesArray);
};

const displayMenuCategories = (categoriesArray) => {
  // [ [ 'science', 3 ], [ 'histoire', 1 ], [ 'sport', 2 ] ]
  // [<Node li>, <Node li>, <Node li>]

  const liElements = categoriesArray.map((categoryElement) => {
    const li = document.createElement("li");
    li.innerHTML = `${categoryElement[0]} (<span>${categoryElement[1]}</span>)`;

    if (categoryElement[0] === filter) {
      li.classList.add("active");
    }

    li.addEventListener("click", (event) => {
      liElements.forEach((element) => element.classList.remove("active"));
      if (filter === categoryElement[0]) {
        // la categorie est deja selectionne, je la deselectionne et je reviens sur la liste de tous les articles
        filter = null;
      } else {
        // j'ai la liste de tous les articles et je choisie une categorie
        li.classList.add("active");
        filter = categoryElement[0];
      }
      createArticlesDOM();
    });
    return li;
  });

  categoriesContainer.innerHTML = "";
  categoriesContainer.append(...liElements);
};

selectElement.addEventListener("change", (event) => {
  sortBy = selectElement.value;
  fetchArticles();
});
