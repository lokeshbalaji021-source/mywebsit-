/**
 * ============================================================================
 * GOOGLE APPS SCRIPT: CONTACT & BOOKING FORM HANDLER FOR LOKESH BALAJI WEBSITE
 * ============================================================================
 * 
 * WHY WAS YOUR GOOGLE SHEET EMPTY?
 * By default, Google Apps Script sets "Who has access" to "Only myself".
 * When set to "Only myself", Google blocks your website and redirects to 
 * "accounts.google.com/ServiceLogin". No data ever reaches the sheet!
 * 
 * FOLLOW THESE 4 SIMPLE STEPS TO FIX IT IN 60 SECONDS:
 * 
 * STEP 1: Open your Google Sheet (from your screenshot).
 * STEP 2: In the top menu, click "Extensions" -> "Apps Script".
 * STEP 3: Replace all code in the editor with THIS ENTIRE FILE, then press Ctrl+S to save.
 * STEP 4: DEPLOY WITH 'ANYONE' ACCESS:
 *    - In the top-right, click "Deploy" -> "Manage deployments".
 *    - Click the pencil icon (Edit) on your active deployment.
 *    - In the "Version" dropdown: Choose "New version".
 *    - In the "Execute as" dropdown: Choose "Me (<your-email>)".
 *    - In the "Who has access" dropdown: Choose "Anyone"   <--- [CRITICAL!]
 *    - Click "Deploy".
 *    - If Google asks for authorization:
 *        Click "Authorize access" -> Pick your account -> Click "Advanced" -> Click "Go to Untitled project (unsafe)" -> Click "Allow".
 *    - Done! Your sheet will now receive every form submission instantly!
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    // 1. Get the Google Sheet
    var ss;
    try {
      ss = SpreadsheetApp.getActiveSpreadsheet();
    } catch (err) {
      ss = null;
    }

    // Optional: If you opened Apps Script outside the sheet, paste the sheet ID here
    var SPREADSHEET_ID = ""; 
    if (!ss && SPREADSHEET_ID) {
      ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    }

    if (!ss) {
      throw new Error("No active spreadsheet found. Please open Apps Script via Extensions -> Apps Script inside your Google Sheet.");
    }

    var sheet = ss.getActiveSheet();

    // Set sheet tab name if default
    if (sheet.getName() === 'Sheet1') {
      sheet.setName('Contact Inquiries');
    }

    // 2. Initialize Headers automatically if sheet is completely blank
    if (sheet.getLastRow() === 0) {
      var headers = [
        'Timestamp',
        'Full Name',
        'Email Address',
        'Phone / WhatsApp',
        'Service Key',
        'Service Selected',
        'Project Details & Requirements'
      ];
      sheet.appendRow(headers);

      // Apply Navy & Cyan styling to header row
      var headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#0f172a');
      headerRange.setFontColor('#38bdf8');
      headerRange.setHorizontalAlignment('center');
      sheet.setFrozenRows(1);
    }

    // 3. Extract incoming form parameters safely
    var data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (jsonErr) {}
    }
    if (e && e.parameter) {
      for (var key in e.parameter) {
        data[key] = e.parameter[key];
      }
    }

    var timestamp = new Date();
    var name = data.name || data['Your Full Name'] || 'Anonymous';
    var email = data.email || data['Email Address'] || '';
    var phone = data.phone || data['Phone / WhatsApp'] || 'Not Provided';
    var service = data.service || '';
    var serviceText = data.serviceText || data['Service Needed'] || service || 'General Inquiry';
    var message = data.message || data['Project Details & Requirements'] || '';

    // 4. Append row to Google Sheet
    sheet.appendRow([
      timestamp,
      name,
      email,
      phone,
      service,
      serviceText,
      message
    ]);

    var lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 1).setNumberFormat('yyyy-mm-dd hh:mm:ss');

    // Auto-fit columns
    for (var col = 1; col <= 7; col++) {
      sheet.autoResizeColumn(col);
    }

    // 5. Return clean JSON response
    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      result: 'success',
      message: 'New row successfully saved to Google Sheet.',
      row: lastRow
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      result: 'error',
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

// Health check GET handler - allows you to verify in browser that URL is public
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'online',
    message: 'Google Apps Script Web App for Lokesh Balaji Contact Form is active and accessible to Anyone!',
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}
