import "./pages/index.css";

import {
  createCard,
  deleteCard,
  addCard,
  likeCard,
} from "./components/card.js";

import { openPopup, closePopup, overlayClick } from "./components/modal.js";

import {
  enableValidation,
  clearValidation,
  validateAvatarInput,
} from "./components/validation.js";

import {
  getCardsFromTheServer,
  profileEditing,
  addNewCard,
  newAvatar,
} from "./components/api.js";

const content = document.querySelector(".content");
const placesList = content.querySelector(".places__list");
const profileEditButton = document.querySelector(".profile__edit-button");
const popupTypeEdit = document.querySelector(".popup_type_edit");
const profileAddButton = document.querySelector(".profile__add-button");
const popupTypeNewCard = document.querySelector(".popup_type_new-card");
const editPopupForm = document.querySelector('form[name="edit-profile"]');
const newCardPopupForm = popupTypeNewCard.querySelector(
  'form[name="new-place"]'
);
const newCardNameInput = newCardPopupForm.querySelector(
  ".popup__input_type_card-name"
);
const newCardNamelink = newCardPopupForm.querySelector(
  ".popup__input_type_url"
);
const formName = document.querySelector(".popup__input_type_name");
const formDescr = document.querySelector(".popup__input_type_description");
const profileTitle = document.querySelector(".profile__title");
const profileDescr = document.querySelector(".profile__description");
const profileImage = document.querySelector(".profile__image");
const profileImageEdit = document.querySelector(".profile__image_edit");
const popupAvatar = document.querySelector(".popup_type_avatar");
const avatarInput = popupAvatar.querySelector(".popup__input_type_avatar");
const avatarForm = popupAvatar.querySelector(".popup__form");
const popupDelete = document.querySelector(".popup_type_delete");

profileImage.addEventListener("click", () => {
  openPopup(popupAvatar);
});

validateAvatarInput(avatarForm, avatarInput, "popup__input_type_error");

avatarForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const submitButton = avatarForm.querySelector(".popup__button");
  submitButton.textContent = "Сохранение...";
  submitButton.disabled = true;

  const newAvatarUrl = avatarInput.value;

  newAvatar(newAvatarUrl)
    .then((data) => {
      profileImage.style.backgroundImage = `url(${newAvatarUrl})`;
      closePopup(popupAvatar);
      submitButton.textContent = "Сохранить";
      submitButton.disabled = false;
    })
    .catch((error) => {
      console.error(error);
      submitButton.textContent = "Сохранить";
      submitButton.disabled = false;
    });
});

profileEditButton.addEventListener("click", () => {
  formName.value = profileTitle.textContent;
  formDescr.value = profileDescr.textContent;

  clearValidation(editPopupForm, {
    inputErrorClass: "popup__input_type_error",
    submitButtonSelector: ".popup__button",
    inactiveButtonClass: "popup__button_disabled",
  });

  openPopup(popupTypeEdit);
});

editPopupForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const submitButton = editPopupForm.querySelector(".popup__button");
  submitButton.textContent = "Сохранение...";
  submitButton.disabled = true;

  profileEditing()
    .then((data) => {
      profileTitle.textContent = formName.value;
      profileDescr.textContent = formDescr.value;
      closePopup(popupTypeEdit);
      submitButton.textContent = "Сохранить";
      submitButton.disabled = false;
    })
    .catch((error) => {
      console.error(error);
      submitButton.textContent = "Сохранить";
      submitButton.disabled = false;
    });
});

profileAddButton.addEventListener("click", () => {
  openPopup(popupTypeNewCard);
});

const config = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
};

enableValidation(config);

enableValidation({
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
});

newCardPopupForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const submitButton = newCardPopupForm.querySelector(".popup__button");
  submitButton.textContent = "Сохранение...";
  submitButton.disabled = true;

  const newCardName = newCardNameInput.value;
  const newCardLink = newCardNamelink.value;

  const newCard = {
    name: newCardName,
    link: newCardLink,
    alt: newCardName,
  };

  addNewCard(newCard)
    .then((data) => {
      const newElement = createCard(
        data,
        deleteCard,
        openImage,
        likeCard,
        document.querySelector("#card-template").content
      );
      addCard(newElement, placesList);
      closePopup(popupTypeNewCard);
      newCardPopupForm.reset();
      submitButton.textContent = "Сохранить";
      submitButton.disabled = false;

      const deleteButton = newElement.querySelector(".card__delete-button");
      if (deleteButton) {
        deleteButton.addEventListener("click", (event) => {
          const cardElement = event.target.closest(".places__item");
          openPopup(popupDelete);
          const buttonDelete = popupDelete.querySelector(
            ".popup__button_delete"
          );
          buttonDelete.addEventListener("click", () => {
            if (cardElement) {
              deleteCard(cardElement, popupDelete);
            }
            closePopup(popupDelete);
          });
        });
      }
    })
    .catch((error) => {
      console.error(error);
      submitButton.textContent = "Сохранить";
      submitButton.disabled = false;
    });

  closePopup(popupTypeNewCard);
  newCardPopupForm.reset();

  clearValidation(newCardPopupForm, {
    inputErrorClass: "popup__input_type_error",
    submitButtonSelector: ".popup__button",
    inactiveButtonClass: "popup__button_disabled",
  });
});

window.addEventListener("click", overlayClick);

function openImage(item) {
  const popupImage = document.querySelector(".popup_type_image");
  popupImage.querySelector(".popup__image").src = item.link;
  popupImage.querySelector(".popup__image").name = item.name;
  popupImage.querySelector(".popup__caption").textContent = item.name;
  openPopup(popupImage);
}

const closeEventLists = function () {
  const popupClose = document.querySelectorAll(".popup__close");
  popupClose.forEach((itemClose) => {
    itemClose.addEventListener("click", () => {
      const popup = itemClose.closest(".popup");
      closePopup(popup);

      if (popup === popupTypeEdit) {
        clearValidation(editPopupForm, {
          inputErrorClass: "popup__input_type_error",
          submitButtonSelector: ".popup__button",
          inactiveButtonClass: "popup__button_disabled",
        });
      } else if (popup === popupTypeNewCard) {
        clearValidation(newCardPopupForm, {
          inputErrorClass: "popup__input_type_error",
          submitButtonSelector: ".popup__button",
          inactiveButtonClass: "popup__button_disabled",
        });
      }
    });
  });
};

closeEventLists();

getCardsFromTheServer().then(([userData, cardsData]) => {
  profileTitle.textContent = userData.name;
  profileDescr.textContent = userData.about;
  profileImage.src = userData.avatar;

  cardsData.forEach((item) => {
    const owner = item.owner._id === userData._id;
    const card = createCard(
      item,
      deleteCard,
      openImage,
      likeCard,
      document.querySelector("#card-template").content,
      owner
    );
    addCard(card, placesList);
    const deleteButton = card.querySelector(".card__delete-button");
    if (deleteButton) {
      deleteButton.addEventListener("click", (event) => {
        const cardElement = event.target.closest(".places__item");
        openPopup(popupDelete);
        const buttonDelete = popupDelete.querySelector(".popup__button_delete");
        buttonDelete.addEventListener("click", () => {
          if (cardElement) {
            deleteCard(cardElement);
          }
          closePopup(popupDelete);
        });
      });
    }
  });
});
