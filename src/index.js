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
  getUserInformation,
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
  localStorage.setItem("profileAvatar", newAvatarUrl);
  profileImage.src = newAvatarUrl;

  document.addEventListener("DOMContentLoaded", function () {
    const storedAvatar = localStorage.getItem("profileAvatar");
    if (storedAvatar) {
      profileImage.src = storedAvatar;
      profileImage.onload = function () {
        console.log("Аватар загружен");
      };
    }
  });

  newAvatar(newAvatarUrl)
    .then((data) => {
      profileImage.style.backgroundImage = `url(${newAvatarUrl})`;
      localStorage.setItem("profileAvatar", newAvatarUrl);
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

  const updatedProfileData = {
    name: formName.value,
    about: formDescr.value,
  };

  profileEditing(updatedProfileData)
    .then((data) => {
      profileTitle.textContent = data.name;
      profileDescr.textContent = data.about;
      localStorage.setItem("profileData", JSON.stringify(data));
      closePopup(popupTypeEdit);
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
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

  getUserInformation().then((userData) => {
    const newCard = {
      name: newCardName,
      link: newCardLink,
      alt: newCardName,
      owner: userData._id,
    };

    addNewCard(newCard)
      .then((data) => {
        getUserInformation().then((userData) => {
          const newElement = createCard(
            data,
            deleteCard,
            openImage,
            likeCard,
            document.querySelector("#card-template").content,
            true
          );

          addCard(newElement, placesList);

          const deleteButton = newElement.querySelector(".card__delete-button");
          if (deleteButton) {
            deleteButton.addEventListener("click", (event) => {
              const cardElement = event.target.closest(".places__item");
              const popupDelete = document.querySelector(".popup_type_delete");
              popupDelete.classList.add("popup_is-opened");
              const buttonDelete = popupDelete.querySelector(
                ".popup__button_delete"
              );
              buttonDelete.addEventListener("click", () => {
                if (cardElement) {
                  deleteCard(
                    cardElement,
                    popupDelete,
                    document.querySelector(".places__list")
                  );
                }
                popupDelete.classList.remove("popup_is-opened");
              });
            });
          }
        });
        closePopup(popupTypeNewCard);
        newCardPopupForm.reset();
        submitButton.textContent = "Сохранить";
        submitButton.disabled = false;
      })
      .catch((error) => {
        console.error(error);
        submitButton.textContent = "Сохранить";
        submitButton.disabled = false;
      });
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

const storedProfileData = localStorage.getItem("profileData");
const storedAvatar = localStorage.getItem("profileAvatar");

function updateAvatar() {
  const storedAvatar = localStorage.getItem("profileAvatar");
  if (storedAvatar) {
    profileImage.src = storedAvatar;
  }
}

if (storedAvatar) {
  profileImage.src = storedAvatar;
}

if (storedProfileData && storedAvatar) {
  const profileData = JSON.parse(storedProfileData);
  profileTitle.textContent = profileData.name;
  profileDescr.textContent = profileData.about;
  profileImage.src = storedAvatar;
}

getUserInformation().then((userData) => {
  const avatarUrl = userData.avatar;
  profileImage.src = avatarUrl;

  newAvatar(avatarUrl)
    .then((data) => {
      profileImage.style.backgroundImage = `url(${avatarUrl})`;
      localStorage.setItem("profileAvatar", avatarUrl);
      getCardsFromTheServer().then(([userData, cardsData]) => {
        const cardTemplate = document.querySelector("#card-template").content;
        cardsData.forEach((item) => {
          const owner = item.owner._id === userData._id;
          const newElement = createCard(
            item,
            deleteCard,
            openImage,
            likeCard,
            cardTemplate,
            owner
          );
          addCard(newElement, placesList);

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
                  deleteCard(
                    cardElement,
                    popupDelete,
                    document.querySelector(".places__list")
                  );
                }
                closePopup(popupDelete);
              });
            });
          }
        });
      });
    })
    .catch((error) => {
      console.error(error);
    });
});
