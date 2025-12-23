# Task Tracker 📋

A modern, full-featured task management application built with React and Appwrite. Collaborate with your team, assign tasks, track deadlines, and stay organized with real-time updates.

## ✨ Features

- 🔐 **Secure Authentication**
  - Email/Password login with verification
  - Google OAuth2 integration
  - Password recovery
  - Secure session management

- 📝 **Task Management**
  - Create, edit, and delete tasks
  - Assign tasks to team members
  - Set priority levels and deadlines
  - Track task status (Pending, In Progress, Completed, Cancelled)

- 🔄 **Real-time Features**
  - Live task updates across all users
  - Real-time notifications for deadlines
  - Instant status synchronization
  - Collaborative task tracking

- 🔔 **Smart Notifications**
  - Due today alerts
  - Upcoming deadline warnings
  - Overdue task notifications
  - User-specific filtering

- 👥 **Team Collaboration**
  - User directory
  - Task assignment to team members
  - View tasks by assignee
  - See task creator information

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- npm or yarn
- Appwrite Cloud account

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/task-tracker.git
cd task-tracker-2

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

## 🌐 Deployment

Deploy to **Appwrite Sites** for free hosting:

```bash
# Install Appwrite CLI
npm install -g appwrite

# Login to Appwrite
appwrite login

# Deploy your app
appwrite deploy web
```

Your app will be live at: `https://yourproject.appwrite.io`

See [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) for detailed deployment instructions.

## 🏗️ Technology Stack

- **Frontend**: React 18 + Vite
- **Backend**: Appwrite (BaaS)
- **Database**: Appwrite Databases
- **Authentication**: Email/Password + Google OAuth
- **Hosting**: Appwrite Sites
- **Real-time**: Appwrite Real-time API

## 📁 Project Structure

```
src/
├── components/         # React components
├── lib/
│   ├── appwrite.js    # Appwrite configuration
│   └── context/       # React contexts (User, Tasks)
├── pages/             # Page components
├── hooks/             # Custom React hooks
├── App.jsx            # Main component
└── main.jsx           # Entry point
```

## 🔐 Authentication

### Register & Verify Email
1. Sign up with email and password
2. Verify email via link sent to inbox
3. Login with verified credentials

### Google OAuth
Click "Login with Google" for instant access.

### Password Recovery
Use "Forgot Password?" to reset your password.

## 📊 Database Schema

### Tasks
- Title, description, deadline
- Priority (1-5)
- Status (Pending, In Progress, Completed, Cancelled)
- Assigned to user
- Created by user

### Users
- Email and name
- Email verification status
- Session management via Appwrite

## 🧪 Testing

Test the application locally:

```bash
npm run dev
```

Then register, create tasks, and test all features including real-time updates.

## 📚 Documentation

- [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) - Complete project overview
- [Appwrite Docs](https://appwrite.io/docs) - Appwrite documentation
- [React Docs](https://react.dev) - React documentation
- [Vite Guide](https://vitejs.dev) - Vite documentation

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is open source and available under the MIT License.

## 🆘 Support

- 📖 **Documentation**: See [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)
- 🐛 **Issues**: Open an issue on GitHub
- 💬 **Community**: Join [Appwrite Discord](https://discord.gg/appwrite)

## 🎓 Learn More

- [React Tutorial](https://react.dev/learn)
- [Appwrite Getting Started](https://appwrite.io/docs/quick-start)
- [Vite Documentation](https://vitejs.dev/guide/)

---

Built with ❤️ as a complete task management solution.
