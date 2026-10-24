// Global state management
        const SomnusUI = {
            isWelcomeVisible: true,
            currentModel: 'Gemma-3-4b-it',
            systemStatus: 'unlimited'
        };

        // Initialize the interface
        document.addEventListener('DOMContentLoaded', function() {
            initializeInterface();
            setupEventListeners();
            setupAutoResize();
        });

        function initializeInterface() {
            console.log('🚀 Somnus AI Command Center initialized');
            console.log('💪 Unlimited Power mode active');
            
            // Animate bubbles on load
            const bubbles = document.querySelectorAll('.nav-bubble');
            bubbles.forEach((bubble, index) => {
                setTimeout(() => {
                    bubble.classList.add('slide-in');
                }, index * 100);
            });
        }

        function setupEventListeners() {
            // Model selector
            document.getElementById('modelSelector').addEventListener('click', function() {
                const models = ['Gemma-3-4b-it', 'Claude Sonnet 4', 'GPT-4', 'Somnus Unlimited'];
                const currentModel = this.querySelector('.model-name').textContent;
                const currentIndex = models.indexOf(currentModel);
                const nextModel = models[(currentIndex + 1) % models.length];
                
                this.querySelector('.model-name').textContent = nextModel;
                SomnusUI.currentModel = nextModel;
                
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            });

            // Settings button
            document.getElementById('settingsBtn').addEventListener('click', openInstanceSettings);

            // Send button
            document.getElementById('sendBtn').addEventListener('click', sendMessage);

            // Action buttons
            setupActionButtons();

            // Quick actions
            setupQuickActions();
        }

        function setupActionButtons() {
            const actionButtons = document.querySelectorAll('.action-btn');
            actionButtons.forEach(btn => {
                btn.addEventListener('click', function() {
                    // Toggle active state
                    actionButtons.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    
                    const action = this.id.replace('Btn', '');
                    console.log(`Activated: ${action}`);
                });
            });
        }

        function setupQuickActions() {
            document.getElementById('voiceBtn').addEventListener('click', function() {
                this.style.color = 'var(--accent-red)';
                setTimeout(() => {
                    this.style.color = '';
                }, 2000);
            });

            document.getElementById('cameraBtn').addEventListener('click', function() {
                this.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
            });
        }

        function setupAutoResize() {
            const messageInput = document.getElementById('messageInput');
            messageInput.addEventListener('input', function() {
                this.style.height = 'auto';
                this.style.height = Math.min(this.scrollHeight, 120) + 'px';
            });

            messageInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                }
            });
        }

        // Bubble navigation functions
        function createNewArtifact() {
            console.log('Creating new artifact...');
            // This would open the artifact system interface
        }

        function viewAllArtifacts() {
            console.log('Viewing all artifacts...');
        }

        function openRecentArtifact() {
            console.log('Opening recent artifact...');
        }

        function createNewProject() {
            console.log('Creating new project...');
        }

        function cloneProject() {
            console.log('Cloning project...');
        }

        function manageProjects() {
            console.log('Managing projects...');
        }

        function startTraining() {
            console.log('Starting AI training...');
        }

        function viewModels() {
            console.log('Viewing models...');
        }

        function monitorTraining() {
            console.log('Monitoring training...');
        }

        function cloneRepo() {
            console.log('Cloning repository...');
        }

        function browseRepos() {
            console.log('Browsing repositories...');
        }

        function syncRepos() {
            console.log('Syncing repositories...');
        }

        function startWebResearch() {
            console.log('Starting web research...');
        }

        function viewFindings() {
            console.log('Viewing research findings...');
        }

        function automateResearch() {
            console.log('Automating research...');
        }

        // Quick launch functions
        function openNewArtifact() {
            console.log('Opening new artifact interface...');
            // Would slide in the artifact system
        }

        function resumeLastSession() {
            console.log('Resuming last session...');
        }

        function openProjects() {
            console.log('Opening projects...');
        }

        function startResearch() {
            console.log('Starting research...');
        }

        function toggleMainMenu() {
            console.log('Toggling main menu...');
            // Could show a radial menu or action selector
        }

        function openInstanceSettings() {
            console.log('Opening instance settings...');
            // Would open the instance settings interface
        }

        // Chat functionality
        function sendMessage() {
            const input = document.getElementById('messageInput');
            const message = input.value.trim();
            
            if (!message) return;
            
            // Hide welcome screen
            if (SomnusUI.isWelcomeVisible) {
                const welcomeScreen = document.getElementById('welcomeScreen');
                if (welcomeScreen) {
                    welcomeScreen.style.display = 'none';
                    SomnusUI.isWelcomeVisible = false;
                }
            }
            
            // Add user message
            addMessage(message, 'user');
            
            // Clear input
            input.value = '';
            input.style.height = 'auto';
            
            // Simulate AI response
            setTimeout(() => {
                const responses = [
                    "I understand your request and I'm processing it with unlimited capabilities. Let me help you with that.",
                    "Absolutely! I can assist you with unlimited resources and capabilities. Here's what I can do...",
                    "Perfect! I'm accessing all available tools and knowledge to provide you with the best solution.",
                    "I'm on it! Using my complete toolkit to analyze and respond to your request."
                ];
                
                const response = responses[Math.floor(Math.random() * responses.length)];
                const tools = ['Unlimited Processing', 'Memory Access', 'Web Integration', 'Tool Access'];
                addMessage(response, 'assistant', tools.slice(0, Math.floor(Math.random() * 3) + 1));
            }, 1000 + Math.random() * 1000);
        }

        function addMessage(text, sender, tools = []) {
            const messagesContainer = document.getElementById('chatMessages');
            
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${sender} fade-in`;
            
            const avatar = document.createElement('div');
            avatar.className = 'message-avatar';
            avatar.innerHTML = sender === 'user' ? 
                '<i class="fas fa-user"></i>' : '<i class="fas fa-brain"></i>';
            
            const content = document.createElement('div');
            content.className = 'message-content';
            
            const messageText = document.createElement('div');
            messageText.className = 'message-text';
            messageText.textContent = text;
            content.appendChild(messageText);
            
            if (tools.length > 0) {
                const toolsDiv = document.createElement('div');
                toolsDiv.className = 'message-tools';
                
                tools.forEach(tool => {
                    const toolSpan = document.createElement('span');
                    toolSpan.className = 'tool-badge';
                    toolSpan.innerHTML = `<i class="fas fa-cog"></i> ${tool}`;
                    toolsDiv.appendChild(toolSpan);
                });
                
                content.appendChild(toolsDiv);
            }
            
            messageDiv.appendChild(avatar);
            messageDiv.appendChild(content);
            
            messagesContainer.appendChild(messageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        console.log('🚀 Somnus Unlimited Chat Interface loaded');
        console.log('🎨 Command center with unlimited capabilities');