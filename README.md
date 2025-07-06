<div align="center">

# 🔮 FinDocAI
**Financial Document Intelligence Platform**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

🚀 **Transform your financial documents into actionable insights with AI-powered intelligence** �

[Live Demo](https://findocai.netlify.app/) • [Documentation](#-documentation) • [Installation](#-quick-start) • [Contributing](#-contributing)

 

</div>

---

## ✨ What is FinDocAI?

**FinDocAI** is a cutting-edge financial document processing platform that leverages artificial intelligence to transform your invoices, bank statements, and tax documents into structured, searchable data. Built with modern web technologies, it offers enterprise-grade security with a user-friendly interface.

### 🎯 Problem We Solve
- **Manual Data Entry**: No more tedious typing of financial data
- **Document Organization**: Keep all your financial documents in one secure place
- **Information Extraction**: Automatically extract key data points from complex documents
- **Financial Analysis**: Get insights and trends from your financial documents

---

## 🌟 Key Features

<table>
<tr>
<td width="50%">

### 🔐 **Secure & Private**
- JWT-based authentication
- bcrypt password encryption
- Secure file upload to cloud
- GDPR compliant data handling

### 🧠 **AI-Powered Analysis**
- Advanced OCR text extraction
- Intelligent document categorization
- Key data point identification
- Financial pattern recognition

</td>
<td width="50%">

### 📊 **Modern Dashboard**
- Clean, intuitive interface
- Real-time document processing
- Advanced search & filtering
- Mobile-responsive design

### ⚡ **High Performance**
- Server-side rendering (SSR)
- Optimized image processing
- Efficient database queries
- Fast API responses

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

<div align="center">

### Frontend
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js) ![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react) ![TypeScript](https://img.shields.io/badge/TypeScript-4.9-3178C6?style=flat-square&logo=typescript) ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC?style=flat-square&logo=tailwind-css)

### Backend & Database
![Node.js](https://img.shields.io/badge/Node.js-18-339933?style=flat-square&logo=node.js) ![Prisma](https://img.shields.io/badge/Prisma-5.6-2D3748?style=flat-square&logo=prisma) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?style=flat-square&logo=postgresql)

### AI & Cloud Services
![Groq](https://img.shields.io/badge/Groq_API-FF6B35?style=flat-square) ![Tesseract](https://img.shields.io/badge/Tesseract.js-OCR-00ADD8?style=flat-square) ![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=flat-square&logo=cloudinary)

</div>

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database
- Cloudinary account (free tier available)
- Groq API key (optional - mock implementation included)

### 📦 Installation

```bash
# 1. Clone the repository
git clone https://github.com/aRyanDuTta425/FINDOCAIWEB.git
cd FINDOCAIWEB

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
```

### ⚙️ Environment Configuration

Create a `.env.local` file with the following variables:

```env
# 🗄️ Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/findocai"

# 🔐 Authentication
JWT_SECRET="your-super-secure-jwt-secret-key"

# ☁️ Cloudinary (File Storage)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# 🤖 AI Services
GROQ_API_KEY="your-groq-api-key"
```

### 🗄️ Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push database schema
npm run db:push

# (Optional) Open Prisma Studio to view data
npm run db:studio
```

### 🏃‍♂️ Run Development Server

```bash
npm run dev
```

🎉 **Success!** Open [http://localhost:3000](http://localhost:3000) to see your application.

---

## � Project Structure

```
📦 findocai/
├── 📂 app/                 # Next.js App Router
│   ├── 📂 api/            # API endpoints
│   ├── 📂 dashboard/      # Dashboard pages
│   ├── 📂 auth/           # Authentication pages
│   └── 📄 layout.tsx      # Root layout
├── 📂 components/         # Reusable UI components
│   ├── 📂 ui/            # Base UI components
│   ├── 📂 dashboard/     # Dashboard-specific components
│   └── 📂 auth/          # Authentication components
├── 📂 lib/               # Utility functions & configurations
│   ├── 📄 db.ts         # Database connection
│   ├── 📄 auth.ts       # Authentication utilities
│   └── 📄 ocr.ts        # OCR processing
├── 📂 prisma/            # Database schema & migrations
├── 📂 contexts/          # React Context providers
└── 📂 public/            # Static assets
```

---

## 🎯 Usage Guide

### 1. **Authentication**
- Create an account or sign in
- Secure JWT-based session management

### 2. **Document Upload**
```javascript
// Drag & drop or click to upload
Supported formats: PDF, JPG, PNG, JPEG
Max file size: 10MB
```

### 3. **AI Processing**
- **OCR Extraction**: Automatic text recognition
- **AI Analysis**: Smart categorization and data extraction
- **Results**: View extracted data and confidence scores

### 4. **Document Management**
- Browse all uploaded documents
- Search by content, type, or date
- Filter and sort options
- Export capabilities

---

## 🔧 Available Scripts

```bash
# 🏗️ Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# 🗄️ Database Management
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Create database migration
npm run db:studio    # Open Prisma Studio GUI
```

---

## 🔒 Security Features

- **🔐 Authentication**: JWT tokens with HTTP-only cookies
- **🛡️ Password Security**: bcrypt hashing with salt rounds
- **📁 File Validation**: Type and size restrictions
- **🌐 CORS Protection**: Configured for production
- **🔒 Environment Variables**: Secure credential management
- **🚫 SQL Injection**: Prisma ORM protection

---

## 📊 API Documentation

### Authentication Endpoints
```http
POST /api/auth/signup     # Create new account
POST /api/auth/login      # User login
POST /api/auth/logout     # User logout
GET  /api/auth/me         # Get current user
```

### Document Endpoints
```http
POST /api/upload          # Upload document
GET  /api/documents       # Get user documents
GET  /api/documents/[id]  # Get specific document
POST /api/ocr             # Process OCR
POST /api/analyze         # AI analysis
```

---

## 🌐 Deployment

### 🔥 Netlify (Recommended)

```bash
# 1. Build the project
npm run build

# 2. Deploy to Netlify
# - Connect your GitHub repository
# - Set environment variables in Netlify dashboard
# - Deploy automatically on git push
```

### 🐳 Docker Deployment

```dockerfile
# Use the official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
```

---

## 🤝 Contributing

We love contributions! Here's how you can help:

### 🐛 Found a Bug?
1. Check existing [issues](https://github.com/aRyanDuTta425/FINDOCAIWEB/issues)
2. Create a new issue with detailed reproduction steps
3. Include error messages and screenshots

### 💡 Have a Feature Idea?
1. Open a feature request issue
2. Describe the use case and benefits
3. Discuss implementation approach

### 🔧 Want to Contribute Code?
```bash
# 1. Fork the repository
# 2. Create a feature branch
git checkout -b feature/amazing-feature

# 3. Make your changes
# 4. Run tests and linting
npm run lint

# 5. Commit your changes
git commit -m "Add amazing feature"

# 6. Push and create a Pull Request
git push origin feature/amazing-feature
```

---

## �️ Roadmap

### 🔮 **Coming Soon**
- [ ] **Batch Processing**: Upload and process multiple documents
- [ ] **Advanced Analytics**: Financial trends and insights
- [ ] **Team Collaboration**: Share documents with team members
- [ ] **API Integrations**: QuickBooks, Xero, etc.
- [ ] **Mobile App**: iOS and Android applications

### 🚀 **Future Vision**
- [ ] **Machine Learning**: Custom model training
- [ ] **Real-time Collaboration**: Live document editing
- [ ] **Advanced Search**: Natural language queries
- [ ] **Workflow Automation**: Rule-based processing
- [ ] **Enterprise Features**: SSO, audit logs, compliance

---

## 📞 Support & Community

<div align="center">

### Need Help?

[![GitHub Issues](https://img.shields.io/badge/GitHub-Issues-red?style=for-the-badge&logo=github)](https://github.com/aRyanDuTta425/FINDOCAIWEB/issues)
[![Documentation](https://img.shields.io/badge/📚-Documentation-blue?style=for-the-badge)](#-documentation)
[![Discord](https://img.shields.io/badge/Discord-Community-purple?style=for-the-badge&logo=discord)](https://discord.gg/your-discord)

**Response Time**: Usually within 24 hours
**Support Hours**: Monday - Friday, 9 AM - 6 PM EST

</div>

---

## 📄 License

```
MIT License

Copyright (c) 2024 FinDocAI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

<div align="center">

### 🙏 Acknowledgments

Built with ❤️ by developers who believe in the power of AI to simplify financial workflows.

**Special Thanks To:**
- [Next.js Team](https://nextjs.org/) for the amazing framework
- [Vercel](https://vercel.com/) for deployment platform
- [Prisma](https://prisma.io/) for the excellent ORM
- [Groq](https://groq.com/) for lightning-fast AI inference

---

**⭐ Star this repository if you found it helpful!**

[![GitHub stars](https://img.shields.io/github/stars/aRyanDuTta425/FINDOCAIWEB?style=social)](https://github.com/aRyanDuTta425/FINDOCAIWEB/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/aRyanDuTta425/FINDOCAIWEB?style=social)](https://github.com/aRyanDuTta425/FINDOCAIWEB/network/members)

Made with 💻 and ☕ by [Aryan Dutta](https://github.com/aRyanDuTta425)

</div>
