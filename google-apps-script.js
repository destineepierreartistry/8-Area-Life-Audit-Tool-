// ─────────────────────────────────────────────────────────────────────────────
// PASTE THIS INTO YOUR GOOGLE SHEET'S APPS SCRIPT EDITOR
//
// HOW TO SET UP:
//   1. Open your Google Sheet
//   2. Extensions → Apps Script
//   3. Delete all existing code, paste this entire file
//   4. Click Deploy → New deployment
//      - Type: Web app
//      - Execute as: Me
//      - Who has access: Anyone
//   5. Click Deploy → copy the Web App URL
//   6. In your GitHub repo: Settings → Secrets → Actions
//      Add secret named APPS_SCRIPT_URL and paste the URL as the value
//   7. Push any commit to main — GitHub Actions will rebuild with the URL baked in
// ─────────────────────────────────────────────────────────────────────────────

var HEADERS = [
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

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
  }

  var data = JSON.parse(e.postData.contents);
  var s = data.scores || {};

  sheet.appendRow([
    new Date().toISOString(),
    data.name || "",
    data.email || "",
    s.self || 0,
    s.mindset || 0,
    s.health || 0,
    s.money || 0,
    s.work || 0,
    s.relationships || 0,
    s.growth || 0,
    s.environment || 0,
    parseFloat(data.avg) || 0,
  ]);

  return ContentService.createTextOutput(JSON.stringify({ success: true })).setMimeType(
    ContentService.MimeType.JSON
  );
}
