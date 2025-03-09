export function showInputError(formElement, element, errorMessage, errorClass) {
  const formError = formElement.querySelector(`.${element.id}-error`);

  if (formError) {
    element.classList.add(errorClass);
    formError.textContent = errorMessage;
    formError.classList.add("popup__error_visible");
  }
}

export function hideInputError(formElement, element, errorClass) {
  const formError = formElement.querySelector(`.${element.id}-error`);
  if (formError) {
    element.classList.remove(errorClass);
    formError.classList.remove("popup__error_visible");
    formError.textContent = "";
  }
}

export function clearValidationErrors(formElement, inputErrorClass) {
  const inputList = Array.from(formElement.querySelectorAll(".popup__input"));
  inputList.forEach((inputElement) => {
    hideInputError(formElement, inputElement, inputErrorClass);
  });
}

export function clearValidation(formElement, config) {
  clearValidationErrors(formElement, config.inputErrorClass);
  const buttonElement = formElement.querySelector(config.submitButtonSelector);
  buttonElement.disabled = true;
  buttonElement.classList.add(config.inactiveButtonClass);
}

export function isValid(form, inputElement, errorClass) {
  if (inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity(inputElement.dataset.errorMessage);
  } else {
    inputElement.setCustomValidity("");
  }

  if (!inputElement.validity.valid) {
    showInputError(
      form,
      inputElement,
      inputElement.validationMessage,
      errorClass
    );
  } else {
    hideInputError(form, inputElement, errorClass);
  }
}

export function hasInvalidInput(inputList) {
  return inputList.some((inputElement) => {
    return !inputElement.validity.valid;
  });
}

export function toggleButtonState(
  inputList,
  buttonElement,
  inactiveButtonClass
) {
  if (hasInvalidInput(inputList)) {
    buttonElement.disabled = true;
    buttonElement.classList.add(inactiveButtonClass);
  } else {
    buttonElement.disabled = false;
    buttonElement.classList.remove(inactiveButtonClass);
  }
}

export function enableValidation(config) {
  const formList = Array.from(document.querySelectorAll(config.formSelector));

  formList.forEach((formElement) => {
    formElement.addEventListener("submit", (event) => {
      event.preventDefault();
    });
    setEventListeners(
      formElement,
      config.inputSelector,
      config.submitButtonSelector,
      config.inputErrorClass,
      config.inactiveButtonClass
    );
  });
}

export function setEventListeners(
  formElement,
  inputSelector,
  submitButtonSelector,
  inputErrorClass,
  inactiveButtonClass
) {
  const inputList = Array.from(formElement.querySelectorAll(inputSelector));
  const buttonElement = formElement.querySelector(submitButtonSelector);
  toggleButtonState(inputList, buttonElement, inactiveButtonClass);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", () => {
      isValid(formElement, inputElement, inputErrorClass);
      toggleButtonState(inputList, buttonElement, inactiveButtonClass);
    });
  });
}

export function validateAvatarInput(formElement, inputElement, errorClass) {
  inputElement.addEventListener("input", () => {
    isValid(formElement, inputElement, errorClass);
    toggleButtonState(
      [inputElement],
      formElement.querySelector(".popup__button"),
      "popup__button_disabled"
    );
  });
}
