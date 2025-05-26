import fetch from 'node-fetch';

// Test the improved OCR endpoint
async function testOCRImprovement() {
  console.log('🧪 Testing improved OCR implementation...\n');

  try {
    // First, login to get a token
    console.log('1. Logging in...');
    const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
      }),
    });

    if (!loginResponse.ok) {
      console.error('❌ Login failed:', await loginResponse.text());
      return;
    }

    // Extract the token from Set-Cookie header
    const setCookieHeader = loginResponse.headers.get('set-cookie');
    const tokenMatch = setCookieHeader?.match(/token=([^;]+)/);
    const token = tokenMatch ? tokenMatch[1] : null;

    if (!token) {
      console.error('❌ No token found in response');
      return;
    }

    console.log('✅ Login successful');

    // Get the list of documents
    console.log('\n2. Fetching documents...');
    const documentsResponse = await fetch('http://localhost:3001/api/documents', {
      headers: {
        'Cookie': `token=${token}`,
      },
    });

    if (!documentsResponse.ok) {
      console.error('❌ Failed to fetch documents:', await documentsResponse.text());
      return;
    }

    const documentsData = await documentsResponse.json();
    console.log(`✅ Found ${documentsData.documents?.length || 0} documents`);

    if (!documentsData.documents || documentsData.documents.length === 0) {
      console.log('ℹ️  No documents found. Please upload a document first.');
      return;
    }

    // Test OCR on the first document
    const firstDocument = documentsData.documents[0];
    console.log(`\n3. Testing OCR on document: ${firstDocument.originalName}`);
    console.log(`   File URL: ${firstDocument.fileUrl}`);

    const ocrResponse = await fetch('http://localhost:3001/api/ocr', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${token}`,
      },
      body: JSON.stringify({
        documentId: firstDocument.id,
      }),
    });

    if (!ocrResponse.ok) {
      console.error('❌ OCR request failed:', await ocrResponse.text());
      return;
    }

    const ocrData = await ocrResponse.json();
    console.log('\n📄 OCR Results:');
    console.log(`   Confidence: ${ocrData.ocrData?.confidence || 0}%`);
    console.log(`   Text length: ${ocrData.ocrData?.extractedText?.length || 0} characters`);
    
    if (ocrData.ocrData?.extractedText) {
      console.log(`   Sample text: "${ocrData.ocrData.extractedText.substring(0, 100)}..."`);
      
      // Check if it's still the placeholder text
      if (ocrData.ocrData.extractedText.includes('[OCR text will be processed in browser]')) {
        console.log('⚠️  WARNING: Still getting placeholder text from server OCR');
      } else if (ocrData.ocrData.extractedText.includes('OCR processing failed')) {
        console.log('❌ OCR processing failed on server');
      } else {
        console.log('✅ OCR successfully extracted text!');
      }
    }

    // Test analysis with the OCR result
    if (ocrData.ocrData?.confidence && ocrData.ocrData.confidence > 0) {
      console.log('\n4. Testing AI analysis...');
      const analysisResponse = await fetch('http://localhost:3001/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `token=${token}`,
        },
        body: JSON.stringify({
          documentId: firstDocument.id,
        }),
      });

      if (!analysisResponse.ok) {
        console.error('❌ Analysis request failed:', await analysisResponse.text());
        return;
      }

      const analysisData = await analysisResponse.json();
      console.log('\n🤖 AI Analysis Results:');
      console.log(`   Confidence: ${analysisData.analysisResult?.confidence || 0}%`);
      console.log(`   Summary: ${analysisData.analysisResult?.summary?.substring(0, 200) || 'N/A'}...`);
      
      if (analysisData.analysisResult?.summary?.includes('Unable to determine document type')) {
        console.log('⚠️  Analysis still showing poor results due to OCR input');
      } else {
        console.log('✅ Analysis successfully processed OCR text!');
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testOCRImprovement();
