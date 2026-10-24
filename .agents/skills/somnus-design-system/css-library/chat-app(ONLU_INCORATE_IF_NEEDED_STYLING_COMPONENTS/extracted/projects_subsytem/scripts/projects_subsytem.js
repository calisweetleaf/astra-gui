// Revolutionary Projects Management System
        class RevolutionaryProjectsManager {
            constructor() {
                this.websocket = null;
                this.isConnected = false;
                this.projects = new Map();
                this.selectedProject = null;
                this.currentTab = 'vm-dashboard';
                this.monitoringCharts = {
                    resource: null,
                    activity: null
                };
                
                this.init();
            }

            init() {
                this.connectWebSocket();
                this.initializeEventListeners();
                this.initializeCharts();
                this.loadProjects();
                this.startMonitoring();
                this.populateSampleData();
            }

            connectWebSocket() {
                try {
                    this.websocket = new WebSocket('ws://localhost:25805/projects/ws');
                    
                    this.websocket.onopen = () => {
                        this.isConnected = true;
                        this.logActivity('WebSocket connected to projects system', 'success');
                    };

                    this.websocket.onmessage = (event) => {
                        const data = JSON.parse(event.data);
                        this.handleWebSocketMessage(data);
                    };

                    this.websocket.onclose = () => {
                        this.isConnected = false;
                        this.logActivity('WebSocket disconnected', 'warning');
                        setTimeout(() => this.connectWebSocket(), 5000);
                    };

                    this.websocket.onerror = (error) => {
                        this.logActivity('WebSocket error: ' + error.message, 'error');
                    };
                } catch (error) {
                    this.logActivity('Failed to connect WebSocket: ' + error.message, 'error');
                }
            }

            sendMessage(data) {
                if (this.isConnected && this.websocket.readyState === WebSocket.OPEN) {
                    this.websocket.send(JSON.stringify(data));
                } else {
                    this.logActivity('Cannot send message: WebSocket not connected', 'warning');
                }
            }

            handleWebSocketMessage(data) {
                switch (data.type) {
                    case 'project_created':
                        this.addProject(data.project);
                        break;
                    case 'project_updated':
                        this.updateProject(data.project);
                        break;
                    case 'vm_status_update':
                        this.updateVMStatus(data.projectId, data.vmStatus);
                        break;
                    case 'collaboration_update':
                        this.updateCollaboration(data.projectId, data.collaboration);
                        break;
                    case 'intelligence_insight':
                        this.addIntelligenceInsight(data.insight);
                        break;
                    case 'activity_update':
                        this.addActivity(data.activity);
                        break;
                    default:
                        console.log('Unknown message type:', data.type);
                }
            }

            initializeEventListeners() {
                // Create project button
                document.getElementById('create-project').addEventListener('click', () => {
                    this.showCreateProjectModal();
                });

                // Modal controls
                document.getElementById('close-modal').addEventListener('click', () => {
                    this.hideCreateProjectModal();
                });

                document.getElementById('cancel-create').addEventListener('click', () => {
                    this.hideCreateProjectModal();
                });

                // Create project form
                document.getElementById('create-project-form').addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.createProject();
                });

                // Tab switching
                document.querySelectorAll('.workspace-tab').forEach(tab => {
                    tab.addEventListener('click', () => {
                        this.switchTab(tab.dataset.tab);
                    });
                });

                // Filter buttons
                document.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.addEventListener('click', () => {
                        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                        this.filterProjects(btn.dataset.type);
                    });
                });

                // Search functionality
                document.getElementById('project-search').addEventListener('input', (e) => {
                    this.searchProjects(e.target.value);
                });

                // Header controls
                document.getElementById('sync-projects').addEventListener('click', () => {
                    this.syncProjects();
                });

                document.getElementById('project-settings').addEventListener('click', () => {
                    this.showProjectSettings();
                });

                // Intelligence actions
                document.getElementById('ai-analyze').addEventListener('click', () => {
                    this.analyzeProject();
                });

                document.getElementById('ai-optimize').addEventListener('click', () => {
                    this.optimizeWorkflow();
                });

                document.getElementById('ai-suggest').addEventListener('click', () => {
                    this.generateSuggestions();
                });

                // Click outside modal to close
                document.getElementById('create-project-modal').addEventListener('click', (e) => {
                    if (e.target.id === 'create-project-modal') {
                        this.hideCreateProjectModal();
                    }
                });
            }

            initializeCharts() {
                try {
                    // Check if Chart.js is loaded
                    if (typeof Chart === 'undefined') {
                        console.error('Chart.js is not loaded');
                        this.logActivity('Chart.js library not loaded', 'error');
                        return;
                    }

                    // Wait for DOM elements to be available
                    const resourceCanvas = document.getElementById('resource-chart');
                    const activityCanvas = document.getElementById('activity-chart');
                    
                    if (!resourceCanvas || !activityCanvas) {
                        console.error('Chart canvas elements not found');
                        setTimeout(() => this.initializeCharts(), 1000);
                        return;
                    }

                    // Resource usage chart
                    const resourceCtx = resourceCanvas.getContext('2d');
                    this.monitoringCharts.resource = new Chart(resourceCtx, {
                        type: 'doughnut',
                        data: {
                            labels: ['CPU', 'Memory', 'Storage'],
                            datasets: [{
                                data: [65, 45, 30],
                                backgroundColor: ['#06b6d4', '#8b5cf6', '#10b981'],
                                borderColor: '#1a1a2e',
                                borderWidth: 2
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    display: false
                                }
                            }
                        }
                    });

                    // Activity chart
                    const activityCtx = activityCanvas.getContext('2d');
                    this.monitoringCharts.activity = new Chart(activityCtx, {
                        type: 'line',
                        data: {
                            labels: ['1h', '2h', '3h', '4h', '5h', '6h'],
                            datasets: [{
                                label: 'Activity',
                                data: [12, 19, 15, 25, 22, 18],
                                borderColor: '#06b6d4',
                                backgroundColor: 'rgba(6, 182, 212, 0.1)',
                                tension: 0.4,
                                fill: true
                            }]
                        },
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                x: {
                                    display: false
                                },
                                y: {
                                    display: false
                                }
                            },
                            plugins: {
                                legend: {
                                    display: false
                                }
                            }
                        }
                    });

                    this.logActivity('Monitoring charts initialized successfully', 'success');
                } catch (error) {
                    console.error('Error initializing charts:', error);
                    this.logActivity(`Chart initialization failed: ${error.message}`, 'error');
                }
            }

            loadProjects() {
                // Load projects from backend or localStorage
                this.sendMessage({
                    type: 'list_projects',
                    user_id: 'current_user'
                });
            }

            populateSampleData() {
                const sampleProjects = [
                    {
                        id: 'quantum-research',
                        name: 'Quantum Research Project',
                        description: 'Advanced quantum computing research with cryptographic implications',
                        type: 'research',
                        status: 'running',
                        vmStatus: {
                            cpu: 23,
                            memory: 68,
                            storage: 45,
                            uptime: '2d 14h'
                        },
                        metrics: {
                            artifacts: 12,
                            collaborators: 3,
                            commits: 47
                        },
                        lastActivity: '2 minutes ago'
                    },
                    {
                        id: 'ai-development',
                        name: 'AI Development Suite',
                        description: 'Revolutionary AI system development with multi-agent capabilities',
                        type: 'development',
                        status: 'running',
                        vmStatus: {
                            cpu: 45,
                            memory: 72,
                            storage: 62,
                            uptime: '5d 8h'
                        },
                        metrics: {
                            artifacts: 28,
                            collaborators: 5,
                            commits: 156
                        },
                        lastActivity: '8 minutes ago'
                    },
                    {
                        id: 'data-analysis',
                        name: 'Data Analysis Lab',
                        description: 'Large-scale data processing and machine learning research',
                        type: 'analysis',
                        status: 'suspended',
                        vmStatus: {
                            cpu: 0,
                            memory: 0,
                            storage: 38,
                            uptime: 'Suspended'
                        },
                        metrics: {
                            artifacts: 15,
                            collaborators: 2,
                            commits: 89
                        },
                        lastActivity: '1 hour ago'
                    },
                    {
                        id: 'creative-lab',
                        name: 'Creative Lab',
                        description: 'AI-powered creative content generation and multimedia projects',
                        type: 'creative',
                        status: 'running',
                        vmStatus: {
                            cpu: 34,
                            memory: 55,
                            storage: 71,
                            uptime: '1d 12h'
                        },
                        metrics: {
                            artifacts: 9,
                            collaborators: 4,
                            commits: 32
                        },
                        lastActivity: '15 minutes ago'
                    }
                ];

                sampleProjects.forEach(project => {
                    this.projects.set(project.id, project);
                });

                this.renderProjects();
                this.selectProject('quantum-research');
                this.populateIntelligenceInsights();
                this.populateCollaborators();
                this.populateActivityFeed();
            }

            renderProjects() {
                const container = document.getElementById('projects-list');
                const projectsArray = Array.from(this.projects.values());
                
                container.innerHTML = projectsArray.map(project => this.createProjectCard(project)).join('');

                // Add click listeners to project cards
                container.querySelectorAll('.project-card').forEach(card => {
                    card.addEventListener('click', () => {
                        this.selectProject(card.dataset.projectId);
                    });
                });
            }

            createProjectCard(project) {
                const statusColor = {
                    running: 'var(--accent-green)',
                    suspended: 'var(--accent-amber)',
                    stopped: 'var(--light-400)',
                    error: 'var(--accent-red)'
                }[project.status];

                return `
                    <div class="project-card fade-in ${this.selectedProject === project.id ? 'active' : ''}" 
                         data-project-id="${project.id}" data-type="${project.type}">
                        <div class="project-header">
                            <div class="project-info">
                                <div class="project-name">${project.name}</div>
                                <div class="project-description">${project.description}</div>
                                <div class="project-type ${project.type}">
                                    <i class="fas fa-${this.getTypeIcon(project.type)}"></i>
                                    ${project.type}
                                </div>
                            </div>
                            <div class="project-status">
                                <div class="status-indicator ${project.status}"></div>
                                ${project.status}
                            </div>
                        </div>
                        <div class="project-metrics">
                            <div class="metric-item">
                                <div class="metric-value">${project.metrics.artifacts}</div>
                                <div class="metric-label">Artifacts</div>
                            </div>
                            <div class="metric-item">
                                <div class="metric-value">${project.metrics.collaborators}</div>
                                <div class="metric-label">Collaborators</div>
                            </div>
                            <div class="metric-item">
                                <div class="metric-value">${project.metrics.commits}</div>
                                <div class="metric-label">Commits</div>
                            </div>
                        </div>
                        <div class="project-actions">
                            <button class="action-btn primary" onclick="event.stopPropagation(); projectsManager.openProject('${project.id}')">
                                <i class="fas fa-play"></i>
                                Open
                            </button>
                            <button class="action-btn" onclick="event.stopPropagation(); projectsManager.manageVM('${project.id}')">
                                <i class="fas fa-server"></i>
                                VM
                            </button>
                            <button class="action-btn" onclick="event.stopPropagation(); projectsManager.shareProject('${project.id}')">
                                <i class="fas fa-share"></i>
                                Share
                            </button>
                        </div>
                    </div>
                `;
            }

            getTypeIcon(type) {
                const icons = {
                    research: 'microscope',
                    development: 'code',
                    analysis: 'chart-bar',
                    creative: 'palette'
                };
                return icons[type] || 'folder';
            }

            selectProject(projectId) {
                this.selectedProject = projectId;
                const project = this.projects.get(projectId);
                
                if (!project) return;

                // Update header title
                document.getElementById('header-title').textContent = project.name;

                // Update active project card
                document.querySelectorAll('.project-card').forEach(card => {
                    card.classList.remove('active');
                });
                document.querySelector(`[data-project-id="${projectId}"]`)?.classList.add('active');

                // Update workspace content
                this.updateWorkspaceContent(project);
                
                this.logActivity(`Selected project: ${project.name}`, 'info');
            }

            updateWorkspaceContent(project) {
                this.renderVMDashboard(project);
                this.renderCollaboration(project);
                this.renderArtifacts(project);
                this.renderKnowledge(project);
                this.renderAutomation(project);
            }

            renderVMDashboard(project) {
                const container = document.getElementById('vm-overview');
                container.innerHTML = `
                    <div class="vm-card">
                        <div class="vm-header">
                            <div class="vm-name">${project.name} VM</div>
                            <div class="vm-status ${project.status}">
                                <div class="status-indicator ${project.status}"></div>
                                ${project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                            </div>
                        </div>
                        <div class="vm-metrics-grid">
                            <div class="vm-metric">
                                <div class="vm-metric-value">${project.vmStatus.cpu}%</div>
                                <div class="vm-metric-label">CPU Usage</div>
                            </div>
                            <div class="vm-metric">
                                <div class="vm-metric-value">${project.vmStatus.memory}%</div>
                                <div class="vm-metric-label">Memory</div>
                            </div>
                            <div class="vm-metric">
                                <div class="vm-metric-value">${project.vmStatus.storage}%</div>
                                <div class="vm-metric-label">Storage</div>
                            </div>
                            <div class="vm-metric">
                                <div class="vm-metric-value">${project.vmStatus.uptime}</div>
                                <div class="vm-metric-label">Uptime</div>
                            </div>
                        </div>
                        <div class="vm-actions">
                            <button class="vm-action" onclick="projectsManager.connectToVM('${project.id}')">
                                <i class="fas fa-terminal"></i>
                                Connect
                            </button>
                            <button class="vm-action" onclick="projectsManager.suspendVM('${project.id}')">
                                <i class="fas fa-pause"></i>
                                Suspend
                            </button>
                            <button class="vm-action" onclick="projectsManager.restartVM('${project.id}')">
                                <i class="fas fa-redo"></i>
                                Restart
                            </button>
                        </div>
                    </div>
                    <div class="vm-card">
                        <div class="vm-header">
                            <div class="vm-name">Environment Configuration</div>
                        </div>
                        <div style="padding: 16px 0;">
                            <div style="margin-bottom: 12px;">
                                <strong style="color: var(--light-100);">OS:</strong> 
                                <span style="color: var(--light-400);">Ubuntu 22.04 LTS</span>
                            </div>
                            <div style="margin-bottom: 12px;">
                                <strong style="color: var(--light-100);">Python:</strong> 
                                <span style="color: var(--light-400);">3.11.5</span>
                            </div>
                            <div style="margin-bottom: 12px;">
                                <strong style="color: var(--light-100);">Node.js:</strong> 
                                <span style="color: var(--light-400);">18.17.0</span>
                            </div>
                            <div style="margin-bottom: 12px;">
                                <strong style="color: var(--light-100);">Docker:</strong> 
                                <span style="color: var(--light-400);">24.0.2</span>
                            </div>
                        </div>
                        <div class="vm-actions">
                            <button class="vm-action" onclick="projectsManager.updateEnvironment('${project.id}')">
                                <i class="fas fa-download"></i>
                                Update
                            </button>
                            <button class="vm-action" onclick="projectsManager.configureEnvironment('${project.id}')">
                                <i class="fas fa-cog"></i>
                                Configure
                            </button>
                        </div>
                    </div>
                `;
            }

            renderCollaboration(project) {
                const container = document.getElementById('collaboration-sessions');
                container.innerHTML = `
                    <div class="vm-overview">
                        <div class="vm-card">
                            <div class="vm-header">
                                <div class="vm-name">Active Sessions</div>
                                <div class="vm-status running">
                                    <div class="status-indicator running"></div>
                                    ${project.metrics.collaborators} Active
                                </div>
                            </div>
                            <div style="padding: 16px 0;">
                                <div class="collaborator-item" style="margin-bottom: 8px;">
                                    <div class="collaborator-avatar">AI</div>
                                    <div class="collaborator-info">
                                        <div class="collaborator-name">Research Assistant</div>
                                        <div class="collaborator-role">Autonomous Agent</div>
                                    </div>
                                    <div class="collaborator-status"></div>
                                </div>
                                <div class="collaborator-item" style="margin-bottom: 8px;">
                                    <div class="collaborator-avatar">DR</div>
                                    <div class="collaborator-info">
                                        <div class="collaborator-name">Dr. Sarah Chen</div>
                                        <div class="collaborator-role">Lead Researcher</div>
                                    </div>
                                    <div class="collaborator-status"></div>
                                </div>
                                <div class="collaborator-item">
                                    <div class="collaborator-avatar">MK</div>
                                    <div class="collaborator-info">
                                        <div class="collaborator-name">Mike Kumar</div>
                                        <div class="collaborator-role">Data Scientist</div>
                                    </div>
                                    <div class="collaborator-status"></div>
                                </div>
                            </div>
                            <div class="vm-actions">
                                <button class="vm-action" onclick="projectsManager.startCollaboration('${project.id}')">
                                    <i class="fas fa-users"></i>
                                    Invite
                                </button>
                                <button class="vm-action" onclick="projectsManager.shareScreen('${project.id}')">
                                    <i class="fas fa-desktop"></i>
                                    Share
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }

            renderArtifacts(project) {
                const container = document.getElementById('artifacts-grid');
                container.innerHTML = `
                    <div class="vm-overview">
                        <div class="vm-card">
                            <div class="vm-header">
                                <div class="vm-name">Recent Artifacts</div>
                                <div class="vm-status running">
                                    <span>${project.metrics.artifacts} Total</span>
                                </div>
                            </div>
                            <div style="padding: 16px 0;">
                                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                                    <div style="padding: 12px; background: var(--dark-800); border-radius: 8px; text-align: center;">
                                        <i class="fas fa-code" style="font-size: 24px; color: var(--accent-cyan); margin-bottom: 8px;"></i>
                                        <div style="font-size: 12px; color: var(--light-300);">Python Scripts</div>
                                        <div style="font-size: 16px; font-weight: 600; color: var(--light-100);">8</div>
                                    </div>
                                    <div style="padding: 12px; background: var(--dark-800); border-radius: 8px; text-align: center;">
                                        <i class="fas fa-chart-bar" style="font-size: 24px; color: var(--accent-green); margin-bottom: 8px;"></i>
                                        <div style="font-size: 12px; color: var(--light-300);">Visualizations</div>
                                        <div style="font-size: 16px; font-weight: 600; color: var(--light-100);">4</div>
                                    </div>
                                </div>
                            </div>
                            <div class="vm-actions">
                                <button class="vm-action" onclick="projectsManager.createArtifact('${project.id}')">
                                    <i class="fas fa-plus"></i>
                                    Create
                                </button>
                                <button class="vm-action" onclick="projectsManager.viewArtifacts('${project.id}')">
                                    <i class="fas fa-eye"></i>
                                    View All
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }

            renderKnowledge(project) {
                const container = document.getElementById('knowledge-content');
                container.innerHTML = `
                    <div class="vm-overview">
                        <div class="vm-card">
                            <div class="vm-header">
                                <div class="vm-name">Knowledge Base</div>
                            </div>
                            <div style="padding: 16px 0;">
                                <div style="margin-bottom: 16px;">
                                    <strong style="color: var(--light-100);">Documents:</strong> 
                                    <span style="color: var(--accent-cyan);">247 indexed</span>
                                </div>
                                <div style="margin-bottom: 16px;">
                                    <strong style="color: var(--light-100);">Key Concepts:</strong> 
                                    <span style="color: var(--accent-cyan);">89 extracted</span>
                                </div>
                                <div style="margin-bottom: 16px;">
                                    <strong style="color: var(--light-100);">Connections:</strong> 
                                    <span style="color: var(--accent-cyan);">156 relationships</span>
                                </div>
                            </div>
                            <div class="vm-actions">
                                <button class="vm-action" onclick="projectsManager.searchKnowledge('${project.id}')">
                                    <i class="fas fa-search"></i>
                                    Search
                                </button>
                                <button class="vm-action" onclick="projectsManager.addKnowledge('${project.id}')">
                                    <i class="fas fa-plus"></i>
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }

            renderAutomation(project) {
                const container = document.getElementById('automation-workflows');
                container.innerHTML = `
                    <div class="vm-overview">
                        <div class="vm-card">
                            <div class="vm-header">
                                <div class="vm-name">Active Workflows</div>
                                <div class="vm-status running">
                                    <div class="status-indicator running"></div>
                                    3 Running
                                </div>
                            </div>
                            <div style="padding: 16px 0;">
                                <div style="margin-bottom: 12px; padding: 8px; background: var(--dark-800); border-radius: 6px;">
                                    <div style="font-weight: 500; color: var(--light-100);">Data Processing Pipeline</div>
                                    <div style="font-size: 11px; color: var(--light-400);">Runs every 6 hours</div>
                                </div>
                                <div style="margin-bottom: 12px; padding: 8px; background: var(--dark-800); border-radius: 6px;">
                                    <div style="font-weight: 500; color: var(--light-100);">Model Training Scheduler</div>
                                    <div style="font-size: 11px; color: var(--light-400);">Triggered by data updates</div>
                                </div>
                                <div style="padding: 8px; background: var(--dark-800); border-radius: 6px;">
                                    <div style="font-weight: 500; color: var(--light-100);">Report Generator</div>
                                    <div style="font-size: 11px; color: var(--light-400);">Daily at 9:00 AM</div>
                                </div>
                            </div>
                            <div class="vm-actions">
                                <button class="vm-action" onclick="projectsManager.createWorkflow('${project.id}')">
                                    <i class="fas fa-plus"></i>
                                    Create
                                </button>
                                <button class="vm-action" onclick="projectsManager.manageWorkflows('${project.id}')">
                                    <i class="fas fa-cog"></i>
                                    Manage
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }

            switchTab(tabName) {
                // Update tab appearance
                document.querySelectorAll('.workspace-tab').forEach(tab => {
                    tab.classList.remove('active');
                });
                document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

                // Update content visibility
                document.querySelectorAll('.workspace-content').forEach(content => {
                    content.classList.remove('active');
                });
                document.getElementById(tabName).classList.add('active');

                this.currentTab = tabName;
                this.logActivity(`Switched to ${tabName} tab`, 'info');
            }

            populateIntelligenceInsights() {
                const container = document.getElementById('intelligence-insights');
                const insights = [
                    {
                        type: 'optimization',
                        confidence: 92,
                        text: 'VM resources are underutilized. Consider scaling down to reduce costs while maintaining performance.'
                    },
                    {
                        type: 'collaboration',
                        confidence: 87,
                        text: 'High collaboration activity detected. Enable real-time synchronization for better team coordination.'
                    },
                    {
                        type: 'automation',
                        confidence: 94,
                        text: 'Repetitive data processing tasks identified. Automation workflow recommended for 40% efficiency gain.'
                    }
                ];

                container.innerHTML = insights.map(insight => `
                    <div class="insight-card">
                        <div class="insight-header">
                            <div class="insight-type">${insight.type}</div>
                            <div class="insight-confidence">${insight.confidence}%</div>
                        </div>
                        <div class="insight-text">${insight.text}</div>
                    </div>
                `).join('');
            }

            populateCollaborators() {
                const container = document.getElementById('collaborator-list');
                const collaborators = [
                    { name: 'Research Assistant', role: 'AI Agent', avatar: 'AI', status: 'online' },
                    { name: 'Dr. Sarah Chen', role: 'Lead Researcher', avatar: 'SC', status: 'online' },
                    { name: 'Mike Kumar', role: 'Data Scientist', avatar: 'MK', status: 'online' },
                    { name: 'Analysis Bot', role: 'AI Agent', avatar: 'AB', status: 'busy' }
                ];

                container.innerHTML = collaborators.map(collaborator => `
                    <div class="collaborator-item">
                        <div class="collaborator-avatar">${collaborator.avatar}</div>
                        <div class="collaborator-info">
                            <div class="collaborator-name">${collaborator.name}</div>
                            <div class="collaborator-role">${collaborator.role}</div>
                        </div>
                        <div class="collaborator-status"></div>
                    </div>
                `).join('');
            }

            populateActivityFeed() {
                const container = document.getElementById('activity-feed');
                const activities = [
                    { type: 'vm', text: 'VM resources scaled up for increased workload', time: '2 min ago' },
                    { type: 'collaboration', text: 'Dr. Sarah Chen joined the project workspace', time: '5 min ago' },
                    { type: 'intelligence', text: 'AI generated optimization recommendations', time: '8 min ago' },
                    { type: 'artifact', text: 'New visualization artifact created', time: '12 min ago' },
                    { type: 'vm', text: 'Automated backup completed successfully', time: '15 min ago' }
                ];

                container.innerHTML = activities.map(activity => `
                    <div class="activity-item">
                        <div class="activity-icon ${activity.type}">
                            <i class="fas fa-${this.getActivityIcon(activity.type)}"></i>
                        </div>
                        <div class="activity-content">
                            <div class="activity-text">${activity.text}</div>
                            <div class="activity-time">${activity.time}</div>
                        </div>
                    </div>
                `).join('');
            }

            getActivityIcon(type) {
                const icons = {
                    vm: 'server',
                    collaboration: 'users',
                    intelligence: 'brain',
                    artifact: 'code'
                };
                return icons[type] || 'info';
            }

            // Modal functions
            showCreateProjectModal() {
                document.getElementById('create-project-modal').classList.add('active');
            }

            hideCreateProjectModal() {
                document.getElementById('create-project-modal').classList.remove('active');
                document.getElementById('create-project-form').reset();
            }

            createProject() {
                const formData = new FormData(document.getElementById('create-project-form'));
                const projectData = {
                    name: formData.get('project-name') || document.getElementById('project-name').value,
                    description: document.getElementById('project-description').value,
                    type: document.getElementById('project-type').value,
                    vmConfig: document.getElementById('vm-config').value,
                    enableCollaboration: document.getElementById('enable-collaboration').checked,
                    enableAutomation: document.getElementById('enable-automation').checked
                };

                this.logActivity(`Creating project: ${projectData.name}`, 'info');

                this.sendMessage({
                    type: 'create_project',
                    project: projectData
                });

                this.hideCreateProjectModal();
            }

            // Project actions
            openProject(projectId) {
                this.logActivity(`Opening project: ${projectId}`, 'info');
                this.selectProject(projectId);
                // In a real implementation, this would open the project in the main interface
            }

            manageVM(projectId) {
                this.logActivity(`Managing VM for project: ${projectId}`, 'info');
                this.selectProject(projectId);
                this.switchTab('vm-dashboard');
            }

            shareProject(projectId) {
                this.logActivity(`Sharing project: ${projectId}`, 'info');
                // Implementation for sharing project
            }

            connectToVM(projectId) {
                this.logActivity(`Connecting to VM for project: ${projectId}`, 'info');
                this.sendMessage({
                    type: 'connect_vm',
                    projectId: projectId
                });
            }

            suspendVM(projectId) {
                this.logActivity(`Suspending VM for project: ${projectId}`, 'warning');
                this.sendMessage({
                    type: 'suspend_vm',
                    projectId: projectId
                });
            }

            restartVM(projectId) {
                this.logActivity(`Restarting VM for project: ${projectId}`, 'info');
                this.sendMessage({
                    type: 'restart_vm',
                    projectId: projectId
                });
            }

            // Intelligence actions
            analyzeProject() {
                if (!this.selectedProject) return;
                this.logActivity('Starting AI project analysis...', 'info');
                this.sendMessage({
                    type: 'analyze_project',
                    projectId: this.selectedProject
                });
            }

            optimizeWorkflow() {
                if (!this.selectedProject) return;
                this.logActivity('Optimizing project workflow...', 'info');
                this.sendMessage({
                    type: 'optimize_workflow',
                    projectId: this.selectedProject
                });
            }

            generateSuggestions() {
                if (!this.selectedProject) return;
                this.logActivity('Generating AI suggestions...', 'info');
                this.sendMessage({
                    type: 'generate_suggestions',
                    projectId: this.selectedProject
                });
            }

            // Filter and search functions
            filterProjects(type) {
                const cards = document.querySelectorAll('.project-card');
                cards.forEach(card => {
                    if (type === 'all' || card.dataset.type === type) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            }

            searchProjects(query) {
                const cards = document.querySelectorAll('.project-card');
                cards.forEach(card => {
                    const name = card.querySelector('.project-name').textContent.toLowerCase();
                    const description = card.querySelector('.project-description').textContent.toLowerCase();
                    
                    if (name.includes(query.toLowerCase()) || description.includes(query.toLowerCase())) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            }

            syncProjects() {
                this.logActivity('Syncing projects with backend...', 'info');
                this.sendMessage({
                    type: 'sync_projects'
                });
            }

            showProjectSettings() {
                if (!this.selectedProject) return;
                this.logActivity('Opening project settings...', 'info');
                // Implementation for project settings
            }

            startMonitoring() {
                // Update charts every 5 seconds
                setInterval(() => {
                    this.updateMonitoringCharts();
                }, 5000);
            }

            updateMonitoringCharts() {
                if (this.monitoringCharts.resource) {
                    // Update resource chart with new data
                    this.monitoringCharts.resource.data.datasets[0].data = [
                        Math.random() * 100,
                        Math.random() * 100,
                        Math.random() * 100
                    ];
                    this.monitoringCharts.resource.update('none');
                }

                if (this.monitoringCharts.activity) {
                    // Update activity chart with new data
                    const newData = Array.from({ length: 6 }, () => Math.floor(Math.random() * 30));
                    this.monitoringCharts.activity.data.datasets[0].data = newData;
                    this.monitoringCharts.activity.update('none');
                }
            }

            logActivity(message, type = 'info') {
                console.log(`[Projects] ${message}`);
                
                // Add to activity feed
                const feed = document.getElementById('activity-feed');
                const activity = document.createElement('div');
                activity.className = 'activity-item';
                activity.innerHTML = `
                    <div class="activity-icon ${type === 'info' ? 'vm' : type}">
                        <i class="fas fa-${type === 'info' ? 'info' : type === 'warning' ? 'exclamation-triangle' : 'check'}"></i>
                    </div>
                    <div class="activity-content">
                        <div class="activity-text">${message}</div>
                        <div class="activity-time">Just now</div>
                    </div>
                `;
                
                feed.insertBefore(activity, feed.firstChild);
                
                // Keep only last 10 activities
                while (feed.children.length > 10) {
                    feed.removeChild(feed.lastChild);
                }
            }

            // WebSocket message handlers
            addProject(project) {
                this.projects.set(project.id, project);
                this.renderProjects();
                this.logActivity(`Project created: ${project.name}`, 'success');
            }

            updateProject(project) {
                this.projects.set(project.id, project);
                this.renderProjects();
                if (this.selectedProject === project.id) {
                    this.updateWorkspaceContent(project);
                }
                this.logActivity(`Project updated: ${project.name}`, 'info');
            }

            updateVMStatus(projectId, vmStatus) {
                const project = this.projects.get(projectId);
                if (project) {
                    project.vmStatus = vmStatus;
                    if (this.selectedProject === projectId) {
                        this.renderVMDashboard(project);
                    }
                }
            }

            updateCollaboration(projectId, collaboration) {
                const project = this.projects.get(projectId);
                if (project) {
                    project.collaboration = collaboration;
                    if (this.selectedProject === projectId) {
                        this.renderCollaboration(project);
                    }
                }
            }

            addIntelligenceInsight(insight) {
                // Add new insight to the intelligence panel
                const container = document.getElementById('intelligence-insights');
                const insightElement = document.createElement('div');
                insightElement.className = 'insight-card fade-in';
                insightElement.innerHTML = `
                    <div class="insight-header">
                        <div class="insight-type">${insight.type}</div>
                        <div class="insight-confidence">${insight.confidence}%</div>
                    </div>
                    <div class="insight-text">${insight.text}</div>
                `;
                container.insertBefore(insightElement, container.firstChild);
                
                this.logActivity(`New AI insight: ${insight.type}`, 'intelligence');
            }

            addActivity(activity) {
                this.logActivity(activity.message, activity.type);
            }
        }

        // Initialize the Projects Manager
        document.addEventListener('DOMContentLoaded', () => {
            window.projectsManager = new RevolutionaryProjectsManager();
        });