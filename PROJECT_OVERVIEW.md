# Task Tracker - Project Overview

A modern, full-featured task management application built with React and Appwrite, designed for teams to collaborate on task assignments and tracking.

---

## 📋 Project Summary

**Task Tracker** is a web-based task management system that allows users to:
- Create, assign, and manage tasks
- Track task deadlines and priorities
- Receive real-time notifications
- Collaborate with team members
- Secure authentication with email verification
- Social login via Google OAuth

---

## 🎯 Key Features

### 1. **User Authentication**
- Email/Password registration and login
- Mandatory email verification before access
- Google OAuth2 integration for quick login
- Secure session management
- Password recovery functionality

### 2. **Task Management**
- Create tasks with title, description, and deadline
- Assign tasks to team members
- Set task priority levels (Low, Normal, Medium, High, Critical)
- Track task status (Pending, In Progress, Completed, Cancelled)
- View all tasks or filter by assignee

### 3. **Real-time Features**
- Live task updates across all users
- Real-time notifications for upcoming deadlines
- Instant task status changes
- Real-time task list synchronization

### 4. **Notifications & Alerts**
- Due today notifications
- Upcoming deadline warnings (within 7 days)
- Overdue task alerts
- User-specific task filtering
- Dismissible notification system

### 5. **Team Collaboration**
- User directory with email addresses
- Task assignment to specific team members
- View tasks assigned to you
- See who created each task
- Collaborative task tracking

---

## 🏗️ Technology Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **JavaScript/JSX** - Language and templating
- **CSS3** - Styling with inline styles

### Backend
- **Appwrite** - BaaS (Backend as a Service)
  - User authentication
  - Database (collections)
  - Real-time API
  - File storage
  - Email service

### Deployment
- **Appwrite Sites** - Static hosting
- **GitHub** - Version control and auto-deploy
- **Free Domain** - *.appwrite.io

---

## 📁 Project Structure

```
task-tracker-2/
├── src/
│   ├── components/
│   │   ├── TaskNotifications.jsx      # Notification bar component
│   │   └── TaskNotificationSummary.jsx # Notification summary
│   ├── lib/
│   │   ├── appwrite.js               # Appwrite client config
│   │   └── context/
│   │       ├── user.jsx              # User auth context
│   │       └── tasks.jsx             # Tasks context with real-time
│   ├── pages/
│   │   ├── NewLogin.jsx              # Login/register page
│   │   ├── Dashboard.jsx             # Main dashboard
│   │   ├── TaskList.jsx              # Task list view
│   │   ├── TaskDetail.jsx            # Task detail & edit
│   │   ├── EmailVerification.jsx     # Email verification
│   │   └── VerifyEmail.jsx           # Verification link handler
│   ├── hooks/
│   │   └── useUserResolver.jsx       # User name resolver
│   ├── App.jsx                       # Main app component
│   ├── main.jsx                      # Entry point
│   └── index.css                     # Global styles
├── public/
│   └── vite.svg                      # Vite logo
├── dist/                             # Build output (generated)
├── package.json                      # Dependencies
├── vite.config.js                    # Vite configuration
├── eslint.config.js                  # ESLint configuration
├── index.html                        # HTML template
└── PROJECT_OVERVIEW.md               # This file
```

---

## 🔐 Authentication Flow

### Email/Password Registration
1. User enters email and password
2. Account created in Appwrite
3. Verification email sent
4. User clicks verification link
5. Account activated, ready to login

### Email/Password Login
1. User enters credentials
2. Session created
3. User redirected to dashboard
4. Can create and manage tasks

### Google OAuth Login
1. User clicks "Login with Google"
2. Redirected to Google consent screen
3. User authorizes application
4. Session created automatically
5. Redirected to dashboard

---

## 💾 Database Schema

### Users Collection
```javascript
{
  $id: "user-id",
  email: "user@example.com",
  name: "John Doe",
  emailVerified: true,
  $createdAt: "2025-12-22T10:00:00Z"
}
```

### Tasks Collection
```javascript
{
  $id: "task-id",
  title: "Complete project",
  description: "Finish the React component",
  status: "in-progress",        // pending, in-progress, completed, cancelled
  priority: 3,                  // 1-5 scale
  dueDate: "2025-12-25T00:00:00Z",
  AssignedTo: "user-id",        // User ID (not email)
  CreatedBy: "user-id",         // Task creator
  $createdAt: "2025-12-22T10:00:00Z",
  $updatedAt: "2025-12-22T11:00:00Z"
}
```

---

## 🔄 Real-time Features

### Task Updates
- **Create**: New task appears instantly for all users
- **Update**: Status, description changes sync in real-time
- **Delete**: Task removed immediately from all user views

### Notifications
- Monitor deadline changes
- Alert when task assigned to you
- Update counts dynamically
- Auto-dismiss old notifications

### Subscription
```javascript
// Real-time subscription for all task changes
databases.client.subscribe(
  `databases.${DATABASE_ID}.collections.${TASKS_COLLECTION_ID}.documents`,
  (response) => {
    // Handle create, update, delete events
  }
);
```

---

## 🎨 User Interface

### Pages

1. **Login Page** (`/login`)
   - Email/Password form
   - Google OAuth button
   - Registration link
   - Password recovery link

2. **Dashboard** (`/dashboard`)
   - User statistics
   - Task creation form
   - User directory
   - Task list by assignee
   - Task overview/summary

3. **Task List** (`/tasks`)
   - All tasks view
   - Filter by status
   - Filter by user
   - Task editing capabilities

4. **Task Detail** (`/task/:id`)
   - Full task information
   - Edit status and description
   - Save changes button
   - Task metadata

5. **Email Verification** (`/verify-email`)
   - Verification status
   - Resend verification option
   - Login link after verification

---

## 🚀 Key Workflows

### Creating a Task
1. Login to dashboard
2. Fill task form (title, description, due date, priority, assignee)
3. Click "Create Task"
4. Task appears in real-time for all users
5. Assigned user receives notification

### Editing a Task
1. Click task in list or dashboard
2. Go to Task Detail page
3. Edit status or description
4. Click "Save Changes"
5. Changes sync in real-time

### Managing Tasks
1. View all tasks or filter by user
2. Check deadlines and priorities
3. Update status as progress
4. Complete or cancel tasks
5. Real-time notifications keep you informed

---

## 🔒 Security Features

- **Email Verification**: Required before login
- **Session Management**: Secure Appwrite sessions
- **OAuth2**: Verified Google integration
- **Password Recovery**: Secure reset flow
- **User Isolation**: Users see only relevant data
- **API Security**: Appwrite handles authentication

---

## 🔌 Appwrite Integration

### Services Used
1. **Auth** - User authentication and sessions
2. **Databases** - Task and user data storage
3. **Real-time** - Live updates
4. **Storage** - File uploads (if needed)
5. **Email** - Verification and notifications

### Configuration
- Endpoint: `https://cloud.appwrite.io/v1`
- CORS enabled for app domain
- OAuth providers configured
- Email SMTP configured
- Real-time permissions set

---

## 📦 Dependencies

### Main
- `react` - UI framework
- `appwrite` - Backend SDK

### Build Tools
- `vite` - Build and dev server
- `@vitejs/plugin-react` - React plugin for Vite

### Dev Tools
- `eslint` - Code linting
- `@eslint/js` - ESLint JavaScript rules
- `globals` - Global variables

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn
- Appwrite Cloud account

### Installation
```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/task-tracker.git
cd task-tracker-2

# Install dependencies
npm install

# Create .env.local file (optional for local testing)
# VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
# VITE_APPWRITE_PROJECT_ID=your_project_id

# Start dev server
npm run dev

# Open http://localhost:5173
```

### Deployment
```bash
# Build for production
npm run build

# Deploy to Appwrite Sites
appwrite deploy web
```

---

## 📊 Feature Matrix

| Feature | Implemented | Status |
|---------|-------------|--------|
| Email/Password Auth | ✅ | Production |
| Email Verification | ✅ | Production |
| Google OAuth | ✅ | Production |
| Password Recovery | ✅ | Production |
| Task CRUD | ✅ | Production |
| Task Assignment | ✅ | Production |
| Real-time Updates | ✅ | Production |
| Notifications | ✅ | Production |
| User Directory | ✅ | Production |
| Task Filtering | ✅ | Production |
| Responsive Design | ✅ | Production |
| Dark Mode | ❌ | Future |
| Task Comments | ❌ | Future |
| File Attachments | ❌ | Future |
| Task Templates | ❌ | Future |

---

## 🔄 State Management

### User Context
```javascript
{
  current: User | null,        // Current logged-in user
  login: (email, password) => Promise,
  logout: () => Promise,
  register: (email, password) => Promise,
  loginWithGoogle: () => void,
  verifyEmail: (userId, secret) => Promise,
  resendVerification: () => Promise,
  isLoading: boolean
}
```

### Task Context
```javascript
{
  current: Task[],             // All tasks
  add: (task) => Promise,
  update: (id, data) => Promise,
  remove: (id) => Promise,
  getAllTasks: () => Promise<Task[]>
}
```

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] Register with new email
- [ ] Verify email via link
- [ ] Login with email/password
- [ ] Login with Google
- [ ] Create task
- [ ] Edit task
- [ ] Delete task
- [ ] Check real-time updates
- [ ] Check notifications
- [ ] Test on mobile
- [ ] Test with multiple users

---

## 📝 Environment Variables

### Required for Deployment
```
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id
```

### Optional
- `VITE_API_KEY` - If using API key authentication

---

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Appwrite Documentation](https://appwrite.io/docs)
- [JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

---

## 🤝 Contributing

To contribute to this project:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Push to GitHub
5. Create a Pull Request

---

## 📄 License

This project is open source and available under the MIT License.

---

## 👨‍💻 Author

Built with ❤️ as a complete task management solution.

---

## 🆘 Support

- **Issues**: Report via GitHub Issues
- **Documentation**: See PROJECT_OVERVIEW.md (this file)
- **Appwrite Help**: https://appwrite.io/docs
- **Community**: https://discord.gg/appwrite

---

## 🗺️ Roadmap

### Current (v1.0)
- ✅ Core task management
- ✅ Authentication
- ✅ Real-time updates
- ✅ Notifications

### Future (v2.0)
- Task comments and discussions
- File attachments
- Task templates
- Advanced filtering
- Dark mode
- Mobile app
- Team workspaces

---

## 📞 Contact

For questions or feedback, reach out through:
- GitHub Issues
- Email
- Appwrite Community Discord

---

**Last Updated:** December 23, 2025
**Status:** Production Ready
**Version:** 1.0.0
