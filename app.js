// Application State Management
class TaskFlowApp {
    constructor() {
        this.currentUser = null;
        this.users = [];
        this.tasks = [];
        this.isInitialized = false;
        this.toastCount = 0; // Prevent duplicate toasts
        
        // Initialize demo data first
        this.initializeDemoData();
        
        // Initialize app when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => this.init(), 100);
            });
        } else {
            setTimeout(() => this.init(), 100);
        }
    }

    initializeDemoData() {
        const demoUsers = [
            {
                id: "user_1",
                email: "john@example.com",
                password: "password123",
                name: "John Doe",
                bio: "Software developer passionate about productivity",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
                theme: "light",
                language: "en",
                notifications: {
                    email: true,
                    push: false,
                    reminders: true
                },
                privacy: {
                    showProfile: true,
                    showStats: true
                },
                createdAt: "2025-01-01T00:00:00Z"
            },
            {
                id: "user_2",
                email: "sarah@example.com",
                password: "password123",
                name: "Sarah Wilson",
                bio: "Project manager and productivity enthusiast",
                avatar: "https://images.unsplash.com/photo-1494790108755-2616c9fd9c6e?w=150&h=150&fit=crop&crop=face",
                theme: "dark",
                language: "en",
                notifications: {
                    email: false,
                    push: true,
                    reminders: true
                },
                privacy: {
                    showProfile: true,
                    showStats: false
                },
                createdAt: "2025-01-02T00:00:00Z"
            }
        ];

        const demoTasks = [
            {
                id: "task_1",
                userId: "user_1",
                title: "Complete project proposal",
                description: "Finish the Q1 project proposal for the new client",
                completed: false,
                priority: "high",
                category: "work",
                dueDate: "2025-02-15T00:00:00Z",
                createdAt: "2025-01-20T00:00:00Z",
                updatedAt: "2025-01-20T00:00:00Z"
            },
            {
                id: "task_2",
                userId: "user_1",
                title: "Review code changes",
                description: "Review and approve pull requests from the team",
                completed: true,
                priority: "medium",
                category: "work",
                dueDate: "2025-01-25T00:00:00Z",
                createdAt: "2025-01-18T00:00:00Z",
                updatedAt: "2025-01-24T00:00:00Z"
            },
            {
                id: "task_3",
                userId: "user_1",
                title: "Plan weekend trip",
                description: "Research and book accommodations for the weekend getaway",
                completed: false,
                priority: "low",
                category: "personal",
                dueDate: "2025-02-01T00:00:00Z",
                createdAt: "2025-01-19T00:00:00Z",
                updatedAt: "2025-01-19T00:00:00Z"
            },
            {
                id: "task_4",
                userId: "user_2",
                title: "Team retrospective meeting",
                description: "Conduct monthly team retrospective and gather feedback",
                completed: false,
                priority: "high",
                category: "work",
                dueDate: "2025-01-30T00:00:00Z",
                createdAt: "2025-01-21T00:00:00Z",
                updatedAt: "2025-01-21T00:00:00Z"
            },
            {
                id: "task_5",
                userId: "user_2",
                title: "Update project timeline",
                description: "Revise project milestones based on recent changes",
                completed: true,
                priority: "medium",
                category: "work",
                dueDate: "2025-01-22T00:00:00Z",
                createdAt: "2025-01-15T00:00:00Z",
                updatedAt: "2025-01-22T00:00:00Z"
            }
        ];

        // Load existing data or initialize with demo data
        const storedUsers = localStorage.getItem('taskflow_users');
        const storedTasks = localStorage.getItem('taskflow_tasks');

        if (!storedUsers) {
            this.users = demoUsers;
            localStorage.setItem('taskflow_users', JSON.stringify(demoUsers));
        } else {
            this.users = JSON.parse(storedUsers);
        }

        if (!storedTasks) {
            this.tasks = demoTasks;
            localStorage.setItem('taskflow_tasks', JSON.stringify(demoTasks));
        } else {
            this.tasks = JSON.parse(storedTasks);
        }
    }

    init() {
        console.log('Initializing TaskFlow App...');
        
        // Show loading screen briefly
        setTimeout(() => {
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
            }
            
            // Check for existing session
            const session = this.getSession();
            if (session && this.isValidSession(session)) {
                this.currentUser = this.getUserById(session.userId);
                if (this.currentUser) {
                    this.showMainApp(false); // Don't show welcome toast on init
                } else {
                    this.showAuthPage();
                }
            } else {
                this.showAuthPage();
            }
            
            // Bind events after showing the appropriate page
            setTimeout(() => {
                this.bindEventListeners();
                this.isInitialized = true;
                console.log('App initialized successfully');
            }, 100);
            
        }, 1500);
    }

    bindEventListeners() {
        console.log('Binding event listeners...');
        
        // Clear any existing listeners to prevent duplicates
        this.clearEventListeners();
        
        // Authentication form events
        this.bindAuthEvents();
        
        // Navigation events
        this.bindNavigationEvents();
        
        // User menu events
        this.bindUserMenuEvents();
        
        // Task events
        this.bindTaskEvents();
        
        // Profile events
        this.bindProfileEvents();
        
        // Global events
        this.bindGlobalEvents();
        
        console.log('Event listeners bound successfully');
    }

    clearEventListeners() {
        // Clear toast container to prevent duplicates
        const toastContainer = document.getElementById('toastContainer');
        if (toastContainer) {
            toastContainer.innerHTML = '';
        }
        this.toastCount = 0;
    }

    bindAuthEvents() {
        // Login form
        const loginForm = document.getElementById('loginFormElement');
        if (loginForm) {
            // Remove existing listeners
            const newForm = loginForm.cloneNode(true);
            loginForm.parentNode.replaceChild(newForm, loginForm);
            
            newForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin(e);
            });
        }

        // Register form  
        const registerForm = document.getElementById('registerFormElement');
        if (registerForm) {
            const newForm = registerForm.cloneNode(true);
            registerForm.parentNode.replaceChild(newForm, registerForm);
            
            newForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister(e);
            });
        }

        // Form switching links
        const showRegister = document.getElementById('showRegister');
        if (showRegister) {
            showRegister.onclick = (e) => {
                e.preventDefault();
                this.showRegisterForm();
            };
        }

        const showLogin = document.getElementById('showLogin');
        if (showLogin) {
            showLogin.onclick = (e) => {
                e.preventDefault();
                this.showLoginForm();
            };
        }

        // Demo login buttons
        const demoButtons = document.querySelectorAll('.demo-login');
        demoButtons.forEach(btn => {
            btn.onclick = (e) => {
                e.preventDefault();
                this.handleDemoLogin(e);
            };
        });
    }

    bindNavigationEvents() {
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.onclick = (e) => {
                e.preventDefault();
                this.handleNavigation(e);
            };
        });
    }

    bindUserMenuEvents() {
        const userMenuToggle = document.getElementById('userMenuToggle');
        if (userMenuToggle) {
            // Clear existing event listeners
            userMenuToggle.onclick = null;
            userMenuToggle.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('User menu toggle clicked');
                this.toggleUserMenu();
            };
        }

        const profileSettingsBtn = document.getElementById('profileSettingsBtn');
        if (profileSettingsBtn) {
            profileSettingsBtn.onclick = (e) => {
                e.preventDefault();
                this.showProfileSettings();
            };
        }

        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.onclick = (e) => {
                e.preventDefault();
                this.toggleTheme();
            };
        }

        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.onclick = (e) => {
                e.preventDefault();
                this.logout();
            };
        }

        const backToDashboard = document.getElementById('backToDashboard');
        if (backToDashboard) {
            backToDashboard.onclick = (e) => {
                e.preventDefault();
                this.showPage('dashboard');
            };
        }
    }

    bindTaskEvents() {
        const addTaskBtn = document.getElementById('addTaskBtn');
        if (addTaskBtn) {
            addTaskBtn.onclick = (e) => {
                e.preventDefault();
                this.showTaskModal();
            };
        }

        const addQuickTaskBtn = document.getElementById('addQuickTaskBtn');
        if (addQuickTaskBtn) {
            addQuickTaskBtn.onclick = (e) => {
                e.preventDefault();
                this.showTaskModal();
            };
        }

        const taskForm = document.getElementById('taskForm');
        if (taskForm) {
            const newForm = taskForm.cloneNode(true);
            taskForm.parentNode.replaceChild(newForm, taskForm);
            
            newForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleTaskSubmit(e);
            });
        }

        const closeTaskModal = document.getElementById('closeTaskModal');
        if (closeTaskModal) {
            closeTaskModal.onclick = (e) => {
                e.preventDefault();
                this.hideTaskModal();
            };
        }

        const cancelTask = document.getElementById('cancelTask');
        if (cancelTask) {
            cancelTask.onclick = (e) => {
                e.preventDefault();
                this.hideTaskModal();
            };
        }

        // Filter events
        const filters = ['categoryFilter', 'priorityFilter', 'statusFilter'];
        filters.forEach(filterId => {
            const filter = document.getElementById(filterId);
            if (filter) {
                filter.onchange = () => this.filterTasks();
            }
        });

        const taskSearch = document.getElementById('taskSearch');
        if (taskSearch) {
            taskSearch.oninput = () => this.filterTasks();
        }
    }

    bindProfileEvents() {
        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            const newForm = profileForm.cloneNode(true);
            profileForm.parentNode.replaceChild(newForm, profileForm);
            
            newForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleProfileUpdate(e);
            });
        }

        const updateAvatarBtn = document.getElementById('updateAvatarBtn');
        if (updateAvatarBtn) {
            updateAvatarBtn.onclick = (e) => {
                e.preventDefault();
                this.updateAvatar();
            };
        }

        const themePreference = document.getElementById('themePreference');
        if (themePreference) {
            themePreference.onchange = (e) => {
                this.handleThemeChange(e);
            };
        }
    }

    bindGlobalEvents() {
        // Close dropdowns when clicking outside
        document.onclick = (e) => {
            this.handleOutsideClick(e);
        };

        // Modal close on outside click
        const taskModal = document.getElementById('taskModal');
        if (taskModal) {
            taskModal.onclick = (e) => {
                if (e.target.id === 'taskModal') {
                    this.hideTaskModal();
                }
            };
        }
    }

    // Authentication Methods
    handleLogin(e) {
        console.log('Handling login...');
        const emailInput = document.getElementById('loginEmail');
        const passwordInput = document.getElementById('loginPassword');
        
        if (!emailInput || !passwordInput) {
            console.error('Login form elements not found');
            return;
        }

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        console.log('Login attempt for:', email);

        const user = this.users.find(u => u.email === email && u.password === password);
        if (user) {
            console.log('User found, logging in:', user.name);
            this.login(user);
        } else {
            console.log('Invalid credentials');
            this.showToast('Invalid email or password', 'error');
        }
    }

    handleRegister(e) {
        console.log('Handling registration...');
        const name = document.getElementById('registerName').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('registerConfirmPassword').value;

        if (password !== confirmPassword) {
            this.showToast('Passwords do not match', 'error');
            return;
        }

        if (this.users.find(u => u.email === email)) {
            this.showToast('Email already exists', 'error');
            return;
        }

        const newUser = {
            id: 'user_' + Date.now(),
            email,
            password,
            name,
            bio: '',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
            theme: 'light',
            language: 'en',
            notifications: {
                email: true,
                push: false,
                reminders: true
            },
            privacy: {
                showProfile: true,
                showStats: true
            },
            createdAt: new Date().toISOString()
        };

        this.users.push(newUser);
        this.saveUsers();
        this.login(newUser);
        this.showToast('Account created successfully!', 'success');
    }

    handleDemoLogin(e) {
        console.log('Handling demo login...');
        const email = e.target.dataset.email;
        console.log('Demo login for email:', email);
        
        const user = this.users.find(u => u.email === email);
        if (user) {
            console.log('Demo user found:', user.name);
            this.login(user);
        } else {
            console.error('Demo user not found for email:', email);
            this.showToast('Demo user not found', 'error');
        }
    }

    login(user) {
        console.log('Logging in user:', user.name);
        this.currentUser = user;
        this.createSession(user.id);
        this.applyTheme(user.theme);
        this.showMainApp(true); // Show welcome toast on login
    }

    logout() {
        console.log('Logging out user');
        this.currentUser = null;
        this.clearSession();
        this.showAuthPage();
        this.showToast('Logged out successfully', 'info');
    }

    // Session Management
    createSession(userId) {
        const session = {
            userId,
            token: 'token_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        };
        sessionStorage.setItem('taskflow_session', JSON.stringify(session));
        return session;
    }

    getSession() {
        const session = sessionStorage.getItem('taskflow_session');
        return session ? JSON.parse(session) : null;
    }

    isValidSession(session) {
        return session && new Date(session.expiresAt) > new Date();
    }

    clearSession() {
        sessionStorage.removeItem('taskflow_session');
    }

    // UI Navigation Methods
    showAuthPage() {
        console.log('Showing auth page');
        const authPage = document.getElementById('authPage');
        const mainApp = document.getElementById('mainApp');
        
        if (authPage) authPage.classList.remove('hidden');
        if (mainApp) mainApp.classList.add('hidden');
        
        // Re-bind auth events after showing auth page
        setTimeout(() => {
            this.bindAuthEvents();
        }, 100);
    }

    showMainApp(showWelcome = false) {
        console.log('Showing main app');
        const authPage = document.getElementById('authPage');
        const mainApp = document.getElementById('mainApp');
        
        if (authPage) authPage.classList.add('hidden');
        if (mainApp) mainApp.classList.remove('hidden');
        
        this.updateUserInterface();
        this.showPage('dashboard');
        
        // Show welcome toast only when explicitly requested (on login, not on init)
        if (showWelcome && this.currentUser) {
            this.showToast(`Welcome back, ${this.currentUser.name}!`, 'success');
        }
        
        // Re-bind main app events
        setTimeout(() => {
            this.bindNavigationEvents();
            this.bindUserMenuEvents();
            this.bindTaskEvents();
            this.bindProfileEvents();
        }, 100);
    }

    showLoginForm() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        if (loginForm) loginForm.classList.remove('hidden');
        if (registerForm) registerForm.classList.add('hidden');
    }

    showRegisterForm() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        
        if (loginForm) loginForm.classList.add('hidden');
        if (registerForm) registerForm.classList.remove('hidden');
    }

    showPage(pageName) {
        console.log('Showing page:', pageName);
        
        // Hide all pages
        const pages = document.querySelectorAll('.page-content');
        pages.forEach(page => {
            page.classList.add('hidden');
        });

        // Show selected page
        const targetPage = document.getElementById(pageName + 'Page');
        if (targetPage) {
            targetPage.classList.remove('hidden');
        }

        // Update navigation
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeBtn = document.querySelector(`[data-page="${pageName}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }

        // Load page-specific content with proper timing
        setTimeout(() => {
            switch(pageName) {
                case 'dashboard':
                    this.loadDashboard();
                    break;
                case 'tasks':
                    this.loadTasksPage();
                    break;
                case 'analytics':
                    this.loadAnalytics();
                    break;
            }
        }, 100);
    }

    handleNavigation(e) {
        const page = e.target.dataset.page;
        console.log('Navigation clicked:', page);
        if (page) {
            this.showPage(page);
        }
    }

    showProfileSettings() {
        console.log('Showing profile settings');
        const profilePage = document.getElementById('profilePage');
        if (profilePage) {
            profilePage.classList.remove('hidden');
        }
        
        const pages = document.querySelectorAll('.page-content');
        pages.forEach(page => {
            if (page.id !== 'profilePage') {
                page.classList.add('hidden');
            }
        });
        
        setTimeout(() => {
            this.loadProfileSettings();
            this.bindProfileEvents();
        }, 100);
        
        this.hideUserMenu();
    }

    updateUserInterface() {
        if (!this.currentUser) return;

        const headerAvatar = document.getElementById('headerUserAvatar');
        const headerName = document.getElementById('headerUserName');
        
        if (headerAvatar) headerAvatar.src = this.currentUser.avatar;
        if (headerName) headerName.textContent = this.currentUser.name;
        
        // Re-bind user menu events to ensure they work for the updated interface
        setTimeout(() => {
            this.bindUserMenuEvents();
        }, 50);
    }

    // Dashboard Methods
    loadDashboard() {
        if (!this.currentUser) return;

        const userTasks = this.getUserTasks();
        const stats = this.calculateTaskStats(userTasks);

        // Update welcome message
        const welcomeMsg = document.getElementById('welcomeMessage');
        const subtitle = document.getElementById('dashboardSubtitle');
        
        if (welcomeMsg) welcomeMsg.textContent = `Welcome back, ${this.currentUser.name}!`;
        
        if (subtitle) {
            const now = new Date();
            const timeOfDay = now.getHours() < 12 ? 'morning' : now.getHours() < 18 ? 'afternoon' : 'evening';
            subtitle.textContent = `Good ${timeOfDay}! Here's your productivity overview.`;
        }

        // Update stats
        const elements = {
            totalTasks: stats.total,
            completedTasks: stats.completed,
            pendingTasks: stats.pending,
            highPriorityTasks: stats.highPriority
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) element.textContent = value;
        });

        // Load recent tasks and chart
        this.loadRecentTasks();
        setTimeout(() => this.loadProgressChart(), 300);
    }

    loadRecentTasks() {
        const userTasks = this.getUserTasks()
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
            .slice(0, 5);

        const container = document.getElementById('recentTasksList');
        if (container) {
            container.innerHTML = userTasks.map(task => this.createTaskHTML(task)).join('');
        }
    }

    loadProgressChart() {
        const userTasks = this.getUserTasks();
        const completed = userTasks.filter(t => t.completed).length;
        const pending = userTasks.filter(t => !t.completed).length;

        const canvas = document.getElementById('progressChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        if (window.progressChart) {
            window.progressChart.destroy();
        }

        try {
            window.progressChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Completed', 'Pending'],
                    datasets: [{
                        data: [completed, pending],
                        backgroundColor: ['#1FB8CD', '#FFC185'],
                        borderWidth: 2,
                        borderColor: '#ffffff'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error creating progress chart:', error);
        }
    }

    // Task Management Methods
    loadTasksPage() {
        this.renderTasks();
        // Re-bind task events after rendering
        setTimeout(() => this.bindTaskEvents(), 100);
    }

    renderTasks() {
        const filteredTasks = this.getFilteredTasks();
        const container = document.getElementById('tasksList');
        
        if (!container) return;
        
        if (filteredTasks.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>No tasks found. Create your first task!</p></div>';
            return;
        }

        container.innerHTML = filteredTasks.map(task => this.createTaskHTML(task, true)).join('');
    }

    createTaskHTML(task, showFullActions = false) {
        const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date';
        const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
        
        return `
            <div class="task-item ${task.completed ? 'completed' : ''}" data-task-id="${task.id}">
                <div class="task-content">
                    <h4 class="task-title">${task.title}</h4>
                    ${task.description ? `<p class="task-description">${task.description}</p>` : ''}
                    <div class="task-meta">
                        <span class="task-category">${task.category}</span>
                        <span class="task-priority ${task.priority}">${task.priority}</span>
                        <span class="task-due-date ${isOverdue ? 'overdue' : ''}">${dueDate}</span>
                    </div>
                </div>
                <div class="task-actions">
                    <button class="btn btn--sm ${task.completed ? 'btn--outline' : 'btn--primary'}" 
                            onclick="app.toggleTaskComplete('${task.id}')">
                        ${task.completed ? 'Undo' : 'Complete'}
                    </button>
                    ${showFullActions ? `
                        <button class="btn btn--sm btn--outline" onclick="app.editTask('${task.id}')">Edit</button>
                        <button class="btn btn--sm btn--outline" onclick="app.deleteTask('${task.id}')">Delete</button>
                    ` : ''}
                </div>
            </div>
        `;
    }

    showTaskModal(editTaskId = null) {
        const modal = document.getElementById('taskModal');
        const form = document.getElementById('taskForm');
        const title = document.getElementById('taskModalTitle');

        if (!modal || !form || !title) return;

        if (editTaskId) {
            const task = this.getTaskById(editTaskId);
            if (task) {
                title.textContent = 'Edit Task';
                document.getElementById('taskId').value = task.id;
                document.getElementById('taskTitle').value = task.title;
                document.getElementById('taskDescription').value = task.description || '';
                document.getElementById('taskCategory').value = task.category;
                document.getElementById('taskPriority').value = task.priority;
                if (task.dueDate) {
                    const date = new Date(task.dueDate);
                    document.getElementById('taskDueDate').value = date.toISOString().slice(0, 16);
                }
            }
        } else {
            title.textContent = 'Add Task';
            form.reset();
            document.getElementById('taskId').value = '';
        }

        modal.classList.remove('hidden');
        setTimeout(() => {
            const titleInput = document.getElementById('taskTitle');
            if (titleInput) titleInput.focus();
        }, 100);
    }

    hideTaskModal() {
        const modal = document.getElementById('taskModal');
        const form = document.getElementById('taskForm');
        
        if (modal) modal.classList.add('hidden');
        if (form) form.reset();
    }

    handleTaskSubmit(e) {
        const taskId = document.getElementById('taskId').value;
        const taskData = {
            title: document.getElementById('taskTitle').value,
            description: document.getElementById('taskDescription').value,
            category: document.getElementById('taskCategory').value,
            priority: document.getElementById('taskPriority').value,
            dueDate: document.getElementById('taskDueDate').value || null
        };

        if (taskId) {
            this.updateTask(taskId, taskData);
        } else {
            this.createTask(taskData);
        }

        this.hideTaskModal();
    }

    createTask(taskData) {
        const newTask = {
            id: 'task_' + Date.now(),
            userId: this.currentUser.id,
            ...taskData,
            completed: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.tasks.push(newTask);
        this.saveTasks();
        this.showToast('Task created successfully!', 'success');
        this.refreshCurrentView();
    }

    updateTask(taskId, taskData) {
        const taskIndex = this.tasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
            this.tasks[taskIndex] = {
                ...this.tasks[taskIndex],
                ...taskData,
                updatedAt: new Date().toISOString()
            };
            this.saveTasks();
            this.showToast('Task updated successfully!', 'success');
            this.refreshCurrentView();
        }
    }

    deleteTask(taskId) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.tasks = this.tasks.filter(t => t.id !== taskId);
            this.saveTasks();
            this.showToast('Task deleted successfully!', 'success');
            this.refreshCurrentView();
        }
    }

    editTask(taskId) {
        this.showTaskModal(taskId);
    }

    toggleTaskComplete(taskId) {
        const task = this.getTaskById(taskId);
        if (task) {
            task.completed = !task.completed;
            task.updatedAt = new Date().toISOString();
            this.saveTasks();
            this.showToast(`Task ${task.completed ? 'completed' : 'reopened'}!`, 'success');
            this.refreshCurrentView();
        }
    }

    filterTasks() {
        this.renderTasks();
    }

    getFilteredTasks() {
        let filtered = this.getUserTasks();

        const categoryFilter = document.getElementById('categoryFilter');
        const priorityFilter = document.getElementById('priorityFilter');
        const statusFilter = document.getElementById('statusFilter');
        const taskSearch = document.getElementById('taskSearch');

        if (categoryFilter && categoryFilter.value) {
            filtered = filtered.filter(t => t.category === categoryFilter.value);
        }

        if (priorityFilter && priorityFilter.value) {
            filtered = filtered.filter(t => t.priority === priorityFilter.value);
        }

        if (statusFilter && statusFilter.value) {
            if (statusFilter.value === 'completed') {
                filtered = filtered.filter(t => t.completed);
            } else if (statusFilter.value === 'pending') {
                filtered = filtered.filter(t => !t.completed);
            }
        }

        if (taskSearch && taskSearch.value) {
            const searchQuery = taskSearch.value.toLowerCase();
            filtered = filtered.filter(t => 
                t.title.toLowerCase().includes(searchQuery) || 
                (t.description && t.description.toLowerCase().includes(searchQuery))
            );
        }

        return filtered.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    }

    // Analytics Methods
    loadAnalytics() {
        const userTasks = this.getUserTasks();
        // Add longer delay for analytics charts to ensure proper rendering
        setTimeout(() => {
            this.renderCompletionChart(userTasks);
            this.renderCategoryChart(userTasks);
            this.renderPriorityChart(userTasks);
            this.renderWeeklyChart(userTasks);
        }, 500);
    }

    renderCompletionChart(tasks) {
        const completed = tasks.filter(t => t.completed).length;
        const total = tasks.length;
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

        const canvas = document.getElementById('completionChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        if (window.completionChart) {
            window.completionChart.destroy();
        }

        try {
            window.completionChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Completion Rate'],
                    datasets: [{
                        label: 'Percentage',
                        data: [completionRate],
                        backgroundColor: ['#1FB8CD'],
                        borderColor: ['#1FB8CD'],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 100
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error creating completion chart:', error);
        }
    }

    renderCategoryChart(tasks) {
        const categories = {};
        tasks.forEach(task => {
            categories[task.category] = (categories[task.category] || 0) + 1;
        });

        const canvas = document.getElementById('categoryChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        if (window.categoryChart) {
            window.categoryChart.destroy();
        }

        try {
            window.categoryChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: Object.keys(categories),
                    datasets: [{
                        data: Object.values(categories),
                        backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        } catch (error) {
            console.error('Error creating category chart:', error);
        }
    }

    renderPriorityChart(tasks) {
        const priorities = { high: 0, medium: 0, low: 0 };
        tasks.forEach(task => {
            priorities[task.priority]++;
        });

        const canvas = document.getElementById('priorityChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        if (window.priorityChart) {
            window.priorityChart.destroy();
        }

        try {
            window.priorityChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['High', 'Medium', 'Low'],
                    datasets: [{
                        data: [priorities.high, priorities.medium, priorities.low],
                        backgroundColor: ['#B4413C', '#FFC185', '#1FB8CD']
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        } catch (error) {
            console.error('Error creating priority chart:', error);
        }
    }

    renderWeeklyChart(tasks) {
        const days = [];
        const completedByDay = [];
        
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dayStr = date.toISOString().split('T')[0];
            days.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
            
            const completed = tasks.filter(task => 
                task.completed && 
                task.updatedAt.startsWith(dayStr)
            ).length;
            
            completedByDay.push(completed);
        }

        const canvas = document.getElementById('weeklyChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        
        if (window.weeklyChart) {
            window.weeklyChart.destroy();
        }

        try {
            window.weeklyChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: days,
                    datasets: [{
                        label: 'Tasks Completed',
                        data: completedByDay,
                        borderColor: '#1FB8CD',
                        backgroundColor: 'rgba(31, 184, 205, 0.1)',
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        } catch (error) {
            console.error('Error creating weekly chart:', error);
        }
    }

    // Profile Management Methods
    loadProfileSettings() {
        if (!this.currentUser) return;

        const user = this.currentUser;
        const elements = {
            profileAvatar: user.avatar,
            avatarUrl: user.avatar,
            profileName: user.name,
            profileEmail: user.email,
            profileBio: user.bio || '',
            themePreference: user.theme,
            languagePreference: user.language
        };

        Object.entries(elements).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                if (element.tagName === 'IMG') {
                    element.src = value;
                } else {
                    element.value = value;
                }
            }
        });
        
        // Set notification preferences
        const notifications = {
            emailNotifications: user.notifications.email,
            pushNotifications: user.notifications.push,
            reminderNotifications: user.notifications.reminders
        };

        Object.entries(notifications).forEach(([id, checked]) => {
            const element = document.getElementById(id);
            if (element) element.checked = checked;
        });
        
        // Set privacy preferences
        const privacy = {
            showProfile: user.privacy.showProfile,
            showStats: user.privacy.showStats
        };

        Object.entries(privacy).forEach(([id, checked]) => {
            const element = document.getElementById(id);
            if (element) element.checked = checked;
        });
    }

    handleProfileUpdate(e) {
        const updatedUser = {
            ...this.currentUser,
            name: document.getElementById('profileName').value,
            email: document.getElementById('profileEmail').value,
            bio: document.getElementById('profileBio').value,
            language: document.getElementById('languagePreference').value,
            notifications: {
                email: document.getElementById('emailNotifications').checked,
                push: document.getElementById('pushNotifications').checked,
                reminders: document.getElementById('reminderNotifications').checked
            },
            privacy: {
                showProfile: document.getElementById('showProfile').checked,
                showStats: document.getElementById('showStats').checked
            }
        };

        this.updateUser(updatedUser);
        this.showToast('Profile updated successfully!', 'success');
    }

    updateAvatar() {
        const newAvatarUrl = document.getElementById('avatarUrl').value;
        if (newAvatarUrl) {
            this.currentUser.avatar = newAvatarUrl;
            this.updateUser(this.currentUser);
            
            const profileAvatar = document.getElementById('profileAvatar');
            const headerAvatar = document.getElementById('headerUserAvatar');
            
            if (profileAvatar) profileAvatar.src = newAvatarUrl;
            if (headerAvatar) headerAvatar.src = newAvatarUrl;
            
            this.showToast('Avatar updated successfully!', 'success');
        }
    }

    handleThemeChange(e) {
        const theme = e.target.value;
        this.currentUser.theme = theme;
        this.updateUser(this.currentUser);
        this.applyTheme(theme);
        this.showToast('Theme updated successfully!', 'success');
    }

    // Theme Management
    toggleTheme() {
        const currentTheme = this.currentUser.theme === 'light' ? 'dark' : 'light';
        this.currentUser.theme = currentTheme;
        this.updateUser(this.currentUser);
        this.applyTheme(currentTheme);
        this.hideUserMenu();
    }

    applyTheme(theme) {
        if (theme === 'auto') {
            document.documentElement.removeAttribute('data-color-scheme');
        } else {
            document.documentElement.setAttribute('data-color-scheme', theme);
        }
    }

    // User Menu Management
    toggleUserMenu() {
        console.log('Toggling user menu');
        const dropdown = document.getElementById('userDropdown');
        if (dropdown) {
            dropdown.classList.toggle('hidden');
            console.log('User menu toggled, hidden:', dropdown.classList.contains('hidden'));
        } else {
            console.error('User dropdown not found');
        }
    }

    hideUserMenu() {
        const dropdown = document.getElementById('userDropdown');
        if (dropdown && !dropdown.classList.contains('hidden')) {
            dropdown.classList.add('hidden');
        }
    }

    handleOutsideClick(e) {
        if (!e.target.closest('.user-menu')) {
            this.hideUserMenu();
        }
    }

    // Utility Methods
    getUserTasks() {
        return this.tasks.filter(task => task.userId === this.currentUser.id);
    }

    getTaskById(taskId) {
        return this.tasks.find(task => task.id === taskId);
    }

    getUserById(userId) {
        return this.users.find(user => user.id === userId);
    }

    updateUser(updatedUser) {
        const userIndex = this.users.findIndex(u => u.id === updatedUser.id);
        if (userIndex !== -1) {
            this.users[userIndex] = updatedUser;
            this.currentUser = updatedUser;
            this.saveUsers();
            this.updateUserInterface();
        }
    }

    calculateTaskStats(tasks) {
        return {
            total: tasks.length,
            completed: tasks.filter(t => t.completed).length,
            pending: tasks.filter(t => !t.completed).length,
            highPriority: tasks.filter(t => t.priority === 'high' && !t.completed).length
        };
    }

    refreshCurrentView() {
        const activePage = document.querySelector('.nav-btn.active')?.dataset.page || 'dashboard';
        this.showPage(activePage);
    }

    // Data Persistence
    saveUsers() {
        localStorage.setItem('taskflow_users', JSON.stringify(this.users));
    }

    saveTasks() {
        localStorage.setItem('taskflow_tasks', JSON.stringify(this.tasks));
    }

    // Toast Notifications
    showToast(message, type = 'info') {
        // Prevent duplicate toasts
        if (this.toastCount > 0) {
            return;
        }
        
        this.toastCount++;
        
        const container = document.getElementById('toastContainer');
        if (!container) {
            this.toastCount = 0;
            return;
        }
        
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        toast.innerHTML = `
            <div class="toast-content">
                <p class="toast-message">${message}</p>
                <button class="toast-close">&times;</button>
            </div>
        `;

        container.appendChild(toast);

        // Auto remove after 3 seconds
        setTimeout(() => {
            this.removeToast(toast);
        }, 3000);

        // Close button functionality
        const closeBtn = toast.querySelector('.toast-close');
        if (closeBtn) {
            closeBtn.onclick = () => {
                this.removeToast(toast);
            };
        }
    }

    removeToast(toast) {
        if (toast && toast.parentNode) {
            toast.classList.add('removing');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
                this.toastCount = Math.max(0, this.toastCount - 1);
            }, 300);
        }
    }
}

// Initialize the application
const app = new TaskFlowApp();

// Make app globally available
window.app = app;