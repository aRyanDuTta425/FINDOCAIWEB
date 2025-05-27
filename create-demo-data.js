const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createDemoData() {
  try {
    console.log('🚀 Creating demo financial data...\n');

    // First check if user exists, if not create one
    let demoUser = await prisma.user.findFirst({
      where: { email: 'demo@findocai.com' }
    });

    if (!demoUser) {
      demoUser = await prisma.user.create({
        data: {
          email: 'demo@findocai.com',
          password: 'hashed_password',
          name: 'Demo User'
        }
      });
      console.log('✅ Created demo user');
    } else {
      console.log('📌 Found existing demo user');
    }

    // Create sample documents with analysis results
    const demoDocuments = [
      {
        filename: 'grocery_receipt_01.pdf',
        originalName: 'Grocery Receipt - Whole Foods',
        fileType: 'application/pdf',
        fileSize: 245760,
        analysis: {
          documentType: 'invoice',
          amount: 127.50,
          vendor: 'Whole Foods Market',
          invoiceNumber: 'WF2024-001',
          confidence: 0.95
        }
      },
      {
        filename: 'bank_statement_jan.pdf',
        originalName: 'Bank Statement January 2024',
        fileType: 'application/pdf',
        fileSize: 512000,
        analysis: {
          documentType: 'bank_statement',
          balance: 5420.00,
          accountNumber: '****1234',
          statementDate: new Date('2024-01-31'),
          confidence: 0.98
        }
      },
      {
        filename: 'restaurant_bill.jpg',
        originalName: 'Restaurant Bill - Olive Garden',
        fileType: 'image/jpeg',
        fileSize: 156789,
        analysis: {
          documentType: 'invoice',
          amount: 67.25,
          vendor: 'Olive Garden',
          confidence: 0.87
        }
      },
      {
        filename: 'gas_receipt.pdf',
        originalName: 'Gas Station Receipt',
        fileType: 'application/pdf',
        fileSize: 89034,
        analysis: {
          documentType: 'invoice',
          amount: 45.80,
          vendor: 'Shell Gas Station',
          confidence: 0.92
        }
      },
      {
        filename: 'salary_deposit.pdf',
        originalName: 'Salary Deposit Confirmation',
        fileType: 'application/pdf',
        fileSize: 67890,
        analysis: {
          documentType: 'bank_statement',
          amount: 3500.00,
          vendor: 'ABC Company Payroll',
          confidence: 0.96
        }
      }
    ];

    for (const docData of demoDocuments) {
      // Check if document already exists
      const existingDoc = await prisma.document.findFirst({
        where: { 
          originalName: docData.originalName,
          userId: demoUser.id 
        }
      });

      if (!existingDoc) {
        // Create document
        const document = await prisma.document.create({
          data: {
            filename: docData.filename,
            originalName: docData.originalName,
            fileUrl: `/uploads/${docData.filename}`,
            fileType: docData.fileType,
            fileSize: docData.fileSize,
            userId: demoUser.id
          }
        });

        // Create analysis result
        await prisma.analysisResult.create({
          data: {
            ...docData.analysis,
            documentId: document.id,
            extractedData: {
              total_amount: docData.analysis.amount,
              vendor_name: docData.analysis.vendor,
              document_type: docData.analysis.documentType
            }
          }
        });

        // Create sample OCR data
        const sampleOCRText = `
Document: ${docData.originalName}
Amount: $${docData.analysis.amount}
Vendor: ${docData.analysis.vendor}
Date: ${new Date().toLocaleDateString()}
        `.trim();

        await prisma.oCRData.create({
          data: {
            text: sampleOCRText,
            confidence: docData.analysis.confidence,
            documentId: document.id
          }
        });

        console.log(`✅ Created: ${docData.originalName} - $${docData.analysis.amount}`);
      } else {
        console.log(`📌 Already exists: ${docData.originalName}`);
      }
    }

    // Verify the created data
    const totalDocs = await prisma.document.count({ where: { userId: demoUser.id } });
    const totalAnalysis = await prisma.analysisResult.count({
      where: { document: { userId: demoUser.id } }
    });

    console.log(`\n📊 Summary:`);
    console.log(`   User: ${demoUser.email}`);
    console.log(`   Documents: ${totalDocs}`);
    console.log(`   Analysis Results: ${totalAnalysis}`);

    // Calculate financial summary
    const documents = await prisma.document.findMany({
      where: { userId: demoUser.id },
      include: { analysisResult: true }
    });

    let totalIncome = 0;
    let totalExpenses = 0;

    documents.forEach(doc => {
      if (doc.analysisResult && doc.analysisResult.amount) {
        if (doc.analysisResult.documentType === 'bank_statement') {
          totalIncome += doc.analysisResult.amount;
        } else {
          totalExpenses += doc.analysisResult.amount;
        }
      }
    });

    console.log(`\n💰 Financial Summary:`);
    console.log(`   Total Income: $${totalIncome.toFixed(2)}`);
    console.log(`   Total Expenses: $${totalExpenses.toFixed(2)}`);
    console.log(`   Net Savings: $${(totalIncome - totalExpenses).toFixed(2)}`);

    console.log(`\n🎉 Demo data creation completed!`);
    console.log(`\nTo test the dashboard:`);
    console.log(`1. Login with: demo@findocai.com`);
    console.log(`2. Visit: http://localhost:3001/dashboard/financial`);

  } catch (error) {
    console.error('❌ Error creating demo data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createDemoData();
