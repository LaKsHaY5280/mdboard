# Notes Management Dashboard (MDboard)

A modern, full-stack notes management application built with Next.js 15, React 19, and MongoDB. Perfect for organizing personal notes, project documentation, and collaborative workspaces.

![Next.js](https://img.shields.io/badge/Next.js-15-black) ![React](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![MongoDB](https://img.shields.io/badge/MongoDB-6-green) ![Prisma](https://img.shields.io/badge/Prisma-6-blueviolet)

## ✨ Features

### 🔐 Authentication & Security
- **Secure JWT Authentication** with HTTP-only cookies
- **Password Security** with bcrypt hashing (12 salt rounds)
- **Profile Management** with bio, interests, and avatar support
- **Account Security** with password change and account deletion

### 📝 Notes Management
- **Rich Text Notes** with title, content, and metadata
- **Advanced Organization** with categories, tags, and workspaces
- **Priority System** (Low, Medium, High, Urgent)
- **Due Dates** with deadline tracking
- **Pin Important Notes** for quick access
- **Archive System** for completed notes

### 🎯 Advanced Features
- **Bulk Operations** for managing multiple notes
- **Smart Search** across all note content
- **Workspace Organization** for project-based grouping
- **Responsive Design** optimized for mobile and desktop
- **Real-time Updates** with optimistic UI
- **Dark/Light Theme** support

### 🚀 Technical Excellence
- **Modern Stack** with Next.js 15 App Router
- **Type Safety** with TypeScript throughout
- **Database ORM** with Prisma and MongoDB
- **UI Components** with shadcn/ui and Radix UI
- **Form Handling** with React Hook Form and Zod validation
- **Styling** with Tailwind CSS

## 🛠️ Tech Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **Next.js** | Full-stack React framework | 15.5.4 |
| **React** | Frontend library | 19.1.0 |
| **TypeScript** | Type safety | 5+ |
| **MongoDB** | NoSQL database | - |
| **Prisma** | Database ORM | 6.16.3 |
| **Tailwind CSS** | Utility-first CSS | 4+ |
| **shadcn/ui** | UI component library | Latest |
| **React Hook Form** | Form management | 7.63.0 |
| **Zod** | Schema validation | 4.1.11 |
| **JWT (jose)** | Authentication tokens | 6.1.0 |
| **bcryptjs** | Password hashing | 3.0.2 |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- MongoDB database (local or MongoDB Atlas)
- pnpm (recommended) or npm

### 1. Clone & Install

```bash
git clone https://github.com/LaKsHaY5280/mdboard.git
cd mdboard
pnpm install
```

### 2. Environment Setup

Copy the example environment file and configure your settings:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual values:

```env
# Database Configuration
DATABASE_URL="mongodb://localhost:27017/mdboard"
# or for MongoDB Atlas:
# DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/mdboard"

# JWT Secret (minimum 32 characters)
JWT_SECRET="your-super-secret-jwt-key-minimum-32-characters-long"

# Environment
NODE_ENV="development"
```

**💡 Tip:** Generate a secure JWT secret using:
```bash
openssl rand -base64 32
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate
```

### 4. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### 5. Demo Login

Use these credentials to explore the application:

```
Email: demo@notesapp.com
Password: Demo123!
```

The demo account includes 11 sample notes across 4 workspaces to showcase all features.

## 📖 Documentation

### 📚 Comprehensive Guides

- **[API Documentation](./API_DOCUMENTATION.md)** - Complete API reference with examples
- **[Production Scaling Guide](./PRODUCTION_SCALING_GUIDE.md)** - Enterprise architecture strategy

### 🔗 Quick References

- **[API Quick Reference](./API_QUICK_REFERENCE.md)** - Developer cheat sheet
- **[Demo Guide](./DEMO_GUIDE.md)** - Feature showcase for presentations
- **[Postman Collection](./postman_collection.json)** - Import for API testing

## 🏗️ Project Structure

```
mdboard/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts               # Demo data seeding
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   │   ├── auth/         # Authentication endpoints
│   │   │   └── notes/        # Notes management
│   │   ├── globals.css       # Global styles
│   │   ├── layout.tsx        # Root layout
│   │   └── page.tsx          # Home page
│   ├── components/
│   │   └── ui/               # shadcn/ui components
│   ├── hooks/
│   │   └── use-mobile.ts     # Custom React hooks
│   └── lib/
│       ├── utils.ts          # Utility functions
│       ├── prisma.ts         # Database client
│       └── jwt.ts            # JWT utilities
├── API_DOCUMENTATION.md      # Complete API docs
├── PRODUCTION_SCALING_GUIDE.md # Scaling strategy
└── package.json
```

## 🔧 Available Scripts

```bash
# Development
pnpm dev                    # Start development server with Turbopack
pnpm build                  # Build for production
pnpm start                  # Start production server

# Database
pnpm db:seed               # Populate with demo data
pnpm db:reset              # Reset database and reseed

# Prisma
npx prisma generate        # Generate Prisma client
npx prisma studio          # Open Prisma Studio
npx prisma db push         # Push schema changes
```

## 🌟 Key Features Demo

### Authentication System
- Secure JWT-based authentication
- Profile management with custom fields
- Password strength requirements
- HTTP-only cookie security

### Notes Management
- Create, read, update, delete notes
- Rich metadata (tags, categories, priorities)
- Workspace organization
- Archive and pin functionality

### Advanced Operations
- Bulk operations for multiple notes
- Search across all content
- Filter by workspace, category, tags
- Date-based organization

### User Experience
- Responsive design for all devices
- Dark/light theme toggle
- Optimistic UI updates
- Form validation with helpful errors

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Environment Variables**: Add your `.env` variables in Vercel dashboard
3. **Deploy**: Automatic deployment on every push to main branch

### Environment Variables for Production

```env
DATABASE_URL="your-mongodb-atlas-connection-string"
JWT_SECRET="your-production-jwt-secret-min-32-chars"
NODE_ENV="production"
```

### Manual Deployment

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

## 🧪 API Testing

### Using the Demo Account

1. **Register/Login**: Use demo credentials or create new account
2. **Explore Notes**: Browse the 11 sample notes in 4 workspaces
3. **Test Features**: Try creating, editing, archiving, and deleting notes
4. **Bulk Operations**: Select multiple notes for batch actions

### Postman Collection

Import the provided `postman_collection.json` for complete API testing with:
- Pre-configured endpoints
- Sample request bodies
- Authentication setup
- Environment variables

## 🔒 Security Features

- **Password Hashing**: bcrypt with 12 salt rounds
- **JWT Tokens**: Secure, HTTP-only cookies with 24h expiration
- **Input Validation**: Zod schemas for all API inputs
- **SQL Injection Protection**: Prisma ORM prevents injection attacks
- **XSS Prevention**: HTTP-only cookies and input sanitization
- **CSRF Protection**: SameSite cookie configuration

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface
- **Responsive Layout**: Optimized for mobile, tablet, and desktop
- **Accessibility**: ARIA labels and keyboard navigation
- **Theme Support**: Dark and light mode toggle
- **Loading States**: Skeleton loaders and loading indicators
- **Error Handling**: User-friendly error messages
- **Toast Notifications**: Success and error feedback

## 📊 Performance

- **Fast Loading**: Next.js 15 with App Router optimization
- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js built-in image optimization
- **Caching**: Efficient database query caching
- **Bundle Size**: Optimized production builds

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use the existing component patterns
- Write meaningful commit messages
- Test your changes thoroughly
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework
- **Vercel** for hosting and deployment platform
- **shadcn** for the beautiful UI components
- **Prisma Team** for the excellent ORM
- **MongoDB** for the flexible database solution

## 📞 Support

- 📧 Email: support@mdboard.com
- 🐛 Issues: [GitHub Issues](https://github.com/LaKsHaY5280/mdboard/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/LaKsHaY5280/mdboard/discussions)

---

**Built with ❤️ by [LaKsHaY5280](https://github.com/LaKsHaY5280)**

*MDboard - Where productivity meets simplicity*
