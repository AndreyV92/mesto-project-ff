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
  if (cardTemplate && cardTemplate.querySelector) {
    const cardTemplateCopy = cardTemplate
      .querySelector(".places__item")
      .cloneNode(true);
    cardTemplateCopy.querySelector(".card__image").src = item.link;
    cardTemplateCopy.querySelector(".card__image").name = item.name;
    cardTemplateCopy.querySelector(".card__title").textContent = item.name;
    if (item.likes) {
      cardTemplateCopy.querySelector(".card__like-counter").textContent =
        item.likes.length;
    } else {
      cardTemplateCopy.querySelector(".card__like-counter").textContent = "";
    }

    cardTemplateCopy.setAttribute("data-id", item._id);

    const isLiked = localStorage.getItem(`like-${item._id}`);
    if (isLiked === "true") {
      cardTemplateCopy
        .querySelector(".card__like-button")
        .classList.add("card__like-button_is-active");
    }

    if (owner) {
      const deleteButton = cardTemplateCopy.querySelector(
        ".card__delete-button"
      );
      if (deleteButton) {
        deleteButton.style.display = "block";
      }
    } else {
      const deleteButton = cardTemplateCopy.querySelector(
        ".card__delete-button"
      );
      if (deleteButton) {
        deleteButton.style.display = "none";
      }
    }

    const imageElement = cardTemplateCopy.querySelector(".card__image");
    if (imageElement) {
      imageElement.addEventListener("click", () => {
        openImage(item);
      });
    }

    const likeButton = cardTemplateCopy.querySelector(".card__like-button");
    if (likeButton) {
      likeButton.addEventListener("click", (event) => {
        likeCard(event.target);
      });
    }

    return cardTemplateCopy;
  }
}

export function deleteCard(cardElement, popupDelete, placesList) {
  if (cardElement && popupDelete && placesList) {
    const cardId = cardElement.getAttribute("data-id");
    deleteCardById(cardId)
      .then(() => {
        cardElement.remove();
        closePopup(popupDelete);
        getCardsFromTheServer().then(([userData, cardsData]) => {
          placesList.innerHTML = "";
          cardsData.forEach((item) => {
            const owner = item.owner._id === userData._id;
            const newElement = createCard(
              item,
              deleteCard,
              (item) => {
                const popupImage = document.querySelector(".popup_type_image");
                popupImage.querySelector(".popup__image").src = item.link;
                popupImage.querySelector(".popup__image").name = item.name;
                popupImage.querySelector(".popup__caption").textContent =
                  item.name;
                openPopup(popupImage);
              },
              likeCard,
              document.querySelector("#card-template").content,
              owner
            );
            addCard(newElement, placesList);
          });
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }
}

export function addCard(cardTemplateCopy, placesList) {
  placesList.prepend(cardTemplateCopy);
  return cardTemplateCopy;
}

export function likeCard(likeButton) {
  const cardElement = likeButton.closest(".places__item");
  const cardId = cardElement.getAttribute("data-id");
  if (likeButton.classList.contains("card__like-button_is-active")) {
    deleteLike(cardId)
      .then((data) => {
        likeButton.classList.remove("card__like-button_is-active");
        cardElement.querySelector(".card__like-counter").textContent =
          data.likes.length;
        localStorage.setItem(`like-${cardId}`, "false");
      })
      .catch((error) => {
        console.error(error);
      });
  } else {
    addLike(cardId)
      .then((data) => {
        likeButton.classList.add("card__like-button_is-active");
        cardElement.querySelector(".card__like-counter").textContent =
          data.likes.length;
        localStorage.setItem(`like-${cardId}`, "true");
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
