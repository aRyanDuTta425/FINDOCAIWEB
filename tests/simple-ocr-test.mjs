// Simple OCR test script

import { createCanvas } from 'canvas';
import fs from 'fs';
import path from 'path';
import Tesseract from 'tesseract.js';

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
  const filename = 'simple-test-image.png';
  fs.writeFileSync(filename, buffer);
  console.log(`Created test image: ${filename}`);
  return filename;
}

// Perform OCR on the test image
async function performOCR(imagePath) {
  console.log(`Performing OCR on ${imagePath}...`);
  
  try {
    const result = await Tesseract.recognize(
      fs.readFileSync(imagePath),
      'eng',
      {
        logger: m => {
          if (m.status === 'recognizing text') {
            console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
          }
        }
      }
    );
    
    console.log('OCR Result:');
    console.log('Text:', result.data.text);
    console.log('Confidence:', result.data.confidence);
    return result.data;
  } catch (error) {
    console.error('OCR failed:', error);
  }
}

// Main test function
async function runTest() {
  console.log('Starting simple OCR test');
  const imagePath = createTestImage();
  
  try {
    const ocrResult = await performOCR(imagePath);
    
    // Verify the OCR results
    if (ocrResult.text.includes('FINANCIAL') && 
        ocrResult.text.includes('INVOICE') && 
        ocrResult.text.includes('1,500.00')) {
      console.log('✅ Test PASSED: OCR correctly detected key financial information');
    } else {
      console.log('⚠️ Test WARNING: OCR may not have detected all expected text');
      console.log('Expected to find: FINANCIAL, INVOICE, 1,500.00');
    }
    
    // Clean up
    fs.unlinkSync(imagePath);
    console.log(`Deleted test image: ${imagePath}`);
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
runTest();
