// Initial mock data with rich student profiles, hackathon projects, requests, and chats

export const INITIAL_STUDENTS = [
    {
        id: "user-1",
        name: "Alex Chen",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        university: "UC Berkeley",
        major: "Computer Science & AI",
        year: "Junior (3rd Year)",
        bio: "Passionate AI engineer building multimodal vision & voice models. Leading the Smart Campus Assistant project.",
        experience: "Advanced",
        availability: "25 hrs/week",
        availabilityType: "Hackathon Sprints & Weekends",
        workingStyle: "Collaborative & Sprint-Focused",
        primaryRole: "AI / ML Developer",
        secondaryRoles: ["Backend Developer"],
        skills: ["Python", "PyTorch", "OpenCV", "FastAPI", "Docker", "Machine Learning"],
        interests: ["Campus AI", "Education Tech", "Computer Vision", "Assistants"],
        hackathonHistory: [
            { event: "CalHacks 10.0", achievement: "1st Place - AI Track" },
            { event: "TreeHacks 2025", achievement: "Top 10 Finalist" }
        ],
        github: "github.com/alexchen-ai",
        portfolio: "alexchen.dev",
        linkedin: "linkedin.com/in/alexchen-ai"
    },
    {
        id: "user-2",
        name: "Maya Patel",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        university: "Stanford University",
        major: "Product Design & HCI",
        year: "Senior (4th Year)",
        bio: "Product designer passionate about intuitive student experiences, design systems, and rapid prototyping in Figma.",
        experience: "Advanced",
        availability: "20 hrs/week",
        availabilityType: "Evenings & Full Hackathon",
        workingStyle: "User-Centered & Iterative Prototyper",
        primaryRole: "UI/UX Designer",
        secondaryRoles: ["Frontend Developer", "Pitch / Presenter"],
        skills: ["Figma", "UI Design", "User Research", "TailwindCSS", "Wireframing", "React"],
        interests: ["Campus Apps", "Accessibility", "Design Systems", "HCI"],
        hackathonHistory: [
            { event: "TreeHacks 2025", achievement: "Best UI/UX Design Winner" },
            { event: "HackDavis 2024", achievement: "2nd Place Overall" }
        ],
        github: "github.com/mayapatel-ux",
        portfolio: "mayapatel.design",
        linkedin: "linkedin.com/in/mayapatel-design"
    },
    {
        id: "user-3",
        name: "Marcus Vance",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        university: "Carnegie Mellon",
        major: "Software Engineering",
        year: "Junior (3rd Year)",
        bio: "Frontend craftsman specializing in ultra-fast React, Next.js, interactive visual animations, and real-time dashboard data.",
        experience: "Intermediate",
        availability: "20 hrs/week",
        availabilityType: "Weekends & Hackathon Sprint",
        workingStyle: "Fast Coder & Pair Programmer",
        primaryRole: "Frontend Developer",
        secondaryRoles: ["Fullstack Developer"],
        skills: ["React", "Next.js", "TypeScript", "TailwindCSS", "WebSockets", "JavaScript"],
        interests: ["Student Portals", "Data Visualization", "Developer Tools", "Gamification"],
        hackathonHistory: [
            { event: "TartHacks 2025", achievement: "Best Web App Award" }
        ],
        github: "github.com/marcus-vance",
        portfolio: "marcusvance.io",
        linkedin: "linkedin.com/in/marcusvance"
    },
    {
        id: "user-4",
        name: "Sarah Lin",
        avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
        university: "MIT Sloan / EECS",
        major: "Business Analytics & CS",
        year: "Senior (4th Year)",
        bio: "Storyteller, product strategist, and seasoned pitch presenter. Won 3 hackathon pitch awards with compelling demo narratives.",
        experience: "Advanced",
        availability: "15 hrs/week",
        availabilityType: "Hackathon Sprint & Demo Day Prep",
        workingStyle: "Storytelling & High-Energy Presenter",
        primaryRole: "Pitch / Presenter",
        secondaryRoles: ["Product Manager", "UI/UX Designer"],
        skills: ["Pitch Deck Creation", "Storytelling", "Public Speaking", "Market Research", "Product Strategy", "Figma"],
        interests: ["Social Impact", "EdTech", "Venture Capital", "Student Tools"],
        hackathonHistory: [
            { event: "MIT 100K", achievement: "Best Pitch Presenter" },
            { event: "HackMIT 2024", achievement: "Best Business Value" }
        ],
        github: "github.com/sarahlin",
        portfolio: "sarahlin.me",
        linkedin: "linkedin.com/in/sarah-lin-mit"
    },
    {
        id: "user-5",
        name: "Devon Miller",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
        university: "University of Washington",
        major: "Computer Systems",
        year: "Sophomore (2nd Year)",
        bio: "Backend developer and cloud enthusiast. Love building robust REST/GraphQL APIs, database architecture, and microservices.",
        experience: "Intermediate",
        availability: "18 hrs/week",
        availabilityType: "Flexible Weekdays & Weekends",
        workingStyle: "System Architecture & Async Focused",
        primaryRole: "Backend Developer",
        secondaryRoles: ["Cloud / DevOps"],
        skills: ["Python", "FastAPI", "Node.js", "PostgreSQL", "MongoDB", "Docker", "Redis"],
        interests: ["Cloud Infrastructure", "API Architecture", "Security", "Distributed Systems"],
        hackathonHistory: [
            { event: "DubHacks 2024", achievement: "Honorable Mention" }
        ],
        github: "github.com/devonmiller-dev",
        portfolio: "devonmiller.net",
        linkedin: "linkedin.com/in/devonmiller"
    },
    {
        id: "user-6",
        name: "Rahul Sharma",
        avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
        university: "Georgia Tech",
        major: "Machine Learning & CS",
        year: "Junior (3rd Year)",
        bio: "Machine learning enthusiast specializing in NLP, semantic embeddings, and conversational assistants.",
        experience: "Intermediate",
        availability: "20 hrs/week",
        availabilityType: "Hackathon Sprints",
        workingStyle: "Experimenter & Fast Prototyper",
        primaryRole: "AI / ML Developer",
        secondaryRoles: ["Backend Developer"],
        skills: ["Python", "Machine Learning", "HuggingFace", "FastAPI", "PyTorch"],
        interests: ["NLP", "Campus Assistants", "Chatbots"],
        hackathonHistory: [
            { event: "HackGT 2024", achievement: "AI Track Finalist" }
        ],
        github: "github.com/rahulsharma-ai",
        portfolio: "rahulsharma.dev",
        linkedin: "linkedin.com/in/rahulsharma"
    },
    {
        id: "user-7",
        name: "Elena Rostova",
        avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80",
        university: "UT Austin",
        major: "Informatics & Design",
        year: "Junior (3rd Year)",
        bio: "Mobile app developer and interaction designer. Love building silky smooth cross-platform experiences in Flutter and React Native.",
        experience: "Intermediate",
        availability: "15 hrs/week",
        availabilityType: "Evenings & Weekends",
        workingStyle: "Collaborative & Polish-Driven",
        primaryRole: "Mobile App Developer",
        secondaryRoles: ["UI/UX Designer"],
        skills: ["Flutter", "Dart", "React Native", "Firebase", "Figma", "Swift"],
        interests: ["Mobile UX", "Student Life", "Social Apps"],
        hackathonHistory: [
            { event: "HackUTD 2024", achievement: "Best Mobile Hack" }
        ],
        github: "github.com/elena-rostova",
        portfolio: "elenarostova.dev",
        linkedin: "linkedin.com/in/elenarostova"
    },
    {
        id: "user-8",
        name: "Rohan Verma",
        avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
        university: "Cornell Tech",
        major: "Computer Science",
        year: "Graduate (1st Year)",
        bio: "DevOps & Cloud Architect. Specializing in Kubernetes, CI/CD pipelines, Terraform, and scalable backend infrastructure.",
        experience: "Advanced",
        availability: "20 hrs/week",
        availabilityType: "All Week Hackathons",
        workingStyle: "Infrastructure & DevOps Specialist",
        primaryRole: "Cloud / DevOps",
        secondaryRoles: ["Backend Developer"],
        skills: ["Docker", "Kubernetes", "AWS", "GCP", "CI/CD", "Go", "Terraform"],
        interests: ["Cloud Native", "Site Reliability", "Edge Computing"],
        hackathonHistory: [
            { event: "PennApps XXIV", achievement: "1st Place - Cloud Innovation" }
        ],
        github: "github.com/rohanverma-ops",
        portfolio: "rohanverma.cloud",
        linkedin: "linkedin.com/in/rohanverma"
    }
];

export const INITIAL_PROJECTS = [
    {
        id: "proj-1",
        title: "Smart Campus Assistant",
        tagline: "AI voice and multimodal assistant guiding students across university resources and schedules",
        description: "We are developing an intelligent student assistant that integrates campus maps, dining menus, course schedules, and library study room bookings. We already have the core AI inference and backend API built. We urgently need a Frontend Developer to build the web dashboard, a UI/UX Designer to craft clean mobile wireframes, and a Presenter for our final demo.",
        hackathon: "HackMIT 2026",
        track: "Education & Campus Life",
        timeCommitment: "20 hrs/week",
        deadline: "Oct 18, 2026",
        status: "Recruiting Missing Roles",
        creatorId: "user-1", // Alex Chen
        requiredSquadRoles: [
            "AI / ML Developer",
            "Backend Developer",
            "Frontend Developer",
            "UI/UX Designer",
            "Pitch / Presenter"
        ],
        requiredSkills: ["Python", "FastAPI", "React", "Figma", "TailwindCSS", "Pitch Deck Creation"],
        members: [
            {
                userId: "user-1",
                name: "Alex Chen",
                avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
                assignedRole: "AI / ML Developer",
                isLeader: true
            },
            {
                userId: "user-5",
                name: "Devon Miller",
                avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
                assignedRole: "Backend Developer",
                isLeader: false
            }
        ],
        tasks: [
            { id: "task-1", title: "Build Campus FAQ semantic search with LangChain", status: "completed", assignee: "Alex Chen" },
            { id: "task-2", title: "Implement FastAPI backend endpoints with PostgreSQL", status: "completed", assignee: "Devon Miller" },
            { id: "task-3", title: "Design High-Fidelity Student Mobile Interface in Figma", status: "in_progress", assignee: "Unassigned (Needed: UI/UX)" },
            { id: "task-4", title: "Build Interactive Student Dashboard in React", status: "todo", assignee: "Unassigned (Needed: Frontend)" },
            { id: "task-5", title: "Draft 3-minute Hackathon Pitch Deck & Demo Video", status: "todo", assignee: "Unassigned (Needed: Presenter)" }
        ]
    },
    {
        id: "proj-2",
        title: "DecentralVault - Student Credentials",
        tagline: "Verifiable student credentials & transcript proofs without revealing PII",
        description: "Building zero-knowledge credential verification for universities and employers at ETHGlobal. Smart contracts and ZK circuits are prototyped. We need a talented Frontend Developer to build the student wallet portal and a UI/UX Designer to simplify cryptographic keys for non-crypto students.",
        hackathon: "ETHGlobal San Francisco",
        track: "DeFi & Digital Identity",
        timeCommitment: "20 hrs/week",
        deadline: "Nov 3, 2026",
        status: "Recruiting Missing Roles",
        creatorId: "user-8", // Rohan Verma
        requiredSquadRoles: [
            "Cloud / DevOps",
            "Frontend Developer",
            "UI/UX Designer",
            "Pitch / Presenter"
        ],
        requiredSkills: ["Solidity", "React", "Next.js", "Figma", "Ethers.js"],
        members: [
            {
                userId: "user-8",
                name: "Rohan Verma",
                avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
                assignedRole: "Cloud / DevOps",
                isLeader: true
            }
        ],
        tasks: [
            { id: "dv-1", title: "Write Noir ZK-SNARK circuit for GPA threshold proof", status: "completed", assignee: "Rohan Verma" },
            { id: "dv-2", title: "Design Student Verifier Portal Wireframes", status: "todo", assignee: "Unassigned" },
            { id: "dv-3", title: "Connect Web3 wallet with Wagmi/Viem frontend hooks", status: "todo", assignee: "Unassigned" }
        ]
    },
    {
        id: "proj-3",
        title: "EcoRoute - Green Transit Navigator",
        tagline: "Gamified urban transit mapping optimizing for lowest carbon footprint",
        description: "Stanford TreeHacks project calculating carbon footprints of commute alternatives and rewarding students with transit credits. We have the data ingestion and routing algorithms ready, but we are looking for a Mobile App Developer (Flutter/React Native) and a UI/UX Designer to build an addictive gamified UI.",
        hackathon: "Stanford TreeHacks 2026",
        track: "Sustainability & Climate",
        timeCommitment: "15-20 hrs/week",
        deadline: "Oct 28, 2026",
        status: "Recruiting Missing Roles",
        creatorId: "user-7", // Elena Rostova
        requiredSquadRoles: [
            "Mobile App Developer",
            "Backend Developer",
            "UI/UX Designer",
            "Pitch / Presenter"
        ],
        requiredSkills: ["Flutter", "Go", "Docker", "Figma", "PostgreSQL", "Firebase"],
        members: [
            {
                userId: "user-7",
                name: "Elena Rostova",
                avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80",
                assignedRole: "Mobile App Developer",
                isLeader: true
            }
        ],
        tasks: [
            { id: "er-1", title: "Set up transit GTFS data pipeline in Docker", status: "completed", assignee: "Elena Rostova" },
            { id: "er-2", title: "Design gamified carbon badges & routing maps", status: "todo", assignee: "Unassigned" }
        ]
    }
];

export const INITIAL_REQUESTS = [
    {
        id: "req-1",
        projectId: "proj-1",
        projectTitle: "Smart Campus Assistant",
        senderId: "user-2", // Maya Patel
        senderName: "Maya Patel",
        senderAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        senderRole: "UI/UX Designer",
        targetRole: "UI/UX Designer",
        recipientId: "user-1", // Alex Chen
        type: "application",
        status: "pending",
        note: "Hey Alex! I saw your Smart Campus Assistant project for HackMIT. I won Best UI/UX at TreeHacks and designed a student portal last year. I would love to fill your missing UI/UX Designer role and craft the demo deck!",
        matchScore: 94,
        timestamp: "2 hours ago"
    },
    {
        id: "req-2",
        projectId: "proj-1",
        projectTitle: "Smart Campus Assistant",
        senderId: "user-3", // Marcus Vance
        senderName: "Marcus Vance",
        senderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        senderRole: "Frontend Developer",
        targetRole: "Frontend Developer",
        recipientId: "user-1",
        type: "application",
        status: "pending",
        note: "Hi Alex! I specialize in React + Tailwind high-performance dashboards and interactive campus maps. I have 20 hrs/wk available for HackMIT.",
        matchScore: 91,
        timestamp: "5 hours ago"
    },
    {
        id: "req-3",
        projectId: "proj-1",
        projectTitle: "Smart Campus Assistant",
        senderId: "user-1", // Alex Chen
        senderName: "Alex Chen (Smart Campus Assistant)",
        senderAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        senderRole: "Team Lead",
        targetRole: "Pitch / Presenter",
        recipientId: "user-4", // Sarah Lin
        type: "invitation",
        status: "pending",
        note: "Hi Sarah! TeamSync recommended you as the ideal Presenter to complete our Smart Campus Assistant squad. Your MIT Sloan background and pitch victories would make our demo stand out to judges!",
        matchScore: 94,
        timestamp: "1 day ago"
    }
];

export const INITIAL_CHATS = [
    {
        id: "chat-proj-1",
        type: "team",
        targetId: "proj-1",
        title: "Smart Campus Assistant Hub",
        avatar: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80",
        channel: "#general",
        messages: [
            {
                id: "m-1",
                senderId: "user-1",
                senderName: "Alex Chen",
                senderAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
                text: "Welcome to Smart Campus Assistant! Devon and I got the backend API and LangChain semantic search working.",
                timestamp: "Yesterday, 3:15 PM"
            },
            {
                id: "m-2",
                senderId: "user-5",
                senderName: "Devon Miller",
                senderAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
                text: "Awesome! Now we just need to review the applicants for UI/UX and Frontend to complete our squad!",
                timestamp: "Yesterday, 3:42 PM"
            }
        ]
    },
    {
        id: "chat-dm-user-2",
        type: "dm",
        targetId: "user-2", // Maya Patel
        title: "Maya Patel (UI/UX Designer)",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        messages: [
            {
                id: "dm-1",
                senderId: "user-2",
                senderName: "Maya Patel",
                senderAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
                text: "Hey Alex! Just sent over an application for Smart Campus Assistant. I have some existing Figma design components for student portals that we could customize in under 2 hours.",
                timestamp: "Today, 11:30 AM"
            }
        ]
    }
];
