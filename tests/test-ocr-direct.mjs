// Test OCR with a sample image URL
import { performOCR } from './lib/ocr.js';

async function testOCRDirect() {
  console.log('🧪 Testing OCR directly...\n');
  
  try {
    // Test with a sample text image
    const sampleImageUrl = 'https://via.placeholder.com/400x200/ffffff/000000?text=Sample+Text+Document';
    
    console.log('Testing OCR with sample image:', sampleImageUrl);
    
    const result = await performOCR(sampleImageUrl);
    
    console.log('\n📄 OCR Results:');
    console.log(`   Text: "${result.text}"`);
    console.log(`   Confidence: ${result.confidence}%`);
    console.log(`   Words count: ${result.words?.length || 0}`);
    
    if (result.confidence > 0) {
      console.log('✅ OCR is working!');
    } else {
      console.log('❌ OCR returned 0% confidence');
    }
    
  } catch (error) {
    console.error('❌ OCR test failed:', error.message);
    console.error(error.stack);
  }
}

testOCRDirect();
