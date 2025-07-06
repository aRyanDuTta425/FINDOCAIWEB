import fetch from 'node-fetch';
import fs from 'fs';
import FormData from 'form-data';

// Test upload and OCR with a sample image
async function testUploadAndOCR() {
  console.log('🧪 Testing upload and OCR flow...\n');

  try {
    // Create a simple test user
    console.log('1. Creating test user...');
    let token = null;
    
    const signupResponse = await fetch('http://localhost:3001/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'OCR Test User',
        email: `ocr.test.${Date.now()}@example.com`,
        password: 'password123',
      }),
    });

    if (signupResponse.ok) {
      const setCookieHeader = signupResponse.headers.get('set-cookie');
      const tokenMatch = setCookieHeader?.match(/token=([^;]+)/);
      token = tokenMatch ? tokenMatch[1] : null;
      console.log('✅ User created and logged in');
    } else {
      console.error('❌ Failed to create user:', await signupResponse.text());
      return;
    }

    // Create a test image with text using a simple text-to-image URL
    console.log('\n2. Preparing test image...');
    
    // Download a simple text image
    const testImageUrl = 'https://via.placeholder.com/600x200/ffffff/000000?text=INVOICE%20%23123%20%0ADate:%20January%2015,%202024%20%0AAmount:%20$1,250.00';
    
    const imageResponse = await fetch(testImageUrl);
    if (!imageResponse.ok) {
      console.error('❌ Failed to download test image');
      return;
    }
    
    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
    console.log(`✅ Downloaded test image (${imageBuffer.length} bytes)`);

    // Upload the image
    console.log('\n3. Uploading image...');
    const formData = new FormData();
    formData.append('file', imageBuffer, {
      filename: 'test-invoice.png',
      contentType: 'image/png',
    });

    const uploadResponse = await fetch('http://localhost:3001/api/upload', {
      method: 'POST',
      headers: {
        'Cookie': `token=${token}`,
      },
      body: formData,
    });

    if (!uploadResponse.ok) {
      console.error('❌ Upload failed:', await uploadResponse.text());
      return;
    }

    const uploadData = await uploadResponse.json();
    console.log(`✅ Upload successful. Document ID: ${uploadData.document.id}`);
    console.log(`   File URL: ${uploadData.document.fileUrl}`);

    // Test OCR
    console.log('\n4. Running OCR...');
    const ocrResponse = await fetch('http://localhost:3001/api/ocr', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${token}`,
      },
      body: JSON.stringify({
        documentId: uploadData.document.id,
      }),
    });

    if (!ocrResponse.ok) {
      console.error('❌ OCR failed:', await ocrResponse.text());
      return;
    }

    const ocrData = await ocrResponse.json();
    console.log('\n📄 OCR Results:');
    console.log(`   Confidence: ${ocrData.ocrData?.confidence || 0}%`);
    console.log(`   Text length: ${ocrData.ocrData?.extractedText?.length || 0} characters`);
    
    if (ocrData.ocrData?.extractedText) {
      console.log(`   Extracted text: "${ocrData.ocrData.extractedText}"`);
      
      // Check if OCR improvements worked
      if (ocrData.ocrData.extractedText.includes('[OCR text will be processed in browser]')) {
        console.log('❌ Still getting placeholder text - OCR improvement not working');
      } else if (ocrData.ocrData.extractedText.includes('OCR processing failed')) {
        console.log('❌ OCR processing failed on server');
      } else if (ocrData.ocrData.confidence > 0) {
        console.log('✅ OCR improvement working! Got real text extraction');
        
        // Test analysis
        console.log('\n5. Running AI analysis...');
        const analysisResponse = await fetch('http://localhost:3001/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Cookie': `token=${token}`,
          },
          body: JSON.stringify({
            documentId: uploadData.document.id,
          }),
        });

        if (analysisResponse.ok) {
          const analysisData = await analysisResponse.json();
          console.log('\n🤖 AI Analysis Results:');
          console.log(`   Confidence: ${analysisData.analysisResult?.confidence || 0}%`);
          console.log(`   Summary: ${analysisData.analysisResult?.summary || 'N/A'}`);
          
          if (analysisData.analysisResult?.summary?.includes('Unable to determine document type')) {
            console.log('⚠️  Analysis still generic - may need better OCR text');
          } else {
            console.log('✅ Analysis improved with better OCR input!');
          }
        }
      } else {
        console.log('❌ OCR returned 0% confidence');
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error.stack);
  }
}

// Run the test
testUploadAndOCR();
