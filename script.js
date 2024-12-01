document.addEventListener("DOMContentLoaded", () => {
  const supabaseUrl = "https://ezfqcicxvrjvdgipkoig.supabase.co";
  const supabaseKey =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6ZnFjaWN4dnJqdmRnaXBrb2lnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMwNjMyMTUsImV4cCI6MjA0ODYzOTIxNX0.LHTZJM5I5gE_wTfoMUyfPVgUKPOmg5Q2YdppAUiyHL0";
  window.supabase = supabase.createClient(supabaseUrl, supabaseKey);

  emailjs.init("MPZWfC-P-YNf4Hjr2");

  //DOM Elements
  const formContainer = document.getElementById("renewal-reminder-form");
  const regularField = document.getElementById("regular-fieldset");
  const otherField = document.getElementById("others-fieldset");
  const radioGroup = document.querySelector(".radio-group");
  const radios = document.querySelectorAll("input[name='plate-type']");
  const otherPlateInput = document.getElementById("others");
  const fullNameInput = document.getElementById("full-name");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const consentInput = document.getElementById("consent");
  const consentField = document.querySelector(".consent-group");
  const successMessage = document.querySelector(".success-message");
  const submitButton = document.querySelector("button[type='submit']");

  const regularInputs = {
    LGAinput: document.getElementById("LGA"),
    numberInput: document.getElementById("number"),
    prefixInput: document.getElementById("prefix"),
  };
  const errors = {
    fullNameError: document.getElementById("name-error"),
    typeError: document.getElementById("type-error"),
    regularFieldsetError: document.getElementById("regular-fieldset-error"),
    othersError: document.getElementById("others-fieldset-error"),
    emailError: document.getElementById("email-error"),
    phoneError: document.getElementById("phone-error"),
    consentError: document.getElementById("consent-error"),
  };

  //Helper Functions
  const displayFieldset = (fieldset, hiddenClass) => {
    fieldset.classList.remove(hiddenClass);
    fieldset.setAttribute("aria-hidden", "false");
  };
  const hideFieldset = (fieldset, hiddenClass) => {
    fieldset.classList.add(hiddenClass);
    fieldset.setAttribute("aria-hidden", "true");
  };
  const displayError = (errorElement, message) => {
    errorElement.classList.add("display");
    errorElement.textContent = message;
  };

  const hideError = (errorElement) => {
    errorElement.classList.remove("display");
    errorElement.textContent = "";
  };
  const resetInputStates = (inputs) => {
    inputs.forEach((input) => {
      input.value = "";
      input.tabIndex = -1;
      input.classList.remove("invalid-input");
    });
  };

  // Display Fieldset according to the selected radio button
  radios.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      // Hide all errors and reset invalid styles
      hideError(errors.typeError);
      radioGroup.style.paddingBottom = "0";

      // Reset all fieldsets and inputs
      resetInputStates([
        otherPlateInput,
        regularInputs.LGAinput,
        regularInputs.numberInput,
        regularInputs.prefixInput,
      ]);

      hideError(errors.othersError);
      hideFieldset(regularField, "hidden");
      hideFieldset(otherField, "hidden");

      // Display the chosen fieldset
      if (e.target.value === "regular-or-articulated") {
        displayFieldset(regularField, "hidden");
        [
          regularInputs.LGAinput,
          regularInputs.numberInput,
          regularInputs.prefixInput,
        ].forEach((input) => (input.tabIndex = 0));
      } else if (e.target.value === "others") {
        displayFieldset(otherField, "hidden");
        otherPlateInput.tabIndex = 0;
      }
    });
  });

  // Validation Functions
  // Funtion to handle plate type radio buttons
  const validatePlateType = () => {
    const isSlected = [...radios].some((radio) => radio.checked);
    if (!isSlected) {
      displayError(errors.typeError, "Please Select a Plate Type");
      radioGroup.style.paddingBottom = "1.5rem";

      return false;
    }
    hideError(errors.typeError);
    return true;
  };

  // Function to validate full name input
  const validateFullnameInput = () => {
    const namePattern =
      /^[A-Za-z]+(?:[-'][A-Za-z]+)?(?:\s[A-Za-z]+(?:[-'][A-Za-z]+)?)+$/;
    const fullName = fullNameInput.value;
    if (fullName.length <= 3) {
      displayError(errors.fullNameError, "This field is required");
      fullNameInput.classList.add("invalid-input");
      return false;
    } else if (!namePattern.test(fullName)) {
      displayError(errors.fullNameError, "Please input a valid Full name");
      fullNameInput.classList.add("invalid-input");
      return false;
    } else if (fullName.length > 50) {
      displayError(
        errors.fullNameError,
        "Full name must not exceed 50 characters"
      );
      fullNameInput.classList.add("invalid-input");
      return false;
    }

    hideError(errors.fullNameError);
    fullNameInput.classList.remove("invalid-input");
    return true;
  };

  // Function to validate email input
  const validateEmailInput = () => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const email = emailInput.value.trim();
    if (email && !emailPattern.test(email)) {
      displayError(errors.emailError, "Please input a valid email");
      return false;
    }
    hideError(errors.emailError);
    return true;
  };

  // Function to validate regular plate inputs
  const validateRegularPlateInputs = () => {
    const { LGAinput, numberInput, prefixInput } = regularInputs;

    if (
      LGAinput.value === "" ||
      numberInput.value.length > 4 ||
      numberInput.value.length < 2 ||
      prefixInput.value.length < 2 ||
      !/^[A-Za-z]+$/.test(prefixInput.value)
    ) {
      displayError(
        errors.regularFieldsetError,
        "Please fill these field properly"
      );
      regularField.style.paddingBottom = "1.5rem";
      return false;
    }
    hideError(errors.regularFieldsetError);
    regularField.style.paddingBottom = "0";
    return true;
  };
  regularInputs.prefixInput.addEventListener("input", () => {
    const letterPattern = /^[A-Za-z]*$/;
    const input = regularInputs.prefixInput;

    // Remove invalid characters
    if (!letterPattern.test(input.value)) {
      input.value = input.value.replace(/[^A-Za-z]/g, "");
    }
  });

  // Function to validate other plate input
  const validateOtherPlateInput = () => {
    if (otherPlateInput.value.length < 7 || otherPlateInput.value.length > 9) {
      displayError(errors.othersError, "Please Input a Valid Reg. Number");
      otherPlateInput.classList.add("invalid-input");
      return false;
    }
    hideError(errors.othersError);
    otherPlateInput.classList.remove("invalid-input");
    return true;
  };
  // Function to trim number input to the maximum of 3 digits
  regularInputs.numberInput.addEventListener("input", () => {
    const maxLength = 3;
    const input = regularInputs.numberInput;
    input.value = input.value.substring(0, maxLength);
  });

  const validateChoosedPlate = () => {
    hideError(errors.regularFieldsetError);
    hideError(errors.othersError);
    otherPlateInput.classList.remove("invalid-input");
    regularField.style.paddingBottom = "0";
    if (!regularField.classList.contains("hidden")) {
      return validateRegularPlateInputs();
    } else if (!otherField.classList.contains("hidden")) {
      return validateOtherPlateInput();
    }
    return true;
  };

  // Function to validate Phone number input
  const validatePhoneInput = () => {
    const phoneRegex = /^[0-9]{11}$/;
    if (!phoneRegex.test(phoneInput.value.trim())) {
      displayError(errors.phoneError, "Please Input a Valid Phone Number");
      phoneInput.classList.add("invalid-input");
      return false;
    }
    hideError(errors.phoneError);
    phoneInput.classList.remove("invalid-input");
    return true;
  };

  const hideSuccessMessage = () => {
    successMessage.classList.add("hidden");
    submitButton.disabled = false;
  };
  // Funtion to validate consent checkbox
  const validateConsent = () => {
    const isChecked = consentInput.checked;
    if (!isChecked) {
      displayError(errors.consentError, "This field is required");
      consentField.classList.add("invalid-input");
      return false;
    }
    hideError(errors.consentError);
    consentField.classList.remove("invalid-input");
    return true;
  };

  const displaySuccessMessage = () => {
    successMessage.classList.remove("hidden");
    submitButton.disabled = true;

    const SuccessMsgTimeOut = setTimeout(() => {
      hideSuccessMessage();
    }, 5000);

    successMessage.addEventListener("click", () => {
      hideSuccessMessage();
      clearTimeout(SuccessMsgTimeOut);
    });
  };

  const SendMail = async () => {
    const formData = {
      name: fullNameInput.value || "N/A",
      phone: phoneInput.value || "N/A",
      email: emailInput.value || "N/A",
      rPlate:
        regularInputs.LGAinput.value +
          regularInputs.numberInput.value +
          regularInputs.prefixInput.value || "N/A",
      oPlate: otherPlateInput.value || "N/A",
    };

    try {
      // Send email notification using EmailJS
      const emailResponse = await emailjs.send(
        "service_ds40byv",
        "template_gzsh29g",
        formData
      );

      console.log("Email Sent:", emailResponse);
      alert("Form submitted successfully! Notification sent.");
    } catch (error) {
      console.error("EmailJS Error:", error);
      alert("Form submitted, but failed to send notification.");
    }
  };

  const addFormToDB = async () => {
    const formData = {
      name: fullNameInput.value || null,
      phone: phoneInput.value || null,
      email: emailInput.value || null,
      rPlate:
        regularInputs.LGAinput.value +
          regularInputs.numberInput.value +
          regularInputs.prefixInput.value || null,
      oPlate: otherPlateInput.value || null,
    };

    // Remove empty fields
    const cleanedData = Object.fromEntries(
      Object.entries(formData).filter(
        ([_, value]) => value !== null && value !== ""
      )
    );

    console.log("Cleaned Form Data:", cleanedData); // Debugging: Check the final payload

    try {
      // Insert cleaned data into Supabase
      const { data, error } = await supabase
        .from("form_submissions")
        .insert([cleanedData]);

      if (error) throw error;

      // alert("Form submitted successfully!");
      console.log("Inserted data:", data);
    } catch (error) {
      alert("Error submitting form. Please check the console for details.");
      console.error("Submission Error:", error);
    }
  };

  // Function to rest form
  const resetForm = () => {
    formContainer.reset();
    hideFieldset(regularField, "hidden");
    hideFieldset(otherField, "hidden");
  };

  // Function to handle form submit
  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Execute all validations independently
    const isChoosedPlateValid = validateChoosedPlate();
    const isPlateTypeValid = validatePlateType();
    const isFullNameValid = validateFullnameInput();
    const isEmailValid = validateEmailInput();
    const isPhoneValid = validatePhoneInput();
    const isConsentValid = validateConsent();

    // Combine results into a final check
    const formIsValid =
      isChoosedPlateValid &&
      isPlateTypeValid &&
      isFullNameValid &&
      isEmailValid &&
      isPhoneValid &&
      isConsentValid;

    if (formIsValid) {
      addFormToDB();
      SendMail();
      displaySuccessMessage();
      resetForm();
    }
  };
  fullNameInput.addEventListener("input", validateFullnameInput);
  emailInput.addEventListener("input", validateEmailInput);
  phoneInput.addEventListener("input", validatePhoneInput);
  formContainer.addEventListener("submit", handleFormSubmit);
});
