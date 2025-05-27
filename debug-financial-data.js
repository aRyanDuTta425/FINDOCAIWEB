const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugFinancialData() {
  try {
    console.log('🔍 Debugging Financial Data Issues...\n');

    // Get all users
    const users = await prisma.user.findMany();
    console.log(`👥 Found ${users.length} users:`);
    users.forEach(user => console.log(`   - ${user.email} (${user.id})`));
    console.log('');

    // Get all documents with analysis results
    const documents = await prisma.document.findMany({
      include: {
        analysisResult: true,
        ocrData: true,
        user: true
      },
      orderBy: { uploadedAt: 'desc' }
    });

    console.log(`📄 Found ${documents.length} documents:\n`);

    documents.forEach((doc, index) => {
      console.log(`📄 Document ${index + 1}:`);
      console.log(`   ID: ${doc.id}`);
      console.log(`   User: ${doc.user.email}`);
      console.log(`   File: ${doc.originalName}`);
      console.log(`   Type: ${doc.fileType}`);
      console.log(`   Size: ${(doc.fileSize / 1024).toFixed(1)} KB`);
      console.log(`   Uploaded: ${doc.uploadedAt.toLocaleDateString()}`);
      console.log(`   Has OCR: ${doc.ocrData ? '✅' : '❌'}`);
      console.log(`   Has Analysis: ${doc.analysisResult ? '✅' : '❌'}`);
      
      if (doc.analysisResult) {
        console.log(`   📊 Analysis Results:`);
        console.log(`      Document Type: ${doc.analysisResult.documentType || 'Unknown'}`);
        console.log(`      Amount: ${doc.analysisResult.amount || 'None'}`);
        console.log(`      Balance: ${doc.analysisResult.balance || 'None'}`);
        console.log(`      Vendor: ${doc.analysisResult.vendor || 'None'}`);
        console.log(`      Invoice Number: ${doc.analysisResult.invoiceNumber || 'None'}`);
        console.log(`      Confidence: ${doc.analysisResult.confidence || 'None'}`);
        
        if (doc.analysisResult.extractedData) {
          console.log(`      Extracted Data:`, JSON.stringify(doc.analysisResult.extractedData, null, 8));
        }
      }
      
      if (doc.ocrData) {
        const truncatedText = doc.ocrData.text.substring(0, 200) + (doc.ocrData.text.length > 200 ? '...' : '');
        console.log(`   📝 OCR Text (first 200 chars): "${truncatedText}"`);
        console.log(`   📝 OCR Confidence: ${doc.ocrData.confidence || 'Unknown'}`);
      }
      
      console.log('');
    });

    // Calculate totals like the API does
    let totalIncome = 0;
    let totalExpenses = 0;
    const processedAmounts = [];

    documents.forEach(doc => {
      if (doc.analysisResult) {
        let amount = 0;
        let source = '';
        
        if (doc.analysisResult.amount && doc.analysisResult.amount > 0) {
          amount = doc.analysisResult.amount;
          source = 'amount field';
        } else if (doc.analysisResult.balance && doc.analysisResult.balance > 0) {
          amount = doc.analysisResult.balance;
          source = 'balance field';
        } else if (doc.analysisResult.extractedData) {
          const extractedData = doc.analysisResult.extractedData;
          if (extractedData.total_amount) {
            amount = parseFloat(extractedData.total_amount.toString());
            source = 'extractedData.total_amount';
          } else if (extractedData.amount) {
            amount = parseFloat(extractedData.amount.toString());
            source = 'extractedData.amount';
          } else if (extractedData.balance) {
            amount = parseFloat(extractedData.balance.toString());
            source = 'extractedData.balance';
          }
        }

        if (amount > 0) {
          const documentType = doc.analysisResult.documentType || 'other';
          const transactionType = documentType === 'bank_statement' ? 'income' : 'expense';
          
          if (transactionType === 'income') {
            totalIncome += amount;
          } else {
            totalExpenses += amount;
          }

          processedAmounts.push({
            filename: doc.originalName,
            documentType,
            amount,
            source,
            transactionType
          });
        }
      }
    });

    console.log(`💰 Financial Summary:`);
    console.log(`   Total Income: $${totalIncome.toFixed(2)}`);
    console.log(`   Total Expenses: $${totalExpenses.toFixed(2)}`);
    console.log(`   Net Savings: $${(totalIncome - totalExpenses).toFixed(2)}`);
    console.log(`   Documents with extractable amounts: ${processedAmounts.length}\n`);

    if (processedAmounts.length > 0) {
      console.log(`💵 Processed Amounts:`);
      processedAmounts.forEach(item => {
        console.log(`   - ${item.filename}: $${item.amount} (${item.transactionType}) from ${item.source}`);
      });
    } else {
      console.log(`❌ No financial amounts could be extracted from any documents!`);
      console.log(`\n🔧 Troubleshooting suggestions:`);
      console.log(`   1. Check if documents contain clear financial amounts`);
      console.log(`   2. Verify OCR processing extracted the amounts correctly`);
      console.log(`   3. Check if analysis results are being stored properly`);
      console.log(`   4. Consider re-processing documents with better OCR`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugFinancialData();
