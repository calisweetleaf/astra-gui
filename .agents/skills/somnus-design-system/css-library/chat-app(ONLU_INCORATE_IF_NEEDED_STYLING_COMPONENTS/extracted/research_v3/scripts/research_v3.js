// Enhanced Research System with Full WebSocket Integration
        class RevolutionaryResearchEngine {
            constructor() {
                this.websocket = null;
                this.isConnected = false;
                this.researchSession = {
                    id: this.generateSessionId(),
                    query: '',
                    sources: [],
                    insights: [],
                    contradictions: [],
                    knowledgeGraph: { nodes: [], links: [] },
                    metrics: {
                        credibility: 0,
                        coverage: 0,
                        sources: 0,
                        conflicts: 0
                    }
                };
                this.currentTab = 'sources';
                this.knowledgeGraphRenderer = null;
                this.analysisCharts = null;
                
                this.init();
            }

            generateSessionId() {
                return 'research_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            }

            init() {
                this.connectWebSocket();
                this.initializeEventListeners();
                this.initializeKnowledgeGraph();
                this.initializeAnalysisCharts();
                this.populateSampleData();
                this.startTerminalAnimation();
            }

            connectWebSocket() {
                try {
                    this.websocket = new WebSocket('ws://localhost:25805/research/ws');
                    
                    this.websocket.onopen = () => {
                        this.isConnected = true;
                        this.logActivity('WebSocket connected', 'success');
                        this.sendMessage({
                            type: 'session_init',
                            session_id: this.researchSession.id
                        });
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
                    case 'research_progress':
                        this.updateResearchProgress(data.payload);
                        break;
                    case 'source_discovered':
                        this.addSource(data.payload);
                        break;
                    case 'contradiction_detected':
                        this.addContradiction(data.payload);
                        break;
                    case 'insight_generated':
                        this.addInsight(data.payload);
                        break;
                    case 'knowledge_graph_update':
                        this.updateKnowledgeGraph(data.payload);
                        break;
                    case 'metrics_update':
                        this.updateMetrics(data.payload);
                        break;
                    default:
                        console.log('Unknown message type:', data.type);
                }
            }

            initializeEventListeners() {
                // Main research controls
                document.getElementById('start-research').addEventListener('click', () => {
                    this.startResearch();
                });

                document.getElementById('pause-research').addEventListener('click', () => {
                    this.pauseResearch();
                });

                document.getElementById('stop-research').addEventListener('click', () => {
                    this.stopResearch();
                });

                // Tab switching
                document.querySelectorAll('.tab').forEach(tab => {
                    tab.addEventListener('click', () => {
                        this.switchTab(tab.dataset.tab);
                    });
                });

                // Source type filters
                document.querySelectorAll('.source-type').forEach(btn => {
                    btn.addEventListener('click', () => {
                        btn.classList.toggle('active');
                        this.updateSourceTypes();
                    });
                });

                // Max sources slider
                const maxSourcesSlider = document.getElementById('max-sources');
                maxSourcesSlider.addEventListener('input', () => {
                    document.getElementById('sources-count').textContent = maxSourcesSlider.value + ' sources';
                });

                // Knowledge graph controls
                document.querySelectorAll('.graph-mode').forEach(btn => {
                    btn.addEventListener('click', () => {
                        document.querySelectorAll('.graph-mode').forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                        this.switchGraphMode(btn.dataset.mode);
                    });
                });

                // Export actions
                document.getElementById('create-website').addEventListener('click', () => {
                    this.createWebsite();
                });

                document.getElementById('export-report').addEventListener('click', () => {
                    this.exportReport();
                });

                document.getElementById('generate-infographic').addEventListener('click', () => {
                    this.generateInfographic();
                });

                document.getElementById('create-presentation').addEventListener('click', () => {
                    this.createPresentation();
                });

                // Quick actions
                document.getElementById('expand-search').addEventListener('click', () => {
                    this.expandSearch();
                });

                document.getElementById('refine-query').addEventListener('click', () => {
                    this.refineQuery();
                });

                document.getElementById('save-session').addEventListener('click', () => {
                    this.saveSession();
                });

                // Enter key for search
                document.getElementById('main-query').addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.startResearch();
                    }
                });
            }

            startResearch() {
                const query = document.getElementById('main-query').value;
                if (!query.trim()) {
                    this.logActivity('Please enter a research query', 'warning');
                    return;
                }

                this.researchSession.query = query;
                this.logActivity(`Starting research: "${query}"`, 'info');

                const researchConfig = {
                    query: query,
                    depth: document.getElementById('research-depth').value,
                    maxSources: parseInt(document.getElementById('max-sources').value),
                    sourceTypes: this.getActiveSourceTypes(),
                    aiMode: document.getElementById('ai-mode').value
                };

                this.sendMessage({
                    type: 'start_research',
                    session_id: this.researchSession.id,
                    config: researchConfig
                });

                this.updateProgressStatus('processing');
            }

            pauseResearch() {
                this.logActivity('Research paused by user', 'warning');
                this.sendMessage({
                    type: 'pause_research',
                    session_id: this.researchSession.id
                });
            }

            stopResearch() {
                this.logActivity('Research stopped by user', 'error');
                this.sendMessage({
                    type: 'stop_research',
                    session_id: this.researchSession.id
                });
                this.updateProgressStatus('complete');
            }

            getActiveSourceTypes() {
                return Array.from(document.querySelectorAll('.source-type.active'))
                    .map(btn => btn.dataset.type);
            }

            switchTab(tabName) {
                // Update tab appearance
                document.querySelectorAll('.tab').forEach(tab => {
                    tab.classList.remove('active');
                });
                document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

                // Update content panels
                document.querySelectorAll('.tab-content').forEach(panel => {
                    panel.classList.remove('active');
                });
                document.getElementById(`${tabName}-panel`).classList.add('active');

                this.currentTab = tabName;

                // Load tab-specific content
                this.loadTabContent(tabName);
            }

            loadTabContent(tabName) {
                switch (tabName) {
                    case 'sources':
                        this.renderSources();
                        break;
                    case 'analysis':
                        this.renderAnalysis();
                        break;
                    case 'contradictions':
                        this.renderContradictions();
                        break;
                    case 'insights':
                        this.renderInsights();
                        break;
                    case 'activity':
                        // Activity is always live
                        break;
                }
            }

            initializeKnowledgeGraph() {
                const container = document.getElementById('knowledge-graph');
                const width = container.clientWidth;
                const height = container.clientHeight;

                const svg = d3.select('#knowledge-graph')
                    .append('svg')
                    .attr('width', width)
                    .attr('height', height);

                const simulation = d3.forceSimulation()
                    .force('link', d3.forceLink().id(d => d.id))
                    .force('charge', d3.forceManyBody().strength(-300))
                    .force('center', d3.forceCenter(width / 2, height / 2));

                this.knowledgeGraphRenderer = {
                    svg: svg,
                    simulation: simulation,
                    width: width,
                    height: height
                };

                this.renderKnowledgeGraph();
            }

            renderKnowledgeGraph() {
                if (!this.knowledgeGraphRenderer) return;

                const { svg, simulation } = this.knowledgeGraphRenderer;
                const { nodes, links } = this.researchSession.knowledgeGraph;

                // Clear previous render
                svg.selectAll('*').remove();

                if (nodes.length === 0) {
                    // Show placeholder
                    svg.append('text')
                        .attr('x', this.knowledgeGraphRenderer.width / 2)
                        .attr('y', this.knowledgeGraphRenderer.height / 2)
                        .attr('text-anchor', 'middle')
                        .attr('fill', '#94a3b8')
                        .attr('font-size', '14px')
                        .text('Knowledge graph will appear here');
                    return;
                }

                // Create links
                const link = svg.selectAll('.link')
                    .data(links)
                    .enter().append('line')
                    .attr('class', 'link')
                    .attr('stroke', '#06b6d4')
                    .attr('stroke-width', 2)
                    .attr('opacity', 0.6);

                // Create nodes
                const node = svg.selectAll('.node')
                    .data(nodes)
                    .enter().append('circle')
                    .attr('class', 'node')
                    .attr('r', d => Math.max(5, Math.min(20, d.weight * 10)))
                    .attr('fill', d => this.getNodeColor(d.type))
                    .attr('stroke', '#ffffff')
                    .attr('stroke-width', 2)
                    .call(d3.drag()
                        .on('start', this.dragstarted.bind(this))
                        .on('drag', this.dragged.bind(this))
                        .on('end', this.dragended.bind(this)));

                // Add labels
                const label = svg.selectAll('.label')
                    .data(nodes)
                    .enter().append('text')
                    .attr('class', 'label')
                    .attr('text-anchor', 'middle')
                    .attr('fill', '#ffffff')
                    .attr('font-size', '10px')
                    .attr('dy', 3)
                    .text(d => d.label);

                // Update simulation
                simulation.nodes(nodes);
                simulation.force('link').links(links);

                simulation.on('tick', () => {
                    link.attr('x1', d => d.source.x)
                        .attr('y1', d => d.source.y)
                        .attr('x2', d => d.target.x)
                        .attr('y2', d => d.target.y);

                    node.attr('cx', d => d.x)
                        .attr('cy', d => d.y);

                    label.attr('x', d => d.x)
                         .attr('y', d => d.y);
                });

                simulation.restart();
            }

            getNodeColor(type) {
                const colors = {
                    entity: '#06b6d4',
                    concept: '#8b5cf6',
                    source: '#10b981',
                    topic: '#f59e0b'
                };
                return colors[type] || '#6b7280';
            }

            dragstarted(event, d) {
                if (!event.active) this.knowledgeGraphRenderer.simulation.alphaTarget(0.3).restart();
                d.fx = d.x;
                d.fy = d.y;
            }

            dragged(event, d) {
                d.fx = event.x;
                d.fy = event.y;
            }

            dragended(event, d) {
                if (!event.active) this.knowledgeGraphRenderer.simulation.alphaTarget(0);
                d.fx = null;
                d.fy = null;
            }

            switchGraphMode(mode) {
                this.logActivity(`Switched knowledge graph to ${mode} mode`, 'info');
                // Different graph layouts would be implemented here
                this.renderKnowledgeGraph();
            }

            initializeAnalysisCharts() {
                // Initialize Plotly charts for analysis
                this.analysisCharts = {
                    sentiment: null,
                    timeline: null,
                    topics: null
                };
            }

            renderAnalysis() {
                const container = document.getElementById('analysis-charts');
                container.innerHTML = `
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px;">
                        <div id="sentiment-chart" style="height: 300px;"></div>
                        <div id="topics-chart" style="height: 300px;"></div>
                    </div>
                    <div id="timeline-chart" style="height: 250px;"></div>
                `;

                // Sentiment analysis chart
                const sentimentData = [{
                    values: [65, 25, 10],
                    labels: ['Positive', 'Neutral', 'Negative'],
                    type: 'pie',
                    marker: {
                        colors: ['#10b981', '#94a3b8', '#ef4444']
                    }
                }];

                Plotly.newPlot('sentiment-chart', sentimentData, {
                    title: 'Sentiment Analysis',
                    paper_bgcolor: 'transparent',
                    plot_bgcolor: 'transparent',
                    font: { color: '#ffffff' }
                }, { displayModeBar: false });

                // Topics distribution
                const topicsData = [{
                    x: ['Quantum Computing', 'Cryptography', 'Security', 'Algorithms', 'Implementation'],
                    y: [45, 38, 25, 22, 15],
                    type: 'bar',
                    marker: { color: '#06b6d4' }
                }];

                Plotly.newPlot('topics-chart', topicsData, {
                    title: 'Topic Distribution',
                    paper_bgcolor: 'transparent',
                    plot_bgcolor: 'transparent',
                    font: { color: '#ffffff' },
                    xaxis: { color: '#ffffff' },
                    yaxis: { color: '#ffffff' }
                }, { displayModeBar: false });

                // Research timeline
                const timelineData = [{
                    x: ['2020', '2021', '2022', '2023', '2024'],
                    y: [12, 18, 25, 31, 28],
                    type: 'scatter',
                    mode: 'lines+markers',
                    line: { color: '#06b6d4', width: 3 },
                    marker: { color: '#06b6d4', size: 8 }
                }];

                Plotly.newPlot('timeline-chart', timelineData, {
                    title: 'Research Timeline',
                    paper_bgcolor: 'transparent',
                    plot_bgcolor: 'transparent',
                    font: { color: '#ffffff' },
                    xaxis: { color: '#ffffff', title: 'Year' },
                    yaxis: { color: '#ffffff', title: 'Publications' }
                }, { displayModeBar: false });
            }

            renderSources() {
                const container = document.getElementById('sources-container');
                container.innerHTML = this.researchSession.sources.map(source => this.createSourceCard(source)).join('');
            }

            createSourceCard(source) {
                const badgeClass = source.credibility >= 8 ? 'high' : source.credibility >= 6 ? 'medium' : 'low';
                const badgeText = source.credibility >= 8 ? 'HIGH' : source.credibility >= 6 ? 'MEDIUM' : 'LOW';

                return `
                    <div class="source-card" data-source-id="${source.id}">
                        <div class="source-header">
                            <div>
                                <div class="source-title">${source.title}</div>
                                <a href="${source.url}" class="source-domain" target="_blank">${source.domain}</a>
                            </div>
                            <div class="source-badge ${badgeClass}">${badgeText}</div>
                        </div>
                        <div class="source-excerpt">${source.excerpt}</div>
                        <div class="source-meta">
                            <span><i class="fas fa-calendar"></i> ${source.publishedDate}</span>
                            <span><i class="fas fa-eye"></i> ${source.views} views</span>
                            <span><i class="fas fa-star"></i> ${source.credibility}/10</span>
                        </div>
                    </div>
                `;
            }

            renderContradictions() {
                const container = document.getElementById('contradictions-container');
                
                if (this.researchSession.contradictions.length === 0) {
                    container.innerHTML = `
                        <div style="text-align: center; padding: 40px; color: var(--light-400);">
                            <i class="fas fa-check-circle" style="font-size: 48px; margin-bottom: 16px; color: var(--accent-green);"></i>
                            <div style="font-size: 16px; margin-bottom: 8px;">No Contradictions Detected</div>
                            <div style="font-size: 14px;">All sources are consistent with each other</div>
                        </div>
                    `;
                    return;
                }

                container.innerHTML = this.researchSession.contradictions.map(contradiction => `
                    <div class="contradiction-panel">
                        <div class="contradiction-header">
                            <i class="fas fa-exclamation-triangle"></i>
                            Contradiction Detected: ${contradiction.topic}
                        </div>
                        <div class="contradiction-sources">
                            <div class="contradiction-source">
                                <strong>Source A:</strong> ${contradiction.sourceA.claim}
                                <br><small>${contradiction.sourceA.source}</small>
                            </div>
                            <div class="contradiction-source">
                                <strong>Source B:</strong> ${contradiction.sourceB.claim}
                                <br><small>${contradiction.sourceB.source}</small>
                            </div>
                        </div>
                        <div style="margin-top: 12px; padding: 12px; background: var(--dark-800); border-radius: 8px;">
                            <strong>AI Analysis:</strong> ${contradiction.analysis}
                        </div>
                    </div>
                `).join('');
            }

            renderInsights() {
                const container = document.getElementById('insights-container');
                
                if (this.researchSession.insights.length === 0) {
                    container.innerHTML = `
                        <div style="text-align: center; padding: 40px; color: var(--light-400);">
                            <i class="fas fa-lightbulb" style="font-size: 48px; margin-bottom: 16px; color: var(--accent-amber);"></i>
                            <div style="font-size: 16px; margin-bottom: 8px;">Insights Being Generated</div>
                            <div style="font-size: 14px;">AI analysis in progress...</div>
                        </div>
                    `;
                    return;
                }

                container.innerHTML = this.researchSession.insights.map(insight => `
                    <div class="source-card" style="border-left: 4px solid var(--accent-amber);">
                        <div class="source-header">
                            <div class="source-title">
                                <i class="fas fa-lightbulb" style="color: var(--accent-amber); margin-right: 8px;"></i>
                                ${insight.title}
                            </div>
                        </div>
                        <div class="source-excerpt">${insight.description}</div>
                        <div class="source-meta">
                            <span><i class="fas fa-brain"></i> Confidence: ${insight.confidence}%</span>
                            <span><i class="fas fa-link"></i> ${insight.sourceCount} sources</span>
                        </div>
                    </div>
                `).join('');
            }

            logActivity(message, type = 'info') {
                const terminal = document.getElementById('terminal-content');
                const timestamp = new Date().toLocaleTimeString();
                
                const typeIcons = {
                    info: '<i class="fas fa-info-circle"></i>',
                    success: '<i class="fas fa-check"></i>',
                    warning: '<i class="fas fa-exclamation-triangle"></i>',
                    error: '<i class="fas fa-times"></i>'
                };

                const line = document.createElement('div');
                line.className = 'terminal-line';
                line.innerHTML = `
                    <div class="terminal-timestamp">${timestamp}</div>
                    <div class="terminal-output terminal-${type}">
                        ${typeIcons[type] || ''} ${message}
                    </div>
                `;

                terminal.appendChild(line);
                terminal.scrollTop = terminal.scrollHeight;
            }

            startTerminalAnimation() {
                // Simulate research activity
                const activities = [
                    { message: 'Research session initiated', type: 'info' },
                    { message: 'Analyzing query: "quantum computing cryptography"', type: 'info' },
                    { message: 'Query parsed successfully', type: 'success' },
                    { message: 'Searching academic sources...', type: 'info' },
                    { message: 'Found 12 high-quality sources', type: 'success' },
                    { message: 'Extracting content from nature.com...', type: 'info' },
                    { message: 'Content extracted (2.4KB)', type: 'success' },
                    { message: 'Analyzing credibility scores...', type: 'info' },
                    { message: 'Running deep analysis on 12 sources...', type: 'info' }
                ];

                activities.forEach((activity, index) => {
                    setTimeout(() => {
                        this.logActivity(activity.message, activity.type);
                    }, index * 1000);
                });
            }

            populateSampleData() {
                // Sample sources
                this.researchSession.sources = [
                    {
                        id: 1,
                        title: "Quantum Computing Breakthrough: IBM's 1000-Qubit Processor",
                        domain: "nature.com",
                        url: "https://nature.com/articles/quantum-breakthrough",
                        excerpt: "IBM announced a significant milestone in quantum computing with their new 1000-qubit processor, potentially revolutionizing cryptographic security...",
                        publishedDate: "2 days ago",
                        views: "12.4k",
                        credibility: 9.2
                    },
                    {
                        id: 2,
                        title: "Post-Quantum Cryptography Standards Released by NIST",
                        domain: "nist.gov",
                        url: "https://nist.gov/post-quantum-crypto",
                        excerpt: "The National Institute of Standards and Technology has finalized new cryptographic standards designed to resist quantum computer attacks...",
                        publishedDate: "1 week ago",
                        views: "8.7k",
                        credibility: 9.5
                    },
                    {
                        id: 3,
                        title: "Quantum Supremacy and Its Impact on Blockchain Security",
                        domain: "arxiv.org",
                        url: "https://arxiv.org/quantum-blockchain",
                        excerpt: "This paper explores the theoretical implications of quantum supremacy on current blockchain implementations and proposes quantum-resistant alternatives...",
                        publishedDate: "3 days ago",
                        views: "2.1k",
                        credibility: 8.1
                    }
                ];

                // Sample knowledge graph
                this.researchSession.knowledgeGraph = {
                    nodes: [
                        { id: 'quantum', label: 'Quantum Computing', type: 'concept', weight: 1.0 },
                        { id: 'crypto', label: 'Cryptography', type: 'concept', weight: 0.9 },
                        { id: 'ibm', label: 'IBM', type: 'entity', weight: 0.7 },
                        { id: 'nist', label: 'NIST', type: 'entity', weight: 0.8 },
                        { id: 'blockchain', label: 'Blockchain', type: 'concept', weight: 0.6 }
                    ],
                    links: [
                        { source: 'quantum', target: 'crypto' },
                        { source: 'quantum', target: 'ibm' },
                        { source: 'crypto', target: 'nist' },
                        { source: 'crypto', target: 'blockchain' }
                    ]
                };

                // Sample insights
                this.researchSession.insights = [
                    {
                        title: "Quantum Threat to Current Encryption",
                        description: "Current RSA and ECC encryption methods are vulnerable to quantum attacks using Shor's algorithm. Organizations should begin transitioning to post-quantum cryptography.",
                        confidence: 92,
                        sourceCount: 8
                    },
                    {
                        title: "Timeline for Practical Quantum Computers",
                        description: "Experts estimate 10-15 years before quantum computers can break current encryption at scale, giving organizations time to prepare.",
                        confidence: 78,
                        sourceCount: 12
                    }
                ];

                // Update UI
                this.updateMetrics({
                    credibility: 8.7,
                    sources: this.researchSession.sources.length,
                    conflicts: 0,
                    coverage: 95
                });

                this.renderSources();
                this.renderKnowledgeGraph();
            }

            updateMetrics(metrics) {
                document.getElementById('credibility-score').textContent = metrics.credibility;
                document.getElementById('sources-found').textContent = metrics.sources;
                document.getElementById('conflicts-detected').textContent = metrics.conflicts;
                document.getElementById('coverage-percent').textContent = metrics.coverage + '%';
                
                document.getElementById('sources-badge').textContent = metrics.sources;
                document.getElementById('contradictions-badge').textContent = metrics.conflicts;
            }

            updateProgressStatus(status) {
                const progressItems = document.querySelectorAll('.progress-item');
                progressItems.forEach((item, index) => {
                    const icon = item.querySelector('.progress-icon');
                    const statusText = item.querySelector('.progress-status');
                    
                    if (status === 'processing' && index === 1) {
                        icon.className = 'progress-icon processing';
                        statusText.textContent = 'In Progress';
                    } else if (status === 'complete') {
                        icon.className = 'progress-icon complete';
                        statusText.textContent = 'Completed';
                    }
                });
            }

            // Export and action methods
            createWebsite() {
                this.logActivity('Creating website from research data...', 'info');
                this.sendMessage({
                    type: 'create_artifact',
                    session_id: this.researchSession.id,
                    artifact_type: 'website',
                    data: this.researchSession
                });
            }

            exportReport() {
                this.logActivity('Generating research report...', 'info');
                this.sendMessage({
                    type: 'export_report',
                    session_id: this.researchSession.id,
                    format: 'pdf'
                });
            }

            generateInfographic() {
                this.logActivity('Creating infographic...', 'info');
                this.sendMessage({
                    type: 'create_artifact',
                    session_id: this.researchSession.id,
                    artifact_type: 'infographic',
                    data: this.researchSession
                });
            }

            createPresentation() {
                this.logActivity('Creating presentation slides...', 'info');
                this.sendMessage({
                    type: 'create_artifact',
                    session_id: this.researchSession.id,
                    artifact_type: 'presentation',
                    data: this.researchSession
                });
            }

            expandSearch() {
                this.logActivity('Expanding search with related queries...', 'info');
                this.sendMessage({
                    type: 'expand_search',
                    session_id: this.researchSession.id
                });
            }

            refineQuery() {
                this.logActivity('Refining query based on current results...', 'info');
                const refinedQuery = prompt('Enter refined query:', this.researchSession.query);
                if (refinedQuery) {
                    document.getElementById('main-query').value = refinedQuery;
                    this.startResearch();
                }
            }

            saveSession() {
                this.logActivity('Saving research session...', 'success');
                localStorage.setItem('research_session_' + this.researchSession.id, JSON.stringify(this.researchSession));
            }

            // WebSocket message handlers
            updateResearchProgress(data) {
                this.logActivity(data.message, data.type || 'info');
                if (data.progress) {
                    this.updateProgressStatus(data.progress);
                }
            }

            addSource(source) {
                this.researchSession.sources.push(source);
                this.renderSources();
                this.updateMetrics({
                    ...this.researchSession.metrics,
                    sources: this.researchSession.sources.length
                });
                this.logActivity(`New source added: ${source.title}`, 'success');
            }

            addContradiction(contradiction) {
                this.researchSession.contradictions.push(contradiction);
                this.renderContradictions();
                this.updateMetrics({
                    ...this.researchSession.metrics,
                    conflicts: this.researchSession.contradictions.length
                });
                this.logActivity(`Contradiction detected: ${contradiction.topic}`, 'warning');
            }

            addInsight(insight) {
                this.researchSession.insights.push(insight);
                this.renderInsights();
                this.logActivity(`New insight generated: ${insight.title}`, 'success');
            }

            updateKnowledgeGraph(graphData) {
                this.researchSession.knowledgeGraph = graphData;
                this.renderKnowledgeGraph();
                this.logActivity('Knowledge graph updated', 'info');
            }
        }

        // Initialize the Research Engine
        document.addEventListener('DOMContentLoaded', () => {
            window.researchEngine = new RevolutionaryResearchEngine();
        });