import {
  addLike,
  deleteLike,
  deleteCardById,
} from "./api";

export function createCard(item, openImage, likeCard, cardTemplate, userData) {
  const cardTemplateCopy = cardTemplate
    .querySelector(".places__item")
    .cloneNode(true);

  const cardImage = cardTemplateCopy.querySelector(".card__image");
  const cardTitle = cardTemplateCopy.querySelector(".card__title");
  const likeCounter = cardTemplateCopy.querySelector(".card__like-counter");
  const deleteButton = cardTemplateCopy.querySelector(".card__delete-button");
  const likeButton = cardTemplateCopy.querySelector(".card__like-button");

  cardImage.src = item.link;
  cardImage.alt = item.name
  cardTitle.textContent = item.name;

  const likes = item.likes || [];
  likeCounter.textContent = likes.length;

  cardTemplateCopy.setAttribute("data-id", item._id);

  const isLiked = item.likes.some((like) => like._id === userData._id);
  if (isLiked) {
    likeButton.classList.add("card__like-button_is-active");
  }

  if (item.owner._id === userData._id && deleteButton) {
    deleteButton.style.display = "block";

    deleteButton.addEventListener("click", () => {
      deleteCardById(item._id)
        .then(() => {
          cardTemplateCopy.remove();
        })
        .catch((error) => {
          console.error(error);
        });
    });
  } else if (deleteButton) {
    deleteButton.style.display = "none";
  }

  cardImage.addEventListener("click", () => {
    openImage(item);
  });

  likeButton.addEventListener("click", () => {
    likeCard(likeButton, cardTemplateCopy);
  });

  return cardTemplateCopy;
}

export function addCard(cardTemplateCopy, placesList) {
  placesList.prepend(cardTemplateCopy);

  return cardTemplateCopy;
}

export function likeCard(likeButton, cardElement) {
  const cardId = cardElement.getAttribute("data-id");
  const likeCounter = cardElement.querySelector(".card__like-counter");

  if (likeButton.classList.contains("card__like-button_is-active")) {
    deleteLike(cardId)
      .then((data) => {
        likeButton.classList.remove("card__like-button_is-active");
        likeCounter.textContent = data.likes.length; 
      })
      .catch((error) => {
        console.error(error);
      });
  } else {
    addLike(cardId)
      .then((data) => {
        likeButton.classList.add("card__like-button_is-active");
        likeCounter.textContent = data.likes.length; 
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
