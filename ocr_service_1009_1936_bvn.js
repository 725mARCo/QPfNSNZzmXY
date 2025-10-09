// 代码生成时间: 2025-10-09 19:36:42
 * OCR Service - A Meteor application service for Optical Character Recognition (OCR)
 *
 * @author Your Name
 * @version 1.0.0
 */

// Import necessary Meteor packages and modules
import { Meteor } from 'meteor/meteor';
import { ServiceConfiguration } from 'meteor/service-configuration';
import { HTTP } from 'meteor/http';

// Define global settings for OCR service
const OcrServiceSettings = {
  baseUrl: 'https://ocr.space/api/',
  apiKey: 'your_ocr_space_api_key', // Replace with your actual API key
  lang: 'eng', // Language code for text recognition
};

/**
 * OCRService class responsible for handling OCR operations.
 *
 * @class OCRService
 */
class OCRService {
  /**
   * Constructor for OCRService
   */
  constructor() {
    // Initialize the service with settings
    this.settings = OcrServiceSettings;
  }

  /**
   * Perform OCR on an image file
   *
   * @param {File} imageFile - The image file to perform OCR on
   * @returns {Promise} - A promise that resolves with the text from the image
   */
  async performOcr(imageFile) {
    try {
      // Check if the file is valid
      if (!imageFile) {
        throw new Error('No image file provided for OCR.');
      }
      
      // Create a FormData object to send the file in the request
      const formData = new FormData();
      formData.append('file', imageFile, imageFile.name);
      formData.append('isOverlayRequired', 'True');
      formData.append('language', this.settings.lang);
      formData.append('apikey', this.settings.apiKey);
      
      // Make the HTTP POST request to the OCR service
      const response = await HTTP.post(this.settings.baseUrl + 'ocrurl', {
        data: formData,
        headers: {'Content-Type': 'multipart/form-data'}
      });

      // Parse the JSON response
      const jsonResponse = JSON.parse(response.content);
      
      // Extract the recognized text from the response
      const recognizedText = jsonResponse.ParsedResults[0].ParsedText;
      
      // Return the recognized text
      return recognizedText;
    } catch (error) {
      // Handle any errors that occur during OCR
      console.error('OCR Error:', error.message);
      throw error;
    }
  }
}

// Expose the OCRService class to Meteor
export { OCRService };

// Example usage of OCRService
Meteor.startup(() => {
  // Create an instance of OCRService
  const ocrService = new OCRService();
  
  // Simulate a file upload event and perform OCR
  const exampleImageFile = {
    // ... your image file object
  };
  
  ocrService.performOcr(exampleImageFile)
    .then((text) => {
      console.log('Recognized Text:', text);
    }).catch((error) => {
      console.error('Error performing OCR:', error.message);
    });
});