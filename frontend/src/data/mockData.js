export const user = {
  name: 'Aisha Khan',
  title: 'Aspiring Machine Learning Engineer',
}

export const resumeOverview = {
  score: 84,
  status: 'Strong Resume',
  summary: {
    ATS: 88,
    Skills: 86,
    Projects: 82,
    Education: 91,
    Experience: 76,
    Keywords: 85,
  },
  strengths: [
    'Strong Python experience',
    'Relevant machine learning projects',
    'Good technical skill coverage',
    'Relevant educational background',
  ],
  improvements: [
    'Limited cloud experience',
    'Missing deployment skills',
    'Project outcomes could be more measurable',
  ],
  personal: {
    name: 'Aisha Khan',
    email: 'aisha.khan@example.com',
    phone: '(555) 123-9874',
    location: 'New York, NY',
  },
  education: {
    degree: 'B.Sc. Computer Science',
    college: 'New York University',
    branch: 'Data Science',
    cgpa: '3.8 / 4.0',
    year: '2024',
  },
  experience: [
    {
      company: 'Innova Labs',
      role: 'Data Science Intern',
      duration: 'Jan 2024 - Present',
    },
    {
      company: 'BrightAnalytics',
      role: 'Data Analyst Intern',
      duration: 'Jun 2023 - Dec 2023',
    },
  ],
  projects: [
    {
      name: 'Predictive Maintenance Pipeline',
      description: 'Built a machine learning pipeline to predict equipment failures using sensor telemetry and time-series analysis.',
      technologies: ['Python', 'Scikit-learn', 'TensorFlow', 'AWS'],
    },
    {
      name: 'Customer Segmentation Model',
      description: 'Developed clustering models to identify high-value customer segments and support personalized recommendations.',
      technologies: ['Pandas', 'SQL', 'KMeans', 'Tableau'],
    },
  ],
}

export const nlpProcessing = [
  { label: 'Text Extraction', status: 'Complete' },
  { label: 'Section Detection', status: 'Complete' },
  { label: 'Entity Recognition', status: 'Complete' },
  { label: 'Skill Extraction', status: 'Complete' },
  { label: 'Skill Normalization', status: 'Complete' },
  { label: 'Career Mapping', status: 'Complete' },
]

export const skills = [
  { id: 'python', name: 'Python', category: 'Programming', confidence: 94, claimLevel: 'Advanced' },
  { id: 'sql', name: 'SQL', category: 'Database', confidence: 89, claimLevel: 'Intermediate' },
  { id: 'machine-learning', name: 'Machine Learning', category: 'AI / ML', confidence: 72, claimLevel: 'Advanced' },
  { id: 'deep-learning', name: 'Deep Learning', category: 'AI / ML', confidence: 67, claimLevel: 'Intermediate' },
  { id: 'docker', name: 'Docker', category: 'Tools', confidence: 31, claimLevel: 'Beginner' },
  { id: 'aws', name: 'AWS', category: 'Tools', confidence: 42, claimLevel: 'Beginner' },
  { id: 'pandas', name: 'Pandas', category: 'AI / ML', confidence: 88, claimLevel: 'Advanced' },
  { id: 'react', name: 'React', category: 'Web', confidence: 76, claimLevel: 'Intermediate' },
  { id: 'git', name: 'Git', category: 'Tools', confidence: 92, claimLevel: 'Advanced' },
  { id: 'statistics', name: 'Statistics', category: 'AI / ML', confidence: 81, claimLevel: 'Intermediate' },
  { id: 'data-visualization', name: 'Data Visualization', category: 'AI / ML', confidence: 58, claimLevel: 'Intermediate' },
  { id: 'kubernetes', name: 'Kubernetes', category: 'Tools', confidence: 24, claimLevel: 'Beginner' },
]

export const careerMatches = [
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    score: 91,
    status: 'Strong Match',
    matchedSkills: ['Python', 'SQL', 'Pandas', 'Machine Learning', 'Statistics'],
    missingSkills: ['Advanced SQL', 'Cloud'],
    description: 'Data Scientist roles align closely with your analytical background, machine learning experience, and Python skills.',
  },
  {
    id: 'ml-engineer',
    title: 'ML Engineer',
    score: 86,
    status: 'Good Match',
    matchedSkills: ['Python', 'Machine Learning', 'Deep Learning', 'Git'],
    missingSkills: ['Docker', 'MLOps'],
    description: 'Machine Learning Engineer is a strong fit for your model development and data workflow skills.',
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    score: 81,
    status: 'Good Match',
    matchedSkills: ['SQL', 'Python', 'Statistics', 'Data Visualization'],
    missingSkills: ['Advanced SQL', 'Automation'],
    description: 'Data Analyst is a practical career path given your data querying and analytical strengths.',
  },
  {
    id: 'backend-developer',
    title: 'Backend Developer',
    score: 73,
    status: 'Developing Match',
    matchedSkills: ['Python', 'Git', 'APIs'],
    missingSkills: ['Docker', 'Cloud', 'System Design'],
    description: 'Backend Developer is secondary but can benefit from improving deployment and cloud skills.',
  },
  {
    id: 'ai-engineer',
    title: 'AI Engineer',
    score: 78,
    status: 'Developing Match',
    matchedSkills: ['Python', 'Deep Learning', 'Machine Learning'],
    missingSkills: ['MLOps', 'Cloud'],
    description: 'AI Engineer is a strong aspirational fit with additional experience in deployment and systems integration.',
  },
]

export const skillGap = {
  targetCareer: 'Machine Learning Engineer',
  overallMatch: 78,
  haveSkills: ['Python', 'Machine Learning', 'Deep Learning', 'SQL', 'Git'],
  missingSkills: ['Docker', 'AWS', 'MLOps'],
  priorities: [
    { level: 'High', skills: ['Docker', 'AWS'] },
    { level: 'Medium', skills: ['MLOps'] },
    { level: 'Low', skills: ['Kubernetes'] },
  ],
}

export const recommendations = [
  {
    skill: 'Docker',
    priority: 'High',
    why: 'Your target career frequently requires Docker, but it was not detected in your resume.',
    path: ['Docker', 'Containerization', 'Deployment', 'MLOps'],
  },
  {
    skill: 'AWS',
    priority: 'High',
    why: 'Cloud skills are important for machine learning pipelines and deployment.',
    path: ['AWS', 'Cloud Fundamentals', 'Infrastructure', 'Deployment'],
  },
  {
    skill: 'MLOps',
    priority: 'Medium',
    why: 'MLOps bridges model development and production readiness for your chosen career.',
    path: ['MLOps', 'CI/CD', 'Deployment', 'Monitoring'],
  },
]

export const assessmentLevels = [
  {
    id: 'beginner',
    title: 'Beginner',
    description: 'Tests fundamental concepts.',
    questions: 10,
    time: '10 Minutes',
  },
  {
    id: 'advanced',
    title: 'Advanced',
    description: 'Tests practical understanding.',
    questions: 10,
    time: '15 Minutes',
  },
  {
    id: 'expert',
    title: 'Expert',
    description: 'Tests advanced reasoning and technical depth.',
    questions: 10,
    time: '20 Minutes',
  },
]

export const assessmentQuestions = {
  beginner: [
    {
      id: 'b1',
      skill: 'Python',
      question: 'Which Python data type is best for storing ordered, immutable records?',
      options: ['List', 'Tuple', 'Set', 'Dictionary'],
      correct: 1,
    },
    {
      id: 'b2',
      skill: 'Statistics',
      question: 'What does the mean represent in a dataset?',
      options: ['Most common value', 'Middle value', 'Average value', 'Range'],
      correct: 2,
    },
    {
      id: 'b3',
      skill: 'SQL',
      question: 'Which SQL clause filters returned rows?',
      options: ['SELECT', 'WHERE', 'FROM', 'GROUP BY'],
      correct: 1,
    },
    {
      id: 'b4',
      skill: 'Machine Learning',
      question: 'What is supervised learning?',
      options: ['Learning without labels', 'Learning from labeled data', 'Learning from sequential data', 'Learning from noise'],
      correct: 1,
    },
    {
      id: 'b5',
      skill: 'Data Visualization',
      question: 'Which chart type is best to compare categories?',
      options: ['Line chart', 'Bar chart', 'Scatter plot', 'Histogram'],
      correct: 1,
    },
  ],
  advanced: [
    {
      id: 'a1',
      skill: 'Machine Learning',
      question: 'A model performs significantly better on training data than validation data. Which issue is most likely responsible?',
      options: ['Underfitting', 'Overfitting', 'Normalization', 'Encoding'],
      correct: 1,
    },
    {
      id: 'a2',
      skill: 'SQL',
      question: 'Which SQL function calculates the average of a column?',
      options: ['COUNT()', 'SUM()', 'AVG()', 'MIN()'],
      correct: 2,
    },
    {
      id: 'a3',
      skill: 'Python',
      question: 'Which library is commonly used for data manipulation in Python?',
      options: ['NumPy', 'Pandas', 'Matplotlib', 'Flask'],
      correct: 1,
    },
    {
      id: 'a4',
      skill: 'Deep Learning',
      question: 'Which activation function is most common in deep neural networks?',
      options: ['ReLU', 'Sigmoid', 'Step', 'Softmax'],
      correct: 0,
    },
    {
      id: 'a5',
      skill: 'MLOps',
      question: 'What does Docker primarily provide for deployment?',
      options: ['Virtual machines', 'Containerization', 'Database storage', 'Monitoring dashboards'],
      correct: 1,
    },
  ],
  expert: [
    {
      id: 'e1',
      skill: 'Machine Learning',
      question: 'Which technique helps prevent overfitting by randomly disabling neurons during training?',
      options: ['Batch normalization', 'Dropout', 'Gradient clipping', 'Early stopping'],
      correct: 1,
    },
    {
      id: 'e2',
      skill: 'AWS',
      question: 'Which AWS service is commonly used for model deployment at scale?',
      options: ['Amazon S3', 'AWS Lambda', 'Amazon SageMaker', 'Amazon RDS'],
      correct: 2,
    },
    {
      id: 'e3',
      skill: 'Docker',
      question: 'Which file defines instructions to build a Docker image?',
      options: ['Dockerfile', 'compose.yml', 'Docker.config', 'image.json'],
      correct: 0,
    },
    {
      id: 'e4',
      skill: 'MLOps',
      question: 'What is the primary purpose of model monitoring in production?',
      options: ['Increase model size', 'Track performance drift', 'Improve training speed', 'Reduce dataset size'],
      correct: 1,
    },
    {
      id: 'e5',
      skill: 'Statistics',
      question: 'Which metric measures the spread of values around the mean?',
      options: ['Mean', 'Median', 'Standard deviation', 'Mode'],
      correct: 2,
    },
  ],
}

export const assessmentResult = {
  score: 82,
  status: 'HIGH CONFIDENCE',
  skills: [
    { name: 'Python', score: 92 },
    { name: 'Machine Learning', score: 81 },
    { name: 'SQL', score: 88 },
    { name: 'Statistics', score: 67 },
  ],
  summary: {
    correct: 8,
    incorrect: 2,
    total: 10,
  },
}

export const claimComparison = [
  {
    skill: 'Machine Learning',
    resumeClaim: 'Advanced',
    assessment: 62,
    confidence: 'Medium',
    status: 'Needs Validation',
  },
  {
    skill: 'SQL',
    resumeClaim: 'Intermediate',
    assessment: 94,
    confidence: 'High',
    status: 'Strongly Demonstrated',
  },
  {
    skill: 'Python',
    resumeClaim: 'Advanced',
    assessment: 92,
    confidence: 'High',
    status: 'Well Supported',
  },
  {
    skill: 'Docker',
    resumeClaim: 'Beginner',
    assessment: 31,
    confidence: 'Low',
    status: 'Low Confidence',
  },
]

export const confidenceLevels = [
  { range: '0–40', label: 'Low Confidence', color: 'danger' },
  { range: '41–60', label: 'Developing', color: 'warning' },
  { range: '61–75', label: 'Good', color: 'accent' },
  { range: '76–90', label: 'High', color: 'primary' },
  { range: '91–100', label: 'Expert Confidence', color: 'success' },
]

export const readinessOverview = {
  score: 81,
  status: 'GOOD PREPARATION',
  breakdown: {
    resumeQuality: 84,
    skillMatch: 78,
    assessment: 82,
    confidence: 80,
  },
  strengths: ['Python', 'SQL', 'Machine Learning Fundamentals'],
  improvements: ['Docker', 'AWS', 'MLOps', 'Advanced Machine Learning'],
}

export const nextSteps = [
  {
    title: 'Improve Docker',
    reason: 'Important missing skill for your target career.',
    action: 'View Skill Gap',
    link: '/skill-gap',
  },
  {
    title: 'Learn AWS Fundamentals',
    reason: 'Cloud knowledge is missing.',
    action: 'View Recommendations',
    link: '/recommendations',
  },
  {
    title: 'Practice Advanced ML',
    reason: 'Assessment shows moderate confidence.',
    action: 'Start Assessment',
    link: '/assessment',
  },
  {
    title: 'Retake Expert Assessment',
    reason: 'Validate improvement after learning.',
    action: 'Begin Expert Level',
    link: '/assessment/expert',
  },
]

export const analyticsOverview = {
  main: {
    resumeScore: 84,
    skillScore: 86,
    careerMatch: 91,
    skillGap: 5,
    assessmentScore: 82,
    confidence: 82,
    readiness: 81,
  },
  skillDistribution: [
    { name: 'Python', value: 94 },
    { name: 'SQL', value: 89 },
    { name: 'Machine Learning', value: 72 },
    { name: 'Docker', value: 31 },
  ],
  careerMatch: [
    { name: 'Data Scientist', value: 91 },
    { name: 'ML Engineer', value: 86 },
    { name: 'Data Analyst', value: 81 },
  ],
  assessmentHistory: [
    { name: 'Beginner', value: 91 },
    { name: 'Advanced', value: 82 },
    { name: 'Expert', value: 62 },
  ],
}
