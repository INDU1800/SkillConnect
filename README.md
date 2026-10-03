# SkillConnect - Peer-to-Peer Student Skill Sharing Platform

A  full-stack web application designed for university students to barter practical skills directly with their peers. Students can list what they can teach, what they want to learn, discover peer mentors, find reciprocal skill matches, and coordinate exchange proposals through a dashboard.

---

## 🚀 Key Features

1. **Authentication & Security**
   - Student account registration and JWT-based authentication
   - Passwords hashed using `bcrypt` (salted)
   - Client-side session persistence via `localStorage` with automatic session validation
   - Protected routes and token verification middleware

2. **Student Profile Management**
   - Profile overview displaying college name, branch/course, year of study, and bio
   - Dynamic inventory management for:
     - **Skills to Teach** (with category, proficiency level, and description)
     - **Skills to Learn** (with category, desired learning level, and goals)

3. **Skill Discovery & Search**
   - Explore skills across 13 student-relevant categories (Programming, Web Development, Mobile Development, UI/UX Design, Graphic Design, Languages, Music, Photography, Video Editing, Business, Academic, Communication, Other)
   - Real-time search by skill name, student name, or category
   - Filter by proficiency level (Beginner, Intermediate, Advanced, Expert)
   - View student cards and profile previews

4. **Reciprocal Matching Engine**
   - Transparent, explainable matching logic (no black-box AI/ML)
   - Highlights **Mutual Matches** with highest priority:
     - User A teaches what User B wants to learn **AND** User B teaches what User A wants to learn
   - One-way match indicators for complementary skills
   - Compatibility percentage and match badge indicators

5. **Peer Exchange Requests**
   - Direct proposals: specify what skill you teach in return for what you learn
   - Add personalized introductory message
   - Status tracking: `pending`, `accepted`, `rejected`, `completed`, `cancelled`
   - Role-based actions: receiver can accept or reject; sender can cancel while pending; either party can mark completed once finished

6. **Interactive Student Dashboard**
   - Welcome message with student academic summary
   - Real-time metrics:
     - Skills I Teach
     - Skills I Want
     - Pending Requests
     - Active Exchanges
   - Quick previews of current skills, potential matches, and recent requests

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React.js (Vite) |
| **Language** | JavaScript (ES6+) |
| **Routing** | React Router v6 |
| **Styling** | Tailwind CSS |
| **Icons** | Lucide React |
| **HTTP Client** | Axios |
| **Backend Framework**| Node.js & Express.js |
| **Database** | MongoDB Atlas & Mongoose ODM |
| **Authentication** | JSON Web Tokens (JWT) & bcrypt |

---

## 🏛️ System Architecture

SkillConnect uses a decoupled **Client-Server (MERN)** architecture:

```
skillconnect/
├── client/                      # Frontend Application (React + Vite + Tailwind)
│   ├── src/
│   │   ├── components/          # Reusable UI elements
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Select.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── SkillCard.jsx
│   │   │   ├── UserCard.jsx
│   │   │   ├── MatchCard.jsx
│   │   │   ├── RequestCard.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── FilterBar.jsx
│   │   │   ├── DashboardCard.jsx
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx  # Global session and authentication state
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── DiscoverSkillsPage.jsx
│   │   │   ├── AddSkillPage.jsx
│   │   │   ├── MySkillsPage.jsx
│   │   │   ├── MatchesPage.jsx
│   │   │   ├── RequestsPage.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   ├── EditProfilePage.jsx
│   │   │   ├── AboutPage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   ├── services/
│   │   │   └── api.js           # Central Axios client with Bearer interceptors
│   │   ├── App.jsx              # Application routing table
│   │   ├── main.jsx             # React entry point
│   │   └── index.css            # Tailwind CSS directives
│   ├── .env.example
│   └── package.json
│
└── server/                      # Backend REST API (Node.js + Express + Mongoose)
    ├── controllers/
    │   ├── authController.js    # Register, login, me
    │   ├── userController.js    # Profile & skills CRUD, discover
    │   ├── matchController.js   # Reciprocal matching engine
    │   └── requestController.js # Exchange requests & dashboard stats
    ├── middleware/
    │   └── authMiddleware.js    # JWT verification & route protection
    ├── models/
    │   ├── User.js              # Student schema with embedded skills
    │   └── ExchangeRequest.js   # Exchange requests with user references
    ├── routes/
    │   ├── authRoutes.js
    │   ├── userRoutes.js
    │   ├── matchRoutes.js
    │   └── requestRoutes.js
    ├── seed.js                  # Database seeder with sample students
    ├── server.js                # Server entry point, CORS, error handling
    ├── .env.example
    └── package.json
```

---

## 🗄️ Database Models

### 1. `User` Model
```javascript
{
  name: String (required),
  email: String (required, unique, lowercase),
  password: String (hashed with bcrypt),
  college: String,
  course: String,
  year: String,
  bio: String,
  avatar: String,
  skillsToTeach: [
    {
      name: String,
      category: String (enum),
      proficiency: String (Beginner | Intermediate | Advanced | Expert),
      description: String
    }
  ],
  skillsToLearn: [
    {
      name: String,
      category: String (enum),
      proficiency: String (Beginner | Intermediate | Advanced),
      description: String
    }
  ],
  timestamps: true
}
```

### 2. `ExchangeRequest` Model
```javascript
{
  sender: ObjectId (ref: 'User', required),
  receiver: ObjectId (ref: 'User', required),
  skillOffered: String (required),
  skillRequested: String (required),
  status: String (enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled']),
  message: String,
  timestamps: true
}
```

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Create a student account
- `POST /api/auth/login` - Authenticate and obtain JWT
- `GET /api/auth/me` - Fetch authenticated user details (Protected)

### Profiles & Skills
- `GET /api/users` - List all student profiles (searchable)
- `GET /api/users/:id` - Fetch student profile by ID
- `PUT /api/users/:id` - Update student profile (Protected, owner only)
- `POST /api/users/skills/teach` - Add skill to teach (Protected)
- `DELETE /api/users/skills/teach/:skillId` - Delete skill to teach (Protected)
- `POST /api/users/skills/learn` - Add skill to learn (Protected)
- `DELETE /api/users/skills/learn/:skillId` - Delete skill to learn (Protected)
- `GET /api/users/skills/discover` - Browse and filter skills across all students

### Matches
- `GET /api/matches` - Compute reciprocal and one-way matches for current user (Protected)

### Exchange Requests
- `POST /api/requests` - Send exchange proposal (Protected)
- `GET /api/requests/sent` - List proposals sent by user (Protected)
- `GET /api/requests/received` - List proposals received by user (Protected)
- `PUT /api/requests/:id` - Update request status (`accepted`, `rejected`, `completed`, `cancelled`) (Protected)
- `GET /api/requests/dashboard` - Get metrics and activity for dashboard (Protected)

---

## ⚡ Matching Algorithm Explanation

The matching algorithm is implemented in `server/controllers/matchController.js` and evaluates pairwise user compatibility without black-box ML:

1. Let User A be the logged-in user.
2. For each other User B in the database:
   - Identify intersection between **User A's `skillsToLearn`** and **User B's `skillsToTeach`** ($\text{TheyCanTeachMe}$).
   - Identify intersection between **User A's `skillsToTeach`** and **User B's `skillsToLearn`** ($\text{ICanTeachThem}$).
3. **Classification & Scoring:**
   - **Mutual Reciprocal Match:** Both intersections are non-empty. Score: **95%**.
     - *Example:* User A teaches JavaScript and wants Photoshop. User B teaches Photoshop and wants JavaScript.
   - **They Can Teach You:** User B teaches what User A wants, but does not currently seek what User A teaches. Score: **70%**.
   - **You Can Teach Them:** User A teaches what User B wants. Score: **50%**.
4. Output is sorted by compatibility score and displayed with high-visibility visual badges.

---

## 💻 Setup & Running Instructions

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas free cluster account (or local MongoDB URI)

### 2. Configure MongoDB Atlas Credentials
In `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/skillconnect?retryWrites=true&w=majority
JWT_SECRET=skillconnect_super_secret_jwt_key_2026
```
*(Replace `<username>`, `<password>`, and `<cluster>` with your actual MongoDB Atlas cluster credentials).*

In `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Seed Database (Optional but Recommended)
Run the seed script to populate 8+ realistic student profiles with mutual matches:
```bash
cd server
npm run seed
```

### 4. Run Backend Server
```bash
cd server
npm start
# Server runs on http://localhost:5000
```

### 5. Run Frontend Client
```bash
cd client
npm run dev
# Frontend runs on http://localhost:3000
```

---

## 🔑 Demo Account Credentials

Once the seed script is run:
- **Email:** `demo@skillconnect.com`
- **Password:** `Demo@123`

Other seeded accounts:
- `priya@skillconnect.com` / `Password@123` (Teaches Photoshop, wants JavaScript - mutual match with Demo!)
- `aarav@skillconnect.com` / `Password@123` (Teaches JavaScript, wants Photoshop - mutual match with Priya!)
- `rahul@skillconnect.com` / `Password@123` (Teaches Python, wants UI/UX)
- `ananya@skillconnect.com` / `Password@123` (Teaches UI/UX, wants Python)

---

## 🔮 Future Enhancements
- In-app real-time messaging between matched students
- Mutual calendar scheduling for study sessions
- Peer review and rating badges after completing an exchange
- Verification badges for college university email domains (`.edu` / `.ac.in`)
