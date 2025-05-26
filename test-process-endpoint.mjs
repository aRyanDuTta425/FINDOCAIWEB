import fetch from 'node-fetch';

// Test the batch processing endpoint
async function testProcessEndpoint() {
  console.log('🧪 Testing batch processing endpoint...\n');

  try {
    // First, login with the correct credentials
    console.log('1. Logging in...');
    const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'aryan@test.com', // Try the email from our previous tests
        password: 'password123',
      }),
    });

    let token = null;
    if (loginResponse.ok) {
      const setCookieHeader = loginResponse.headers.get('set-cookie');
      const tokenMatch = setCookieHeader?.match(/token=([^;]+)/);
      token = tokenMatch ? tokenMatch[1] : null;
      console.log('✅ Login successful');
    } else {
      // Try creating a new user if login fails
      console.log('Login failed, creating new user...');
      const signupResponse = await fetch('http://localhost:3001/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test User',
          email: 'ocr.test@example.com',
          password: 'password123',
        }),
      });

      if (signupResponse.ok) {
        const setCookieHeader = signupResponse.headers.get('set-cookie');
        const tokenMatch = setCookieHeader?.match(/token=([^;]+)/);
        token = tokenMatch ? tokenMatch[1] : null;
        console.log('✅ Signup successful');
      } else {
        console.error('❌ Both login and signup failed');
        return;
      }
    }

    // Get documents
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
      console.log('ℹ️  No documents found. Test by uploading a document through the web interface.');
      console.log('ℹ️  Then run this test again.');
      return;
    }

    // Test the batch processing endpoint
    const document = documentsData.documents[0];
    console.log(`\n3. Testing batch processing on: ${document.originalName}`);
    console.log(`   Document ID: ${document.id}`);
    console.log(`   File URL: ${document.fileUrl}`);

    const processResponse = await fetch('http://localhost:3001/api/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `token=${token}`,
      },
      body: JSON.stringify({
        documentId: document.id,
      }),
    });

    if (!processResponse.ok) {
      console.error('❌ Process request failed:', await processResponse.text());
      return;
    }

    const processData = await processResponse.json();
    console.log('\n📊 Batch Processing Results:');
    
    if (processData.ocrResult) {
      console.log(`\n📄 OCR Results:`);
      console.log(`   Confidence: ${processData.ocrResult.confidence}%`);
      console.log(`   Text length: ${processData.ocrResult.text?.length || 0} characters`);
      
      if (processData.ocrResult.text) {
        console.log(`   Sample text: "${processData.ocrResult.text.substring(0, 150)}..."`);
        
        if (processData.ocrResult.text.includes('[OCR text will be processed in browser]')) {
          console.log('❌ Still getting placeholder text!');
        } else if (processData.ocrResult.text.includes('OCR processing failed')) {
          console.log('❌ OCR processing failed');
        } else if (processData.ocrResult.confidence > 0) {
          console.log('✅ OCR successfully extracted real text!');
        }
      }
    }

    if (processData.analysisResult) {
      console.log(`\n🤖 Analysis Results:`);
      console.log(`   Confidence: ${processData.analysisResult.confidence}%`);
      console.log(`   Summary: ${processData.analysisResult.summary?.substring(0, 200) || 'N/A'}...`);
      
      if (processData.analysisResult.summary?.includes('Unable to determine document type')) {
        console.log('⚠️  Analysis still showing generic response');
      } else {
        console.log('✅ Analysis showing improved results!');
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testProcessEndpoint();
