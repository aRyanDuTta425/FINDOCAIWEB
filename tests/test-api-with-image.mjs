import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { createCanvas } from 'canvas';

/**
 * This script tests the key functionality of the FinDocAI system
 * 
 * Run with: node test-api-with-image.mjs
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
  fs.writeFileSync('test-financial-doc.png', buffer);
  return 'test-financial-doc.png';
}

// Main test function
async function runTests() {
  try {
    log('Starting FinDocAI API tests with image');

    // Step 1: Login with the test user
    log('Logging in with test user');
    const loginResponse = await axios.post(`${baseUrl}/auth/login`, {
      email: testUser.email,
      password: testUser.password,
    });
    
    authToken = loginResponse.data.token;
    console.log('Login success, token received');

    // Step 2: Create a test image
    log('Creating test image');
    const testImagePath = createTestImage();
    console.log(`Created test image: ${testImagePath}`);

    // Step 3: Upload the test image
    log('Uploading test image');
    
    const fileBuffer = fs.readFileSync(testImagePath);
    const formData = new FormData();
    formData.append('file', new Blob([fileBuffer], { type: 'image/png' }), 'test-financial-doc.png');
    
    const uploadResponse = await axios.post(`${baseUrl}/upload`, formData, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'multipart/form-data',
      }
    });
    
    const documentId = uploadResponse.data.document.id;
    console.log(`Document uploaded with ID: ${documentId}`);

    // Step 4: Process the document (OCR + Analysis)
    log('Processing document with OCR and analysis');
    const processResponse = await axios.post(`${baseUrl}/process`, 
      { documentId },
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        }
      }
    );
    
    console.log('Processing response:', processResponse.data);

    // Step 5: Retrieve the document with OCR and analysis data
    log('Retrieving document with OCR and analysis data');
    const documentResponse = await axios.get(`${baseUrl}/documents/${documentId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      }
    });
    
    console.log('Document data:', documentResponse.data);

    // Final step: Clean up
    log('Test completed successfully! Cleaning up...');
    fs.unlinkSync(testImagePath);
    
  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
  }
}

// Run the tests
runTests();
