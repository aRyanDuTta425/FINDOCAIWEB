# FinDocAI - Financial Document Intelligence Platform

A full-stack AI-powered financial document processing and analysis platform built with Next.js, TypeScript, and modern web technologies.

## 🚀 Features

- **🔐 Secure Authentication**: JWT-based user authentication with bcrypt password hashing
- **☁️ Cloud File Upload**: Drag-and-drop file upload with Cloudinary integration
- **📄 OCR Processing**: Extract text from images and PDFs using Tesseract.js
- **🧠 AI Analysis**: Intelligent document analysis using Gemini API for:
  - Invoice extraction (amount, due date, vendor, etc.)
  - Bank statement parsing (transactions, balances)
  - Tax document categorization
- **📊 Modern Dashboard**: Clean, responsive interface with document management
- **🔍 Search & Filter**: Find documents by type, date, or content
- **📱 Mobile Responsive**: Works seamlessly on all devices

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icons
- **React Hook Form** - Form management
- **React Dropzone** - File upload interface

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Prisma ORM** - Database management
- **PostgreSQL** - Primary database
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

### AI & Cloud Services
- **Tesseract.js** - OCR text extraction
- **Gemini API** - AI document analysis
- **Cloudinary** - File storage and management

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd findocai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your credentials:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/findocai?schema=public"
   
   # JWT Secret
   JWT_SECRET="your-super-secret-jwt-key"
   
   # Cloudinary
   CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
   CLOUDINARY_API_KEY="your-cloudinary-api-key"
   CLOUDINARY_API_SECRET="your-cloudinary-api-secret"
   
   # Gemini API
   GEMINI_API_KEY="your-gemini-api-key"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗄️ Database Schema

The application uses the following main models:

- **User**: User authentication and profile
- **Document**: File metadata and relationships
- **OCRData**: Extracted text content and confidence scores
- **AnalysisResult**: AI analysis results with document-specific fields

## 🔧 Configuration

### Database Setup
1. Install PostgreSQL locally or use a cloud provider
2. Create a new database named `findocai`
3. Update the `DATABASE_URL` in your `.env.local` file

### Cloudinary Setup
1. Create a free account at [Cloudinary](https://cloudinary.com/)
2. Get your cloud name, API key, and API secret from the dashboard
3. Update the Cloudinary variables in `.env.local`

### Gemini API Setup
1. Get a Gemini API key from Google AI Studio
2. Update `GEMINI_API_KEY` in `.env.local`
3. (Optional) The app includes a mock implementation if you don't have an API key

## 📱 Usage

1. **Sign Up/Login**: Create an account or log in to access the dashboard
2. **Upload Documents**: Drag and drop financial documents (images or PDFs)
3. **Extract Text**: Use OCR to extract text content from documents
4. **Analyze Documents**: Get AI-powered insights and categorization
5. **View Results**: Browse analysis results, search, and filter documents

## 🧪 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema changes
npm run db:migrate   # Create and run migrations
npm run db:studio    # Open Prisma Studio
```

### Project Structure

```
findocai/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard page
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   └── globals.css        # Global styles
├── components/            # React components
├── contexts/              # React contexts
├── lib/                   # Utility functions
├── prisma/                # Database schema
└── public/                # Static assets
```

## 🔒 Security Features

- JWT-based authentication with HTTP-only cookies
- bcrypt password hashing with salt rounds
- File type validation and size limits
- Secure file upload to Cloudinary
- Environment variable protection

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on git push

### Manual Deployment
1. Build the application: `npm run build`
2. Set up production database
3. Configure environment variables
4. Deploy to your hosting provider

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [documentation](README.md)
2. Search existing [issues](issues)
3. Create a new issue with detailed information

## 🎯 Roadmap

- [ ] Batch document processing
- [ ] Advanced search with filters
- [ ] Export functionality (PDF, Excel)
- [ ] Team collaboration features
- [ ] API integrations (QuickBooks, etc.)
- [ ] Mobile app
- [ ] Advanced analytics dashboard

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.
