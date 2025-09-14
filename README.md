# 📚 The BookKeeper

A modern, professional book tracking and discovery application built with React and Firebase. Track your reading journey, discover new books, and manage your personal library with ease.

![The BookKeeper](https://img.shields.io/badge/Status-Production%20Ready-green)
![React](https://img.shields.io/badge/React-19.0.0-blue)
![Firebase](https://img.shields.io/badge/Firebase-11.4.0-orange)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.3.5-blue)

## ✨ Features

- 🔐 **Secure Authentication** - Google OAuth integration with Firebase Auth
- 📖 **Book Discovery** - Browse books by genre with Google Books API integration
- 📚 **Personal Bookshelf** - Track books you've read, want to read, and are currently reading
- 🔍 **Advanced Search** - Find books by title, author, or genre
- 📱 **Responsive Design** - Beautiful UI that works on all devices
- ⚡ **Fast Performance** - Optimized with caching and modern React patterns
- 🎨 **Modern UI/UX** - Professional design with smooth animations

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Firebase project with Authentication and Firestore enabled
- Google Books API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/theBookKeeper.git
   cd theBookKeeper
   ```

2. **Install frontend dependencies**
   ```bash
   cd theBookKeeper
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd functions
   npm install
   ```

4. **Environment Setup**
   
   Create `.env` file in the `theBookKeeper` directory:
   ```env
   VITE_API_KEY=your_firebase_api_key
   VITE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_PROJECT_ID=your_project_id
   VITE_STORAGE_BUCKET=your_project.appspot.com
   VITE_MESSAGING_SENDER_ID=your_sender_id
   VITE_APP_ID=your_app_id
   VITE_MEASUREMENT_ID=your_measurement_id
   VITE_DATABASE_URL=https://your_project.firebaseio.com
   VITE_GOOGLE_BOOKS_API_KEY=your_google_books_api_key
   VITE_API_URL=your_firebase_functions_url
   ```

5. **Start Development Server**
   ```bash
   cd theBookKeeper
   npm run dev
   ```

6. **Deploy Backend Functions** (Optional)
   ```bash
   cd functions
   firebase deploy --only functions
   ```

## 🏗️ Project Structure

```
theBookKeeper/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── bookShelf/      # Bookshelf-specific components
│   │   ├── ErrorBoundary.jsx
│   │   ├── LoadScreen.jsx
│   │   └── ...
│   ├── contexts/           # React contexts
│   │   └── AuthContext.jsx
│   ├── pages/              # Main application pages
│   │   ├── Dashboard.jsx
│   │   ├── BookShelf.jsx
│   │   ├── Profile.jsx
│   │   └── ...
│   ├── firebase.js         # Firebase configuration
│   └── App.jsx            # Main application component
├── functions/              # Firebase Cloud Functions
│   ├── controllers/        # API controllers
│   ├── routes/            # API routes
│   ├── firebase.js        # Firebase Admin SDK
│   └── index.js           # Main functions file
└── public/                # Static assets
```

## 🛠️ Technology Stack

### Frontend
- **React 19** - Modern React with hooks and context
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **React Icons** - Beautiful icon library
- **Axios** - HTTP client for API requests
- **React Helmet Async** - SEO and meta tag management

### Backend
- **Firebase Functions** - Serverless backend
- **Express.js** - Web framework
- **Firebase Admin SDK** - Server-side Firebase integration
- **CORS** - Cross-origin resource sharing

### External APIs
- **Google Books API** - Book data and search
- **Firebase Auth** - User authentication
- **Firestore** - NoSQL database

## 🎨 Design System

The application uses a modern, professional design system with:

- **Color Palette**: Slate, blue, and indigo gradients
- **Typography**: Clean, readable fonts with proper hierarchy
- **Components**: Consistent, reusable UI components
- **Animations**: Smooth transitions and micro-interactions
- **Responsive**: Mobile-first design approach

## 🔧 Development

### Available Scripts

```bash
# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint

# Backend
npm run serve        # Start Firebase emulator
npm run deploy       # Deploy to Firebase
npm run logs         # View function logs
```

### Code Quality

- **ESLint** - Code linting and formatting
- **Error Boundaries** - Graceful error handling
- **TypeScript** - Type safety (optional)
- **JSDoc** - API documentation

## 🚀 Deployment

### Frontend (Vercel/Netlify)
1. Connect your repository
2. Set environment variables
3. Deploy automatically on push

### Backend (Firebase)
```bash
cd functions
firebase deploy --only functions
```

## 📱 Features in Detail

### Authentication
- Google OAuth integration
- Secure token management
- User session persistence
- Automatic logout on token expiry

### Book Management
- Genre-based book discovery
- Advanced search functionality
- Personal bookshelf organization
- Reading progress tracking

### User Experience
- Responsive design for all devices
- Smooth animations and transitions
- Professional loading states
- Comprehensive error handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Jacob Ols**
- GitHub: [@jacobols](https://github.com/jacobols)
- Email: jacob@example.com

## 🙏 Acknowledgments

- Google Books API for book data
- Firebase for backend services
- React community for excellent documentation
- Tailwind CSS for the design system

---

Made with ❤️ by Jacob Ols