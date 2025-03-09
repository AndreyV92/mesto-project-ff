import { openPopup, closePopup } from "./modal";
import { addLike, deleteLike } from "./api";

export function createCard(
  item,
  deleteCard,
  openImage,
  likeCard,
  cardTemplate,
  owner
) {
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

  if (!owner) {
    const deleteButton = cardTemplateCopy.querySelector(".card__delete-button");
    if (deleteButton) {
      deleteButton.remove();
    }
  } else {
    const deleteButton = cardTemplateCopy.querySelector(".card__delete-button");
    if (deleteButton) {
      deleteButton.addEventListener("click", (event) => {
        const popupDelete = document.querySelector(".popup_type_delete");
        openPopup(popupDelete);
        const buttonDelete = popupDelete.querySelector(".popup__button_delete");
        buttonDelete.addEventListener("click", () => {
          deleteCard(event.target.closest(".places__item"), popupDelete);
        });
      });
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

export function deleteCard(cardElement, popupDelete) {
  if (cardElement && popupDelete) {
    const deleteButton = cardElement.querySelector(".card__delete-button");
    if (deleteButton) {
      const cardId = cardElement.getAttribute("data-id");
      const buttonDelete = popupDelete.querySelector(".popup__button_delete");
      if (buttonDelete) {
        buttonDelete.removeEventListener("click", () => {});
        buttonDelete.addEventListener("click", () => {
          fetch(`https://nomoreparties.co/v1/wff-cohort-33/cards/${cardId}`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: "0ae5b52a-cf5b-4c64-a6ed-5b7a5c2cfd81",
            },
          })
            .then((response) => {
              if (response.ok) {
                cardElement.remove();
                closePopup(popupDelete);
              }
            })
            .catch((error) => {
              console.error(error);
            });
        });
      }
    }
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
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
