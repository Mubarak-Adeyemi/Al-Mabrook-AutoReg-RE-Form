// document
//   .getElementById("renewal-reminder-form")
//   .addEventListener("submit", async function (e) {
//     e.preventDefault();

//     const formData = {
//       name: document.getElementById("full-name").value || null,
//       phone: document.getElementById("phone").value || null,
//       email: document.getElementById("email").value || null,
//       rPlate:
//         document.getElementById("LGA").value +
//           document.getElementById("number").value +
//           document.getElementById("prefix").value || null,
//       oPlate: document.getElementById("others").value || null,
//     };

//     // Remove empty fields
//     const cleanedData = Object.fromEntries(
//       Object.entries(formData).filter(
//         ([_, value]) => value !== null && value !== ""
//       )
//     );

//     console.log("Cleaned Form Data:", cleanedData); // Debugging: Check the final payload

//     try {
//       // Insert cleaned data into Supabase
//       const { data, error } = await supabase
//         .from("form_submissions")
//         .insert([cleanedData]);

//       if (error) throw error;

//       alert("Form submitted successfully!");
//       console.log("Inserted data:", data);
//     } catch (error) {
//       alert("Error submitting form. Please check the console for details.");
//       console.error("Submission Error:", error);
//     }
//   });
