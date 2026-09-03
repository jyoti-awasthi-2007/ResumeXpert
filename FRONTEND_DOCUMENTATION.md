# AI Resume & Career Analysis System - Frontend Documentation

## 🎯 System Overview

**Application Name:** VerifyAI  
**Framework:** React + Vite  
**Styling:** Tailwind CSS  
**Animations:** Framer Motion  
**Charts:** Recharts  
**Icons:** Lucide React  
**State Management:** React Context (CareerLensContext)  
**Routing:** React Router v6

---

## 📱 **PAGES & ROUTES**

### 1. **Landing Page** (`/`)
**Purpose:** Marketing and entry point for new users  
**Key Features:**
- Hero section with AI-powered verification messaging
- Trust score display (94%)
- Problem statement section explaining credential fraud issues
- How it Works (3-step process)
- Call-to-action buttons: "Get Started" and "Open Dashboard"

**Key Buttons:**
- ✅ "Get Started" → `/signup`
- ✅ "Open Dashboard" → `/dashboard`
- ✅ Navigation Links: Features, How it Works, Pricing

---

### 2. **Login Page** (`/login`)
**Purpose:** User authentication  
**Key Features:**
- Email input with icon
- Password input with show/hide toggle
- Remember me checkbox
- Forgot password link
- Animated card design with gradient background

**Key Buttons:**
- ✅ "Sign In" → `/dashboard`
- ✅ "Sign up" → `/signup` (for new users)
- ✅ "Forgot password?" link

**Form Inputs:**
- Email address
- Password
- Remember me (checkbox)

---

### 3. **Signup Page** (`/signup`)
**Purpose:** User registration  
**Key Features:** (Similar structure to Login)
- Account creation form
- Email validation
- Password setup

**Key Buttons:**
- ✅ Sign up button
- ✅ Link to login page

---

### 4. **Dashboard** (`/dashboard`)
**Purpose:** Main hub showing user's overall progress and analytics  
**Key Features:**
- Score Cards displaying 4 key metrics:
  - Career Readiness Score (%)
  - Resume Score (%)
  - Assessment Score (%)
  - Skill Confidence (%)
- Trust Score Trend Chart (Area chart showing Resume, Match, Assessment, Readiness scores)
- Top Skills Progress Bars:
  - Skills detected
  - Career match
  - Skill gap
  - Assessment score
- Recent Activity Feed with 3 recent actions
- Quick Actions panel with 3 shortcuts

**Key Buttons:**
- ✅ "Upload Resume" → `/upload-resume`
- ✅ "Find Career Matches" → `/career-suggestions`
- ✅ "Review Skill Gap" → `/skill-gap`
- ✅ Activity items (clickable)

---

### 5. **Resume Upload** (`/upload-resume`, `/resume`)
**Purpose:** Upload and process resume files  
**Key Features:**
- Three-stage upload workflow:
  1. **Upload Stage:** Drag-drop or click file uploader
  2. **Scanning Stage:** AI processing animation with progress steps
  3. **Results Stage:** Extracted skills display
- File types supported: PDF, DOC, DOCX (Max 10MB)
- Real-time upload progress indicator
- Scanning steps shown:
  - Parsing document structure
  - Identifying skills & technologies
  - Analyzing work experience
  - Cross-referencing certifications

**Key Buttons:**
- ✅ "Upload Resume" (UploadBox)
- ✅ File selection
- ✅ Remove file options
- ✅ Next/Continue buttons

---

### 6. **Resume Analysis** (`/resume-analysis`)
**Purpose:** Detailed breakdown of resume quality  
**Key Features:**
- Overall Resume Score (large display: e.g., 84/100)
- Resume status indicator
- Summary breakdown in 4 categories (Skills, Projects, Education, Experience, Keywords - each showing percentage)
- Strengths section with checkmarks
- Weaknesses section with warning icons
- NLP processing display

**Key Buttons:**
- ✅ "Analyze New Resume" → `/upload-resume`
- ✅ Navigation to other analysis pages

---

### 7. **Skills** (`/skills`)
**Purpose:** Display extracted skills from resume with categorization and search  
**Key Features:**
- Search bar to find specific skills
- Category filter buttons: All, Programming, AI/ML, Database, Web, Tools
- Skill badges with confidence scores
- Animated skill cards
- NLP-based skill extraction

**Key Buttons:**
- ✅ Category filter buttons (All, Programming, AI/ML, Database, Web, Tools)
- ✅ Search input field
- ✅ Skill badges (clickable cards)
- ✅ "Analyze Resume" (if not uploaded)

---

### 8. **Career Suggestions** (`/career-suggestions`, `/careers`)
**Purpose:** Show career paths matching user's skills  
**Key Features:**
- Grid display of career cards
- Each card shows:
  - Career title
  - Match percentage (e.g., 89%)
  - Description
  - Key matched skills
- Based on resume analysis and AI recommendations

**Key Buttons:**
- ✅ Career cards (clickable to view details)
- ✅ View button on each card → `/career/{careerId}`
- ✅ "Analyze Resume" (if not uploaded)

---

### 9. **Career Details** (`/career/:careerId`)
**Purpose:** Deep dive into a specific career path  
**Key Features:**
- Career title and description
- Match Score (large display)
- Two-column layout:
  - Skills you already have (with green checkmarks)
  - Skills you need (with warning icons)
- Related recommendations

**Key Buttons:**
- ✅ "Analyze Skill Gap" → `/skill-gap` + selects this career
- ✅ "View Recommendations" → `/recommendations`
- ✅ "Back to Careers" → `/careers`

---

### 10. **Skill Gap Analysis** (`/skill-gap`)
**Purpose:** Compare required vs. current skills for target career  
**Key Features:**
- Target career name
- Overall Skill Match percentage
- Two-column comparison:
  - Skills You Have (green circles)
  - Missing Skills (warning circles)
- Skill Gap Priority grouping:
  - High Priority
  - Medium Priority
  - Low Priority
- Each priority group shows list of skills

**Key Buttons:**
- ✅ "Explore Recommendations" → `/recommendations`
- ✅ Career selection dropdown (implied)

---

### 11. **Recommendations** (`/recommendations`)
**Purpose:** Suggest skills to learn for career improvement  
**Key Features:**
- Grid of recommendation cards
- Each card includes:
  - Skill name
  - Description
  - Estimated learning time
  - Difficulty level
  - Relevance score
- "Mark as Learning" action for each skill

**Key Buttons:**
- ✅ "Mark as Learning" (on each recommendation card)
- ✅ "Analyze Resume" (if not uploaded)

---

### 12. **Assessment** (`/assessment`)
**Purpose:** Select difficulty level for skill assessment  
**Key Features:**
- Assessment level selection:
  - Beginner Level
  - Intermediate Level
  - Advanced Level/Expert Level
- Each level card shows:
  - Title
  - Number of questions
  - Time estimate
  - Description
- Selected level details display with options to start or change selection

**Key Buttons:**
- ✅ Level selection cards (clickable to select)
- ✅ "Start {Level} Test" → `/assessment/{level}`
- ✅ "Choose Different Level" (deselect current)
- ✅ "Analyze Resume" (if not uploaded)

---

### 13. **Assessment Level** (`/assessment/:level`)
**Purpose:** Take the skill assessment quiz  
**Key Features:**
- Question card display (one per screen/slide)
- Multiple choice options for each question
- Progress indicator showing current question/total
- Navigation: Previous/Next/Submit
- Timer (if applicable)
- Skill-specific MCQ based on selected career

**Key Buttons:**
- ✅ Multiple choice answer options
- ✅ "Previous" question button
- ✅ "Next" question button
- ✅ "Submit Assessment" button
- ✅ "Skip" (optional)

---

### 14. **Assessment Results** (`/assessment/results`)
**Purpose:** Display assessment performance and confidence score  
**Key Features:**
- Overall Performance status
- Assessment Complete confirmation
- Skill-by-skill breakdown cards showing:
  - Skill name
  - Score percentage
  - Progress bar
- Answer Summary section showing:
  - Correct answers count
  - Incorrect answers count
  - Total questions
- Confidence Score display (overall percentage)

**Key Buttons:**
- ✅ "Start Assessment" (if not completed)
- ✅ Navigation to other analysis pages

---

### 15. **Confidence** (`/confidence`)
**Purpose:** Display user's skill confidence levels  
**Key Features:**
- Confidence score display
- Breakdown by skill area
- Comparison with claimed vs. actual confidence

---

### 16. **Claim vs. Actual** (`/claim-vs-actual`)
**Purpose:** Compare claimed skills (resume) vs. demonstrated knowledge (assessment)  
**Key Features:**
- Side-by-side comparison visualization
- Gap analysis between what's claimed and proven
- Visual indicators for matches and mismatches

---

### 17. **Career Readiness** (`/career-readiness`)
**Purpose:** Comprehensive career preparation assessment  
**Key Features:**
- Overall readiness score (large display)
- Readiness breakdown in 4 categories:
  - Resume Quality
  - Skill Match
  - Assessment Performance
  - Confidence Level
- Strengths list
- Improvements list (areas to work on)
- Action Plan with recommended next steps
- Each step shows:
  - Action title
  - Action type (Learn, Practice, Build, etc.)
  - Reasoning/explanation

**Key Buttons:**
- ✅ "Analyze Resume" (if not uploaded)

---

### 18. **Results & Analytics** (`/analytics`)
**Purpose:** Comprehensive analytics dashboard  
**Key Features:**
- Skill Trust Score (animated circular progress)
- Performance Summary stats:
  - Resume Score
  - Assessment Score
  - Test Score
- Radar chart showing skill proficiency across 6 areas
- Bar chart comparing 5 major score categories
- Trending indicators with percentage changes

---

### 19. **Settings** (`/settings`)
**Purpose:** User profile and account management  
**Key Features:**
- User profile display:
  - Name
  - Email
  - Job title
- Settings sections (info only):
  - Profile settings
  - Security settings
  - Notifications preferences

**Key Buttons:**
- ✅ Settings navigation (implied)
- ✅ Profile section expandable areas (implied)

---

## 🧩 **COMPONENTS**

### 1. **AnimatedButton**
**Props:**
- `children` - Button text
- `variant` - 'primary' | 'secondary' | 'outline' | 'ghost' | 'ai' | 'premium' | 'danger'
- `size` - 'sm' | 'md' | 'lg'
- `icon` - Lucide icon component
- `onClick` - Click handler
- `disabled` - Boolean
- `type` - 'button' | 'submit' | 'reset'
- `className` - Additional CSS classes

**Animation:** Scale hover (1.03x), tap (0.96x)

---

### 2. **UploadBox**
**Props:**
- `onFilesSelected` - Callback when files selected
- `accept` - File type filter (default: '.pdf,.doc,.docx,.jpg,.png')
- `multiple` - Allow multiple files
- `label` - Upload prompt text
- `description` - Description text

**Features:**
- Drag & drop support
- Click to browse
- File preview with progress bar
- Remove file option
- Upload progress animation

---

### 3. **ScoreCard**
**Props:**
- `title` - Card title
- `value` - Score number
- `suffix` - '%' or other suffix
- `icon` - Lucide icon
- `color` - 'primary' | 'accent' | 'success' | 'warning'
- `delay` - Animation delay

**Display:** Large animated score with icon and label

---

### 4. **ProgressBar**
**Props:**
- `label` - Bar label
- `value` - Progress percentage (0-100)
- `color` - 'primary' | 'accent' | 'success' | 'warning'
- `delay` - Animation delay
- `showValue` - Show percentage value

---

### 5. **ProgressRing**
**Purpose:** Circular progress indicator  
**Used for:** Skill confidence, readiness scores

---

### 6. **SkillBadge**
**Props:**
- `skill` - Skill name
- `confidence` - Confidence percentage
- `category` - Skill category

**Display:** Card with skill name, confidence percentage, and category badge

---

### 7. **CareerCard**
**Props:**
- `career` - Career object with title, description, score, matchedSkills, missingSkills
- `onView` - Callback for view button

**Display:**
- Career title
- Description
- Match percentage
- Key skills
- View button

---

### 8. **AssessmentLevelCard**
**Props:**
- `level` - Level object {id, title, questions, time, description}
- `selected` - Boolean
- `onSelect` - Selection callback

**Display:** Selectable card with level details

---

### 9. **RecommendationCard**
**Props:**
- `item` - Recommendation object {skill, description, timeToLearn, difficulty, relevance}
- `onMark` - Mark as learning callback

**Display:** Skill recommendation with learning time and difficulty

---

### 10. **QuestionCard**
**Purpose:** Assessment question display  
**Props:**
- `question` - Question object {id, text, options, type}
- `onAnswer` - Answer selection callback
- `currentIndex` - Current question number
- `total` - Total questions

---

### 11. **ReadinessScore**
**Props:**
- `score` - Score percentage
- `status` - Status text

**Display:** Large readiness score with status indicator

---

### 12. **AnalyticsCard**
**Purpose:** Data visualization cards on analytics page

---

### 13. **ClaimComparison**
**Purpose:** Side-by-side comparison visualization

---

### 14. **LoaderSkeleton**
**Purpose:** Loading placeholder skeleton screens

---

### 15. **GradientBackground**
**Props:**
- `variant` - 'default' | 'auth'

**Purpose:** Page background with animated gradient blobs

---

### 16. **PageTransition**
**Purpose:** Page enter/exit animations with Framer Motion  
**Wraps:** Every page component

---

### 17. **Navbar**
**Features:**
- Fixed position navbar
- Mobile hamburger menu
- Logo with link to home
- Navigation links: Features, How it Works, Pricing
- Auth buttons: Log in, Get Started
- Mobile responsive menu

**Key Buttons:**
- ✅ Logo (→ `/`)
- ✅ Nav links (scroll to sections on landing)
- ✅ Log in (→ `/login`)
- ✅ Get Started (→ `/signup`)
- ✅ Mobile menu toggle

---

### 18. **Sidebar**
**Purpose:** Dashboard navigation sidebar  
**Items:** Links to all main sections

---

### 19. **DashboardLayout**
**Props:**
- `title` - Page title
- `children` - Page content

**Features:**
- Navbar integration
- Sidebar navigation
- Page title display
- Layout wrapper

---

## 🔧 **SERVICES & FUNCTIONS**

### **1. api.js - API Client**
```javascript
// API Configuration
- Base URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
- Timeout: 30000ms
- Error handling: apiError() function
```

**Key Functions:**
- `apiError(error)` - Extract error message from response

---

### **2. resumeService.js - Resume Operations**
```javascript
uploadResume(file)
// POST /resumes/upload
// Request: FormData with file
// Response: { resume_id, ... }

analyzeResume(resumeId)
// POST /resumes/{resumeId}/analyze
// Response: { score, status, summary, strengths, weaknesses, skills, ... }
```

---

### **3. careerService.js - Career Operations**
```javascript
getCareers()
// GET /careers
// Response: List of careers

recommendCareers(resumeId)
// POST /careers/recommend
// Request: { resume_id }
// Response: { recommendations: [...] }
```

---

### **4. assessmentService.js - Assessment Operations**
```javascript
generateAssessment(resumeId, careerId, difficulty)
// POST /assessments/generate
// Request: { resume_id, career_id, difficulty }
// Response: { assessment_id, questions: [...], ... }

submitAssessment(assessmentId, answers)
// POST /assessments/{assessmentId}/submit
// Request: { answers: [...] }
// Response: { score, correct, incorrect, total, summary, ... }
```

---

### **5. skillService.js - Skill Operations**
```javascript
getSkills()
// Returns: Promise<skills[]>
// Simulates backend call with 700ms delay
```

---

## 🎨 **CONTEXT & STATE MANAGEMENT**

### **CareerLensContext**

**State Variables:**
- `selectedCareerId` - Currently selected career
- `resumeState` - {uploaded, processing, analysis, id}
- `skills` - Extracted skills array
- `careerMatches` - Recommended careers
- `skillGap` - {overallMatch, haveSkills, missingSkills, priorities}
- `recommendations` - Skill recommendations
- `assessmentResult` - {score, status, skills, summary}
- `confidence` - Confidence score (0-100)
- `claimComparisonState` - Claim vs actual comparison data
- `readinessOverviewState` - Readiness details
- `analyticsOverviewState` - Analytics data
- `error` - Error message

**Key Functions:**
```javascript
uploadResume(file)
// Upload and analyze resume
// Returns: analysis object

selectCareer(careerId)
// Select target career
// Updates all dependent data

submitAssessment(answers)
// Submit assessment answers
// Returns: result object with score

generateAssessmentQuestions(level)
// Generate questions for assessment level
// Returns: questions array
```

---

## 📊 **DATA STRUCTURES**

### **Resume Object**
```javascript
{
  score: number,
  status: string,
  summary: {
    skills: percentage,
    projects: percentage,
    education: percentage,
    experience: percentage,
    keywords: percentage
  },
  strengths: string[],
  weaknesses: string[]
}
```

### **Career Object**
```javascript
{
  id: string,
  title: string,
  description: string,
  score: percentage,
  matchedSkills: string[],
  missingSkills: string[]
}
```

### **Skill Object**
```javascript
{
  id: string,
  name: string,
  category: string,
  confidence: percentage
}
```

### **Assessment Object**
```javascript
{
  id: string,
  title: string,
  level: string,
  questions: number,
  time: string,
  description: string
}
```

### **Recommendation Object**
```javascript
{
  skill: string,
  description: string,
  timeToLearn: string,
  difficulty: string,
  relevance: percentage
}
```

---

## 🎯 **KEY FEATURES SUMMARY**

### **1. Resume Analysis**
- Upload PDF/DOCX documents
- AI-powered NLP processing
- Extract skills, experience, education
- Calculate resume quality score
- Identify strengths and weaknesses

### **2. Skill Extraction**
- Automatic skill identification from resume
- Categorization (Programming, AI/ML, Database, Web, Tools)
- Confidence scoring for each skill
- Searchable and filterable skill view

### **3. Career Matching**
- AI-recommended career paths based on resume
- Match percentage for each career
- Skills comparison (have vs. need)
- Career-specific details and descriptions

### **4. Skill Gap Analysis**
- Identify missing skills for target career
- Prioritize gaps (High/Medium/Low)
- Track progress on skill acquisition

### **5. AI-Powered Assessment**
- Multi-level difficulty assessments
  - Beginner/Intermediate/Advanced/Expert
- Career-specific MCQ questions
- Real-time performance tracking
- Skill-by-skill scoring

### **6. Skill Confidence Measurement**
- Compare claimed (resume) vs. demonstrated (assessment) skills
- Confidence percentage based on assessment performance
- Trend tracking over time

### **7. Career Readiness**
- Composite score from:
  - Resume quality
  - Skill match percentage
  - Assessment performance
  - Confidence level
- Action plan with next steps
- Strengths and improvement areas

### **8. Analytics & Insights**
- Trust score calculation
- Skill proficiency radar chart
- Performance trending
- Comparative analysis
- Visual performance summaries

### **9. User Dashboard**
- At-a-glance metrics
- Recent activity feed
- Quick action shortcuts
- Trend visualization

### **10. User Authentication**
- Login/Signup pages
- Session management
- Profile settings
- Security settings (UI ready)

---

## 🎨 **STYLING & DESIGN**

### **Theme Variables** (CSS Custom Properties)
```css
--color-primary        /* Main brand color */
--color-accent         /* Accent color */
--color-success        /* Success state */
--color-warning        /* Warning state */
--color-danger         /* Error state */
--color-border         /* Border color */
--color-text-primary   /* Primary text */
--color-text-secondary /* Secondary text */
--grad-1               /* Gradient color 1 */
--grad-2               /* Gradient color 2 */
--grad-3               /* Gradient color 3 */
```

### **Key Style Classes**
- `.glass-card` - Glassmorphic card design
- `.glass-card-strong` - Stronger glass effect
- `.sig-gradient` - Brand gradient
- `.gradient-text` - Gradient text effect
- `.btn-primary`, `.btn-secondary`, etc. - Button styles
- `.card-float` - Float animation effect

### **Animations**
- Framer Motion for page transitions
- Staggered animations on lists
- Hover scale effects on interactive elements
- Progress animations
- Loading spinner animations

---

## 📱 **RESPONSIVE DESIGN**

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Hamburger menu on mobile
- Touch-friendly button sizes
- Flexible grid layouts
- Adaptive typography

---

## 🔐 **SECURITY FEATURES**

- Form input validation
- Error handling and display
- Session storage for assessment IDs
- API error handling and user feedback
- Secure password input with show/hide toggle

---

## 🚀 **PERFORMANCE OPTIMIZATIONS**

- React.lazy and Suspense for code splitting (ready)
- Memoization with useMemo
- useCallback for function optimization
- Debounced search input
- Lazy loading animations
- Optimized re-renders with proper dependency arrays

---

## 📝 **FILE STRUCTURE**
```
src/
├── pages/               # All page components
├── components/          # Reusable UI components
├── services/            # API service functions
├── context/             # React Context providers
├── layouts/             # Layout wrapper components
├── data/                # Mock data
├── assets/              # Images, logos, etc.
├── App.jsx              # Main app with routing
├── main.jsx             # React entry point
└── index.css            # Global styles
```

---

## 🔗 **NAVIGATION FLOW**

```
Landing Page
  ├─→ Login Page ─→ Dashboard
  ├─→ Signup Page ─→ Dashboard
  └─→ Get Started Button ─→ Dashboard

Dashboard (Hub)
  ├─→ Upload Resume ─→ Resume Analysis
  ├─→ Skills Page
  ├─→ Career Suggestions
  │    └─→ Career Details
  │         ├─→ Skill Gap Analysis
  │         └─→ Recommendations
  ├─→ Assessment
  │    └─→ Assessment Level (Quiz)
  │         └─→ Assessment Results
  ├─→ Career Readiness
  ├─→ Analytics
  ├─→ Confidence
  ├─→ Claim vs Actual
  └─→ Settings
```

---

## ✨ **BUTTON LOCATION REFERENCE**

| Button | Location | Action |
|--------|----------|--------|
| Get Started | Landing, Navbar | → `/signup` |
| Log In | Landing, Navbar | → `/login` |
| Sign In | Login Page | → `/dashboard` |
| Sign Up | Signup Page | → `/dashboard` |
| Upload Resume | Dashboard, ResumeUpload | File upload |
| Analyze Resume | Multiple pages | → `/upload-resume` |
| Find Career Matches | Dashboard | → `/career-suggestions` |
| Review Skill Gap | Dashboard | → `/skill-gap` |
| View Career | Career Cards | → `/career/{id}` |
| Analyze Skill Gap | Career Details | → `/skill-gap` |
| View Recommendations | Career Details | → `/recommendations` |
| Mark as Learning | Recommendations | Track skill |
| Start Test | Assessment | → `/assessment/{level}` |
| Submit Assessment | Assessment Quiz | Submit answers |
| Back to Careers | Career Details | → `/careers` |
| Choose Different | Assessment | Deselect level |
| Explore Recommendations | Skill Gap | → `/recommendations` |

---

## 🎯 **SUMMARY**

This is a comprehensive AI-powered resume and career analysis system with:
- **20 main pages** for different features
- **18+ reusable components** for consistent UI
- **4 key services** for API communication
- **Context-based state management** for data flow
- **Professional animations** and transitions
- **Mobile-responsive design**
- **Comprehensive analytics** and visualizations
- **Multi-level assessments** for skill evaluation
- **Career recommendation engine**
- **Skill gap analysis and recommendations**

The system helps users verify their skills through resume analysis, assessments, and career matching while providing actionable insights for career development.
