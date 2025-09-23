# 🏭 Gajpati Industries

> A comprehensive web platform for Gajpati Industries built with modern full-stack architecture

![Project Status](https://img.shields.io/badge/Status-Active-brightgreen)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue)

## 🌟 Overview

Gajpati Industries is a modern web application designed to showcase and manage industrial operations. Built with a robust full-stack architecture featuring React frontend, Node.js backend, and comprehensive admin panel.

## 🚀 Features

- **Modern UI/UX** - Built with React 18 and TypeScript
- **Responsive Design** - Tailwind CSS with shadcn/ui components
- **Admin Panel** - Complete administrative interface
- **Authentication** - Secure JWT-based authentication
- **Email Integration** - SendGrid and Nodemailer support
- **File Management** - Cloudinary integration for media
- **Database** - MongoDB with Mongoose ODM
- **Real-time Features** - Interactive components and forms

## 🏗️ Architecture

```
gajpati/
├── 📁 frontend/          # React + TypeScript + Vite
├── 📁 backend/           # Node.js + Express API
└── 📁 admin/            # Admin panel interface
```

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful UI components
- **React Router** - Client-side routing
- **React Query** - Server state management

### Backend
- **Node.js** - JavaScript runtime
- **Express 5** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - Authentication tokens
- **Cloudinary** - Media management
- **SendGrid** - Email service

### Key Libraries
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons
- **React Hook Form** - Form management
- **Zod** - Schema validation

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/MishraAmit1/gajpati.git
   cd gajpati
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env  # Configure your environment variables
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

4. **Setup Admin Panel**
   ```bash
   cd ../admin
   npm install
   npm start
   ```

### Environment Variables

Create `.env` files in respective directories:

**Backend (.env)**
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
SENDGRID_API_KEY=your_sendgrid_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Gajpati Industries
```

## 📱 Screenshots

*Screenshots will be added soon*

## 🔧 Development

### Available Scripts

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

**Backend:**
- `npm run dev` - Start with nodemon
- `npm start` - Start production server

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Flauraa** - *Initial work*

## 🙏 Acknowledgments

- Built for Gajpati Industries
- Powered by modern web technologies
- Designed with user experience in mind

---

⭐ Star this repository if you find it helpful!