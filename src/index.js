import "./pages/index.css";

//импорт переменных и функций
import {initialCards} from './components/cards';
import {createCard, deleteCard, addCard, likeCard} from './components/card.js';
import {openPopup, closePopup, overlayClick} from './components/modal.js';

const content = document.querySelector('.content');
const placesList = content.querySelector('.places__list');
const profileEditButton = document.querySelector('.profile__edit-button');
const popupTypeEdit = document.querySelector('.popup_type_edit')
const profileAddButton = document.querySelector('.profile__add-button')
const popupTypeNewCard = document.querySelector('.popup_type_new-card')
const editPopupForm = document.querySelector('form[name="edit-profile"]')
const newCardPopupForm = popupTypeNewCard.querySelector('form[name="new-place"]')
const newCardNameInput = newCardPopupForm.querySelector('.popup__input_type_card-name')
const newCardNamelink = newCardPopupForm.querySelector('.popup__input_type_url')
const formName = document.querySelector('.popup__input_type_name')
const formDescr = document.querySelector('.popup__input_type_description')
const profileTitle = document.querySelector('.profile__title')
const profileDescr = document.querySelector('.profile__description')

profileEditButton.addEventListener('click', ()=> {
  formName.value = profileTitle.textContent
  formDescr.value = profileDescr.textContent

  openPopup(popupTypeEdit)
})

editPopupForm.addEventListener('submit',(event) => {
  event.preventDefault()

  profileTitle.textContent = formName.value
  profileDescr.textContent = formDescr.value

  closePopup(popupTypeEdit)
})

profileAddButton.addEventListener('click', ()=> {
  openPopup(popupTypeNewCard)
})

newCardPopupForm.addEventListener('submit', (event)=> {
  event.preventDefault()

  const newCardName = newCardNameInput.value
  const newCardLink = newCardNamelink.value

  const newCard = {
    name: newCardName,
    link: newCardLink,
    alt: newCardName,
  }

  const newElement = createCard(newCard, deleteCard, openImage, likeCard, document.querySelector('#card-template').content)
  addCard(newElement, placesList)
  
  closePopup(popupTypeNewCard)
  newCardPopupForm.reset()
})

window.addEventListener('click', overlayClick)

function openImage(item) {
  const popupImage = document.querySelector('.popup_type_image')
  popupImage.querySelector('.popup__image').src = item.link;
  popupImage.querySelector('.popup__image').name = item.name;
  popupImage.querySelector('.popup__caption').textContent = item.name;
  openPopup(popupImage)
}

const closeEventLists = function() {
  const popupClose = document.querySelectorAll('.popup__close')
  popupClose.forEach((itemClose) => {
    itemClose.addEventListener('click', () => {
      const popup = itemClose.closest('.popup');
      closePopup(popup)
    })
  })
}

closeEventLists()

initialCards.forEach((item) => {
  const card = createCard(item, deleteCard, openImage, likeCard, document.querySelector('#card-template').content)
  addCard(card, placesList)
})