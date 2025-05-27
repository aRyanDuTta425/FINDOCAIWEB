const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createRealisticDemoData() {
  try {
    console.log('🚀 Creating realistic financial demo data...\n');

    // Create or find demo user
    let demoUser = await prisma.user.findUnique({
      where: { email: 'demo@findocai.com' }
    });

    if (!demoUser) {
      demoUser = await prisma.user.create({
        data: {
          email: 'demo@findocai.com',
          name: 'Demo User',
          password: 'demo-password-hash'
        }
      });
      console.log('✅ Created demo user');
    }

    // Clear existing demo data
    await prisma.document.deleteMany({
      where: { userId: demoUser.id }
    });
    console.log('🧹 Cleared existing demo data');

    // Create realistic financial documents
    const documentsData = [
      // January Income
      {
        originalName: 'January Salary - ABC Corp.pdf',
        fileType: 'application/pdf',
        fileSize: 245760,
        analysisData: {
          documentType: 'bank_statement',
          amount: 5500,
          vendor: 'ABC Corporation',
          confidence: 0.95,
          extractedData: {
            vendor_name: 'ABC Corporation',
            total_amount: 5500,
            document_type: 'bank_statement',
            description: 'Monthly Salary Deposit'
          }
        },
        ocrData: {
          text: 'BANK STATEMENT\nABC Corporation\nSalary Deposit: $5,500.00\nDate: January 15, 2025\nAccount: ****1234',
          confidence: 95
        }
      },
      
      // Freelance Income
      {
        originalName: 'Freelance Payment - XYZ Client.pdf',
        fileType: 'application/pdf',
        fileSize: 125440,
        analysisData: {
          documentType: 'invoice',
          amount: 1200,
          vendor: 'XYZ Client',
          confidence: 0.92,
          extractedData: {
            vendor_name: 'XYZ Client',
            total_amount: 1200,
            document_type: 'invoice',
            description: 'Freelance Project Payment'
          }
        },
        ocrData: {
          text: 'PAYMENT CONFIRMATION\nXYZ Client\nFreelance Project: $1,200.00\nDate: January 20, 2025\nProject: Website Development',
          confidence: 92
        }
      },

      // Rent Expense
      {
        originalName: 'January Rent Receipt.pdf',
        fileType: 'application/pdf',
        fileSize: 180320,
        analysisData: {
          documentType: 'receipt',
          amount: 1800,
          vendor: 'Metro Property Management',
          confidence: 0.94,
          extractedData: {
            vendor_name: 'Metro Property Management',
            total_amount: 1800,
            document_type: 'receipt',
            description: 'Monthly Rent Payment'
          }
        },
        ocrData: {
          text: 'RENT RECEIPT\nMetro Property Management\nAmount: $1,800.00\nDate: January 1, 2025\nApartment 2B',
          confidence: 94
        }
      },

      // Grocery Expenses
      {
        originalName: 'Whole Foods Receipt 1-22.jpg',
        fileType: 'image/jpeg',
        fileSize: 156780,
        analysisData: {
          documentType: 'receipt',
          amount: 127.50,
          vendor: 'Whole Foods Market',
          invoiceNumber: 'WF-2025-0122',
          confidence: 0.88,
          extractedData: {
            vendor_name: 'Whole Foods Market',
            total_amount: 127.50,
            document_type: 'receipt',
            description: 'Grocery Shopping'
          }
        },
        ocrData: {
          text: 'WHOLE FOODS MARKET\nTotal: $127.50\nDate: January 22, 2025\nOrganic Produce, Meats, Dairy',
          confidence: 88
        }
      },

      // Utility Bills
      {
        originalName: 'Electric Bill January 2025.pdf',
        fileType: 'application/pdf',
        fileSize: 89650,
        analysisData: {
          documentType: 'invoice',
          amount: 142.75,
          vendor: 'City Electric Company',
          invoiceNumber: 'EC-2025-001',
          confidence: 0.96,
          extractedData: {
            vendor_name: 'City Electric Company',
            total_amount: 142.75,
            document_type: 'invoice',
            description: 'Monthly Electric Bill'
          }
        },
        ocrData: {
          text: 'CITY ELECTRIC COMPANY\nAccount: 123456789\nAmount Due: $142.75\nDue Date: February 15, 2025',
          confidence: 96
        }
      },

      // Internet Bill
      {
        originalName: 'Internet Bill - TechNet.pdf',
        fileType: 'application/pdf',
        fileSize: 76540,
        analysisData: {
          documentType: 'invoice',
          amount: 79.99,
          vendor: 'TechNet Internet',
          invoiceNumber: 'TN-2025-001',
          confidence: 0.93,
          extractedData: {
            vendor_name: 'TechNet Internet',
            total_amount: 79.99,
            document_type: 'invoice',
            description: 'Monthly Internet Service'
          }
        },
        ocrData: {
          text: 'TECHNET INTERNET\nHigh-Speed Internet Service\nAmount: $79.99\nBilling Period: Jan 1-31, 2025',
          confidence: 93
        }
      },

      // Gas Station
      {
        originalName: 'Shell Gas Receipt.jpg',
        fileType: 'image/jpeg',
        fileSize: 98760,
        analysisData: {
          documentType: 'receipt',
          amount: 52.30,
          vendor: 'Shell Gas Station',
          confidence: 0.89,
          extractedData: {
            vendor_name: 'Shell Gas Station',
            total_amount: 52.30,
            document_type: 'receipt',
            description: 'Gasoline Purchase'
          }
        },
        ocrData: {
          text: 'SHELL\nGallons: 12.5\nPrice/Gal: $4.18\nTotal: $52.30\nDate: January 25, 2025',
          confidence: 89
        }
      },

      // Restaurant
      {
        originalName: 'Olive Garden Dinner Receipt.jpg',
        fileType: 'image/jpeg',
        fileSize: 134220,
        analysisData: {
          documentType: 'receipt',
          amount: 67.25,
          vendor: 'Olive Garden',
          confidence: 0.85,
          extractedData: {
            vendor_name: 'Olive Garden',
            total_amount: 67.25,
            document_type: 'receipt',
            description: 'Restaurant Dining'
          }
        },
        ocrData: {
          text: 'OLIVE GARDEN\nTable 15\nTotal: $67.25\nDate: January 23, 2025\nThank you for dining with us!',
          confidence: 85
        }
      },

      // Coffee Shop
      {
        originalName: 'Starbucks Receipt.jpg',
        fileType: 'image/jpeg',
        fileSize: 45680,
        analysisData: {
          documentType: 'receipt',
          amount: 15.75,
          vendor: 'Starbucks',
          confidence: 0.91,
          extractedData: {
            vendor_name: 'Starbucks',
            total_amount: 15.75,
            document_type: 'receipt',
            description: 'Coffee Purchase'
          }
        },
        ocrData: {
          text: 'STARBUCKS\n2 Latte Grande\nTotal: $15.75\nDate: January 26, 2025\nStore #1234',
          confidence: 91
        }
      },

      // Bank Statement
      {
        originalName: 'January Bank Statement.pdf',
        fileType: 'application/pdf',
        fileSize: 456780,
        analysisData: {
          documentType: 'bank_statement',
          amount: null,
          balance: 8450.25,
          vendor: null,
          confidence: 0.97,
          extractedData: {
            document_type: 'bank_statement',
            closing_balance: 8450.25,
            account_summary: {
              opening_balance: 6230.50,
              total_deposits: 6700.00,
              total_withdrawals: 4480.25,
              closing_balance: 8450.25
            }
          }
        },
        ocrData: {
          text: 'MONTHLY STATEMENT\nAccount: ****1234\nOpening Balance: $6,230.50\nDeposits: $6,700.00\nWithdrawals: $4,480.25\nClosing Balance: $8,450.25',
          confidence: 97
        }
      }
    ];

    console.log('📄 Creating documents and analysis results...\n');

    for (const [index, docData] of documentsData.entries()) {
      // Create document
      const document = await prisma.document.create({
        data: {
          userId: demoUser.id,
          filename: docData.originalName.replace(/[^a-zA-Z0-9.-]/g, '_'), // Safe filename
          originalName: docData.originalName,
          fileUrl: `/uploads/demo/${docData.originalName.replace(/[^a-zA-Z0-9.-]/g, '_')}`,
          fileType: docData.fileType,
          fileSize: docData.fileSize,
          uploadedAt: new Date(2025, 0, index + 1), // Spread across January
        }
      });

      // Create OCR data
      await prisma.oCRData.create({
        data: {
          documentId: document.id,
          text: docData.ocrData.text,
          confidence: docData.ocrData.confidence,
          processedAt: new Date(),
        }
      });

      // Create analysis result
      await prisma.analysisResult.create({
        data: {
          documentId: document.id,
          documentType: docData.analysisData.documentType,
          amount: docData.analysisData.amount,
          balance: docData.analysisData.balance,
          vendor: docData.analysisData.vendor,
          invoiceNumber: docData.analysisData.invoiceNumber,
          confidence: docData.analysisData.confidence,
          extractedData: docData.analysisData.extractedData,
          processedAt: new Date(),
        }
      });

      console.log(`✅ Created: ${docData.originalName}`);
    }

    console.log('\n🎉 Demo data creation completed!');
    console.log('\n📊 Summary:');
    console.log(`   📄 Documents: ${documentsData.length}`);
    console.log(`   💰 Income Sources: 2 (Salary + Freelance)`);
    console.log(`   💸 Expense Categories: 7 (Rent, Groceries, Utilities, etc.)`);
    console.log(`   💳 Bank Statements: 1`);
    console.log('\n🚀 You can now test the enhanced dashboard with realistic data!');

  } catch (error) {
    console.error('❌ Error creating demo data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createRealisticDemoData();
