// 代码生成时间: 2025-09-23 22:03:46
#!/usr/bin/env node

/**
 * Excel Generator using Meteor Framework and JS libraries.
 * This script generates an Excel file with predefined data structure.
 */

const moment = require('moment');
const ExcelJS = require('exceljs');
const fs = require('fs');

// Function to create an Excel workbook
function createWorkbook() {
  const workbook = new ExcelJS.Workbook();
  return workbook;
}

// Function to add a worksheet to the workbook
function addWorksheet(workbook, sheetName) {
  return workbook.addWorksheet(sheetName);
}

// Function to add headers to the worksheet
function addHeaders(sheet, headers) {
  const row = sheet.addRow();
  headers.forEach(header => {
    row.addCell({ value: header });
  });
}

// Function to add data rows to the worksheet
function addDataRows(sheet, data) {
  data.forEach(row => {
    const newRow = sheet.addRow();
    Object.keys(row).forEach(key => {
      newRow.addCell({ value: row[key] });
    });
  });
}

// Function to save the workbook to a file
function saveWorkbook(workbook, filename) {
  workbook.xlsx.writeFile(filename)
    .then(() => {
      console.log(`Excel file '${filename}' has been successfully created.`);
    }).catch(error => {
      console.error(`Failed to create Excel file: ${error.message}`);
    });
}

// Main function to generate the Excel file
function generateExcelFile() {
  try {
    // Create a new workbook
    const workbook = createWorkbook();
    // Add a worksheet named 'Data'
    const worksheet = addWorksheet(workbook, 'Data');
    
    // Define headers for the worksheet
    const headers = ['ID', 'Name', 'Date', 'Value'];
    // Add headers to the worksheet
    addHeaders(worksheet, headers);

    // Define data to be added to the worksheet
    const data = [
      { ID: 1, Name: 'John Doe', Date: moment().format('YYYY-MM-DD'), Value: 100 },
      { ID: 2, Name: 'Jane Doe', Date: moment().format('YYYY-MM-DD'), Value: 200 }
    ];
    // Add data rows to the worksheet
    addDataRows(worksheet, data);

    // Save the workbook to a file named 'data.xlsx'
    saveWorkbook(workbook, 'data.xlsx');
  } catch (error) {
    console.error(`An error occurred: ${error.message}`);
  }
}

// Run the function to generate the Excel file
generateExcelFile();