const scriptURL =
  "https://script.google.com/macros/s/AKfycbwySTwaMgSz8j1Vsc8a9_ULGCWEJQUov-8ihPpH-MYAP6kPb3FyXX9FGmvX0BNOQlpqdQ/exec";

document
  .getElementById("renewal-reminder-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const otherPlateInput = document.getElementById("others");
    const fullNameInput = document.getElementById("full-name");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const regularInputs = {
      LGAinput: document.getElementById("LGA"),
      numberInput: document.getElementById("number"),
      prefixInput: document.getElementById("prefix"),
    };

    // Collect form data
    const formData = {
      name: fullNameInput.value,
      phone: phoneInput.value,
      email: emailInput.value,
      rPlate: `${regularInputs.LGAinput.value}${regularInputs.numberInput.value}${regularInputs.prefixInput.value}`,
      oPlates: otherPlateInput.value,
    };

    // Submit form data to Google Apps Script
    fetch(scriptURL, {
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Success") {
          alert("Form submitted successfully!");
        } else {
          throw new Error(data.error || "Unknown error");
        }
        console.log(data); // Debugging information
      })
      .catch((error) => {
        alert("Error submitting form. Please try again.");
        console.error(error); // Debugging information
      });
  });
