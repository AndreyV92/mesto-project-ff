import { openPopup, closePopup } from "./modal";
import {
  addLike,
  deleteLike,
  getCardsFromTheServer,
  deleteCardById,
} from "./api";

export function createCard(
  item,
  deleteCard,
  openImage,
  likeCard,
  cardTemplate,
  owner
) {
  const cardTemplateCopy = cardTemplate.querySelector(".places__item").cloneNode(true);

  const cardImage = cardTemplateCopy.querySelector(".card__image");
  const cardTitle = cardTemplateCopy.querySelector(".card__title");
  const likeCounter = cardTemplateCopy.querySelector(".card__like-counter");
  const deleteButton = cardTemplateCopy.querySelector(".card__delete-button");
  const likeButton = cardTemplateCopy.querySelector(".card__like-button");

  cardImage.src = item.link;
  cardTitle.textContent = item.name;
  likeCounter.textContent = item.likes ? item.likes.length : "";

  cardTemplateCopy.setAttribute("data-id", item._id);

  if (owner && deleteButton) {
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
    likeCard(likeButton);
  });

  return cardTemplateCopy;
}

export function deleteCard(cardElement, popupDelete) {
  const cardId = cardElement.getAttribute("data-id");

  deleteCardById(cardId)
    .then(() => {
      cardElement.remove();
      closePopup(popupDelete);
    })
    .catch((error) => {
      console.error(error);
    });
}

export function addCard(cardTemplateCopy, placesList) {
  placesList.prepend(cardTemplateCopy);
  return cardTemplateCopy;
}

export function likeCard(likeButton) {
  const cardElement = likeButton.closest(".places__item");
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
