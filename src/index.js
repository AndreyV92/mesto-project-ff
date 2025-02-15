import "./pages/index.css";

//импорт переменных и функций
import {initialCards} from './components/cards';
import {createCard, deleteCard, addCard, likeCard, openImage} from './components/card.js';
import {openPopup, closePopup} from './components/modal.js';

//импорт картинок
const addIcon = new URL("./images/add-icon.svg", import.meta.url);
const avatar = new URL("./images/avatar.jpg", import.meta.url);
const card1 = new URL("./images/card_1.jpg", import.meta.url);
const card2 = new URL("./images/card_2.jpg", import.meta.url);
const card3 = new URL("./images/card_3.jpg", import.meta.url);
const close = new URL("./images/close.svg", import.meta.url);
const deleteIcon = new URL("./images/delete-icon.svg", import.meta.url);
const editIcon = new URL("./images/edit-icon.svg", import.meta.url);
const likeActive = new URL("./images/like-active.svg", import.meta.url);
const logo = new URL("./images/logo.svg", import.meta.url);
const likeInactive = new URL("./images/like-inactive.svg", import.meta.url);

const images = [
  // меняем исходные пути на переменные
  { name: "addIcon", link: addIcon },
  { name: "avatar", link: avatar },
  { name: "card1", link: card1 },
  { name: "card2", link: card2 },
  { name: "card3", link: card3 },
  { name: "close", link: close },
  { name: "deleteIcon", link: deleteIcon },
  { name: "editIcon", link: editIcon },
  { name: "likeActive", link: likeActive },
  { name: "likeInactive", link: likeInactive },
  { name: "logo", link: logo },
];


const content = document.querySelector('.content');
const placesList = content.querySelector('.places__list');

const profileEditButton = document.querySelector('.profile__edit-button');
const popupTypeEdit = document.querySelector('.popup_type_edit')
const profileAddButton = document.querySelector('.profile__add-button')
const popupTypeNewCard = document.querySelector('.popup_type_new-card')
const editPopupForm = document.querySelector('.popup__form')
const newCardPopupForm = popupTypeNewCard.querySelector('.popup__form')
const newCardNameInput = newCardPopupForm.querySelector('.popup__input_type_card-name')
const newCardNamelink = newCardPopupForm.querySelector('.popup__input_type_url')

profileEditButton.addEventListener('click', ()=> {
  const formName = document.querySelector('.popup__input_type_name')
  const formDescr = document.querySelector('.popup__input_type_description')
  const profileTitle = document.querySelector('.profile__title')
  const profileDescr = document.querySelector('.profile__description')
  
  formName.value = profileTitle.textContent
  formDescr.value = profileDescr.textContent

  openPopup(popupTypeEdit)
})

editPopupForm.addEventListener('submit',(event) => {
  event.preventDefault()

  const formName = document.querySelector('.popup__input_type_name')
  const formDescr = document.querySelector('.popup__input_type_description')
  const profileTitle = document.querySelector('.profile__title')
  const profileDescr = document.querySelector('.profile__description')

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
    cardTemplate: document.querySelector('#card-template').content
  }

  const newElement = createCard(newCard, deleteCard, openImage, likeCard)
  addCard(newElement, placesList)
  
  closePopup(popupTypeNewCard)
  newCardPopupForm.reset()
})

window.addEventListener('click', (event) => {
  if (event.target.classList.contains('popup')) {
    closePopup(event.target)
  }
})

const closeEventLists = function() {
  const popupClose = document.querySelectorAll('.popup__close')
  popupClose.forEach((itemClose) => {
    itemClose.addEventListener('click', () => {
      const popup = itemClose.closest('.popup');
      popup.classList.remove('popup_is-opened');
    })
  })
}

closeEventLists(popupTypeEdit)
closeEventLists(popupTypeNewCard)

initialCards.forEach((item) => {
  item.cardTemplate = document.querySelector('#card-template').content
  const card = createCard(item, deleteCard, openImage, likeCard)
  addCard(card, placesList)
})


