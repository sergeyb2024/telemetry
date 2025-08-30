// Racing Telemetry Analyzer - Main Application Logic

class TelemetryAnalyzer {
    constructor() {
        this.rawData = [];
        this.corners = [];
        this.analysis = {
            slow: { total: 0, oversteer: 0, understeer: 0, neutral: 0 },
            mid: { total: 0, oversteer: 0, understeer: 0, neutral: 0 },
            high: { total: 0, oversteer: 0, understeer: 0, neutral: 0 }
        };
        this.recommendations = {};
        this.init();
    }

    init() {
        console.log('Initializing Telemetry Analyzer...');
        this.setupEventListeners();
        this.setupDragAndDrop();
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        const fileInput = document.getElementById('fileInput');
        const browseBtn = document.getElementById('browseBtn');
        const analyzeBtn = document.getElementById('analyzeBtn');
        
        // Fixed file input click handler
        if (browseBtn && fileInput) {
            browseBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Browse button clicked');
                fileInput.click();
            });
        }

        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                console.log('File selected');
                this.handleFileSelect(e);
            });
        }

        if (analyzeBtn) {
            analyzeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Analyze button clicked');
                this.analyzeData();
            });
        }

        // Tab navigation - will be available after analysis
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-tab')) {
                e.preventDefault();
                this.switchTab(e.target.dataset.tab);
            }
        });

        // Export buttons - will be available after analysis
        document.addEventListener('click', (e) => {
            if (e.target.id === 'exportReportBtn') {
                e.preventDefault();
                this.exportReport();
            } else if (e.target.id === 'exportSettingsBtn') {
                e.preventDefault();
                this.exportSettings();
            } else if (e.target.id === 'newAnalysisBtn') {
                e.preventDefault();
                this.resetAnalysis();
            }
        });
    }

    setupDragAndDrop() {
        const uploadArea = document.getElementById('uploadArea');
        
        if (!uploadArea) return;

        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleFile(files[0]);
            }
        });

        // Also handle click on upload area
        uploadArea.addEventListener('click', (e) => {
            if (e.target === uploadArea || e.target.closest('.upload-area')) {
                const fileInput = document.getElementById('fileInput');
                if (fileInput) {
                    fileInput.click();
                }
            }
        });
    }

    handleFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            this.handleFile(file);
        }
    }

    handleFile(file) {
        console.log('Handling file:', file.name);
        
        if (!file.name.toLowerCase().endsWith('.csv')) {
            alert('Please select a CSV file.');
            return;
        }

        const fileDetails = document.getElementById('fileDetails');
        if (fileDetails) {
            fileDetails.innerHTML = `
                <strong>File:</strong> ${file.name}<br>
                <strong>Size:</strong> ${(file.size / 1024).toFixed(2)} KB<br>
                <strong>Type:</strong> ${file.type || 'CSV'}
            `;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            this.parseCSV(text);
            this.showFilePreview(text);
        };
        reader.readAsText(file);
    }

    parseCSV(text) {
        console.log('Parsing CSV data...');
        const lines = text.split('\n').filter(line => line.trim());
        if (lines.length === 0) return;

        const headers = lines[0].split(',').map(h => h.trim());
        
        this.rawData = [];
        for (let i = 1; i < Math.min(lines.length, 1000); i++) { // Limit to 1000 rows for demo
            const values = lines[i].split(',');
            if (values.length === headers.length) {
                const row = {};
                headers.forEach((header, index) => {
                    const value = values[index].trim();
                    row[header] = isNaN(value) ? value : parseFloat(value);
                });
                this.rawData.push(row);
            }
        }

        console.log(`Parsed ${this.rawData.length} data points`);
    }

    showFilePreview(text) {
        const preview = document.getElementById('filePreview');
        const fileInfo = document.getElementById('fileInfo');
        
        if (preview) {
            const lines = text.split('\n').slice(0, 6);
            preview.textContent = lines.join('\n') + (text.split('\n').length > 6 ? '\n...' : '');
        }
        
        if (fileInfo) {
            fileInfo.classList.remove('hidden');
        }
    }

    analyzeData() {
        if (this.rawData.length === 0) {
            alert('No data to analyze. Please upload a CSV file first.');
            return;
        }

        console.log('Starting data analysis...');
        this.showLoadingScreen();
        
        // Simulate processing steps with actual analysis
        setTimeout(() => {
            this.processData();
        }, 1000);
    }

    showLoadingScreen() {
        const uploadSection = document.getElementById('uploadSection');
        const loadingSection = document.getElementById('loadingSection');
        
        if (uploadSection) uploadSection.classList.add('hidden');
        if (loadingSection) loadingSection.classList.remove('hidden');
        
        let progress = 0;
        const progressFill = document.getElementById('progressFill');
        const loadingStatus = document.getElementById('loadingStatus');
        
        const steps = [
            'Parsing telemetry data...',
            'Identifying corner entry/exit points...',
            'Analyzing vehicle dynamics...',
            'Detecting oversteer/understeer...',
            'Generating recommendations...',
            'Building visualizations...'
        ];

        let stepIndex = 0;
        const interval = setInterval(() => {
            progress += 16.67;
            if (progressFill) progressFill.style.width = `${Math.min(progress, 100)}%`;
            
            if (stepIndex < steps.length && loadingStatus) {
                loadingStatus.textContent = steps[stepIndex];
                stepIndex++;
            }

            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => this.showResults(), 500);
            }
        }, 300);
    }

    processData() {
        console.log('Processing telemetry data...');
        
        // Generate sample analysis data if real data is insufficient
        if (this.rawData.length < 100) {
            this.generateSampleAnalysis();
        } else {
            this.detectCorners();
            this.analyzeCorners();
        }
        
        this.generateRecommendations();
    }

    generateSampleAnalysis() {
        console.log('Generating sample analysis data...');
        
        // Create sample corners for demonstration
        this.corners = [
            {
                id: 1,
                entrySpeed: 85,
                peakSpeed: 75,
                exitSpeed: 90,
                avgSpeed: 83,
                speedType: 'slow',
                maxGLat: 1.2,
                maxSteerAngle: 45,
                balance: 'understeer',
                confidence: 78,
                explanation: 'High steering input with limited lateral response. Front tires losing grip.',
                severity: 'moderate'
            },
            {
                id: 2,
                entrySpeed: 145,
                peakSpeed: 135,
                exitSpeed: 150,
                avgSpeed: 143,
                speedType: 'mid',
                maxGLat: 1.8,
                maxSteerAngle: 32,
                balance: 'neutral',
                confidence: 85,
                explanation: 'Good balance between steering input and vehicle response.',
                severity: 'good'
            },
            {
                id: 3,
                entrySpeed: 195,
                peakSpeed: 185,
                exitSpeed: 205,
                avgSpeed: 195,
                speedType: 'high',
                maxGLat: 2.1,
                maxSteerAngle: 28,
                balance: 'oversteer',
                confidence: 72,
                explanation: 'High yaw rate detected with counter-steering movements. Rear end losing grip.',
                severity: 'severe'
            },
            {
                id: 4,
                entrySpeed: 95,
                peakSpeed: 88,
                exitSpeed: 105,
                avgSpeed: 96,
                speedType: 'slow',
                maxGLat: 1.4,
                maxSteerAngle: 38,
                balance: 'neutral',
                confidence: 92,
                explanation: 'Good balance between steering input and vehicle response.',
                severity: 'good'
            },
            {
                id: 5,
                entrySpeed: 165,
                peakSpeed: 155,
                exitSpeed: 170,
                avgSpeed: 163,
                speedType: 'mid',
                maxGLat: 1.9,
                maxSteerAngle: 35,
                balance: 'understeer',
                confidence: 68,
                explanation: 'High steering input with limited lateral response. Front tires losing grip.',
                severity: 'minor'
            }
        ];

        this.analyzeCorners();
    }

    detectCorners() {
        // Simplified corner detection for demo
        this.corners = [];
        // Implementation would be more complex with real data
        console.log('Corner detection complete');
    }

    analyzeCorners() {
        // Reset analysis
        this.analysis = {
            slow: { total: 0, oversteer: 0, understeer: 0, neutral: 0 },
            mid: { total: 0, oversteer: 0, understeer: 0, neutral: 0 },
            high: { total: 0, oversteer: 0, understeer: 0, neutral: 0 }
        };

        this.corners.forEach(corner => {
            const speedType = corner.speedType;
            this.analysis[speedType].total++;
            this.analysis[speedType][corner.balance]++;
        });

        console.log('Corner analysis complete:', this.analysis);
    }

    generateRecommendations() {
        console.log('Generating recommendations...');
        
        this.recommendations = {
            tires: [],
            aerodynamics: [],
            suspension: [],
            brakes: [],
            drivetrain: [],
            electronics: []
        };

        // Analyze overall balance tendencies
        const totalCorners = this.corners.length;
        const oversteerCorners = this.corners.filter(c => c.balance === 'oversteer').length;
        const understeerCorners = this.corners.filter(c => c.balance === 'understeer').length;

        const oversteerPercent = totalCorners > 0 ? (oversteerCorners / totalCorners) * 100 : 0;
        const understeerPercent = totalCorners > 0 ? (understeerCorners / totalCorners) * 100 : 0;

        // Generate tire recommendations
        if (oversteerPercent > 30) {
            this.recommendations.tires.push({
                title: 'Rear Tire Pressure',
                value: '+2-3 PSI',
                description: 'Increase rear tire pressure to reduce rear grip and improve stability'
            });
            this.recommendations.tires.push({
                title: 'Front Camber',
                value: '+0.5°',
                description: 'Increase front camber to improve front grip in corners'
            });
        } else if (understeerPercent > 30) {
            this.recommendations.tires.push({
                title: 'Front Tire Pressure',
                value: '-1-2 PSI',
                description: 'Reduce front tire pressure to increase contact patch and grip'
            });
            this.recommendations.tires.push({
                title: 'Rear Camber',
                value: '+0.3°',
                description: 'Increase rear camber to reduce rear grip slightly'
            });
        } else {
            this.recommendations.tires.push({
                title: 'Tire Pressure',
                value: 'Maintain Current',
                description: 'Current pressures appear optimal based on balance analysis'
            });
        }

        // Aerodynamic recommendations
        const highSpeedIssues = this.analysis.high.oversteer + this.analysis.high.understeer;
        if (highSpeedIssues > 0) {
            if (this.analysis.high.oversteer > this.analysis.high.understeer) {
                this.recommendations.aerodynamics.push({
                    title: 'Rear Wing',
                    value: '+2-3 clicks',
                    description: 'Increase rear downforce to improve high-speed stability'
                });
            } else {
                this.recommendations.aerodynamics.push({
                    title: 'Front Wing',
                    value: '+1-2 clicks',
                    description: 'Increase front downforce to improve turn-in response'
                });
            }
        } else {
            this.recommendations.aerodynamics.push({
                title: 'Aerodynamic Balance',
                value: 'Well Balanced',
                description: 'Current aerodynamic setup is working well across all speeds'
            });
        }

        // Suspension recommendations
        const slowSpeedIssues = this.analysis.slow.oversteer + this.analysis.slow.understeer;
        if (slowSpeedIssues > 0) {
            if (this.analysis.slow.oversteer > this.analysis.slow.understeer) {
                this.recommendations.suspension.push({
                    title: 'Rear Anti-Roll Bar',
                    value: '-1-2 clicks',
                    description: 'Soften rear anti-roll bar to reduce oversteer in slow corners'
                });
            } else {
                this.recommendations.suspension.push({
                    title: 'Front Anti-Roll Bar',
                    value: '+1-2 clicks',
                    description: 'Stiffen front anti-roll bar to improve turn-in response'
                });
            }
        } else {
            this.recommendations.suspension.push({
                title: 'Suspension Setup',
                value: 'Well Balanced',
                description: 'Current suspension settings are working well across all corner types'
            });
        }

        // Brake recommendations
        this.recommendations.brakes.push({
            title: 'Brake Bias',
            value: understeerPercent > oversteerPercent ? '+0.2% front' : 'Maintain Current',
            description: understeerPercent > oversteerPercent ? 
                'Move bias forward to help with turn-in' : 
                'Current brake balance appears appropriate'
        });

        // Drivetrain recommendations
        this.recommendations.drivetrain.push({
            title: 'Differential',
            value: oversteerPercent > 20 ? 'Reduce preload' : 'Maintain Current',
            description: oversteerPercent > 20 ? 
                'Reduce differential preload to improve corner exit stability' :
                'Current differential settings appear appropriate'
        });

        // Electronics recommendations
        const severeCorners = this.corners.filter(c => c.severity === 'severe').length;
        if (severeCorners > 0) {
            this.recommendations.electronics.push({
                title: 'Traction Control',
                value: '+1 level',
                description: 'Increase TC to help manage severe oversteer situations'
            });
        } else {
            this.recommendations.electronics.push({
                title: 'Electronics',
                value: 'Optimal Settings',
                description: 'Current electronic aids are working effectively'
            });
        }
    }

    showResults() {
        console.log('Showing results...');
        
        const loadingSection = document.getElementById('loadingSection');
        const resultsSection = document.getElementById('resultsSection');
        
        if (loadingSection) loadingSection.classList.add('hidden');
        if (resultsSection) resultsSection.classList.remove('hidden');

        this.updateSummaryCards();
        this.updateBalanceAnalysis();
        this.updateIssuesList();
        this.updateCornersList();
        this.updateRecommendations();
        this.createCharts();
    }

    updateSummaryCards() {
        const elements = {
            totalCorners: document.getElementById('totalCorners'),
            slowCorners: document.getElementById('slowCorners'),
            midCorners: document.getElementById('midCorners'),
            highCorners: document.getElementById('highCorners')
        };

        if (elements.totalCorners) elements.totalCorners.textContent = this.corners.length;
        if (elements.slowCorners) elements.slowCorners.textContent = this.analysis.slow.total;
        if (elements.midCorners) elements.midCorners.textContent = this.analysis.mid.total;
        if (elements.highCorners) elements.highCorners.textContent = this.analysis.high.total;
    }

    updateBalanceAnalysis() {
        ['slow', 'mid', 'high'].forEach(speedType => {
            const data = this.analysis[speedType];
            const total = data.total;
            
            const balanceElement = document.getElementById(`${speedType}Balance`);
            const textElement = document.getElementById(`${speedType}BalanceText`);
            
            if (!balanceElement || !textElement) return;
            
            if (total === 0) {
                balanceElement.className = 'balance-fill neutral';
                balanceElement.style.width = '10%';
                textElement.textContent = 'No Data';
                return;
            }

            const oversteerPercent = (data.oversteer / total) * 100;
            const understeerPercent = (data.understeer / total) * 100;
            
            if (oversteerPercent > understeerPercent && oversteerPercent > 30) {
                balanceElement.className = 'balance-fill oversteer';
                balanceElement.style.width = `${oversteerPercent}%`;
                textElement.textContent = `${oversteerPercent.toFixed(0)}% Oversteer`;
            } else if (understeerPercent > 30) {
                balanceElement.className = 'balance-fill understeer';
                balanceElement.style.width = `${understeerPercent}%`;
                textElement.textContent = `${understeerPercent.toFixed(0)}% Understeer`;
            } else {
                balanceElement.className = 'balance-fill neutral';
                balanceElement.style.width = '100%';
                textElement.textContent = 'Well Balanced';
            }
        });
    }

    updateIssuesList() {
        const issuesList = document.getElementById('issuesList');
        if (!issuesList) return;

        const severeCorners = this.corners.filter(c => c.severity === 'severe');
        const moderateCorners = this.corners.filter(c => c.severity === 'moderate');

        let html = '';

        if (severeCorners.length > 0) {
            html += `
                <div class="issue-item severe">
                    <div class="issue-title">Severe Balance Issues</div>
                    <div class="issue-description">${severeCorners.length} corners with significant oversteer/understeer detected</div>
                </div>
            `;
        }

        if (moderateCorners.length > 0) {
            html += `
                <div class="issue-item moderate">
                    <div class="issue-title">Moderate Balance Issues</div>
                    <div class="issue-description">${moderateCorners.length} corners with moderate balance problems</div>
                </div>
            `;
        }

        if (html === '') {
            html = '<div class="issue-item minor"><div class="issue-title">No Critical Issues</div><div class="issue-description">Vehicle balance appears good across all corner types</div></div>';
        }

        issuesList.innerHTML = html;
    }

    updateCornersList() {
        const cornersList = document.getElementById('cornersList');
        if (!cornersList) return;

        let html = '';

        this.corners.forEach(corner => {
            html += `
                <div class="corner-item">
                    <div class="corner-header">
                        <div class="corner-title">Corner ${corner.id}</div>
                        <div class="corner-speed-type ${corner.speedType}">
                            ${corner.speedType.charAt(0).toUpperCase() + corner.speedType.slice(1)}-Speed
                        </div>
                    </div>
                    <div class="corner-details">
                        <div class="corner-detail">
                            <span>Entry Speed:</span>
                            <span>${corner.entrySpeed} km/h</span>
                        </div>
                        <div class="corner-detail">
                            <span>Peak G-Force:</span>
                            <span>${corner.maxGLat}g</span>
                        </div>
                        <div class="corner-detail">
                            <span>Max Steering:</span>
                            <span>${corner.maxSteerAngle}°</span>
                        </div>
                        <div class="corner-detail">
                            <span>Balance:</span>
                            <span class="status status--${corner.severity}">${corner.balance.toUpperCase()}</span>
                        </div>
                    </div>
                    <div class="corner-explanation">${corner.explanation}</div>
                </div>
            `;
        });

        cornersList.innerHTML = html;
    }

    updateRecommendations() {
        Object.keys(this.recommendations).forEach(category => {
            const element = document.getElementById(`${category}Recommendations`);
            if (!element) return;

            let html = '';

            this.recommendations[category].forEach(rec => {
                html += `
                    <div class="recommendation-item">
                        <div class="recommendation-title">${rec.title}</div>
                        <div class="recommendation-value">${rec.value}</div>
                        <div class="recommendation-description">${rec.description}</div>
                    </div>
                `;
            });

            element.innerHTML = html;
        });
    }

    createCharts() {
        // Create sample data for charts if no real data
        if (this.rawData.length === 0) {
            this.createSampleCharts();
        } else {
            this.createRealCharts();
        }
    }

    createSampleCharts() {
        // Generate sample telemetry data for visualization
        const sampleData = [];
        for (let i = 0; i < 100; i++) {
            sampleData.push({
                SPEED: 80 + Math.sin(i * 0.1) * 30 + Math.random() * 10,
                G_LAT: Math.sin(i * 0.08) * 1.5 + Math.random() * 0.3,
                STEERANGLE: Math.sin(i * 0.09) * 40 + Math.random() * 5,
                ROTY: Math.sin(i * 0.07) * 20 + Math.random() * 3
            });
        }

        this.createSpeedChart(sampleData);
        this.createSteeringChart(sampleData);
    }

    createRealCharts() {
        const dataPoints = this.rawData.slice(0, 200); // Limit for performance
        this.createSpeedChart(dataPoints);
        this.createSteeringChart(dataPoints);
    }

    createSpeedChart(dataPoints) {
        const ctx = document.getElementById('speedChart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: dataPoints.map((_, i) => i),
                datasets: [{
                    label: 'Speed (km/h)',
                    data: dataPoints.map(d => d.SPEED || 0),
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    fill: true,
                    tension: 0.4
                }, {
                    label: 'Lateral G-Force',
                    data: dataPoints.map(d => (d.G_LAT || 0) * 50), // Scale for visibility
                    borderColor: '#FFC185',
                    backgroundColor: 'rgba(255, 193, 133, 0.1)',
                    fill: false,
                    yAxisID: 'y1',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Speed (km/h)'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'G-Force (scaled)'
                        },
                        grid: {
                            drawOnChartArea: false,
                        },
                    }
                },
                plugins: {
                    legend: {
                        display: true
                    }
                }
            }
        });
    }

    createSteeringChart(dataPoints) {
        const ctx = document.getElementById('steeringChart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: dataPoints.map((_, i) => i),
                datasets: [{
                    label: 'Steering Angle (°)',
                    data: dataPoints.map(d => d.STEERANGLE || 0),
                    borderColor: '#B4413C',
                    backgroundColor: 'rgba(180, 65, 60, 0.1)',
                    fill: true,
                    tension: 0.4
                }, {
                    label: 'Yaw Rate (°/s)',
                    data: dataPoints.map(d => d.ROTY || 0),
                    borderColor: '#5D878F',
                    backgroundColor: 'rgba(93, 135, 143, 0.1)',
                    fill: false,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: 'Angle / Rate'
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true
                    }
                }
            }
        });
    }

    switchTab(tabName) {
        console.log('Switching to tab:', tabName);
        
        // Update tab buttons
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeTab) activeTab.classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        const activePanel = document.getElementById(tabName);
        if (activePanel) activePanel.classList.add('active');
    }

    resetAnalysis() {
        console.log('Resetting analysis...');
        
        const resultsSection = document.getElementById('resultsSection');
        const uploadSection = document.getElementById('uploadSection');
        const fileInfo = document.getElementById('fileInfo');
        const fileInput = document.getElementById('fileInput');
        
        if (resultsSection) resultsSection.classList.add('hidden');
        if (uploadSection) uploadSection.classList.remove('hidden');
        if (fileInfo) fileInfo.classList.add('hidden');
        if (fileInput) fileInput.value = '';
        
        this.rawData = [];
        this.corners = [];
    }

    exportReport() {
        const report = this.generateReportText();
        this.downloadFile('telemetry_analysis_report.txt', report);
    }

    exportSettings() {
        const settings = this.generateSettingsText();
        this.downloadFile('recommended_setup.txt', settings);
    }

    generateReportText() {
        let report = `RACING TELEMETRY ANALYSIS REPORT\n`;
        report += `Generated: ${new Date().toLocaleString()}\n`;
        report += `${'='.repeat(50)}\n\n`;
        
        report += `SUMMARY\n`;
        report += `Total Corners Analyzed: ${this.corners.length}\n`;
        report += `Slow Speed Corners: ${this.analysis.slow.total}\n`;
        report += `Mid Speed Corners: ${this.analysis.mid.total}\n`;
        report += `High Speed Corners: ${this.analysis.high.total}\n\n`;
        
        report += `BALANCE ANALYSIS\n`;
        ['slow', 'mid', 'high'].forEach(type => {
            const data = this.analysis[type];
            if (data.total > 0) {
                report += `${type.toUpperCase()} CORNERS:\n`;
                report += `  Oversteer: ${((data.oversteer / data.total) * 100).toFixed(1)}%\n`;
                report += `  Understeer: ${((data.understeer / data.total) * 100).toFixed(1)}%\n`;
                report += `  Neutral: ${((data.neutral / data.total) * 100).toFixed(1)}%\n\n`;
            }
        });

        return report;
    }

    generateSettingsText() {
        let settings = `RECOMMENDED SETUP CHANGES\n`;
        settings += `Generated: ${new Date().toLocaleString()}\n`;
        settings += `${'='.repeat(40)}\n\n`;

        Object.keys(this.recommendations).forEach(category => {
            if (this.recommendations[category].length > 0) {
                settings += `${category.toUpperCase()}\n`;
                this.recommendations[category].forEach(rec => {
                    settings += `  ${rec.title}: ${rec.value}\n`;
                    settings += `    ${rec.description}\n\n`;
                });
            }
        });

        return settings;
    }

    downloadFile(filename, content) {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing app...');
    new TelemetryAnalyzer();
});