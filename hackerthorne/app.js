import { INITIAL_STUDENTS, INITIAL_PROJECTS, INITIAL_REQUESTS, INITIAL_CHATS } from './mockData.js';

// LocalStorage Keys
const STORAGE_KEYS = {
    STUDENTS: 'hackerthorne_students_v1',
    PROJECTS: 'hackerthorne_projects_v1',
    REQUESTS: 'hackerthorne_requests_v1',
    CHATS: 'hackerthorne_chats_v1',
    CURRENT_USER: 'hackerthorne_current_user_v1'
};

// Global App State
class AppState {
    constructor() {
        this.students = this.loadData(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
        this.projects = this.loadData(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
        this.requests = this.loadData(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
        this.chats = this.loadData(STORAGE_KEYS.CHATS, INITIAL_CHATS);
        this.currentUserId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || 'user-1'; // Alex Chen by default
        this.activeView = 'projects';
        this.activeChatId = 'chat-proj-1';
        this.inboxSubtab = 'incoming';
    }

    loadData(key, fallback) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : JSON.parse(JSON.stringify(fallback));
        } catch (e) {
            console.error(`Error loading ${key}`, e);
            return JSON.parse(JSON.stringify(fallback));
        }
    }

    save() {
        localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(this.students));
        localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(this.projects));
        localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(this.requests));
        localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(this.chats));
        localStorage.setItem(STORAGE_KEYS.CURRENT_USER, this.currentUserId);
    }

    reset() {
        this.students = JSON.parse(JSON.stringify(INITIAL_STUDENTS));
        this.projects = JSON.parse(JSON.stringify(INITIAL_PROJECTS));
        this.requests = JSON.parse(JSON.stringify(INITIAL_REQUESTS));
        this.chats = JSON.parse(JSON.stringify(INITIAL_CHATS));
        this.currentUserId = 'user-1';
        this.save();
    }

    getCurrentUser() {
        return this.students.find(s => s.id === this.currentUserId) || this.students[0];
    }

    getStudentById(id) {
        return this.students.find(s => s.id === id);
    }

    getProjectById(id) {
        return this.projects.find(p => p.id === id);
    }
}

const state = new AppState();

// Utility Functions
function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon = type === 'success' ? '✓' : 'ℹ';
    toast.innerHTML = `<span style="font-weight:bold; font-size:16px;">${icon}</span> <span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
        setTimeout(() => toast.remove(), 300);
    }, 3200);
}

// Calculate Compatibility Score between a Student and a Project
function calculateMatchScore(student, project) {
    if (!student || !project) return 80;
    let score = 70;
    
    // Check if student covers any required role
    const coversRole = project.requiredSquadRoles.some(r => 
        r === student.primaryRole || (student.secondaryRoles && student.secondaryRoles.includes(r))
    );
    if (coversRole) score += 15;

    // Check shared skills
    const matchingSkills = student.skills.filter(s => 
        project.requiredSkills.some(ps => ps.toLowerCase() === s.toLowerCase())
    );
    score += Math.min(matchingSkills.length * 4, 12);

    // Advanced experience bonus
    if (student.experience === 'Advanced') score += 5;

    return Math.min(score, 98);
}

// DOM Elements
const elements = {
    tabs: document.querySelectorAll('.nav-tab'),
    viewPanels: document.querySelectorAll('.view-panel'),
    currentUserSelect: document.getElementById('active-user-select'),
    currentUserAvatar: document.getElementById('current-user-avatar'),
    btnResetData: document.getElementById('btn-reset-data'),
    btnOpenCreateProject: document.getElementById('btn-open-create-project'),
    
    // Project View
    projectsContainer: document.getElementById('projects-container'),
    projectSearchInput: document.getElementById('project-search-input'),
    projectHackathonFilter: document.getElementById('project-hackathon-filter'),
    projectRoleFilter: document.getElementById('project-role-filter'),

    // Students View
    studentsContainer: document.getElementById('students-container'),
    studentSearchInput: document.getElementById('student-search-input'),
    studentRoleFilter: document.getElementById('student-role-filter'),
    studentExpFilter: document.getElementById('student-exp-filter'),

    // Matchmaker View
    matchmakerProjectSelect: document.getElementById('matchmaker-project-select'),
    btnRunMatchmaker: document.getElementById('btn-run-matchmaker'),
    matchmakerResults: document.getElementById('matchmaker-results'),

    // Inbox View
    requestsContainer: document.getElementById('requests-container'),
    subtabIncoming: document.getElementById('subtab-incoming'),
    subtabOutgoing: document.getElementById('subtab-outgoing'),
    incomingCount: document.getElementById('incoming-count'),
    outgoingCount: document.getElementById('outgoing-count'),
    inboxBadgeCount: document.getElementById('inbox-badge-count'),

    // Chat View
    projectChatsList: document.getElementById('project-chats-list'),
    dmChatsList: document.getElementById('dm-chats-list'),
    chatHeader: document.getElementById('chat-header'),
    chatMessages: document.getElementById('chat-messages'),
    chatForm: document.getElementById('chat-form'),
    chatInput: document.getElementById('chat-input'),
    chatBadgeCount: document.getElementById('chat-badge-count'),

    // Modals
    projectModal: document.getElementById('project-detail-modal'),
    btnCloseProjectModal: document.getElementById('btn-close-project-modal'),
    modalProjectTitle: document.getElementById('modal-project-title'),
    modalProjectHackathon: document.getElementById('modal-project-hackathon'),
    modalProjectBody: document.getElementById('modal-project-body'),

    createModal: document.getElementById('create-project-modal'),
    btnCloseCreateModal: document.getElementById('btn-close-create-modal'),
    btnCancelCreate: document.getElementById('btn-cancel-create'),
    createProjectForm: document.getElementById('create-project-form'),

    applyModal: document.getElementById('apply-modal'),
    btnCloseApplyModal: document.getElementById('btn-close-apply-modal'),
    btnCancelApply: document.getElementById('btn-cancel-apply'),
    applyForm: document.getElementById('apply-form'),
    applyModalTitle: document.getElementById('apply-modal-title'),
    applyModalDesc: document.getElementById('apply-modal-desc'),
    applyRoleSelect: document.getElementById('apply-role-select'),
    applyNote: document.getElementById('apply-note')
};

// Current Modal Context
let currentSelectedProjectId = null;
let currentTargetStudentId = null;

// Initialize Application
function init() {
    renderUserSelector();
    setupNavigation();
    setupEventListeners();
    updateBadges();
    renderAllViews();
}

// User Perspective Selector
function renderUserSelector() {
    elements.currentUserSelect.innerHTML = '';
    state.students.forEach(student => {
        const option = document.createElement('option');
        option.value = student.id;
        option.textContent = `${student.name} (${student.primaryRole.split(' ')[0]})`;
        if (student.id === state.currentUserId) option.selected = true;
        elements.currentUserSelect.appendChild(option);
    });

    const current = state.getCurrentUser();
    elements.currentUserAvatar.src = current.avatar;
    elements.currentUserAvatar.title = `${current.name} - ${current.primaryRole}`;
}

// Setup Tab Navigation
function setupNavigation() {
    elements.tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetView = tab.getAttribute('data-view');
            switchView(targetView);
        });
    });
}

function switchView(viewName) {
    state.activeView = viewName;
    elements.tabs.forEach(t => {
        if (t.getAttribute('data-view') === viewName) {
            t.classList.add('active');
        } else {
            t.classList.remove('active');
        }
    });

    elements.viewPanels.forEach(panel => {
        if (panel.id === `view-${viewName}`) {
            panel.classList.add('active');
        } else {
            panel.classList.remove('active');
        }
    });

    if (viewName === 'projects') renderProjects();
    if (viewName === 'students') renderStudents();
    if (viewName === 'matchmaker') renderMatchmaker();
    if (viewName === 'applications') renderRequests();
    if (viewName === 'chat') renderChat();
}

// Setup Event Listeners
function setupEventListeners() {
    // Switch User Perspective
    elements.currentUserSelect.addEventListener('change', (e) => {
        state.currentUserId = e.target.value;
        state.save();
        renderUserSelector();
        showToast(`Switched perspective to ${state.getCurrentUser().name}`);
        updateBadges();
        renderAllViews();
    });

    // Reset Data
    elements.btnResetData.addEventListener('click', () => {
        if (confirm('Reset HackerThorne to default mock data?')) {
            state.reset();
            renderUserSelector();
            updateBadges();
            renderAllViews();
            showToast('All demo data restored to initial state');
        }
    });

    // Project Filters
    elements.projectSearchInput.addEventListener('input', renderProjects);
    elements.projectHackathonFilter.addEventListener('change', renderProjects);
    elements.projectRoleFilter.addEventListener('change', renderProjects);

    // Student Filters
    elements.studentSearchInput.addEventListener('input', renderStudents);
    elements.studentRoleFilter.addEventListener('change', renderStudents);
    elements.studentExpFilter.addEventListener('change', renderStudents);

    // Create Project Modal
    elements.btnOpenCreateProject.addEventListener('click', () => {
        elements.createModal.style.display = 'flex';
    });
    elements.btnCloseCreateModal.addEventListener('click', () => {
        elements.createModal.style.display = 'none';
    });
    elements.btnCancelCreate.addEventListener('click', () => {
        elements.createModal.style.display = 'none';
    });
    elements.createProjectForm.addEventListener('submit', handleCreateProject);

    // Project Detail Modal
    elements.btnCloseProjectModal.addEventListener('click', () => {
        elements.projectModal.style.display = 'none';
    });

    // Apply Modal
    elements.btnCloseApplyModal.addEventListener('click', () => {
        elements.applyModal.style.display = 'none';
    });
    elements.btnCancelApply.addEventListener('click', () => {
        elements.applyModal.style.display = 'none';
    });
    elements.applyForm.addEventListener('submit', handleApplySubmit);

    // Matchmaker Controls
    elements.btnRunMatchmaker.addEventListener('click', runSquadMatchmaker);
    elements.matchmakerProjectSelect.addEventListener('change', runSquadMatchmaker);

    // Inbox Subtabs
    elements.subtabIncoming.addEventListener('click', () => {
        state.inboxSubtab = 'incoming';
        elements.subtabIncoming.classList.add('active');
        elements.subtabOutgoing.classList.remove('active');
        renderRequests();
    });
    elements.subtabOutgoing.addEventListener('click', () => {
        state.inboxSubtab = 'outgoing';
        elements.subtabOutgoing.classList.add('active');
        elements.subtabIncoming.classList.remove('active');
        renderRequests();
    });

    // Chat Message Submit
    elements.chatForm.addEventListener('submit', handleSendMessage);
}

function updateBadges() {
    // Calculate pending incoming requests for projects created by or involving current user
    const user = state.getCurrentUser();
    const myProjects = state.projects.filter(p => p.creatorId === user.id);
    const myProjectIds = myProjects.map(p => p.id);

    const pendingIncoming = state.requests.filter(r => 
        (r.recipientId === user.id || myProjectIds.includes(r.projectId)) &&
        r.status === 'pending' &&
        r.senderId !== user.id
    );

    const pendingOutgoing = state.requests.filter(r =>
        r.senderId === user.id && r.status === 'pending'
    );

    elements.incomingCount.textContent = pendingIncoming.length;
    elements.outgoingCount.textContent = pendingOutgoing.length;
    elements.inboxBadgeCount.textContent = pendingIncoming.length;
    if (pendingIncoming.length === 0) {
        elements.inboxBadgeCount.style.display = 'none';
    } else {
        elements.inboxBadgeCount.style.display = 'inline-block';
    }
}

function renderAllViews() {
    renderProjects();
    renderStudents();
    renderMatchmaker();
    renderRequests();
    renderChat();
}

// ==========================================
// 1. PROJECTS VIEW & SQUAD VISUALIZER
// ==========================================
function renderProjects() {
    const searchTerm = elements.projectSearchInput.value.toLowerCase().trim();
    const hackathonFilter = elements.projectHackathonFilter.value;
    const roleFilter = elements.projectRoleFilter.value;
    const currentUser = state.getCurrentUser();

    const filtered = state.projects.filter(project => {
        if (hackathonFilter !== 'all' && project.hackathon !== hackathonFilter) return false;
        
        // Missing roles check
        const filledRoles = project.members.map(m => m.assignedRole);
        const missingRoles = project.requiredSquadRoles.filter(r => !filledRoles.includes(r));
        if (roleFilter !== 'all' && !missingRoles.includes(roleFilter)) return false;

        // Search match
        if (searchTerm) {
            const matchTitle = project.title.toLowerCase().includes(searchTerm);
            const matchDesc = project.description.toLowerCase().includes(searchTerm);
            const matchSkills = project.requiredSkills.some(s => s.toLowerCase().includes(searchTerm));
            if (!matchTitle && !matchDesc && !matchSkills) return false;
        }

        return true;
    });

    elements.projectsContainer.innerHTML = '';

    if (filtered.length === 0) {
        elements.projectsContainer.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 48px; background: rgba(0,0,0,0.2); border-radius: 16px;">
                <p style="font-size: 16px; color: var(--text-muted);">No projects found matching the selected filters.</p>
                <button class="btn btn-secondary" style="margin-top: 12px;" onclick="document.getElementById('project-search-input').value=''; document.getElementById('project-hackathon-filter').value='all'; document.getElementById('project-role-filter').value='all'; window.renderProjects();">Reset Filters</button>
            </div>
        `;
        return;
    }

    filtered.forEach(project => {
        const card = document.createElement('div');
        card.className = 'project-card';

        // Filled roles vs missing roles
        const filledRoles = project.members.map(m => m.assignedRole);
        const missingRoles = project.requiredSquadRoles.filter(r => !filledRoles.includes(r));
        const isMember = project.members.some(m => m.userId === currentUser.id);
        const isCreator = project.creatorId === currentUser.id;

        // Tasks progress
        const totalTasks = project.tasks ? project.tasks.length : 0;
        const completedTasks = project.tasks ? project.tasks.filter(t => t.status === 'completed').length : 0;
        const progressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        // Squad Slots HTML
        let squadSlotsHtml = '';
        project.requiredSquadRoles.forEach(role => {
            const member = project.members.find(m => m.assignedRole === role);
            if (member) {
                squadSlotsHtml += `
                    <div class="squad-slot" title="${member.name} (${member.assignedRole})">
                        <img class="slot-avatar" src="${member.avatar}" alt="${member.name}">
                        <span class="slot-role-lbl">${member.assignedRole.split(' ')[0]}</span>
                    </div>
                `;
            } else {
                squadSlotsHtml += `
                    <div class="squad-slot" title="Needed: ${role}" onclick="window.openProjectModal('${project.id}')">
                        <div class="slot-empty">+</div>
                        <span class="slot-role-lbl slot-empty-lbl">${role.split(' ')[0]}</span>
                    </div>
                `;
            }
        });

        // Skills HTML
        const skillsHtml = project.requiredSkills.slice(0, 4).map(s => `<span class="skill-tag">${s}</span>`).join('');

        card.innerHTML = `
            <div>
                <div class="project-card-header">
                    <div>
                        <div class="project-meta-badges">
                            <span class="badge badge-purple">${project.hackathon}</span>
                            <span class="badge badge-cyan">${project.track}</span>
                            <span class="badge badge-emerald">${project.timeCommitment}</span>
                        </div>
                        <h3 class="project-title">${project.title}</h3>
                        <p class="project-tagline">${project.tagline}</p>
                    </div>
                </div>

                <div class="squad-visualizer" style="margin-top: 14px;">
                    <div class="squad-vis-title">
                        <span>Squad Formation (${project.members.length}/${project.requiredSquadRoles.length})</span>
                        <span style="color: ${missingRoles.length > 0 ? '#06b6d4' : '#10b981'}; font-weight: 700;">
                            ${missingRoles.length > 0 ? `${missingRoles.length} Open Role${missingRoles.length > 1 ? 's' : ''}` : 'Squad Full'}
                        </span>
                    </div>
                    <div class="squad-slots-row">
                        ${squadSlotsHtml}
                    </div>
                </div>

                <div style="margin-top: 14px;">
                    <div class="skills-tags">
                        ${skillsHtml}
                    </div>
                </div>
            </div>

            <div class="project-card-footer">
                <div class="progress-mini">
                    <span class="progress-text">Sprint Tasks: ${completedTasks}/${totalTasks} (${progressPct}%)</span>
                    <div class="progress-bar-bg">
                        <div class="progress-bar-fill" style="width: ${progressPct}%;"></div>
                    </div>
                </div>

                <div class="project-actions">
                    <button class="btn btn-secondary" onclick="window.openProjectModal('${project.id}')">
                        <span>Squad Hub</span>
                    </button>
                    ${!isMember ? `
                        <button class="btn btn-primary" onclick="window.openApplyModal('${project.id}')">
                            <span>Apply</span>
                        </button>
                    ` : `
                        <span class="badge badge-emerald" style="padding: 7px 10px;">Joined</span>
                    `}
                </div>
            </div>
        `;

        elements.projectsContainer.appendChild(card);
    });
}
window.renderProjects = renderProjects;

// Open Project Detail & Squad Hub Modal
window.openProjectModal = function(projectId) {
    currentSelectedProjectId = projectId;
    const project = state.getProjectById(projectId);
    if (!project) return;

    elements.modalProjectTitle.textContent = project.title;
    elements.modalProjectHackathon.textContent = `${project.hackathon} • ${project.track}`;

    const filledRoles = project.members.map(m => m.assignedRole);
    const missingRoles = project.requiredSquadRoles.filter(r => !filledRoles.includes(r));
    const currentUser = state.getCurrentUser();
    const isMember = project.members.some(m => m.userId === currentUser.id);

    // Members list HTML
    const membersHtml = project.members.map(member => {
        const studentInfo = state.getStudentById(member.userId);
        return `
            <div style="display:flex; align-items:center; justify-content:space-between; padding:10px 14px; background:rgba(255,255,255,0.03); border-radius:8px; border:1px solid rgba(255,255,255,0.05);">
                <div style="display:flex; align-items:center; gap:12px;">
                    <img src="${member.avatar}" style="width:40px; height:40px; border-radius:50%; object-fit:cover; border:2px solid #8b5cf6;" alt="${member.name}">
                    <div>
                        <div style="font-weight:700; color:#fff; font-size:14px;">
                            ${member.name} ${member.isLeader ? '<span class="badge badge-purple" style="font-size:10px; margin-left:6px;">Squad Lead</span>' : ''}
                        </div>
                        <div style="font-size:12px; color:var(--text-muted);">${member.assignedRole} ${studentInfo ? `• ${studentInfo.university}` : ''}</div>
                    </div>
                </div>
                <button class="btn btn-secondary" style="padding:5px 10px; font-size:12px;" onclick="window.startDirectMessage('${member.userId}')">Chat</button>
            </div>
        `;
    }).join('');

    // Missing Roles and instant matches
    let missingRolesHtml = '';
    if (missingRoles.length === 0) {
        missingRolesHtml = `<p style="color:#10b981; font-weight:600; font-size:13.5px;">🎉 Squad is complete! All ${project.requiredSquadRoles.length} roles filled.</p>`;
    } else {
        missingRolesHtml = missingRoles.map(role => {
            // Find top candidate for this role
            const candidates = state.students
                .filter(s => !project.members.some(m => m.userId === s.id))
                .filter(s => s.primaryRole === role || (s.secondaryRoles && s.secondaryRoles.includes(role)))
                .map(s => ({ student: s, score: calculateMatchScore(s, project) }))
                .sort((a, b) => b.score - a.score);

            const topCandidate = candidates[0];

            return `
                <div style="padding:12px; background:rgba(6, 182, 212, 0.04); border:1px dashed rgba(6, 182, 212, 0.3); border-radius:8px; display:flex; flex-direction:column; gap:8px;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-weight:700; color:#22d3ee; font-size:13px;">🚨 Needed: ${role}</span>
                        ${!isMember ? `
                            <button class="btn btn-primary" style="padding:4px 10px; font-size:11px;" onclick="window.openApplyModal('${project.id}', '${role}')">Apply for Role</button>
                        ` : ''}
                    </div>
                    ${topCandidate ? `
                        <div style="display:flex; align-items:center; justify-content:space-between; padding:6px 10px; background:rgba(0,0,0,0.3); border-radius:6px; font-size:12px;">
                            <div style="display:flex; align-items:center; gap:8px;">
                                <img src="${topCandidate.student.avatar}" style="width:26px; height:26px; border-radius:50%;" alt="${topCandidate.student.name}">
                                <span>Top Pick: <strong>${topCandidate.student.name}</strong> (${topCandidate.student.university})</span>
                                <span class="badge badge-emerald" style="font-size:10px;">${topCandidate.score}% Match</span>
                            </div>
                            <button class="btn btn-secondary" style="padding:3px 8px; font-size:11px;" onclick="window.inviteCandidate('${project.id}', '${topCandidate.student.id}', '${role}')">Invite</button>
                        </div>
                    ` : '<span style="font-size:11.5px; color:var(--text-dim);">Scanning candidate directory...</span>'}
                </div>
            `;
        }).join('');
    }

    // Tasks list HTML
    const tasksHtml = (project.tasks || []).map(task => `
        <div class="task-item-row" id="task-row-${task.id}">
            <div class="task-left">
                <input type="checkbox" class="task-checkbox" ${task.status === 'completed' ? 'checked' : ''} onchange="window.toggleTask('${project.id}', '${task.id}')">
                <span class="task-text ${task.status === 'completed' ? 'done' : ''}">${task.title}</span>
            </div>
            <span class="task-assignee">${task.assignee || 'Unassigned'}</span>
        </div>
    `).join('');

    elements.modalProjectBody.innerHTML = `
        <div>
            <h4 style="font-size:14px; font-weight:700; text-transform:uppercase; color:var(--text-dim); margin-bottom:6px;">Project Overview</h4>
            <p style="color:var(--text-muted); font-size:14px; line-height:1.6;">${project.description}</p>
        </div>

        <div>
            <h4 style="font-size:14px; font-weight:700; text-transform:uppercase; color:var(--text-dim); margin-bottom:8px;">Current Squad Members (${project.members.length})</h4>
            <div style="display:flex; flex-direction:column; gap:8px;">
                ${membersHtml}
            </div>
        </div>

        <div>
            <h4 style="font-size:14px; font-weight:700; text-transform:uppercase; color:var(--text-dim); margin-bottom:8px;">Open Positions & AI Match Suggestions</h4>
            <div style="display:flex; flex-direction:column; gap:10px;">
                ${missingRolesHtml}
            </div>
        </div>

        <!-- Task Checklist Board -->
        <div class="task-manager-box">
            <div class="task-manager-header">
                <h4>Hackathon Sprint Tasks & Milestones</h4>
                <span style="font-size:12px; color:var(--text-dim);">${project.tasks ? project.tasks.length : 0} Total</span>
            </div>
            <div id="modal-task-list">
                ${tasksHtml}
            </div>
            <div class="new-task-form">
                <input type="text" id="new-task-input" class="new-task-input" placeholder="Add a new milestone or feature task...">
                <button class="btn btn-secondary" style="padding:6px 14px;" onclick="window.addNewTask('${project.id}')">Add Task</button>
            </div>
        </div>
    `;

    elements.projectModal.style.display = 'flex';
};

// Toggle Task
window.toggleTask = function(projectId, taskId) {
    const project = state.getProjectById(projectId);
    if (!project || !project.tasks) return;
    const task = project.tasks.find(t => t.id === taskId);
    if (task) {
        task.status = task.status === 'completed' ? 'todo' : 'completed';
        state.save();
        renderProjects();
        window.openProjectModal(projectId);
        showToast(`Task updated: ${task.title}`);
    }
};

// Add New Task
window.addNewTask = function(projectId) {
    const input = document.getElementById('new-task-input');
    if (!input || !input.value.trim()) return;
    const project = state.getProjectById(projectId);
    if (!project) return;
    if (!project.tasks) project.tasks = [];

    const newTask = {
        id: `task-${Date.now()}`,
        title: input.value.trim(),
        status: 'todo',
        assignee: state.getCurrentUser().name
    };
    project.tasks.push(newTask);
    state.save();
    renderProjects();
    window.openProjectModal(projectId);
    showToast('New milestone task added to sprint!');
};

// ==========================================
// 2. TALENT NETWORK / STUDENTS VIEW
// ==========================================
function renderStudents() {
    const searchTerm = elements.studentSearchInput.value.toLowerCase().trim();
    const roleFilter = elements.studentRoleFilter.value;
    const expFilter = elements.studentExpFilter.value;
    const currentUser = state.getCurrentUser();
    const activeProject = state.projects[0]; // Reference project for match calculation

    const filtered = state.students.filter(student => {
        if (roleFilter !== 'all' && student.primaryRole !== roleFilter && (!student.secondaryRoles || !student.secondaryRoles.includes(roleFilter))) {
            return false;
        }
        if (expFilter !== 'all' && student.experience !== expFilter) return false;

        if (searchTerm) {
            const matchName = student.name.toLowerCase().includes(searchTerm);
            const matchUniv = student.university.toLowerCase().includes(searchTerm);
            const matchMajor = student.major.toLowerCase().includes(searchTerm);
            const matchSkills = student.skills.some(s => s.toLowerCase().includes(searchTerm));
            if (!matchName && !matchUniv && !matchMajor && !matchSkills) return false;
        }

        return true;
    });

    elements.studentsContainer.innerHTML = '';

    if (filtered.length === 0) {
        elements.studentsContainer.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 48px; background: rgba(0,0,0,0.2); border-radius: 16px;">
                <p style="font-size: 16px; color: var(--text-muted);">No student talent found matching the criteria.</p>
            </div>
        `;
        return;
    }

    filtered.forEach(student => {
        const card = document.createElement('div');
        card.className = 'student-card';

        const matchScore = calculateMatchScore(student, activeProject);
        const isSelf = student.id === currentUser.id;

        // Skills HTML
        const skillsHtml = student.skills.slice(0, 5).map(s => `<span class="skill-tag">${s}</span>`).join('');

        // Achievements HTML
        const achievementsHtml = (student.hackathonHistory || []).map(h => `
            <div class="achievement-item">
                <span>🏆</span>
                <span><strong>${h.event}:</strong> ${h.achievement}</span>
            </div>
        `).join('');

        card.innerHTML = `
            <div>
                <div class="student-top">
                    <img class="student-avatar" src="${student.avatar}" alt="${student.name}">
                    <div class="student-info">
                        <div class="student-name-row">
                            <h3 class="student-name">${student.name}</h3>
                            <span class="match-score-pill">
                                <span>⚡</span> ${matchScore}% Match
                            </span>
                        </div>
                        <div class="student-univ">${student.university} • ${student.year}</div>
                        <div class="student-major">${student.major}</div>
                    </div>
                </div>

                <div style="margin-top: 12px;">
                    <div class="roles-row">
                        <span class="role-badge-primary">${student.primaryRole}</span>
                        ${(student.secondaryRoles || []).map(r => `<span class="role-badge-secondary">${r}</span>`).join('')}
                    </div>
                </div>

                <p class="student-bio" style="margin-top: 10px;">${student.bio}</p>

                <div style="margin-top: 12px;">
                    <div class="skills-tags">
                        ${skillsHtml}
                    </div>
                </div>

                ${achievementsHtml ? `
                    <div style="margin-top: 12px;">
                        <div class="achievement-list">
                            ${achievementsHtml}
                        </div>
                    </div>
                ` : ''}
            </div>

            <div class="project-card-footer" style="padding-top: 14px;">
                <div style="display:flex; flex-direction:column; gap:2px;">
                    <span style="font-size:11px; color:var(--text-dim);">Availability</span>
                    <span style="font-size:12px; font-weight:600; color:#34d399;">${student.availability}</span>
                </div>

                <div style="display:flex; gap:8px;">
                    ${!isSelf ? `
                        <button class="btn btn-secondary" onclick="window.startDirectMessage('${student.id}')">
                            <span>Message</span>
                        </button>
                        <button class="btn btn-primary" onclick="window.openInviteModal('${student.id}')">
                            <span>Invite to Squad</span>
                        </button>
                    ` : `
                        <span class="badge badge-purple">Current Active User</span>
                    `}
                </div>
            </div>
        `;

        elements.studentsContainer.appendChild(card);
    });
}
window.renderStudents = renderStudents;

// ==========================================
// 3. AI SQUAD BUILDER (MATCHMAKER) VIEW
// ==========================================
function renderMatchmaker() {
    // Populate project select
    elements.matchmakerProjectSelect.innerHTML = '';
    state.projects.forEach(project => {
        const option = document.createElement('option');
        option.value = project.id;
        option.textContent = `${project.title} (${project.hackathon})`;
        elements.matchmakerProjectSelect.appendChild(option);
    });

    runSquadMatchmaker();
}

function runSquadMatchmaker() {
    const projectId = elements.matchmakerProjectSelect.value || (state.projects[0] && state.projects[0].id);
    const project = state.getProjectById(projectId);
    if (!project) return;

    const filledRoles = project.members.map(m => m.assignedRole);
    const assignedUserIds = project.members.map(m => m.userId);

    // Compute dream team recommendations for each role
    const rosterCards = project.requiredSquadRoles.map(role => {
        const existingMember = project.members.find(m => m.assignedRole === role);
        if (existingMember) {
            return `
                <div class="roster-card filled">
                    <span class="badge badge-purple" style="position:absolute; top:12px; left:12px;">Active Member</span>
                    <span class="roster-role-title">${role}</span>
                    <img class="roster-avatar" src="${existingMember.avatar}" alt="${existingMember.name}">
                    <div>
                        <h4 style="font-weight:700; color:#fff; font-size:15px;">${existingMember.name}</h4>
                        <span style="font-size:12px; color:var(--text-muted);">${existingMember.isLeader ? 'Squad Captain' : 'Confirmed Member'}</span>
                    </div>
                </div>
            `;
        } else {
            // Find top candidate
            const availableCandidates = state.students
                .filter(s => !assignedUserIds.includes(s.id))
                .filter(s => s.primaryRole === role || (s.secondaryRoles && s.secondaryRoles.includes(role)))
                .map(s => ({ student: s, score: calculateMatchScore(s, project) }))
                .sort((a, b) => b.score - a.score);

            const match = availableCandidates[0];

            if (match) {
                return `
                    <div class="roster-card matched">
                        <span class="roster-match-score badge badge-emerald">⚡ ${match.score}% Synergy</span>
                        <span class="roster-role-title" style="color:#22d3ee;">Needed: ${role}</span>
                        <img class="roster-avatar" style="border-color:#10b981;" src="${match.student.avatar}" alt="${match.student.name}">
                        <div>
                            <h4 style="font-weight:700; color:#fff; font-size:15px;">${match.student.name}</h4>
                            <span style="font-size:12px; color:#38bdf8;">${match.student.university}</span>
                        </div>
                        <p style="font-size:11.5px; color:var(--text-dim); line-height:1.3;">
                            Key: ${match.student.skills.slice(0, 3).join(', ')}
                        </p>
                        <button class="btn btn-primary" style="width:100%; padding:6px 12px; font-size:12px; margin-top:4px;" onclick="window.inviteCandidate('${project.id}', '${match.student.id}', '${role}')">
                            Send Squad Invite
                        </button>
                    </div>
                `;
            } else {
                return `
                    <div class="roster-card">
                        <span class="roster-role-title" style="color:var(--accent-amber);">Needed: ${role}</span>
                        <div class="slot-empty" style="width:68px; height:68px; font-size:24px;">?</div>
                        <div>
                            <h4 style="font-weight:700; color:#fff; font-size:14px;">Open Slot</h4>
                            <span style="font-size:12px; color:var(--text-muted);">No candidate in directory</span>
                        </div>
                    </div>
                `;
            }
        }
    }).join('');

    elements.matchmakerResults.innerHTML = `
        <div style="background: rgba(0,0,0,0.3); padding: 18px 24px; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); margin-bottom: 20px; display:flex; justify-content:space-between; align-items:center;">
            <div>
                <h3 style="font-size: 18px; font-weight: 700; color: #fff;">${project.title} — AI Ideal Squad Formation</h3>
                <p style="font-size: 13px; color: var(--text-muted); margin-top: 2px;">
                    Targeting 5-role complete squad coverage with maximum skill compatibility for ${project.hackathon}.
                </p>
            </div>
            <button class="btn btn-primary" onclick="window.inviteAllRecommendations('${project.id}')">
                <span>⚡ 1-Click Invite All Missing Roles</span>
            </button>
        </div>

        <div class="roster-grid">
            ${rosterCards}
        </div>
    `;
}

// 1-Click Invite All Recommendations
window.inviteAllRecommendations = function(projectId) {
    const project = state.getProjectById(projectId);
    if (!project) return;
    const filledRoles = project.members.map(m => m.assignedRole);
    const missingRoles = project.requiredSquadRoles.filter(r => !filledRoles.includes(r));
    let invitedCount = 0;

    missingRoles.forEach(role => {
        const assignedUserIds = project.members.map(m => m.userId);
        const match = state.students
            .filter(s => !assignedUserIds.includes(s.id))
            .filter(s => s.primaryRole === role || (s.secondaryRoles && s.secondaryRoles.includes(role)))[0];

        if (match) {
            window.inviteCandidate(projectId, match.id, role, false);
            invitedCount++;
        }
    });

    showToast(`Sent ${invitedCount} squad invitations automatically!`);
    updateBadges();
    renderRequests();
};

// Invite Individual Candidate
window.inviteCandidate = function(projectId, studentId, role, showNotification = true) {
    const project = state.getProjectById(projectId);
    const student = state.getStudentById(studentId);
    const currentUser = state.getCurrentUser();
    if (!project || !student) return;

    // Check if request already exists
    const existing = state.requests.find(r => 
        r.projectId === projectId && r.recipientId === studentId && r.status === 'pending'
    );
    if (existing) {
        if (showNotification) showToast(`Invitation already pending for ${student.name}`, 'info');
        return;
    }

    const newRequest = {
        id: `req-${Date.now()}-${Math.floor(Math.random()*1000)}`,
        projectId: project.id,
        projectTitle: project.title,
        senderId: currentUser.id,
        senderName: `${currentUser.name} (${project.title})`,
        senderAvatar: currentUser.avatar,
        senderRole: 'Squad Lead',
        targetRole: role,
        recipientId: student.id,
        type: 'invitation',
        status: 'pending',
        note: `Hi ${student.name}! We saw your incredible hackathon work and would love for you to join our squad as our ${role} for ${project.hackathon}!`,
        matchScore: calculateMatchScore(student, project),
        timestamp: 'Just now'
    };

    state.requests.unshift(newRequest);
    state.save();
    updateBadges();
    if (showNotification) showToast(`Invitation sent to ${student.name} for ${role}!`);
};

// ==========================================
// 4. INBOX & APPLICATIONS VIEW
// ==========================================
function renderRequests() {
    const currentUser = state.getCurrentUser();
    const myProjects = state.projects.filter(p => p.creatorId === currentUser.id);
    const myProjectIds = myProjects.map(p => p.id);

    let requestsToDisplay = [];

    if (state.inboxSubtab === 'incoming') {
        // Incoming applications to projects owned by user OR invitations sent to user
        requestsToDisplay = state.requests.filter(r => 
            (r.recipientId === currentUser.id || myProjectIds.includes(r.projectId)) &&
            r.senderId !== currentUser.id
        );
    } else {
        // Outgoing applications/invitations sent by user
        requestsToDisplay = state.requests.filter(r => r.senderId === currentUser.id);
    }

    elements.requestsContainer.innerHTML = '';

    if (requestsToDisplay.length === 0) {
        elements.requestsContainer.innerHTML = `
            <div style="text-align: center; padding: 48px; background: rgba(0,0,0,0.2); border-radius: 16px;">
                <p style="font-size: 15px; color: var(--text-muted);">No ${state.inboxSubtab} requests at this time.</p>
            </div>
        `;
        return;
    }

    requestsToDisplay.forEach(req => {
        const card = document.createElement('div');
        card.className = 'request-card';

        const isPending = req.status === 'pending';
        const isIncoming = state.inboxSubtab === 'incoming';

        card.innerHTML = `
            <div class="request-left">
                <img class="request-avatar" src="${req.senderAvatar}" alt="${req.senderName}">
                <div class="request-details">
                    <div class="request-title-line">
                        <span class="request-sender-name">${req.senderName}</span>
                        <span class="badge badge-purple">${req.type === 'application' ? 'Application' : 'Team Invitation'}</span>
                        <span class="badge badge-cyan">Role: ${req.targetRole}</span>
                        <span class="badge badge-emerald">${req.matchScore}% Match</span>
                    </div>
                    <div class="request-meta">Project: <strong>${req.projectTitle}</strong> • Sent ${req.timestamp}</div>
                    <p class="request-note">"${req.note}"</p>
                </div>
            </div>

            <div class="request-actions">
                ${isPending && isIncoming ? `
                    <button class="btn btn-accept" onclick="window.acceptRequest('${req.id}')">Accept & Add to Squad</button>
                    <button class="btn btn-decline" onclick="window.declineRequest('${req.id}')">Decline</button>
                ` : `
                    <span class="badge ${req.status === 'accepted' ? 'badge-emerald' : req.status === 'declined' ? 'badge-rose' : 'badge-amber'}" style="padding: 6px 12px; font-size: 12px; text-transform: uppercase;">
                        ${req.status}
                    </span>
                `}
            </div>
        `;

        elements.requestsContainer.appendChild(card);
    });
}

// Accept Request
window.acceptRequest = function(requestId) {
    const req = state.requests.find(r => r.id === requestId);
    if (!req) return;

    const project = state.getProjectById(req.projectId);
    const applicant = state.getStudentById(req.senderId);

    if (project && applicant) {
        // Add member to project
        const alreadyMember = project.members.some(m => m.userId === applicant.id);
        if (!alreadyMember) {
            project.members.push({
                userId: applicant.id,
                name: applicant.name,
                avatar: applicant.avatar,
                assignedRole: req.targetRole,
                isLeader: false
            });
        }

        // Post welcome announcement to team chat
        const teamChat = state.chats.find(c => c.targetId === project.id);
        if (teamChat) {
            teamChat.messages.push({
                id: `m-${Date.now()}`,
                senderId: 'system',
                senderName: 'HackerThorne Bot',
                senderAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
                text: `🎉 Squad Update: ${applicant.name} has officially joined the team as our ${req.targetRole}! Welcome aboard!`,
                timestamp: 'Just now'
            });
        }
    }

    req.status = 'accepted';
    state.save();
    updateBadges();
    renderAllViews();
    showToast(`Accepted ${req.senderName}! ${req.targetRole} role is now filled on ${project ? project.title : 'the squad'}.`);
};

// Decline Request
window.declineRequest = function(requestId) {
    const req = state.requests.find(r => r.id === requestId);
    if (!req) return;
    req.status = 'declined';
    state.save();
    updateBadges();
    renderRequests();
    showToast('Request declined.');
};

// ==========================================
// 5. TEAM CHAT & DIRECT MESSAGES VIEW
// ==========================================
function renderChat() {
    // Render Project Chats list
    elements.projectChatsList.innerHTML = '';
    const teamChats = state.chats.filter(c => c.type === 'team');
    teamChats.forEach(chat => {
        const item = document.createElement('div');
        item.className = `chat-channel-item ${chat.id === state.activeChatId ? 'active' : ''}`;
        item.innerHTML = `
            <span>#</span>
            <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${chat.title}</span>
        `;
        item.addEventListener('click', () => {
            state.activeChatId = chat.id;
            renderChat();
        });
        elements.projectChatsList.appendChild(item);
    });

    // Render DM Chats list
    elements.dmChatsList.innerHTML = '';
    const dmChats = state.chats.filter(c => c.type === 'dm');
    dmChats.forEach(chat => {
        const item = document.createElement('div');
        item.className = `chat-channel-item ${chat.id === state.activeChatId ? 'active' : ''}`;
        item.innerHTML = `
            <img class="chat-channel-avatar" src="${chat.avatar}" alt="${chat.title}">
            <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${chat.title}</span>
        `;
        item.addEventListener('click', () => {
            state.activeChatId = chat.id;
            renderChat();
        });
        elements.dmChatsList.appendChild(item);
    });

    // Active Chat Header & Messages
    const activeChat = state.chats.find(c => c.id === state.activeChatId) || state.chats[0];
    if (!activeChat) return;

    elements.chatHeader.innerHTML = `
        <div style="display:flex; align-items:center; gap:12px;">
            ${activeChat.type === 'team' ? `
                <div class="brand-icon" style="width:34px; height:34px; font-size:14px;">⚡</div>
            ` : `
                <img src="${activeChat.avatar}" style="width:34px; height:34px; border-radius:50%; object-fit:cover;" alt="${activeChat.title}">
            `}
            <div>
                <div class="chat-active-title">${activeChat.title}</div>
                <div style="font-size:11.5px; color:var(--text-dim);">${activeChat.type === 'team' ? 'Squad Channel' : 'Direct Conversation'}</div>
            </div>
        </div>
    `;

    // Messages
    elements.chatMessages.innerHTML = '';
    const currentUser = state.getCurrentUser();

    (activeChat.messages || []).forEach(msg => {
        const isSelf = msg.senderId === currentUser.id;
        const msgEl = document.createElement('div');
        msgEl.className = `chat-msg ${isSelf ? 'self' : ''}`;
        msgEl.innerHTML = `
            <img class="chat-msg-avatar" src="${msg.senderAvatar}" alt="${msg.senderName}">
            <div class="chat-msg-content">
                <div class="chat-msg-author">
                    <span>${msg.senderName}</span>
                    <span class="chat-msg-time">${msg.timestamp}</span>
                </div>
                <div class="chat-msg-body">${msg.text}</div>
            </div>
        `;
        elements.chatMessages.appendChild(msgEl);
    });

    // Scroll to bottom
    elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
}

function handleSendMessage(e) {
    e.preventDefault();
    const text = elements.chatInput.value.trim();
    if (!text) return;

    const activeChat = state.chats.find(c => c.id === state.activeChatId);
    if (!activeChat) return;

    const currentUser = state.getCurrentUser();
    const newMsg = {
        id: `m-${Date.now()}`,
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar,
        text: text,
        timestamp: 'Just now'
    };

    activeChat.messages.push(newMsg);
    elements.chatInput.value = '';
    state.save();
    renderChat();

    // Contextual auto-reply simulation
    setTimeout(() => {
        simulateChatReply(activeChat, text);
    }, 900);
}

function simulateChatReply(chat, userMessage) {
    const replies = [
        "Sounds like a great plan! I'm pushing the updates to GitHub now.",
        "Awesome! I'll test the API endpoints and check the response format.",
        "Love this direction. I'll mock up the user flows in Figma so we have wireframes ready for demo day.",
        "Got it! Let's synchronize before the hackathon submission deadline to finalize our pitch slides.",
        "Perfect! That directly addresses what the hackathon judges will look for in the grading rubric."
    ];
    const replyText = replies[Math.floor(Math.random() * replies.length)];

    let responderName = "Teammate";
    let responderAvatar = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80";

    if (chat.type === 'dm') {
        const student = state.getStudentById(chat.targetId);
        if (student) {
            responderName = student.name;
            responderAvatar = student.avatar;
        }
    } else {
        const project = state.getProjectById(chat.targetId);
        if (project && project.members.length > 1) {
            const other = project.members.find(m => m.userId !== state.currentUserId) || project.members[0];
            responderName = other.name;
            responderAvatar = other.avatar;
        }
    }

    chat.messages.push({
        id: `m-reply-${Date.now()}`,
        senderId: 'teammate-auto',
        senderName: responderName,
        senderAvatar: responderAvatar,
        text: replyText,
        timestamp: 'Just now'
    });

    state.save();
    if (state.activeChatId === chat.id && state.activeView === 'chat') {
        renderChat();
    }
}

// Start Direct Message from Profile or Squad Member
window.startDirectMessage = function(studentId) {
    elements.projectModal.style.display = 'none';
    const student = state.getStudentById(studentId);
    if (!student) return;

    // Check if DM exists
    let dmChat = state.chats.find(c => c.type === 'dm' && c.targetId === studentId);
    if (!dmChat) {
        dmChat = {
            id: `chat-dm-${student.id}`,
            type: 'dm',
            targetId: student.id,
            title: `${student.name} (${student.primaryRole.split(' ')[0]})`,
            avatar: student.avatar,
            messages: [
                {
                    id: `dm-init-${Date.now()}`,
                    senderId: student.id,
                    senderName: student.name,
                    senderAvatar: student.avatar,
                    text: `Hey there! Excited to connect for the upcoming hackathon season!`,
                    timestamp: 'Just now'
                }
            ]
        };
        state.chats.push(dmChat);
        state.save();
    }

    state.activeChatId = dmChat.id;
    switchView('chat');
};

// ==========================================
// 6. APPLY MODAL & CREATE PROJECT HANDLERS
// ==========================================
window.openApplyModal = function(projectId, preferredRole = null) {
    currentSelectedProjectId = projectId;
    const project = state.getProjectById(projectId);
    if (!project) return;

    elements.applyModalTitle.textContent = `Apply to ${project.title}`;
    elements.applyModalDesc.textContent = `Target Event: ${project.hackathon} • Track: ${project.track}`;

    // Populate roles
    const filledRoles = project.members.map(m => m.assignedRole);
    const missingRoles = project.requiredSquadRoles.filter(r => !filledRoles.includes(r));
    const rolesToShow = missingRoles.length > 0 ? missingRoles : project.requiredSquadRoles;

    elements.applyRoleSelect.innerHTML = '';
    rolesToShow.forEach(role => {
        const option = document.createElement('option');
        option.value = role;
        option.textContent = role;
        if (preferredRole && role === preferredRole) option.selected = true;
        elements.applyRoleSelect.appendChild(option);
    });

    const currentUser = state.getCurrentUser();
    elements.applyNote.value = `Hey team! I'm ${currentUser.name} studying ${currentUser.major} at ${currentUser.university}. I'd love to join as your ${preferredRole || rolesToShow[0]}! I have experience in ${currentUser.skills.slice(0, 3).join(', ')} and ${currentUser.availability} availability.`;

    elements.applyModal.style.display = 'flex';
};

window.openInviteModal = function(studentId) {
    currentTargetStudentId = studentId;
    const student = state.getStudentById(studentId);
    if (!student) return;

    // Pick first project created by current user
    const currentUser = state.getCurrentUser();
    const myProjects = state.projects.filter(p => p.creatorId === currentUser.id);
    const targetProject = myProjects[0] || state.projects[0];

    window.inviteCandidate(targetProject.id, student.id, student.primaryRole);
};

function handleApplySubmit(e) {
    e.preventDefault();
    const project = state.getProjectById(currentSelectedProjectId);
    if (!project) return;

    const currentUser = state.getCurrentUser();
    const selectedRole = elements.applyRoleSelect.value;
    const noteText = elements.applyNote.value.trim();

    const newReq = {
        id: `req-${Date.now()}`,
        projectId: project.id,
        projectTitle: project.title,
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderAvatar: currentUser.avatar,
        senderRole: currentUser.primaryRole,
        targetRole: selectedRole,
        recipientId: project.creatorId,
        type: 'application',
        status: 'pending',
        note: noteText,
        matchScore: calculateMatchScore(currentUser, project),
        timestamp: 'Just now'
    };

    state.requests.unshift(newReq);
    state.save();
    elements.applyModal.style.display = 'none';
    showToast(`Application submitted for ${project.title}!`);
    updateBadges();
    renderRequests();
}

function handleCreateProject(e) {
    e.preventDefault();
    const title = document.getElementById('new-project-title').value.trim();
    const tagline = document.getElementById('new-project-tagline').value.trim();
    const hackathon = document.getElementById('new-project-hackathon').value;
    const track = document.getElementById('new-project-track').value.trim();
    const commitment = document.getElementById('new-project-commitment').value.trim();
    const deadline = document.getElementById('new-project-deadline').value.trim();
    const description = document.getElementById('new-project-description').value.trim();
    const skillsStr = document.getElementById('new-project-skills').value.trim();

    // Checked roles
    const checkedRoles = Array.from(document.querySelectorAll('#new-project-roles input[type="checkbox"]:checked')).map(cb => cb.value);
    const requiredRoles = checkedRoles.length > 0 ? checkedRoles : ['Frontend Developer', 'UI/UX Designer', 'Pitch / Presenter'];

    const currentUser = state.getCurrentUser();
    const skillsList = skillsStr ? skillsStr.split(',').map(s => s.trim()).filter(Boolean) : ['React', 'Python', 'Figma'];

    const newProject = {
        id: `proj-${Date.now()}`,
        title: title,
        tagline: tagline,
        description: description,
        hackathon: hackathon,
        track: track,
        timeCommitment: commitment,
        deadline: deadline,
        status: 'Recruiting Missing Roles',
        creatorId: currentUser.id,
        requiredSquadRoles: requiredRoles,
        requiredSkills: skillsList,
        members: [
            {
                userId: currentUser.id,
                name: currentUser.name,
                avatar: currentUser.avatar,
                assignedRole: currentUser.primaryRole,
                isLeader: true
            }
        ],
        tasks: [
            { id: `t-${Date.now()}-1`, title: 'Define hackathon MVP scope and architecture', status: 'completed', assignee: currentUser.name },
            { id: `t-${Date.now()}-2`, title: 'Recruit missing squad roles and conduct kickoff sync', status: 'in_progress', assignee: currentUser.name },
            { id: `t-${Date.now()}-3`, title: 'Build high-fidelity prototype and demo video', status: 'todo', assignee: 'Unassigned' }
        ]
    };

    // Create Team Chat channel
    const newChat = {
        id: `chat-${newProject.id}`,
        type: 'team',
        targetId: newProject.id,
        title: `${title} Hub`,
        avatar: currentUser.avatar,
        channel: '#general',
        messages: [
            {
                id: `m-init-${Date.now()}`,
                senderId: currentUser.id,
                senderName: currentUser.name,
                senderAvatar: currentUser.avatar,
                text: `Welcome to ${title}! Project is live on HackerThorne. Let's assemble our squad and build something awesome!`,
                timestamp: 'Just now'
            }
        ]
    };

    state.projects.unshift(newProject);
    state.chats.unshift(newChat);
    state.save();

    elements.createModal.style.display = 'none';
    elements.createProjectForm.reset();
    showToast(`Project "${title}" published successfully!`);
    renderProjects();
    switchView('projects');
}

// Start App on DOM Ready
document.addEventListener('DOMContentLoaded', init);
