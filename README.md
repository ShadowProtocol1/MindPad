# Note Taking Application

A full-stack note-taking application built with React and Express.js, featuring user authentication, real-time note management, and a responsive design.

## Features

### Authentication System
- **User Registration**: Secure account creation with email verification
- **Login/Logout**: JWT-based authentication
- **OTP Verification**: Email-based verification system
- **Profile Management**: Update user information, change passwords, delete accounts

### Note Management
- **Create Notes**: Rich note creation with title, content, and tags
- **Edit Notes**: In-place editing with modal interface
- **Delete Notes**: Secure note deletion with confirmation
- **View Notes**: Full-screen note viewing for better readability
- **Search Notes**: Server-side search functionality across titles and content
- **Responsive Grid**: Adaptive note display for different screen sizes

### User Interface
- **Modern Design**: Clean, intuitive interface using Tailwind CSS
- **Responsive Layout**: Optimized for desktop, tablet, and mobile devices
- **Interactive Elements**: Smooth animations and hover effects
- **Modal System**: Reusable modal components for various actions
- **Toast Notifications**: Real-time feedback for user actions

## Tech Stack

### Frontend
- **React 19.1.0**: Modern React with latest features
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icon library
- **React Hot Toast**: Elegant toast notifications
- **Framer Motion**: Smooth animations
- **React Router DOM**: Client-side routing
- **Axios**: HTTP client for API requests

### Backend
- **Express.js 5.1.0**: Web application framework
- **MongoDB**: NoSQL database with Mongoose ODM
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing
- **Nodemailer**: Email sending functionality
- **CORS**: Cross-Origin Resource Sharing
- **Express Rate Limit**: API rate limiting
- **Express Validator**: Input validation

## Project Structure

```
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── ui/        # Reusable UI components
│   │   │   ├── Auth/      # Authentication components
│   │   │   └── Notes/     # Note management components
│   │   ├── contexts/      # React contexts
│   │   ├── services/      # API services
│   │   └── styles/        # CSS files
│   ├── package.json
│   └── vite.config.js
│
├── server/                # Express backend
│   ├── config/           # Configuration files
│   ├── middleware/       # Express middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   ├── index.js         # Server entry point
│   └── package.json
│
├── .gitignore
└── README.md
```

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 18.0 or higher)
- **npm** (version 8.0 or higher)
- **MongoDB** (version 4.4 or higher)

## Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd note-taking-app
```

### 2. Environment Variables

Create a `.env` file in the `server` directory with the following variables:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/notes-app

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# Email Configuration (for OTP)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Server Configuration
PORT=5000
NODE_ENV=development

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173
```

Create a `.env` file in the `client` directory with the following variables:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Install Dependencies

#### Install Backend Dependencies
```bash
cd server
npm install
```

#### Install Frontend Dependencies
```bash
cd client
npm install
```

## Running the Application

### Method 1: Run Both Services Separately

#### 1. Start the Backend Server
```bash
cd server
npm start
```
The server will run on `http://localhost:5000`

#### 2. Start the Frontend Development Server
```bash
cd client
npm run dev
```
The client will run on `http://localhost:5173`

## Building for Production

### Build the Frontend
```bash
cd client
npm run build
```

### Deploy the Backend
```bash
cd server
npm run start
```

## API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User login
- `POST /verify-otp` - OTP verification
- `POST /resend-otp` - Resend OTP
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `POST /change-password` - Change password
- `DELETE /delete-account` - Delete user account
- `GET /debug` - Debug user information (development only)

### Note Routes (`/api/notes`)
- `GET /` - Get all user notes (with optional search)
- `POST /` - Create a new note
- `GET /:id` - Get specific note
- `PUT /:id` - Update note
- `DELETE /:id` - Delete note

## Key Features Explained

### Search Functionality
- Server-side search implementation for better performance
- Searches across note titles and content
- Case-insensitive search using MongoDB regex
- Debounced input to reduce API calls

### Profile Management
- Comprehensive user profile page
- Email field protection (non-editable for security)
- Password change with current password verification
- Account deletion with confirmation process

### Note Viewing
- Click any note card to view full content
- Modal-based viewing for better user experience
- Formatted content display with proper line breaks
- Tag display and timestamp information

### Responsive Design
- Mobile-first approach using Tailwind CSS
- Adaptive layouts for different screen sizes
- Touch-friendly interface elements
- Consistent experience across devices

## Development Guidelines

### Code Organization
- Component-based architecture
- Separation of concerns between UI and business logic
- Reusable UI components in `client/src/components/ui/`
- API services centralized in `client/src/services/`

### State Management
- React Context for authentication state
- Local state for component-specific data
- Proper error handling and loading states

### Security Features
- JWT token-based authentication
- Password hashing with bcryptjs
- Input validation on both client and server
- CORS configuration for secure cross-origin requests
- Rate limiting to prevent abuse

## Troubleshooting

### Common Issues

1. **MongoDB Connection Issues**
   - Ensure MongoDB is running on your system
   - Check the `MONGODB_URI` in your `.env` file
   - Verify database permissions

2. **Email OTP Not Working**
   - Check email configuration in `.env`
   - Ensure app password is used for Gmail
   - Verify email service settings

3. **Frontend Not Loading**
   - Ensure backend server is running first
   - Check if all dependencies are installed
   - Clear browser cache and try again

4. **Authentication Issues**
   - Verify JWT secret is set correctly
   - Check token expiration settings
   - Clear localStorage and try logging in again

### Development Tips

- Use browser developer tools for debugging
- Check server logs for backend issues
- Utilize React Developer Tools for component debugging
- Monitor network requests in browser dev tools

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE)

## Support

For support and questions, please open an issue in the repository or contact the development team.

---

**Note**: This application is designed for educational and development purposes. For production deployment, additional security measures and optimizations should be implemented.
