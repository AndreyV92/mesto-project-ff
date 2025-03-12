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
  deleteCardById,
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
const popupCloseButtons = document.querySelectorAll(".popup__close");
const popups = document.querySelectorAll('.popup')


const config = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
};

enableValidation(config);

getUserInformation()
  .then((userData) => {
    profileTitle.textContent = userData.name;
    profileDescr.textContent = userData.about;
    if (userData.avatar) {
      profileImage.style.backgroundImage = `url(${userData.avatar})`;
    }

    return getCardsFromTheServer();
  })
  .then(([userData, cardsData]) => {
    const cardTemplate = document.querySelector("#card-template").content;

    cardsData.forEach((item) => {
      const owner = item.owner._id === userData._id;
      const isLiked = item.likes.some((like) => like._id === userData._id);

      const newElement = createCard(
        item,
        deleteCard,
        openImage,
        likeCard,
        cardTemplate,
        owner
      );

      // Устанавливаем состояние лайка
      const likeButton = newElement.querySelector(".card__like-button");
      const likeCounter = newElement.querySelector(".card__like-counter");

      if (isLiked) {
        likeButton.classList.add("card__like-button_is-active");
      }

      likeCounter.textContent = item.likes.length;

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

profileImage.addEventListener("click", () => {
  clearValidation(avatarForm, config);
  openPopup(popupAvatar);
});

avatarForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const submitButton = avatarForm.querySelector(".popup__button");
  submitButton.textContent = "Сохранение...";
  submitButton.disabled = true;

  const newAvatarUrl = avatarInput.value;

  newAvatar(newAvatarUrl)
    .then((data) => {
      profileImage.style.backgroundImage = `url(${data.avatar})`; // Обновляем аватар из ответа сервера
      closePopup(popupAvatar);
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
  clearValidation(newCardPopupForm, config);
  openPopup(popupTypeNewCard);
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
        const cardTemplate = document.querySelector("#card-template").content;
        const newElement = createCard(
          data,
          deleteCard,
          openImage,
          likeCard,
          cardTemplate,
          true
        );
        addCard(newElement, placesList);
        closePopup(popupTypeNewCard);
        newCardPopupForm.reset();
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        submitButton.textContent = "Создать";
        submitButton.disabled = false;
      });
  });
});

popupCloseButtons.forEach((itemClose) => {
  itemClose.addEventListener("click", () => {
    const popup = itemClose.closest(".popup");
    closePopup(popup);
  });
});

function openImage(item) {
  const popupImage = document.querySelector(".popup_type_image");
  popupImage.querySelector(".popup__image").src = item.link;
  popupImage.querySelector(".popup__caption").textContent = item.name;
  openPopup(popupImage);
}

popups.forEach((popup) => {
  popup.addEventListener('click', overlayClick);
});
