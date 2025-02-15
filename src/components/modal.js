export function openPopup(popup) {
  popup.classList.add('popup_is-opened');
  document.addEventListener('keyup', handleEscKeyUp);
}

export function closePopup(popup) {
  popup.classList.remove('popup_is-opened')
  document.removeEventListener('keyup', handleEscKeyUp);
}

function handleEscKeyUp (evt) {
  if (evt.key === "Escape") {
    const isOpenPopup = document.querySelector('.popup_is-opened');
    closePopup(isOpenPopup)
  }
}