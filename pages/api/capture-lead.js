import { google } from "googleapis";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

const HEADERS = [
  "Timestamp",
  "Name",
  "Email",
  "Self & Identity",
  "Mindset & Beliefs",
  "Health & Energy",
  "Money & Wealth",
  "Work & Purpose",
  "Love & Relationships",
  "Growth & Learning",
  "Space & Environment",
  "Overall Average",
];

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, scores, avg } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: SCOPES,
    });

    const sheets = google.sheets({ version: "v4", auth });
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

    // Add header row if the sheet is still empty
    const check = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Sheet1!A1:A1",
    });
    if (!check.data.values) {
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: "Sheet1!A:L",
        valueInputOption: "USER_ENTERED",
        requestBody: { values: [HEADERS] },
      });
    }

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Sheet1!A:L",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            new Date().toISOString(),
            name || "",
            email,
            scores?.self || 0,
            scores?.mindset || 0,
            scores?.health || 0,
            scores?.money || 0,
            scores?.work || 0,
            scores?.relationships || 0,
            scores?.growth || 0,
            scores?.environment || 0,
            typeof avg === "number" ? avg.toFixed(2) : avg || "0",
          ],
        ],
      },
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Google Sheets error:", err.message);
    return res.status(500).json({ error: "Failed to save to spreadsheet" });
  }
}
