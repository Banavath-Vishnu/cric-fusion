# 🏏 Cric Fusion

**Cric Fusion** is a dynamic full-stack MERN application that combines live cricket scores, blogging features, and real-time chat during matches. This platform is built for cricket enthusiasts who want to follow live updates, engage in passionate discussions, and share their thoughts through blogs.

---

## 🚀 Features

### 🏏 Live Cricket Scores
- Real-time display of live cricket matches and scores using a cricket API.
- Match statistics including teams, runs, overs, wickets, and player performances.

### ✍️ Blog Section
- Create, read, update, and delete blogs related to cricket matches, players, and opinions.
- Like/Dislike system for blogs.
- Commenting system with support for comment likes.

### 🔒 User Authentication
- Sign up / Sign in with JWT.
- Google OAuth for quick social login.
- Role-based access: Users and Admins.

### 💬 Live Match Chat
- Real-time chat room enabled during live matches.
- Users can join the chat to discuss the ongoing game.
- Messages are displayed instantly using Socket.io (or Firebase Realtime DB).

### 🛠 Admin Panel
- Manage all posts and comments.
- View detailed stats (likes/dislikes, post activity).
- Moderate live chat messages.

---

## 🧰 Tech Stack

### Frontend
- **React.js**
- **Axios**
- **Flowbite** for modern UI components
- **Firebase** (for real-time chat or notifications)

### Backend
- **Node.js**, **Express.js**
- **MongoDB** (with Mongoose)
- **JWT** for session management
- **Google OAuth**
- **Swagger** for API documentation
- **Socket.io** (if used for chat)

### Dev Tools
- **ESLint**, **Nodemon**, **Git**

---

## 📦 Installation

### Prerequisites
- Node.js (>=14.x)
- MongoDB (local or Atlas)
- Git

### Clone the Repository
```bash
git clone https://github.com/your-username/cric-fusion.git
cd cric-fusion
```

### Install Dependencies

#### Backend
```bash
npm install
```

#### Frontend
```bash
cd client
npm install
```

---

## 🔧 Environment Variables

### Backend `.env`
```
MONGO=mongodb+srv://<username>:<password>@cluster.mongodb.net/cric-fusion
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CRICKET_API_KEY=your_cricket_api_key
```

### Frontend `.env`
```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## 🏁 Running the App

### Backend
```bash
npm run dev
# Runs on http://localhost:3000
```

### Frontend
```bash
cd client
npm run dev
# Runs on http://localhost:5173
```

---

## 📁 API Documentation

The entire backend is documented using Swagger.  
To view API docs:

```bash
Visit http://localhost:3000/api-docs
```

---

## 🧑‍💻 Contributing

1. Fork this repository.
2. Create a branch: `git checkout -b feature-branch`.
3. Make your changes and commit: `git commit -m "Added feature"`.
4. Push to the branch: `git push origin feature-branch`.
5. Open a Pull Request.

---

## 📜 License

This project is open-source and available under the MIT License.

---
