import axios from 'axios';
import fs from 'fs';
import path from 'path';

/**
 * This script tests the key functionality of the FinDocAI system
 * 
 * Run with: node test-api.mjs
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

// Main test function
async function runTests() {
  try {
    log('Starting FinDocAI API tests');

    // Step 1: Register a test user
    log('Registering test user');
    try {
      const registerResponse = await axios.post(`${baseUrl}/auth/signup`, testUser);
      console.log('Registration success:', registerResponse.data);
    } catch (err) {
      // Ignore if user already exists
      console.log('Registration error (user may already exist):', err.response?.data || err.message);
    }

    // Step 2: Login with the test user
    log('Logging in with test user');
    const loginResponse = await axios.post(`${baseUrl}/auth/login`, {
      email: testUser.email,
      password: testUser.password,
    });
    
    authToken = loginResponse.data.token;
    console.log('Login success, token received');

    // Step 3: Create a test file for upload
    log('Creating test file');
    const testContent = 'TEST FINANCIAL DOCUMENT\n\nInvoice #: 12345\nDate: May 23, 2025\nAmount: $1,234.56\n\nFrom: Test Company Inc.\nTo: Client LLC';
    fs.writeFileSync('test-document.txt', testContent);

    // Step 4: Upload the test file
    log('Uploading test file');
    const formData = new FormData();
    const fileBuffer = fs.readFileSync('test-document.txt');
    const testFile = new Blob([fileBuffer], { type: 'text/plain' });
    formData.append('file', testFile, 'test-document.txt');
    
    const uploadResponse = await axios.post(`${baseUrl}/upload`, formData, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'multipart/form-data',
      }
    });
    
    const documentId = uploadResponse.data.document.id;
    console.log(`Document uploaded with ID: ${documentId}`);

    // Step 5: Process the document (OCR + Analysis)
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

    // Step 6: Retrieve the document with OCR and analysis data
    log('Retrieving document with OCR and analysis data');
    const documentResponse = await axios.get(`${baseUrl}/documents/${documentId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      }
    });
    
    console.log('Document data:', documentResponse.data);

    // Final step: Clean up
    log('Test completed successfully! Cleaning up...');
    fs.unlinkSync('test-document.txt');
    
  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
  }
}

// Run the tests
runTests();
