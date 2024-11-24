const { google } = require("googleapis");

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const body = JSON.parse(event.body);
    const { name, phone, email, rPlate, oPlates } = body;

    // Authenticate with Google Sheets
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId =
      "1-lCH-fh_BgWKl2lxg9tEHE8I0Jqyp60KcmYfvxMAabY/edit?gid=0#gid=0"; // Replace with your spreadsheet ID
    const range = "Sheet1!A:E"; // Adjust based on your sheet structure

    // Append data to Google Sheets
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "RAW",
      requestBody: {
        values: [[name, phone, email, rPlate, oPlates]],
      },
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Data added to Google Sheet successfully!",
      }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to add data to Google Sheet." }),
    };
  }
};
