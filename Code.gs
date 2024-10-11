var SHEET_NAME = "Form Responses";
var SHEET_ID = "1ZqSHX8YYunjyqPCPW_MGaSvpODA0ZYL2JXPMOrWlirM"; // Replace with your actual Google Sheet ID\

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000); // Wait up to 30 seconds for other processes to finish

    var data = JSON.parse(e.postData.contents); // Ensure incoming data is parsed correctly
    var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);

    // Check if the sheet exists, if not, create it
    if (!sheet) {
      sheet = SpreadsheetApp.openById(SHEET_ID).insertSheet(SHEET_NAME);
      var headers = Object.keys(data);
      headers.unshift("Timestamp");
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }

    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];

    // Prepare a new row with all data, making sure to handle skills as an array
    var newRow = headers.map(function(header) {
      if (header === "Timestamp") {
        // Format the timestamp in GMT+3
        var date = new Date();
        return Utilities.formatDate(date, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss"); // Adjusting to GMT+3
      } else if (data[header]) {
        // Handle skills array properly
        if (Array.isArray(data[header])) {
          return data[header].join(', '); // Join skills as a comma-separated string
        }
        return data[header];
      }
      return ""; // Handle undefined values
    });

    sheet.getRange(sheet.getLastRow() + 1, 1, 1, newRow.length).setValues([newRow]);

    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success', 'row': sheet.getLastRow() }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}


function doGet(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000); // Wait up to 30 seconds for other processes to finish
    
    var sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      sheet = SpreadsheetApp.openById(SHEET_ID).insertSheet(SHEET_NAME);
    }
    
    // Ensure we have at least one column
    if (sheet.getLastColumn() == 0) {
      sheet.getRange(1, 1).setValue("Timestamp");
    }
    
    var headers = sheet.getRange(1, 1, 1, Math.max(1, sheet.getLastColumn())).getValues()[0];
    
    // Add new headers if they don't exist
    var newHeaders = Object.keys(e.parameter).filter(key => key !== 'callback' && !headers.includes(key));
    if (newHeaders.length > 0) {
      sheet.getRange(1, headers.length + 1, 1, newHeaders.length).setValues([newHeaders]);
      headers = headers.concat(newHeaders);
    }
    
    var newRow = headers.map(function(header) {
      if (header === "Timestamp") {
        // Format the timestamp in GMT+3
        var date = new Date();
        return Utilities.formatDate(date, Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss"); // Adjusting to GMT+3
      } 
      var value = e.parameter[header];
      if (value) {
        try {
          var parsedValue = JSON.parse(value);
          if (Array.isArray(parsedValue)) {
            return parsedValue.join(', '); // Join arrays (like skills) into a comma-separated string
          }
          return parsedValue;
        } catch (error) {
          return value; // If parsing fails, use the original value
        }
      }
      return "";
    });
    
    sheet.getRange(sheet.getLastRow() + 1, 1, 1, newRow.length).setValues([newRow]);
    
    var response = JSON.stringify({ 'result': 'success', 'row': sheet.getLastRow() });
    var callback = e.parameter.callback;
    
    return ContentService.createTextOutput(callback + '(' + response + ')').setMimeType(ContentService.MimeType.JAVASCRIPT);
  } catch (error) {
    var response = JSON.stringify({ 'result': 'error', 'error': error.toString() });
    var callback = e.parameter.callback;
    
    return ContentService.createTextOutput(callback + '(' + response + ')').setMimeType(ContentService.MimeType.JAVASCRIPT);
  } finally {
    lock.releaseLock();
  }
}
