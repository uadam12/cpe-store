const firstNameInput = window.document.getElementById("first-name");
const firstNameError = window.document.getElementById("first-name-error");

const lastNameInput = window.document.getElementById("last-name");
const lastNameError = window.document.getElementById("last-name-error");

const emailInput = window.document.getElementById("email");
const emailError = window.document.getElementById("email-error");


function showError(input, error, message) {
  input.classList.add("border-red-500");
  error.textContent = message;
  error.classList.remove("hidden");
}

function clearError(input, error) {
  input.classList.remove("border-red-500");
  error.textContent = "";
  error.classList.add("hidden");
}

function validateName(name) {
  const nameRegex = /^[A-Za-z\s'-]{2,30}$/;
  return nameRegex.test(name.trim());
}

function validateEmail(email) {
  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return emailRegex.test(email.trim());
}

function validateCheckoutForm() {
  let isValid = true;

  const firstName = firstNameInput.value.trim();
  const lastName = lastNameInput.value.trim();
  const email = emailInput.value.trim();

  // Clear previous errors
  clearError(firstNameInput, firstNameError);
  clearError(lastNameInput, lastNameError);
  clearError(emailInput, emailError);

  // First Name
  if (!firstName) {
    showError(firstNameInput, firstNameError, "First name is required.");
    isValid = false;
  } else if (!validateName(firstName)) {
    showError(firstNameInput, firstNameError, "Enter a valid name (letters only).");
    isValid = false;
  }

  // Last Name
  if (!lastName) {
    showError(lastNameInput, lastNameError, "Last name is required.");
    isValid = false;
  } else if (!validateName(lastName)) {
    showError(lastNameInput, lastNameError, "Enter a valid name (letters only).");
    isValid = false;
  }

  // Email
  if (!email) {
    showError(emailInput, emailError, "Email is required.");
    isValid = false;
  } else if (!validateEmail(email)) {
    showError(emailInput, emailError, "Enter a valid email address.");
    isValid = false;
  }

  return { isValid, firstName, lastName, email };
}

export function paystackCheckout(amount) {
    const { isValid, firstName, lastName, email } = validateCheckoutForm();

    if(!isValid) return;

    const popup = new window.PaystackPop();

    window.closeCheckoutModal();

    popup.checkout({
        key: 'pk_test_536ed24f4226c77ef7667481202a51f189dba6cd',
        email, firstName, lastName, amount: amount * 100,

        onSuccess: (transaction) => {
            console.log(transaction);
            alert("Your order for is placed successfully!!!");
            location.reload();
        },

        onLoad: (response) => {
            console.log("onLoad: ", response);
        },
        onCancel: () => {
            console.log("onCancel");
            alert("Order cancelled.");
        },
        onError: (error) => {
            console.log("Error: ", error.message);
            alert("Something went wrong.");
        }
    });
}