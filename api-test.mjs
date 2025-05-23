import axios from 'axios';
import fs from 'fs';
import { createCanvas } from 'canvas';
import FormData from 'form-data';
import path from 'path';

/**
 * This script tests the FinDocAI API endpoints
 * 
 * Run with: node api-test.mjs
 */

// Configuration
const baseUrl = 'http://localhost:3000/api';
let authToken = '';
const testUser = {
  email: 'test@example.com',
  password: 'Test123!',
  name: 'Test User'
};

// Helper to log steps
const log = (message) => {
  console.log(`\n[TEST] ${message}`);
};

// Helper to format API responses
const formatResponse = (data) => {
  const formatted = JSON.stringify(data, null, 2);
  // Truncate if too long
  return formatted.length > 500 
    ? formatted.substring(0, 500) + '... (truncated)'
    : formatted;
};

// Create a test image with financial data
function createTestImage() {
  const width = 800;
  const height = 600;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Fill background
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, width, height);

  // Add a header
  ctx.fillStyle = 'black';
  ctx.font = 'bold 30px Arial';
  ctx.fillText('FINANCIAL DOCUMENT', 200, 50);
  
  // Add invoice details
  ctx.font = '20px Arial';
  ctx.fillText('INVOICE #: INV-2025-12345', 50, 120);
  ctx.fillText('Date: May 23, 2025', 50, 160);
  ctx.fillText('Due Date: June 23, 2025', 50, 200);

  // Add financial amounts
  ctx.fillText('Subtotal: $1,500.00', 50, 300);
  ctx.fillText('Tax (10%): $150.00', 50, 340);
  ctx.fillText('Total: $1,650.00', 50, 380);
  
  // Add company details
  ctx.font = '18px Arial';
  ctx.fillText('From: FinTech Solutions Inc.', 50, 460);
  ctx.fillText('To: Client Corporation LLC', 50, 500);
  
  // Save image to file
  const buffer = canvas.toBuffer('image/png');
  const filename = 'api-test-image.png';
  fs.writeFileSync(filename, buffer);
  console.log(`Created test image: ${filename}`);
  return filename;
}

async function runTests() {
  try {
    log('Starting FinDocAI API Test Suite');
    
    // Step 1: Login with test user
    log('Logging in as test user');
    try {
      const loginResponse = await axios.post(`${baseUrl}/auth/login`, {
        email: testUser.email,
        password: testUser.password
      });
      authToken = loginResponse.data.token;
      console.log('Login successful. Auth token received.');
    } catch (error) {
      // If login fails, try to register first
      log('Login failed. Attempting to register user first.');
      await axios.post(`${baseUrl}/auth/signup`, testUser);
      const loginResponse = await axios.post(`${baseUrl}/auth/login`, {
        email: testUser.email,
        password: testUser.password
      });
      authToken = loginResponse.data.token;
      console.log('Registration and login successful.');
    }
    
    // Step 2: Test /api/auth/me endpoint
    log('Testing /api/auth/me endpoint');
    try {
      const meResponse = await axios.get(`${baseUrl}/auth/me`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      console.log('User data:', formatResponse(meResponse.data));
    } catch (error) {
      console.error('Error fetching user data:', error.response?.data || error.message);
    }
    
    // Step 3: Create and upload test image
    log('Creating and uploading test image');
    const imagePath = createTestImage();
    const imageBuffer = fs.readFileSync(imagePath);

    // Create form data with the image
    const formData = new FormData();
    formData.append('file', imageBuffer, {
      filename: path.basename(imagePath),
      contentType: 'image/png',
    });
    
    let documentId;
    try {
      // Upload the image
      const uploadResponse = await axios.post(`${baseUrl}/upload`, formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          ...formData.getHeaders()
        }
      });
      
      documentId = uploadResponse.data.document.id;
      console.log('Image uploaded successfully');
      console.log('Document data:', formatResponse(uploadResponse.data.document));
    } catch (error) {
      console.error('Upload failed:', error.response?.data || error.message);
      // Continue with other tests even if this fails
    }
    
    if (documentId) {
      // Step 4: Process the document with OCR
      log('Processing document with OCR');
      try {
        const ocrResponse = await axios.post(`${baseUrl}/ocr`, 
          { documentId },
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        console.log('OCR processing result:', formatResponse(ocrResponse.data));
      } catch (error) {
        console.error('OCR processing failed:', error.response?.data || error.message);
      }
      
      // Step 5: Analyze the document
      log('Analyzing document with AI');
      try {
        const analyzeResponse = await axios.post(`${baseUrl}/analyze`, 
          { documentId },
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
        console.log('Analysis result:', formatResponse(analyzeResponse.data));
      } catch (error) {
        console.error('Analysis failed:', error.response?.data || error.message);
      }
      
      // Step 6: Get document data including OCR and analysis
      log('Fetching document with OCR and analysis data');
      try {
        const documentResponse = await axios.get(`${baseUrl}/documents/${documentId}`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('Full document data:', formatResponse(documentResponse.data));
      } catch (error) {
        console.error('Document fetch failed:', error.response?.data || error.message);
      }
      
      // Step 7: List all documents
      log('Listing all documents');
      try {
        const documentsResponse = await axios.get(`${baseUrl}/documents`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        console.log('Documents list:', formatResponse(documentsResponse.data));
      } catch (error) {
        console.error('Documents list fetch failed:', error.response?.data || error.message);
      }
    }
    
    // Clean up
    log('Test suite completed');
    try {
      fs.unlinkSync(imagePath);
      console.log(`Test image deleted: ${imagePath}`);
    } catch (err) {
      // Ignore cleanup errors
    }
    
  } catch (error) {
    console.error('Test suite failed:', error.response?.data || error.message);
  }
}

// Run the tests
runTests();
