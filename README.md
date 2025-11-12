# 📚 StudyNotion - EdTech Platform

A full-stack educational technology platform built with the MERN stack, enabling instructors to create and sell courses while students can discover and learn from quality educational content.

![StudyNotion Banner](https://img.shields.io/badge/MERN-Stack-green) ![License](https://img.shields.io/badge/license-MIT-blue) ![Status](https://img.shields.io/badge/status-active-success)

## 🌟 Features

### For Students
- 🔍 **Course Discovery**: Browse and search through various course categories
- 🛒 **Shopping Cart**: Add multiple courses and checkout seamlessly
- 💳 **Secure Payments**: Integrated Razorpay payment gateway
- 📊 **Progress Tracking**: Monitor your learning progress for each course
- ⭐ **Reviews & Ratings**: Rate and review courses you've completed
- 👤 **Profile Management**: Update your profile, view enrolled courses

### For Instructors
- 📝 **Course Creation**: Create comprehensive courses with sections and subsections
- 🎥 **Video Upload**: Upload video lectures with Cloudinary integration
- 📈 **Course Management**: Edit, publish, or unpublish courses
- 💰 **Revenue Dashboard**: Track your earnings from course sales
- 📊 **Analytics**: View course enrollment statistics

### For Admins
- 🏷️ **Category Management**: Create and manage course categories
- 👥 **User Management**: Monitor and manage platform users
- 📊 **Platform Analytics**: Comprehensive dashboard with platform metrics

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library
- **Redux Toolkit** - State management
- **React Router v6** - Navigation
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Hook Form** - Form handling
- **React Dropzone** - File uploads
- **React Hot Toast** - Notifications
- **Swiper** - Carousel component
- **Video React** - Video player

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Email service
- **Cloudinary** - Media storage
- **Razorpay** - Payment gateway
- **OTP-Generator** - OTP generation

### Deployment
- **Vercel** - Frontend hosting
- **Render** - Backend hosting
- **MongoDB Atlas** - Database hosting
- **Cloudinary** - Media CDN

## 📁 Project Structure

```
StudyNotion/
├── public/                    # Static files
├── src/                       # React source code
│   ├── assets/               # Images and media
│   ├── components/           # React components
│   │   ├── common/          # Shared components
│   │   ├── ContactPage/     # Contact page components
│   │   └── core/            # Core feature components
│   ├── data/                # Static data files
│   ├── hooks/               # Custom React hooks
│   ├── pages/               # Page components
│   ├── reducer/             # Redux reducers
│   ├── services/            # API services
│   ├── slices/              # Redux slices
│   └── utils/               # Utility functions
├── Server/                   # Backend code
│   ├── config/              # Configuration files
│   ├── controllers/         # Route controllers
│   ├── mail/                # Email templates
│   ├── middlewares/         # Express middlewares
│   ├── models/              # Mongoose models
│   ├── routes/              # API routes
│   └── utils/               # Utility functions
└── package.json             # Dependencies
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn
- Cloudinary account
- Razorpay account

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Janmenjay30/EduNotion.git
cd StudyNotion
```

2. **Install frontend dependencies**
```bash
npm install
```

3. **Install backend dependencies**
```bash
cd Server
npm install
cd ..
```

4. **Configure environment variables**

Create a `.env` file in the `Server` directory:
```env
# Database
MONGODB_URL=your_mongodb_connection_string

# JWT Secret
JWT_SECRET=your_jwt_secret

# Cloudinary
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret

# Razorpay
RAZORPAY_KEY=your_razorpay_key
RAZORPAY_SECRET=your_razorpay_secret

# Email
MAIL_HOST=smtp.gmail.com
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password

# Server
PORT=4000
```

Create a `.env` file in the root directory:
```env
REACT_APP_BASE_URL=http://localhost:4000/api/v1
```

5. **Run the application**

**Development mode (runs both frontend and backend concurrently):**
```bash
npm run dev
```

**Or run separately:**

Frontend:
```bash
npm start
```

Backend:
```bash
cd Server
npm start
```

6. **Access the application**
- Frontend: http://localhost:3000
- Backend: http://localhost:4000

## 📦 Deployment

### Frontend (Vercel)

1. Push your code to GitHub
2. Import project in Vercel
3. Configure environment variables:
   - `REACT_APP_BASE_URL`: Your deployed backend URL
4. Deploy

### Backend (Render)

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure:
   - Root Directory: `Server`
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Add environment variables from your `.env` file
5. Deploy

## 🔑 Key Features Implementation

### Authentication Flow
- JWT-based authentication
- Email verification with OTP
- Password reset functionality
- Protected routes with middleware

### Payment Integration
- Razorpay payment gateway integration
- Secure payment processing
- Payment verification
- Order management

### File Upload
- Cloudinary integration for media storage
- Support for images and videos
- Optimized media delivery through CDN

### Email Service
- Automated email templates
- Course enrollment confirmations
- Password reset emails
- Email verification

## 📸 Screenshots

*Add screenshots of your application here*

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Janmenjay**
- GitHub: [@Janmenjay30](https://github.com/Janmenjay30)
- Project Repository: [EduNotion](https://github.com/Janmenjay30/EduNotion)

## 🙏 Acknowledgments

- Icons and illustrations from various sources
- Inspiration from modern EdTech platforms
- Community support and feedback

## 📞 Contact

For any queries or support, please reach out through GitHub issues.

---

⭐ **Star this repository if you find it helpful!**
