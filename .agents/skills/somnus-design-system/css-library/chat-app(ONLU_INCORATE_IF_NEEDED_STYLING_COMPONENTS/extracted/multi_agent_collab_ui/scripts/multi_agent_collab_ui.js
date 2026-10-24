// Collaboration state management
        const collaborationState = {
            activeAgents: [
                { id: 'coordinator', name: 'Coordinator', role: 'Task Orchestration', status: 'synthesizing', avatar: 'CO' },
                { id: 'researcher', name: 'Research Specialist', role: 'Information Analysis', status: 'working', avatar: 'RE' },
                { id: 'coder', name: 'Code Assistant', role: 'Programming & Development', status: 'working', avatar: 'CD' },
                { id: 'analyst', name: 'Data Analyst', role: 'Pattern Recognition', status: 'ready', avatar: 'AN' }
            ],
            activeTasks: [],
            sessionStartTime: Date.now(),
            messageHistory: [],
            orchestrationMode: 'parallel_collaborative'
        };

        // Initialize collaboration interface
        document.addEventListener('DOMContentLoaded', function() {
            initializeOrchestration();
            initializeControls();
            initializeAgentInteractions();
            startSessionTimer();
            initializeAutoResize();
        });

        // Auto-resize textarea
        function initializeAutoResize() {
            const collaborationInput = document.getElementById('collaborationInput');
            collaborationInput.addEventListener('input', function() {
                this.style.height = 'auto';
                this.style.height = Math.min(this.scrollHeight, 120) + 'px';
            });
        }

        // Collaboration controls
        function initializeControls() {
            const controlButtons = document.querySelectorAll('.action-btn');
            controlButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    // Toggle active state
                    this.classList.toggle('active');
                    
                    // Handle specific collaboration modes
                    const mode = this.id.replace('Btn', '');
                    handleCollaborationMode(mode);
                    
                    // Visual feedback
                    const icon = this.querySelector('.action-icon');
                    icon.style.transform = 'scale(1.2)';
                    setTimeout(() => {
                        icon.style.transform = 'scale(1)';
                    }, 150);
                });
            });

            // Agent card interactions
            const agentCards = document.querySelectorAll('.agent-card');
            agentCards.forEach(card => {
                card.addEventListener('click', function() {
                    // Remove active class from all cards
                    agentCards.forEach(c => c.classList.remove('active'));
                    
                    // Add active class to clicked card
                    this.classList.add('active');
                    
                    // Show agent details or initiate direct communication
                    const agentName = this.querySelector('.agent-name').textContent;
                    showAgentDetails(agentName);
                });
            });

            // Orchestration controls
            document.getElementById('pauseOrchestration')?.addEventListener('click', toggleOrchestration);
            document.getElementById('realTimeMode')?.addEventListener('click', toggleRealTimeMode);
            document.getElementById('collaborationSettings')?.addEventListener('click', showCollaborationSettings);
            document.getElementById('exportSession')?.addEventListener('click', exportCollaborationSession);
        }

        // Initialize orchestration system
        function initializeOrchestration() {
            updateOrchestrationStatus();
            startCollaborationHeartbeat();
        }

        // Agent interactions
        function initializeAgentInteractions() {
            // Simulate agent activity
            setInterval(() => {
                simulateAgentActivity();
            }, 5000);
        }

        // Session timer
        function startSessionTimer() {
            setInterval(() => {
                updateSessionTimer();
            }, 1000);
        }

        // Collaboration mode handlers
        function handleCollaborationMode(mode) {
            console.log(`Collaboration mode: ${mode}`);
            
            switch(mode) {
                case 'taskDelegation':
                    initializeTaskDelegation();
                    break;
                case 'parallelProcessing':
                    enableParallelProcessing();
                    break;
                case 'responseSynthesis':
                    startResponseSynthesis();
                    break;
                case 'agentCollaboration':
                    enhanceAgentCollaboration();
                    break;
                case 'devSession':
                    startDevelopmentSession();
                    break;
            }
        }

        // Send collaboration message
        function sendCollaborationMessage() {
            const input = document.getElementById('collaborationInput');
            const message = input.value.trim();
            
            if (!message) return;
            
            // Hide welcome screen
            const welcomeScreen = document.getElementById('collaborationWelcome');
            if (welcomeScreen) {
                welcomeScreen.style.display = 'none';
            }
            
            // Add user message
            addCollaborationMessage(message, 'user');
            
            // Clear input
            input.value = '';
            input.style.height = 'auto';
            
            // Show orchestration indicator
            showOrchestrationIndicator();
            
            // Simulate AI collaboration workflow
            setTimeout(() => {
                startCollaborationWorkflow(message);
            }, 1000);
        }

        // Collaboration workflow simulation
        function startCollaborationWorkflow(userInput) {
            // Phase 1: Task Analysis and Delegation
            setTimeout(() => {
                addTaskDelegationMessage(userInput);
            }, 1500);
            
            // Phase 2: Agent Progress Updates
            setTimeout(() => {
                addAgentProgressMessage('researcher', 'Conducting research on the topic...');
            }, 3000);
            
            setTimeout(() => {
                addAgentProgressMessage('coder', 'Analyzing code requirements...');
            }, 4500);
            
            // Phase 3: Synthesis
            setTimeout(() => {
                addSynthesisMessage();
            }, 6000);
            
            // Phase 4: Final Response
            setTimeout(() => {
                addFinalCollaborationResponse(userInput);
                hideOrchestrationIndicator();
            }, 8000);
        }

        // Add collaboration messages
        function addCollaborationMessage(text, sender, type = 'standard') {
            const messagesContainer = document.getElementById('collaborationMessages');
            
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${sender} ${type}`;
            
            const avatar = document.createElement('div');
            avatar.className = 'message-avatar';
            
            if (sender === 'user') {
                avatar.innerHTML = '<i class="fas fa-user"></i>';
            } else if (sender === 'agent-communication') {
                avatar.innerHTML = '<i class="fas fa-network-wired"></i>';
            } else {
                avatar.innerHTML = '<i class="fas fa-users"></i>';
            }
            
            const content = document.createElement('div');
            content.className = 'message-content';
            
            if (type === 'task-delegation') {
                content.innerHTML = createTaskDelegationContent(text);
            } else if (type === 'synthesis') {
                content.innerHTML = createSynthesisContent(text);
            } else {
                const messageText = document.createElement('div');
                messageText.className = 'message-text';
                messageText.textContent = text;
                content.appendChild(messageText);
            }
            
            messageDiv.appendChild(avatar);
            messageDiv.appendChild(content);
            
            messagesContainer.appendChild(messageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        // Task delegation message
        function addTaskDelegationMessage(userInput) {
            const content = `
                <div class="message-header">
                    <div class="message-type">Task Delegation</div>
                    <div class="message-timestamp">${new Date().toLocaleTimeString()}</div>
                </div>
                <div class="task-delegation">
                    <div class="task-header">
                        <div class="task-title">Multi-Agent Task Analysis</div>
                        <div class="task-status">Active</div>
                    </div>
                    <div class="task-description">${userInput}</div>
                    <div class="task-participants">
                        <div class="participant-badge">
                            <div class="participant-avatar" style="background: var(--accent-purple);"></div>
                            Research Specialist
                        </div>
                        <div class="participant-badge">
                            <div class="participant-avatar" style="background: var(--accent-green);"></div>
                            Code Assistant
                        </div>
                        <div class="participant-badge">
                            <div class="participant-avatar" style="background: var(--accent-cyan);"></div>
                            Coordinator
                        </div>
                    </div>
                    <div class="progress-section">
                        <div class="progress-header">
                            <div class="progress-label">Task Progress</div>
                            <div class="progress-percentage">25%</div>
                        </div>
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 25%"></div>
                        </div>
                    </div>
                </div>
            `;
            
            addCollaborationMessage(content, 'agent-communication', 'task-delegation');
        }

        // Agent progress message
        function addAgentProgressMessage(agentType, progressText) {
            const agentInfo = {
                researcher: { name: 'Research Specialist', color: 'var(--accent-purple)' },
                coder: { name: 'Code Assistant', color: 'var(--accent-green)' },
                analyst: { name: 'Data Analyst', color: 'var(--accent-yellow)' }
            };
            
            const agent = agentInfo[agentType];
            const content = `
                <div class="message-header">
                    <div class="message-type">Agent Progress Update</div>
                    <div class="message-timestamp">${new Date().toLocaleTimeString()}</div>
                </div>
                <div class="agent-communication-content">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                        <div style="width: 20px; height: 20px; background: ${agent.color}; border-radius: 6px;"></div>
                        <strong>${agent.name}</strong>
                    </div>
                    <div>${progressText}</div>
                </div>
            `;
            
            addCollaborationMessage(content, 'agent-communication');
        }

        // Synthesis message
        function addSynthesisMessage() {
            const content = `
                <div class="message-header">
                    <div class="message-type">Response Synthesis</div>
                    <div class="message-timestamp">${new Date().toLocaleTimeString()}</div>
                </div>
                <div class="synthesis-panel">
                    <div class="synthesis-header">
                        <div class="synthesis-icon">
                            <i class="fas fa-compress-arrows-alt"></i>
                        </div>
                        <div class="synthesis-title">Combining Agent Contributions</div>
                    </div>
                    <div class="agent-contributions">
                        <div class="contribution-item">
                            <div class="contribution-agent">Research Specialist</div>
                            <div class="contribution-text">Comprehensive research data and validated sources compiled</div>
                        </div>
                        <div class="contribution-item">
                            <div class="contribution-agent">Code Assistant</div>
                            <div class="contribution-text">Technical implementation approach and code structure defined</div>
                        </div>
                        <div class="contribution-item">
                            <div class="contribution-agent">Coordinator</div>
                            <div class="contribution-text">Integration strategy and unified response framework established</div>
                        </div>
                    </div>
                    <div style="color: var(--accent-green); font-size: 12px; margin-top: 8px;">
                        <i class="fas fa-check-circle"></i> Synthesis complete - generating unified response
                    </div>
                </div>
            `;
            
            addCollaborationMessage(content, 'agent-communication', 'synthesis');
        }

        // Final collaboration response
        function addFinalCollaborationResponse(userInput) {
            const responses = [
                `Based on the collaborative analysis from our specialized agents, here's a comprehensive solution that combines research insights, technical implementation, and strategic coordination to address your request effectively.`,
                `Our multi-agent team has synthesized a unified response incorporating research findings, code analysis, and coordination strategies to provide you with a thorough and well-rounded solution.`,
                `Through collaborative processing involving research, development, and coordination agents, we've assembled a comprehensive response that addresses all aspects of your query.`
            ];
            
            const response = responses[Math.floor(Math.random() * responses.length)];
            
            addCollaborationMessage(response, 'assistant');
            
            // Update collaboration stats
            updateCollaborationStats();
        }

        // Utility functions
        function showOrchestrationIndicator() {
            const indicator = document.getElementById('orchestrationIndicator');
            if (indicator) {
                indicator.classList.add('active');
            }
        }

        function hideOrchestrationIndicator() {
            const indicator = document.getElementById('orchestrationIndicator');
            if (indicator) {
                indicator.classList.remove('active');
            }
        }

        function updateSessionTimer() {
            const elapsed = Date.now() - collaborationState.sessionStartTime;
            const hours = Math.floor(elapsed / 3600000).toString().padStart(2, '0');
            const minutes = Math.floor((elapsed % 3600000) / 60000).toString().padStart(2, '0');
            const seconds = Math.floor((elapsed % 60000) / 1000).toString().padStart(2, '0');
            
            const timerElements = document.querySelectorAll('[data-timer]');
            timerElements.forEach(el => {
                el.textContent = `Session: ${hours}:${minutes}:${seconds}`;
            });
        }

        function simulateAgentActivity() {
            // Randomly update agent statuses
            const statuses = ['ready', 'working', 'synthesizing'];
            const agents = document.querySelectorAll('.agent-status');
            
            agents.forEach(status => {
                if (Math.random() < 0.3) { // 30% chance to update
                    const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
                    status.className = `agent-status ${newStatus}`;
                    status.textContent = newStatus.charAt(0).toUpperCase() + newStatus.slice(1);
                }
            });
        }

        function updateOrchestrationStatus() {
            // Update orchestration status display
            console.log('Orchestration status updated');
        }

        function startCollaborationHeartbeat() {
            setInterval(() => {
                // Maintain collaboration connections
                console.log('Collaboration heartbeat');
            }, 10000);
        }

        function updateCollaborationStats() {
            // Update collaboration statistics
            const statValues = document.querySelectorAll('.stat-value');
            if (statValues.length >= 2) {
                // Increment tasks completed
                const tasksElement = statValues[1];
                const currentTasks = parseInt(tasksElement.textContent);
                tasksElement.textContent = currentTasks + 1;
            }
        }

        // Event handlers
        function toggleOrchestration() {
            console.log('Toggle orchestration');
        }

        function toggleRealTimeMode() {
            console.log('Toggle real-time mode');
        }

        function showCollaborationSettings() {
            console.log('Show collaboration settings');
        }

        function exportCollaborationSession() {
            console.log('Export collaboration session');
        }

        function showAgentDetails(agentName) {
            console.log(`Show details for ${agentName}`);
        }

        function initializeTaskDelegation() {
            console.log('Initialize task delegation');
        }

        function enableParallelProcessing() {
            console.log('Enable parallel processing');
        }

        function startResponseSynthesis() {
            console.log('Start response synthesis');
        }

        function enhanceAgentCollaboration() {
            console.log('Enhance agent collaboration');
        }

        function startDevelopmentSession() {
            console.log('Start development session');
        }

        // Main send function
        document.getElementById('sendCollaborationBtn')?.addEventListener('click', sendCollaborationMessage);

        // Enter key to send (Shift+Enter for new line)
        document.getElementById('collaborationInput')?.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendCollaborationMessage();
            }
        });

        // Quick action handlers
        document.getElementById('voiceInputBtn')?.addEventListener('click', function() {
            console.log('Voice input activated');
        });

        document.getElementById('fileUploadBtn')?.addEventListener('click', function() {
            console.log('File upload activated');
        });

        document.getElementById('orchestrationBtn')?.addEventListener('click', function() {
            this.classList.toggle('active');
            console.log('Orchestration mode toggled');
        });

        console.log('🚀 Somnus AI Collaboration Interface loaded');
        console.log('🤖 Multi-agent orchestration system online');
        console.log('🔗 Agent communication protocols active');