import "./pages/index.css";

import {
  createCard,
  addCard,
  likeCard,
} from "./components/card.js";

import { openPopup, closePopup, overlayClick } from "./components/modal.js";

import {
  enableValidation,
  clearValidation,
} from "./components/validation.js";

import {
  getAppData, 
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
const newCardPopupForm = popupTypeNewCard.querySelector('form[name="new-place"]');
const formName = document.querySelector(".popup__input_type_name");
const formDescr = document.querySelector(".popup__input_type_description");
const profileTitle = document.querySelector(".profile__title");
const profileDescr = document.querySelector(".profile__description");
const profileImage = document.querySelector(".profile__image");
const popupAvatar = document.querySelector(".popup_type_avatar");
const avatarInput = popupAvatar.querySelector(".popup__input_type_avatar");
const avatarForm = popupAvatar.querySelector(".popup__form");
const popupCloseButtons = document.querySelectorAll(".popup__close");
const popups = document.querySelectorAll('.popup')
const popupImage = document.querySelector(".popup_type_image");
const profileFormSubmitButton = editPopupForm.querySelector(".popup__button");  
const newCardFormSubmitButton = newCardPopupForm.querySelector(".popup__button");
const avatarFormSubmitButton = avatarForm.querySelector(".popup__button");

const config = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

enableValidation(config);

getAppData()
  .then(([userData, cardsData]) => {
    const cardTemplate = document.querySelector("#card-template").content;

    profileTitle.textContent = userData.name;
    profileDescr.textContent = userData.about;
    if (userData.avatar) {
      profileImage.style.backgroundImage = `url(${userData.avatar})`;
    }

    cardsData.forEach((item) => {
      const newElement = createCard(
        item,
        openImage,
        likeCard,
        cardTemplate,
        userData
      );
      addCard(newElement, placesList);
    });
  })
  .catch((error) => {
    console.error(error);
  });

profileEditButton.addEventListener("click", () => {
  formName.value = profileTitle.textContent;
  formDescr.value = profileDescr.textContent;
  clearValidation(editPopupForm, config);
  openPopup(popupTypeEdit);
});

editPopupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  profileFormSubmitButton.textContent = "Сохранение...";
  profileFormSubmitButton.disabled = true;

  const updatedProfileData = {
    name: formName.value,
    about: formDescr.value,
  };

  profileEditing(updatedProfileData)
    .then((data) => {
      profileTitle.textContent = data.name;
      profileDescr.textContent = data.about;
      closePopup(popupTypeEdit);
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      profileFormSubmitButton.textContent = "Сохранить";
      profileFormSubmitButton.disabled = false;
    });
});

profileImage.addEventListener("click", () => {
  clearValidation(avatarForm, config);
  openPopup(popupAvatar);
});

avatarForm.addEventListener("submit", (event) => {
  event.preventDefault();
  avatarFormSubmitButton.textContent = "Сохранение...";
  avatarFormSubmitButton.disabled = true;

  const newAvatarUrl = avatarInput.value;

  newAvatar(newAvatarUrl)
    .then((data) => {
      profileImage.style.backgroundImage = `url(${data.avatar})`;
      closePopup(popupAvatar);
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      avatarFormSubmitButton.textContent = "Сохранить";
      avatarFormSubmitButton.disabled = false;
    });
});

profileAddButton.addEventListener("click", () => {
  clearValidation(newCardPopupForm, config);
  openPopup(popupTypeNewCard);
});

newCardPopupForm.addEventListener("submit", (event) => {
  event.preventDefault();
  newCardFormSubmitButton.textContent = "Сохранение...";
  newCardFormSubmitButton.disabled = true;

  const newCardName = newCardPopupForm.querySelector(".popup__input_type_card-name").value;
  const newCardLink = newCardPopupForm.querySelector(".popup__input_type_url").value;

  getUserInformation().then((userData) => {
    const newCard = {
      name: newCardName,
      link: newCardLink,
      alt: newCardName,
      owner: userData._id,
    };

    addNewCard(newCard)
      .then((data) => {
        const cardTemplate = document.querySelector("#card-template").content;
        const newElement = createCard(
          data,
          openImage,
          likeCard,
          cardTemplate,
          userData
        );
        addCard(newElement, placesList);
        closePopup(popupTypeNewCard);
        newCardPopupForm.reset();
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        newCardFormSubmitButton.textContent = "Создать";
        newCardFormSubmitButton.disabled = false;
      });
  });
});

popupCloseButtons.forEach((itemClose) => {
  itemClose.addEventListener("click", () => {
    const popup = itemClose.closest(".popup");
    closePopup(popup);

    if (popup === popupTypeEdit) {
      clearValidation(editPopupForm, config);
    } else if (popup === popupTypeNewCard) {
      clearValidation(newCardPopupForm, config);
    }
  });
});

function openImage(item) {
  popupImage.querySelector(".popup__image").src = item.link;
  popupImage.querySelector(".popup__image").alt = item.name;
  popupImage.querySelector(".popup__caption").textContent = item.name;
  openPopup(popupImage);
}

popups.forEach((popup) => {
  popup.addEventListener('click', overlayClick);
});

