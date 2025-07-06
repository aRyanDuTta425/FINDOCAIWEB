// Simple test to verify OCR functionality
// This is a test file to ensure our OCR implementation works

import { performOCR } from '../lib/ocr';

async function testOCR() {
  try {
    console.log('Testing OCR functionality...');
    
    // Test with a simple text image URL (placeholder)
    const testImageUrl = 'https://via.placeholder.com/400x200/000000/FFFFFF?text=Hello+World+123';
    
    const result = await performOCR(testImageUrl);
    console.log('OCR Test Result:', result);
    
    if (result.text && result.confidence > 0) {
      console.log('✅ OCR test passed!');
    } else {
      console.log('⚠️ OCR test completed but with low confidence or no text');
    }
    
  } catch (error) {
    console.error('❌ OCR test failed:', error);
  }
}

// Only run this in a test environment
if (process.env.NODE_ENV === 'development') {
  console.log('OCR test module loaded');
}

export { testOCR };
