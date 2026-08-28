import React, { useState, useEffect } from 'react';
import { 
  Briefcase, Award, Flame, BookOpen, Compass, User, 
  CheckCircle, Circle, AlertCircle, Calendar, ChevronRight, 
  ChevronDown, Database, TrendingUp, LogOut, RefreshCw, 
  GraduationCap, Building, ExternalLink, ArrowRight, ShieldCheck, Check
} from 'lucide-react';
import { 
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, 
  PolarRadiusAxis, Radar, Tooltip, Legend, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid 
} from 'recharts';
import './App.css';

const API_BASE = 'http://localhost:8080/api';

const SKILL_TOPICS = {
  1: [ // Java
    "Basic Syntax & Data Types",
    "Object-Oriented Programming (Classes, Inheritance, Polymorphism)",
    "Exception Handling & Debugging",
    "Java Collections Framework (List, Set, Map)",
    "Java 8+ Features (Lambdas, Streams)",
    "Multithreading & Concurrency Basics"
  ],
  2: [ // Data Structures and Algorithms
    "Time & Space Complexity (Big O Notation)",
    "Linear Data Structures: Arrays, Linked Lists, Stacks, Queues",
    "Sorting & Searching Algorithms (Binary Search, QuickSort, MergeSort)",
    "Non-linear Data Structures: Binary Trees, BSTs, Heaps",
    "Graphs & Graph Traversals (BFS, DFS)",
    "Dynamic Programming & Recursion Basics"
  ],
  3: [ // Object-Oriented Programming
    "Class and Object Definitions",
    "Four Pillars: Encapsulation, Inheritance, Polymorphism, Abstraction",
    "Interfaces & Abstract Classes",
    "Constructors & Memory Management",
    "OOP Design Patterns (Singleton, Factory, Builder)"
  ],
  4: [ // DBMS
    "Database Architecture & Schemas",
    "Entity-Relationship (ER) Modeling",
    "Database Normalization (1NF, 2NF, 3NF, BCNF)",
    "Relational Algebra & Tuple Calculus",
    "ACID Properties & Transaction Control"
  ],
  5: [ // SQL
    "DDL (CREATE, ALTER, DROP) & DML (SELECT, INSERT, UPDATE, DELETE)",
    "SQL Joins (INNER, LEFT, RIGHT, FULL OUTER)",
    "Group By, Having, and Aggregate Functions",
    "Subqueries, Nested Queries, and Common Table Expressions (CTEs)",
    "Indexes, Views, and Stored Procedures"
  ],
  6: [ // Computer Networks
    "OSI & TCP/IP Model Layers",
    "IP Addressing & Subnetting (IPv4 vs. IPv6)",
    "Common Protocols: HTTP, HTTPS, TCP, UDP, DNS",
    "Routing & Switching Fundamentals",
    "Network Security: Firewalls & SSL/TLS Handshakes"
  ],
  7: [ // Operating Systems
    "Process Management & CPU Scheduling",
    "Threads & Process Synchronization (Mutex, Semaphores)",
    "Memory Management (Paging, Segmentation, Virtual Memory)",
    "Deadlock Detection & Prevention",
    "File Systems & I/O Management"
  ],
  8: [ // Git and GitHub
    "Version Control System Concepts",
    "Basic Workflows: git init, clone, add, commit, status",
    "Branching, Merging, and Conflict Resolution",
    "Remote Operations: git push, pull, fetch, remote",
    "GitHub Collaboration: Pull Requests, Code Reviews, Forks"
  ],
  9: [ // Problem Solving
    "Analyzing Problem Statements & Edge Cases",
    "Optimal Space-Time Tradeoffs",
    "Bit Manipulation Hacks",
    "Two Pointers & Sliding Window techniques",
    "Greedy Algorithms & Backtracking"
  ],
  10: [ // HTML
    "Document Structures & DOCTYPE declaration",
    "Semantic HTML Elements (article, section, nav, header)",
    "Forms, Input Types, and Form Validations",
    "Media Elements (img, video, audio, picture)",
    "SEO Basics & Accessibility (ARIA) Standards"
  ],
  11: [ // CSS
    "Selectors, Specificity, and Box Model",
    "Flexbox Layout System",
    "CSS Grid Layout System",
    "Transitions, Keyframe Animations & Transforms",
    "Responsive Design & Media Queries"
  ],
  12: [ // JavaScript
    "Variables, Scope, Closures, and Execution Context",
    "Arrow Functions, Higher-Order Functions",
    "DOM Manipulation & Dynamic Event Handling",
    "Asynchronous JS: Promises, Async/Await, and Web APIs",
    "Modern ES6+ Features (Destructuring, Spread, Rest, Modules)"
  ],
  13: [ // TypeScript
    "Static Typing: Interfaces, Type Aliases, and Enums",
    "Generics & Interface Type Mapping",
    "Union, Intersection, and Type Guards",
    "TS Configuration (tsconfig.json) & Compilation"
  ],
  14: [ // React
    "JSX Syntax & Component Architecture",
    "State (useState) & Props Management",
    "Component Lifecycle & useEffect Hook",
    "Handling Lists, Keys, and Conditional Rendering",
    "Context API & Global State Management",
    "Custom Hooks & Component Memoization (useMemo, useCallback)"
  ],
  15: [ // Spring Boot
    "Inversion of Control (IoC) & Dependency Injection (DI) (Autowired, Component)",
    "Spring Boot Starters, Application Properties, and Auto-Configuration",
    "Creating REST APIs with Controllers (@RestController, @RequestMapping)",
    "Spring Data JPA integration & Hibernate Mapping",
    "Global Exception Handling (@ControllerAdvice, @ExceptionHandler)",
    "Spring Security & JWT Authentication Architecture"
  ],
  16: [ // System Design
    "Vertical vs. Horizontal Scaling & High Availability",
    "Load Balancers, Reverse Proxies, and CDNs",
    "Caching Strategies (Client-side, Redis, Memcached)",
    "Database Sharding, Replication, and ACID vs BASE",
    "Microservices Architecture & Event-Driven messaging (Kafka/RabbitMQ)"
  ],
  17: [ // Docker
    "Containerization vs. Traditional Virtualization",
    "Writing custom Dockerfiles",
    "Docker Images, Containers, registry pushes, and run Commands",
    "Docker Volumes for Persistent Storage",
    "Docker Compose files for multi-container orchestration"
  ],
  18: [ // Kubernetes
    "Kubernetes Cluster Architecture (Control Plane, Nodes, Kubelet)",
    "K8s Resource Objects: Pods, Services, and Deployments",
    "Configuration Management: ConfigMaps & Secrets",
    "Ingress Controllers and Load Balancing",
    "Persistent Volumes (PV) & Claims (PVC)"
  ],
  19: [ // Cloud Computing (AWS/Azure)
    "Cloud Deployments: Public, Private, Hybrid models",
    "Compute Instances: AWS EC2 / Azure VMs",
    "Object and Block Storage: AWS S3 / Azure Blobs",
    "Cloud Networking: VPCs, Subnets, Gateways, Route Tables",
    "Identity & Access Management (IAM) Policies"
  ],
  20: [ // Node.js & Express
    "Node Event Loop, Asynchronous & Non-blocking I/O",
    "npm Package Ecosystem & package.json scripts",
    "Creating Routing Middleware with Express",
    "RESTful API design & Request validations",
    "Database integration (MongoDB, SQL) in Node"
  ],
  21: [ // MongoDB
    "NoSQL Document Databases vs. RDBMS",
    "Document and BSON structure layout",
    "Complex CRUD operations & querying",
    "Indexes & Aggregation Pipeline Stages",
    "Mongoose ODM implementation in Node"
  ],
  22: [ // Python
    "Variables, Operators, Control Flow, and Loops",
    "Built-in Data Structures: Lists, Tuples, Dictionaries, Sets",
    "Functional Programming, Modules, and Packages",
    "File I/O operations & virtualenv management",
    "Data Libraries: NumPy and Pandas basics"
  ],
  23: [ // Machine Learning
    "Supervised Learning: Linear Regression, Decisions Trees, SVMs",
    "Unsupervised Learning: K-Means Clustering & PCA",
    "Evaluation metrics: Accuracy, Precision, Recall, ROC-AUC",
    "Overfitting vs. Underfitting (Bias-Variance Tradeoff)",
    "ML libraries: Scikit-Learn pipelines"
  ],
  24: [ // Deep Learning
    "Artificial Neural Networks (ANN), Layers & Activation Functions",
    "Forward Pass, Loss functions, and Backpropagation",
    "Convolutional Neural Networks (CNNs) for Computer Vision",
    "Recurrent Neural Networks (RNNs/LSTMs) for NLP",
    "Deep Learning Frameworks: PyTorch or TensorFlow basics"
  ],
  25: [ // Statistics
    "Measures of Central Tendency (Mean, Median, Mode) and Dispersion",
    "Probability Distributions: Normal, Binomial, Uniform",
    "Statistical Significance, Z-score, and Central Limit Theorem",
    "Hypothesis Testing: t-test, p-value interpretation, ANOVA",
    "Correlation metrics and Simple Linear Regression"
  ],
  26: [ // Tableau & Power BI
    "Data ingestion, modeling, and schema relations",
    "Calculated fields & Data Analysis Expressions (DAX)",
    "Creating interactive visual maps, charts, and tables",
    "Designing and publishing dashboard metrics"
  ],
  27: [ // Excel
    "Advanced formulas: VLOOKUP, INDEX-MATCH, XLOOKUP",
    "Pivot Tables & Pivot Charts for business insights",
    "Data validation rules, filters, and conditional formatting",
    "Macros & basic VBA scripting basics"
  ],
  28: [ // Linux
    "Linux File System hierarchies & paths",
    "Terminal commands: cd, ls, mkdir, rm, cp, mv, cat",
    "File System permissions (chmod, chown)",
    "Process Management & utilities (ps, top, kill)",
    "Pipelines & filtering: grep, find, tail, awk"
  ]
};

function App() {
  // Navigation & User State
  const [user, setUser] = useState(null);
  const [currentTab, setCurrentTab] = useState('landing'); // landing, wizard, dashboard, gap, roadmap, gamification
  const [roles, setRoles] = useState([]);
  const [skills, setSkills] = useState([]);
  
  // Persistent check states for detailed roadmap sub-topics
  const [completedTopics, setCompletedTopics] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('sga_completed_topics') || '{}');
    } catch (e) {
      return {};
    }
  });

  const handleToggleTopic = (skillId, topicIdx) => {
    const key = `${skillId}-${topicIdx}`;
    const newCompleted = { ...completedTopics, [key]: !completedTopics[key] };
    setCompletedTopics(newCompleted);
    localStorage.setItem('sga_completed_topics', JSON.stringify(newCompleted));
  };

  const [expandedMilestones, setExpandedMilestones] = useState({});

  const toggleMilestoneExpanded = (milestoneId, isFirstOrIncomplete) => {
    const isCurrentlyExpanded = expandedMilestones[milestoneId] !== undefined
      ? expandedMilestones[milestoneId]
      : isFirstOrIncomplete;
      
    setExpandedMilestones({
      ...expandedMilestones,
      [milestoneId]: !isCurrentlyExpanded
    });
  };
  
  // Loading & Error States
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Report & Roadmap State
  const [analysisReport, setAnalysisReport] = useState(null);
  const [roadmap, setRoadmap] = useState([]);

  // Form Wizard State
  const [wizardName, setWizardName] = useState('');
  const [wizardEducation, setWizardEducation] = useState('B.Tech Computer Science');
  const [wizardCollege, setWizardCollege] = useState('');
  const [wizardYear, setWizardYear] = useState(2027);
  const [wizardRole, setWizardRole] = useState('');
  const [selectedSkills, setSelectedSkills] = useState({}); // skillId -> proficiency

  // Fetch initial catalog data
  useEffect(() => {
    fetchCatalogData();
    // Check if user is cached in localStorage
    const cachedUserId = localStorage.getItem('sga_user_id');
    if (cachedUserId) {
      loadUserProfile(parseInt(cachedUserId));
    }
  }, []);

  const fetchCatalogData = async () => {
    try {
      setApiError(null);
      const rolesRes = await fetch(`${API_BASE}/roles`);
      const skillsRes = await fetch(`${API_BASE}/skills`);
      
      if (!rolesRes.ok || !skillsRes.ok) {
        throw new Error("Failed to load catalog data from the backend.");
      }
      
      const rolesData = await rolesRes.json();
      const skillsData = await skillsRes.json();
      
      setRoles(rolesData);
      setSkills(skillsData);
      if (rolesData.length > 0) {
        setWizardRole(rolesData[0].id.toString());
      }
    } catch (err) {
      console.error(err);
      setApiError("Backend is offline or database configuration is loading. Please make sure the Spring Boot server is running.");
    }
  };

  const loadUserProfile = async (userId) => {
    setLoading(true);
    try {
      const userRes = await fetch(`${API_BASE}/users/${userId}`);
      if (!userRes.ok) {
        throw new Error("User profile not found.");
      }
      const userData = await userRes.json();
      setUser(userData);
      
      // Load Analysis
      const analysisRes = await fetch(`${API_BASE}/analysis/${userId}`);
      if (!analysisRes.ok) {
        throw new Error("Failed to load gap analysis.");
      }
      const analysisData = await analysisRes.json();
      setAnalysisReport(analysisData);

      // Load Roadmap
      const roadmapRes = await fetch(`${API_BASE}/roadmap/${userId}`);
      const roadmapData = await roadmapRes.json();
      setRoadmap(roadmapData);

      setCurrentTab('dashboard');
    } catch (err) {
      console.error("Error loading user profile", err);
      // Clean up bad localStorage state
      localStorage.removeItem('sga_user_id');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProfile = async (e) => {
    e.preventDefault();
    if (!wizardName || !wizardCollege) {
      alert("Please fill in all profile fields.");
      return;
    }
    
    const formattedSkills = Object.keys(selectedSkills).map(skillId => ({
      skillId: parseInt(skillId),
      proficiency: selectedSkills[skillId]
    }));

    if (formattedSkills.length === 0) {
      alert("Please select at least one current technical skill.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: wizardName,
        education: wizardEducation,
        college: wizardCollege,
        graduationYear: parseInt(wizardYear),
        dreamRoleId: parseInt(wizardRole),
        skills: formattedSkills
      };

      const res = await fetch(`${API_BASE}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error("Failed to save profile.");
      }

      const savedUser = await res.json();
      setUser(savedUser);
      localStorage.setItem('sga_user_id', savedUser.id.toString());
      
      // Load reports
      await loadUserProfile(savedUser.id);
    } catch (err) {
      console.error(err);
      alert("Error saving profile. Please check if your backend is running.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleMilestone = async (milestoneId) => {
    try {
      const res = await fetch(`${API_BASE}/roadmap/milestones/${milestoneId}/complete`, {
        method: 'PUT'
      });
      if (!res.ok) throw new Error("Could not update milestone");
      
      // Reload User for updated XP/Streak and Roadmap
      if (user) {
        const userRes = await fetch(`${API_BASE}/users/${user.id}`);
        const userData = await userRes.ok ? await userRes.json() : user;
        setUser(userData);
        
        const roadmapRes = await fetch(`${API_BASE}/roadmap/${user.id}`);
        const roadmapData = await roadmapRes.ok ? await roadmapRes.json() : roadmap;
        setRoadmap(roadmapData);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('sga_user_id');
    setUser(null);
    setAnalysisReport(null);
    setRoadmap([]);
    // Clear form wizard
    setWizardName('');
    setWizardCollege('');
    setSelectedSkills({});
    setCurrentTab('landing');
  };

  // Gamification: Resolve Badges
  const getBadges = () => {
    if (!analysisReport || !user) return [];
    
    const badges = [
      { id: 'starter', name: 'Explorer Starter', desc: 'Created your skill profile', icon: '🚀', unlocked: true },
      { id: 'java', name: 'Java Explorer', desc: 'Possess Java fundamentals', icon: '☕', unlocked: false },
      { id: 'spring', name: 'Spring Developer', desc: 'Spring Boot skill reported', icon: '🍃', unlocked: false },
      { id: 'sql', name: 'SQL Expert', desc: 'Database querying master', icon: '💾', unlocked: false },
      { id: 'dsa', name: 'DSA Warrior', desc: 'Structures & Algorithms master', icon: '🧠', unlocked: false },
      { id: 'milestone', name: 'Milestone Finisher', desc: 'Completed at least 1 milestone', icon: '🏆', unlocked: false },
      { id: 'ready', name: 'Career Ready', desc: 'Readiness Score is over 80%', icon: '🎯', unlocked: false }
    ];

    // Evaluate credentials
    const allKnownSkills = [
      ...analysisReport.strongSkills,
      ...analysisReport.weakSkills
    ];

    const hasSkill = (name) => allKnownSkills.some(s => s.skillName.toLowerCase().includes(name.toLowerCase()));
    const hasProficientSkill = (name) => analysisReport.strongSkills.some(s => s.skillName.toLowerCase().includes(name.toLowerCase()));

    if (hasSkill('Java')) badges[1].unlocked = true;
    if (hasSkill('Spring')) badges[2].unlocked = true;
    if (hasProficientSkill('SQL')) badges[3].unlocked = true;
    if (hasProficientSkill('Structures')) badges[4].unlocked = true;
    if (roadmap.some(m => m.completed)) badges[5].unlocked = true;
    if (analysisReport.readinessScore >= 80) badges[6].unlocked = true;

    return badges;
  };

  const activeMilestonesCount = roadmap.filter(m => m.completed).length;
  const roadmapProgressPercent = roadmap.length === 0 ? 0 : Math.round((activeMilestonesCount / roadmap.length) * 100);

  return (
    <div>
      {/* Top Navbar */}
      <header className="nav-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 100%)',
            width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', color: '#030712'
          }}>
            SG
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: '800', fontFamily: 'var(--font-display)' }}>
            Skill<span className="gradient-text">Gap</span> Analyzer
          </span>
        </div>

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <nav className="nav-links">
              <span className={`nav-link ${currentTab === 'dashboard' ? 'active' : ''}`} onClick={() => setCurrentTab('dashboard')}>
                Dashboard
              </span>
              <span className={`nav-link ${currentTab === 'gap' ? 'active' : ''}`} onClick={() => setCurrentTab('gap')}>
                Gap Analysis
              </span>
              <span className={`nav-link ${currentTab === 'roadmap' ? 'active' : ''}`} onClick={() => setCurrentTab('roadmap')}>
                Roadmap
              </span>
              <span className={`nav-link ${currentTab === 'gamification' ? 'active' : ''}`} onClick={() => setCurrentTab('gamification')}>
                Badges & Streak
              </span>
            </nav>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '1px solid var(--border-glass)', paddingLeft: '1.5rem' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>{user.name}</div>
                <div style={{ fontSize: '0.7rem', color: 'hsl(var(--text-muted))' }}>{user.education}</div>
              </div>
              <button className="btn btn-secondary" style={{ padding: '0.5rem 0.75rem', fontSize: '0.8rem' }} onClick={handleLogout}>
                <LogOut size={14} /> Log Out
              </button>
            </div>
          </div>
        ) : (
          <div>
            {currentTab === 'landing' && (
              <button className="btn btn-primary" onClick={() => setCurrentTab('wizard')}>
                Get Started
              </button>
            )}
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="app-container">
        {apiError && (
          <div className="glass-panel" style={{ borderLeft: '4px solid hsl(var(--danger))', padding: '1rem 1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <AlertCircle size={24} style={{ color: 'hsl(var(--danger))' }} />
            <div>
              <div style={{ fontWeight: '700' }}>System Status Alert</div>
              <div style={{ fontSize: '0.85rem', color: 'hsl(var(--text-secondary))', marginTop: '0.25rem' }}>{apiError}</div>
            </div>
            <button className="btn btn-secondary" style={{ marginLeft: 'auto', padding: '0.5rem' }} onClick={fetchCatalogData}>
              <RefreshCw size={14} />
            </button>
          </div>
        )}

        {/* 1. LANDING PAGE VIEW */}
        {currentTab === 'landing' && (
          <section style={{ padding: '4rem 1rem', textAlign: 'center' }}>
            <div className="floating-element" style={{
              display: 'inline-flex', padding: '0.5rem 1rem', background: 'hsla(var(--primary), 0.1)', border: '1px solid hsla(var(--primary), 0.2)',
              borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600', color: 'hsl(var(--primary))', marginBottom: '2rem'
            }}>
              ✨ AI-Powered Career Learning Roadmaps
            </div>
            <h1 style={{ fontSize: '4rem', fontWeight: '800', lineHeight: '1.1', maxWidth: '800px', margin: '0 auto 1.5rem auto' }}>
              Know Your <span className="gradient-text">Skills</span>.<br />
              Discover Your <span className="gradient-text-pink">Gaps</span>.<br />
              Build Your Future.
            </h1>
            <p style={{ fontSize: '1.2rem', color: 'hsl(var(--text-secondary))', maxWidth: '600px', margin: '0 auto 2.5rem auto', lineHeight: '1.6' }}>
              Analyze your current capabilities against industry benchmarks, visualize your gaps, and follow a personalized month-by-month learning plan.
            </p>
            
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '4rem' }}>
              <button className="btn btn-accent" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }} onClick={() => setCurrentTab('wizard')}>
                Start Free Analysis <ArrowRight size={18} style={{ marginLeft: '0.25rem' }} />
              </button>
              <a href="#roles" className="btn btn-secondary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
                Explore Careers
              </a>
            </div>

            {/* Statistics Row */}
            <div className="dashboard-grid" style={{ maxWidth: '900px', margin: '0 auto 4rem auto' }}>
              <div className="glass-panel" style={{ padding: '2rem' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: '800' }} className="gradient-text">7+</div>
                <div style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.9rem', marginTop: '0.5rem' }}>Industry Roles Map</div>
              </div>
              <div className="glass-panel" style={{ padding: '2rem' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: '800' }} className="gradient-text-pink">28+</div>
                <div style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.9rem', marginTop: '0.5rem' }}>Technical Skills tracked</div>
              </div>
              <div className="glass-panel" style={{ padding: '2rem' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: '800' }} className="gradient-text">100%</div>
                <div style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.9rem', marginTop: '0.5rem' }}>Structured Timeline Roadmap</div>
              </div>
            </div>

            {/* Career Roles Showcase */}
            <div id="roles" style={{ paddingTop: '2rem', textAlign: 'left', maxWidth: '1000px', margin: '0 auto' }}>
              <h2 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
                Supported Career Paths
              </h2>
              <div className="dashboard-grid">
                {roles.map(r => (
                  <div key={r.id} className="glass-panel" style={{ padding: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                      <Briefcase size={20} style={{ color: 'hsl(var(--primary))' }} />
                      <h3 style={{ fontSize: '1.1rem' }}>{r.roleName}</h3>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'hsl(var(--text-secondary))', lineHeight: '1.5' }}>
                      {r.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 2. FORM WIZARD VIEW */}
        {currentTab === 'wizard' && (
          <section style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="glass-panel" style={{ padding: '2.5rem' }}>
              <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                Setup Your Career Profile
              </h2>
              <p style={{ color: 'hsl(var(--text-secondary))', marginBottom: '2rem', fontSize: '0.95rem' }}>
                Provide your background details and technical skill levels to run the analysis engine.
              </p>

              <form onSubmit={handleCreateProfile}>
                <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input type="text" className="form-control" placeholder="Enter name" value={wizardName} onChange={(e) => setWizardName(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Education / Degree</label>
                    <input type="text" className="form-control" placeholder="e.g. B.Tech Computer Science" value={wizardEducation} onChange={(e) => setWizardEducation(e.target.value)} required />
                  </div>
                </div>

                <div className="dashboard-grid" style={{ gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                  <div className="form-group">
                    <label className="form-label">College / University Name</label>
                    <input type="text" className="form-control" placeholder="College Name" value={wizardCollege} onChange={(e) => setWizardCollege(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Graduation Year</label>
                    <input type="number" className="form-control" value={wizardYear} onChange={(e) => setWizardYear(e.target.value)} required />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '2rem' }}>
                  <label className="form-label">Select Your Dream Career Path</label>
                  <select className="form-control" value={wizardRole} onChange={(e) => setWizardRole(e.target.value)} style={{ background: '#0d1426' }}>
                    {roles.map(r => (
                      <option key={r.id} value={r.id}>{r.roleName}</option>
                    ))}
                  </select>
                </div>

                {/* Technical Skills Assessment */}
                <div className="form-group" style={{ marginBottom: '2rem' }}>
                  <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Assess Your Current Technical Skills</span>
                    <span style={{ fontSize: '0.75rem', textTransform: 'none', color: 'hsl(var(--primary))' }}>
                      Select all technologies you have learned
                    </span>
                  </label>
                  
                  <div className="skill-grid">
                    {skills.map(s => {
                      const isSelected = selectedSkills[s.id] !== undefined;
                      const currentProficiency = selectedSkills[s.id] || 'Beginner';

                      const toggleSkillSelection = () => {
                        const newSkills = { ...selectedSkills };
                        if (isSelected) {
                          delete newSkills[s.id];
                        } else {
                          newSkills[s.id] = 'Intermediate'; // Default selected level
                        }
                        setSelectedSkills(newSkills);
                      };

                      const setProficiency = (e, level) => {
                        e.stopPropagation(); // Avoid card toggle
                        setSelectedSkills({
                          ...selectedSkills,
                          [s.id]: level
                        });
                      };

                      return (
                        <div 
                          key={s.id} 
                          className={`skill-select-card ${isSelected ? 'selected' : ''}`}
                          onClick={toggleSkillSelection}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{s.skillName}</span>
                            <span style={{ fontSize: '0.7rem', color: 'hsl(var(--text-muted))' }}>{s.category}</span>
                          </div>
                          
                          {isSelected && (
                            <div className="proficiency-selector">
                              {['Beginner', 'Intermediate', 'Advanced'].map(lvl => (
                                <div 
                                  key={lvl} 
                                  className={`proficiency-btn ${currentProficiency === lvl ? 'active' : ''}`}
                                  onClick={(e) => setProficiency(e, lvl)}
                                >
                                  {lvl[0]}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-secondary" onClick={() => setCurrentTab('landing')}>
                    Back
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Analyzing Gaps...' : 'Generate Roadmap'}
                  </button>
                </div>
              </form>
            </div>
          </section>
        )}

        {/* LOADING SHIMMER */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <div style={{
              display: 'inline-block', width: '40px', height: '40px', border: '3px solid hsla(var(--primary), 0.2)', borderTopColor: 'hsl(var(--primary))',
              borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '1rem'
            }}></div>
            <div style={{ fontSize: '0.95rem', color: 'hsl(var(--text-secondary))' }}>Loading Career Gap Metrics...</div>
          </div>
        )}

        {/* 3. USER DASHBOARD VIEW */}
        {user && currentTab === 'dashboard' && analysisReport && (
          <section>
            {/* User details and streak indicator */}
            <div className="glass-panel" style={{ padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <div style={{ fontSize: '0.85rem', color: 'hsl(var(--text-secondary))', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Welcome back,</div>
                <h2 style={{ fontSize: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {user.name} <span style={{ fontSize: '1.25rem' }}>🎓</span>
                </h2>
                <div style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))', marginTop: '0.25rem' }}>
                  {user.education} &bull; {user.college} (Graduating {user.graduationYear})
                </div>
              </div>

              {/* Streak Tracker */}
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1.25rem', borderColor: 'hsla(var(--warning), 0.3)' }}>
                  <Flame size={28} style={{ color: 'hsl(var(--warning))', fill: 'hsl(var(--warning))' }} className="floating-element" />
                  <div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '800' }}>{user.streak} Days</div>
                    <div style={{ fontSize: '0.7rem', color: 'hsl(var(--text-secondary))' }}>Learning Streak</div>
                  </div>
                </div>

                <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1.25rem', borderColor: 'hsla(var(--primary), 0.3)' }}>
                  <Award size={28} style={{ color: 'hsl(var(--primary))' }} />
                  <div>
                    <div style={{ fontSize: '1.25rem', fontWeight: '800' }}>{user.xp} XP</div>
                    <div style={{ fontSize: '0.7rem', color: 'hsl(var(--text-secondary))' }}>Career score points</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dashboard Cards Grid */}
            <div className="dashboard-grid">
              <div className="glass-panel dashboard-card" style={{ borderLeft: '4px solid hsl(var(--primary))' }}>
                <div className="dashboard-card-title">Dream Career Role</div>
                <div className="dashboard-card-value" style={{ fontSize: '1.8rem' }}>{analysisReport.dreamRole}</div>
                <div className="dashboard-card-subtext">Mapped against standard industry skill frameworks</div>
              </div>

              <div className="glass-panel dashboard-card" style={{ borderLeft: '4px solid hsl(var(--secondary))' }}>
                <div className="dashboard-card-title">Readiness Score</div>
                <div className="dashboard-card-value" style={{ color: 'hsl(var(--secondary))' }}>{analysisReport.readinessScore}%</div>
                <div className="dashboard-card-subtext">Based on skill match and proficiency weights</div>
              </div>

              <div className="glass-panel dashboard-card" style={{ borderLeft: '4px solid hsl(var(--danger))' }}>
                <div className="dashboard-card-title">Missing Skills</div>
                <div className="dashboard-card-value" style={{ color: 'hsl(var(--danger))' }}>{analysisReport.missingSkillsCount}</div>
                <div className="dashboard-card-subtext">Technologies required that you haven't learned yet</div>
              </div>

              <div className="glass-panel dashboard-card" style={{ borderLeft: '4px solid hsl(var(--success))' }}>
                <div className="dashboard-card-title">Roadmap Progress</div>
                <div className="dashboard-card-value" style={{ color: 'hsl(var(--success))' }}>{roadmapProgressPercent}%</div>
                <div className="dashboard-card-subtext">{activeMilestonesCount} of {roadmap.length} Milestones completed</div>
              </div>
            </div>

            {/* Side-by-side Layout: Summary & Quick Roadmap */}
            <div className="dashboard-row">
              {/* Left Column: Quick Gap visualizer */}
              <div className="glass-panel" style={{ padding: '1.75rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <TrendingUp size={20} style={{ color: 'hsl(var(--primary))' }} /> Skill Breakdown
                </h3>
                
                {/* Visual Progress Bar */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                    <span style={{ color: 'hsl(var(--text-secondary))' }}>Skill Match Progress</span>
                    <span style={{ fontWeight: '700' }}>{analysisReport.matchPercentage}%</span>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${analysisReport.matchPercentage}%`, height: '100%', background: 'linear-gradient(to right, hsl(var(--primary)), hsl(var(--secondary)))', borderRadius: '4px' }}></div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
                    <span style={{ fontSize: '0.85rem', color: 'hsl(var(--text-secondary))' }}>Strong Skills</span>
                    <span className="tag tag-success">{analysisReport.strongSkills.length}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
                    <span style={{ fontSize: '0.85rem', color: 'hsl(var(--text-secondary))' }}>Weak Skills (Refinement needed)</span>
                    <span className="tag tag-warning">{analysisReport.weakSkills.length}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
                    <span style={{ fontSize: '0.85rem', color: 'hsl(var(--text-secondary))' }}>Missing Skills (To learn)</span>
                    <span className="tag tag-danger">{analysisReport.missingSkillsCount}</span>
                  </div>
                </div>

                <button className="btn btn-secondary" style={{ width: '100%', marginTop: '1.5rem' }} onClick={() => setCurrentTab('gap')}>
                  View Skill Radar Chart
                </button>
              </div>

              {/* Right Column: Mini Roadmap Timeline */}
              <div className="glass-panel" style={{ padding: '1.75rem' }}>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BookOpen size={20} style={{ color: 'hsl(var(--secondary))' }} /> Next Learning Steps
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {roadmap.slice(0, 3).map(m => (
                    <div key={m.id} style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '1rem' }}>
                      <div 
                        onClick={() => handleToggleMilestone(m.id)}
                        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', marginTop: '0.25rem' }}
                      >
                        {m.completed ? (
                          <CheckCircle size={22} style={{ color: 'hsl(var(--success))' }} />
                        ) : (
                          <Circle size={22} style={{ color: 'hsl(var(--text-muted))' }} />
                        )}
                      </div>
                      <div>
                        <h4 style={{ fontSize: '0.95rem', color: m.completed ? 'hsl(var(--text-muted))' : 'hsl(var(--text-primary))', textDecoration: m.completed ? 'line-through' : 'none' }}>
                          {m.milestone}
                        </h4>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                          {m.skills.map(s => (
                            <span 
                              key={s.skillId} 
                              className={`tag ${s.proficiency === 'None' ? 'tag-danger' : s.proficiency === 'Beginner' ? 'tag-warning' : 'tag-success'}`}
                              style={{ fontSize: '0.65rem' }}
                            >
                              {s.skillName}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} onClick={() => setCurrentTab('roadmap')}>
                  Explore Full Detailed Roadmap
                </button>
              </div>
            </div>
          </section>
        )}

        {/* 4. SKILL GAP ANALYSIS VIEW */}
        {user && currentTab === 'gap' && analysisReport && (
          <section>
            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.75rem' }}>Skill Gap Comparison Screen</h2>
                  <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                    Comparing your skills against standard industry requirements for <strong>{analysisReport.dreamRole}</strong>.
                  </p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem 1.5rem', borderRadius: '8px', border: '1px solid var(--border-glass)', textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', textTransform: 'uppercase' }}>Readiness Status</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'hsl(var(--secondary))' }}>
                    {analysisReport.readinessScore >= 80 ? 'Job-Ready Candidate' : analysisReport.readinessScore >= 50 ? 'Developing Skills' : 'Needs Foundation'}
                  </div>
                </div>
              </div>

              {/* Chart & Lists Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2.5rem' }}>
                
                {/* Left Side: Radar Chart */}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: 'rgba(0,0,0,0.15)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '600', color: 'hsl(var(--text-secondary))', marginBottom: '1.5rem' }}>
                    Skill Proficiency Framework Map
                  </div>
                  
                  {analysisReport.chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={350}>
                      <RadarChart cx="50%" cy="50%" outerRadius="75%" data={analysisReport.chartData}>
                        <PolarGrid stroke="#1e293b" />
                        <PolarAngleAxis dataKey="skillName" stroke="#94a3b8" fontSize={11} />
                        <PolarRadiusAxis angle={30} domain={[0, 10]} stroke="#475569" />
                        <Radar name="Required Benchmark" dataKey="requiredLevel" stroke="hsl(var(--secondary))" fill="hsl(var(--secondary))" fillOpacity={0.1} />
                        <Radar name="Your Current Level" dataKey="userLevel" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.35} />
                        <Tooltip contentStyle={{ background: '#0f172a', borderColor: '#334155', color: '#f8fafc' }} />
                        <Legend wrapperStyle={{ fontSize: '12px' }} />
                      </RadarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div style={{ color: 'hsl(var(--text-muted))', padding: '4rem' }}>No charting details available.</div>
                  )}
                </div>

                {/* Right Side: Skills Breakdown Lists */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  
                  {/* Strong Skills */}
                  <div>
                    <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <CheckCircle size={16} style={{ color: 'hsl(var(--success))' }} /> 
                      Strong Skills &bull; <span style={{ color: 'hsl(var(--text-muted))', fontSize: '0.85rem' }}>{analysisReport.strongSkills.length}</span>
                    </h3>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {analysisReport.strongSkills.length > 0 ? (
                        analysisReport.strongSkills.map(s => (
                          <div key={s.skillId} className="tag tag-success" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.4rem 0.6rem' }}>
                            {s.skillName} <span style={{ fontSize: '0.6rem', opacity: 0.8 }}>({s.proficiency[0]})</span>
                          </div>
                        ))
                      ) : (
                        <div style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))' }}>No strong skills listed. Build some foundations.</div>
                      )}
                    </div>
                  </div>

                  {/* Weak Skills */}
                  <div>
                    <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <AlertCircle size={16} style={{ color: 'hsl(var(--warning))' }} /> 
                      Weak Skills (Need Refinement) &bull; <span style={{ color: 'hsl(var(--text-muted))', fontSize: '0.85rem' }}>{analysisReport.weakSkills.length}</span>
                    </h3>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {analysisReport.weakSkills.length > 0 ? (
                        analysisReport.weakSkills.map(s => (
                          <div key={s.skillId} className="tag tag-warning" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.4rem 0.6rem' }}>
                            {s.skillName} <span style={{ fontSize: '0.6rem', opacity: 0.8 }}>({s.proficiency[0]})</span>
                          </div>
                        ))
                      ) : (
                        <div style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))' }}>No intermediate/beginner gap refinement required.</div>
                      )}
                    </div>
                  </div>

                  {/* Missing Skills */}
                  <div>
                    <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <AlertCircle size={16} style={{ color: 'hsl(var(--danger))' }} /> 
                      Missing Skills (To Learn) &bull; <span style={{ color: 'hsl(var(--text-muted))', fontSize: '0.85rem' }}>{analysisReport.missingSkillsCount}</span>
                    </h3>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {analysisReport.missingSkills.length > 0 ? (
                        analysisReport.missingSkills.map(s => (
                          <div key={s.skillId} className="tag tag-danger" style={{ padding: '0.4rem 0.6rem' }}>
                            {s.skillName}
                          </div>
                        ))
                      ) : (
                        <div style={{ fontSize: '0.85rem', color: 'hsl(var(--text-success))', fontWeight: '600' }}>Success! You cover all required skills.</div>
                      )}
                    </div>
                  </div>

                  {/* Quick Action Info */}
                  <div className="glass-card" style={{ padding: '1rem', borderStyle: 'dashed', borderColor: 'hsla(var(--primary), 0.3)', marginTop: 'auto' }}>
                    <div style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>
                      <strong>💡 Roadmap Strategy:</strong> We have compiled resource guides for all your missing and weak skills. Go to the <strong>Roadmap Tab</strong> to start learning.
                    </div>
                  </div>

                </div>

              </div>

            </div>
          </section>
        )}

        {/* 5. LEARNING ROADMAP TIMELINE VIEW */}
        {user && currentTab === 'roadmap' && (
          <section>
            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.75rem' }}>Personalized Learning Roadmap</h2>
                  <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                    Follow this step-by-step month timeline to fill your technical gaps and become job-ready.
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.25rem', fontWeight: '800' }}>{roadmapProgressPercent}% Done</div>
                  <div style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>{activeMilestonesCount} of {roadmap.length} Milestones</div>
                </div>
              </div>

              {roadmap.length > 0 ? (
                <div className="timeline">
                  {roadmap.map((m, idx) => {
                    const defaultExpanded = idx === 0 || !m.completed;
                    const isExpanded = expandedMilestones[m.id] !== undefined
                      ? expandedMilestones[m.id]
                      : defaultExpanded;
                    
                    return (
                      <div key={m.id} className={`timeline-item ${m.completed ? 'completed' : ''}`}>
                        <div 
                          className="timeline-dot" 
                          onClick={() => handleToggleMilestone(m.id)}
                          style={{ cursor: 'pointer' }}
                          title="Click to toggle completion status"
                        >
                          {m.completed ? <Check size={16} /> : m.targetMonth}
                        </div>
                        
                        <div className="timeline-content">
                          <div 
                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
                            onClick={() => toggleMilestoneExpanded(m.id, defaultExpanded)}
                          >
                            <div>
                              <h3 style={{ fontSize: '1.15rem', color: m.completed ? 'hsl(var(--text-secondary))' : 'hsl(var(--text-primary))' }}>
                                {m.milestone}
                              </h3>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                                <Calendar size={12} style={{ color: 'hsl(var(--text-muted))' }} />
                                <span style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))' }}>
                                  Target: {m.targetDate ? new Date(m.targetDate).toLocaleDateString(undefined, {month: 'long', year: 'numeric'}) : `Month ${m.targetMonth}`}
                                </span>
                              </div>
                            </div>
                            <div>
                              {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                            </div>
                          </div>

                          {isExpanded && (
                            <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-glass)', paddingTop: '1.25rem' }}>
                              <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'hsl(var(--text-secondary))', marginBottom: '0.75rem' }}>
                                Skills covered in this milestone:
                              </h4>

                              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {m.skills.map(skill => (
                                  <div key={skill.skillId} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-glass)', borderRadius: '6px', padding: '0.75rem 1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                      <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{skill.skillName}</span>
                                      <span className={`tag ${
                                        skill.proficiency === 'Advanced' ? 'tag-success' : 
                                        skill.proficiency === 'Intermediate' ? 'tag-success' : 
                                        skill.proficiency === 'Beginner' ? 'tag-warning' : 'tag-danger'
                                      }`} style={{ fontSize: '0.65rem' }}>
                                        Current: {skill.proficiency === 'None' ? 'Missing' : skill.proficiency}
                                      </span>
                                    </div>

                                    {/* Recommended resources */}
                                    <div style={{ paddingLeft: '0.5rem', borderLeft: '2px solid hsla(var(--primary), 0.3)', marginTop: '0.5rem' }}>
                                      <div style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', fontWeight: '600', marginBottom: '0.25rem' }}>
                                        Recommended Resources:
                                      </div>
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                        {skill.resources.map((res, rIdx) => (
                                          <a 
                                            key={rIdx} 
                                            href={res.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            style={{ fontSize: '0.8rem', color: 'hsl(var(--secondary))', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                                          >
                                            <ExternalLink size={10} /> {res.name} <span style={{ fontSize: '0.65rem', color: 'hsl(var(--text-muted))' }}>({res.type})</span>
                                          </a>
                                        ))}
                                      </div>
                                    </div>

                                    {/* Structured curriculum topics guide */}
                                    {SKILL_TOPICS[skill.skillId] && (
                                      <div style={{ paddingLeft: '0.5rem', borderLeft: '2px solid hsla(var(--secondary), 0.3)', marginTop: '0.75rem', paddingTop: '0.25rem' }}>
                                        <div style={{ fontSize: '0.75rem', color: 'hsl(var(--text-muted))', fontWeight: '600', marginBottom: '0.4rem' }}>
                                          Structured Curriculum Guide:
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                          {SKILL_TOPICS[skill.skillId].map((topic, tIdx) => {
                                            const topicKey = `${skill.skillId}-${tIdx}`;
                                            const isTopicCompleted = !!completedTopics[topicKey];
                                            return (
                                              <div 
                                                key={tIdx} 
                                                style={{ 
                                                  display: 'flex', 
                                                  alignItems: 'flex-start', 
                                                  gap: '0.5rem', 
                                                  fontSize: '0.8rem', 
                                                  color: isTopicCompleted ? 'hsl(var(--text-muted))' : 'hsl(var(--text-secondary))',
                                                  textDecoration: isTopicCompleted ? 'line-through' : 'none',
                                                  cursor: 'pointer',
                                                  userSelect: 'none'
                                                }}
                                                onClick={() => handleToggleTopic(skill.skillId, tIdx)}
                                              >
                                                <input 
                                                  type="checkbox" 
                                                  checked={isTopicCompleted} 
                                                  onChange={() => {}} // Toggled by parent div onClick
                                                  style={{ 
                                                    marginTop: '0.15rem', 
                                                    accentColor: 'hsl(var(--secondary))',
                                                    cursor: 'pointer'
                                                  }} 
                                                />
                                                <span>{topic}</span>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    )}

                                  </div>
                                ))}
                              </div>

                              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                                <button 
                                  className={`btn ${m.completed ? 'btn-secondary' : 'btn-primary'}`} 
                                  onClick={() => handleToggleMilestone(m.id)}
                                  style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                                >
                                  {m.completed ? 'Mark Incomplete' : 'Complete Milestone (+100 XP)'}
                                </button>
                              </div>
                            </div>
                          )}

                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '4rem', color: 'hsl(var(--text-muted))' }}>
                  No learning roadmap has been generated yet.
                </div>
              )}

            </div>
          </section>
        )}

        {/* 6. GAMIFICATION SCREEN */}
        {user && currentTab === 'gamification' && (
          <section style={{ maxWidth: '800px', margin: '0 auto' }}>
            {/* Streak card */}
            <div className="glass-panel" style={{ padding: '2.5rem', textAlign: 'center', marginBottom: '2rem' }}>
              <div className="floating-element" style={{ display: 'inline-block', marginBottom: '1rem' }}>
                <Flame size={72} style={{ color: 'hsl(var(--warning))', fill: 'hsl(var(--warning))' }} />
              </div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>
                {user.streak} Days Learning Streak!
              </h2>
              <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '1rem', maxWidth: '500px', margin: '0 auto 1.5rem auto' }}>
                Keep completing monthly milestones to maintain your streak and demonstrate consistent growth to potential employers.
              </p>
              
              <div style={{ maxWidth: '400px', margin: '0 auto', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
                <div style={{ fontSize: '0.85rem', color: 'hsl(var(--text-muted))' }}>XP Level Rating</div>
                <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'hsl(var(--primary))', margin: '0.25rem 0' }}>
                  Level {Math.floor(user.xp / 500) + 1} Professional
                </div>
                <div style={{ fontSize: '0.75rem', color: 'hsl(var(--text-secondary))' }}>
                  {user.xp} Total XP &bull; Next level in {(500 - (user.xp % 500))} XP
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', marginTop: '0.75rem', overflow: 'hidden' }}>
                  <div style={{ width: `${(user.xp % 500) / 5}%`, height: '100%', background: 'hsl(var(--primary))' }}></div>
                </div>
              </div>
            </div>

            {/* Achievement Badges Section */}
            <div className="glass-panel" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                Earned Achievement Badges
              </h3>
              <p style={{ color: 'hsl(var(--text-secondary))', fontSize: '0.9rem', marginBottom: '2rem' }}>
                Unlock career badges by updating technical skills and completing milestones.
              </p>

              <div className="badge-grid">
                {getBadges().map(b => (
                  <div key={b.id} className={`badge-card ${b.unlocked ? 'unlocked' : ''}`}>
                    <div style={{ fontSize: '2.5rem' }} className="badge-icon">
                      {b.icon}
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '0.25rem', color: b.unlocked ? 'hsl(var(--text-primary))' : 'hsl(var(--text-muted))' }}>
                      {b.name}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'hsl(var(--text-muted))', lineHeight: '1.3' }}>
                      {b.desc}
                    </div>
                    <div style={{ marginTop: '0.75rem' }}>
                      {b.unlocked ? (
                        <span className="tag tag-success" style={{ fontSize: '0.6rem', padding: '0.15rem 0.4rem' }}>
                          <Check size={8} style={{ marginRight: '2px' }} /> Unlocked
                        </span>
                      ) : (
                        <span className="tag tag-optional" style={{ fontSize: '0.6rem', padding: '0.15rem 0.4rem' }}>
                          Locked
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <footer style={{ borderTop: '1px solid var(--border-glass)', padding: '2rem', textAlign: 'center', fontSize: '0.8rem', color: 'hsl(var(--text-muted))', marginTop: '4rem' }}>
        Skill Gap Analyzer and Learning Roadmap System &copy; {new Date().getFullYear()} &bull; Designed with Vanilla CSS & Spring Boot
      </footer>
    </div>
  );
}

export default App;
