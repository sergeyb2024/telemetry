// ACC Telemetry Analysis Application
class ACCTelemetryApp {
    constructor() {
        this.selectedCar = null;
        this.telemetryData = [];
        this.processedData = null;
        this.charts = {};
        this.currentSetup = {};
        
        // Car database from provided data
        this.carDatabase = [
            {
                "carId": "mercedes_amg_gt3",
                "carName": "Mercedes-AMG GT3",
                "carModelYear": 2015,
                "carClass": "GT3",
                "wheelbase": 2.665,
                "setupParameters": {
                    "tyres": {
                        "pressureLF": {"min": 24.0, "max": 32.0, "default": 27.5},
                        "pressureRF": {"min": 24.0, "max": 32.0, "default": 27.5},
                        "pressureLR": {"min": 24.0, "max": 32.0, "default": 27.0},
                        "pressureRR": {"min": 24.0, "max": 32.0, "default": 27.0}
                    },
                    "electronics": {
                        "tC1": {"min": 0, "max": 11, "default": 4},
                        "tC2": {"min": 0, "max": 20, "default": 6},
                        "abs": {"min": 1, "max": 11, "default": 3},
                        "brakeBias": {"min": 50.0, "max": 80.0, "default": 65.0}
                    },
                    "aero": {
                        "rideHeight": {"min": [50, 55], "max": [120, 120], "default": [65, 70]},
                        "splitter": {"min": 0, "max": 5, "default": 2},
                        "wing": {"min": 0, "max": 12, "default": 6}
                    },
                    "mechanicalGrip": {
                        "ARBFront": {"min": 0, "max": 30, "default": 15},
                        "ARBRear": {"min": 0, "max": 30, "default": 18}
                    }
                }
            },
            {
                "carId": "mercedes_amg_gt3_evo",
                "carName": "Mercedes-AMG GT3 Evo",
                "carModelYear": 2020,
                "carClass": "GT3",
                "wheelbase": 2.665,
                "setupParameters": {
                    "tyres": {
                        "pressureLF": {"min": 24.0, "max": 32.0, "default": 27.5},
                        "pressureRF": {"min": 24.0, "max": 32.0, "default": 27.5}
                    },
                    "electronics": {
                        "tC1": {"min": 0, "max": 11, "default": 4},
                        "tC2": {"min": 0, "max": 20, "default": 6}
                    },
                    "aero": {
                        "splitter": {"min": 0, "max": 5, "default": 2},
                        "wing": {"min": 0, "max": 12, "default": 6}
                    },
                    "mechanicalGrip": {
                        "ARBFront": {"min": 0, "max": 30, "default": 15},
                        "ARBRear": {"min": 0, "max": 30, "default": 18}
                    }
                }
            },
            {
                "carId": "bmw_m4_gt3",
                "carName": "BMW M4 GT3",
                "carModelYear": 2021,
                "carClass": "GT3",
                "wheelbase": 2.810,
                "setupParameters": {
                    "electronics": {
                        "tC1": {"min": 0, "max": 11, "default": 5},
                        "tC2": {"min": 0, "max": 20, "default": 7}
                    },
                    "aero": {
                        "splitter": {"min": 0, "max": 5, "default": 3},
                        "wing": {"min": 0, "max": 12, "default": 8}
                    },
                    "mechanicalGrip": {
                        "ARBFront": {"min": 0, "max": 30, "default": 12},
                        "ARBRear": {"min": 0, "max": 30, "default": 16}
                    }
                }
            },
            {
                "carId": "audi_r8_lms_evo",
                "carName": "Audi R8 LMS Evo",
                "carModelYear": 2019,
                "carClass": "GT3",
                "wheelbase": 2.650,
                "setupParameters": {
                    "tyres": {
                        "pressureLF": {"min": 24.0, "max": 32.0, "default": 27.0},
                        "pressureRF": {"min": 24.0, "max": 32.0, "default": 27.0}
                    },
                    "electronics": {
                        "tC1": {"min": 0, "max": 11, "default": 3},
                        "tC2": {"min": 0, "max": 20, "default": 5}
                    },
                    "aero": {
                        "splitter": {"min": 0, "max": 5, "default": 3},
                        "wing": {"min": 0, "max": 12, "default": 7}
                    },
                    "mechanicalGrip": {
                        "ARBFront": {"min": 0, "max": 30, "default": 14},
                        "ARBRear": {"min": 0, "max": 30, "default": 17}
                    }
                }
            },
            {
                "carId": "ferrari_488_gt3_evo",
                "carName": "Ferrari 488 GT3 Evo",
                "carModelYear": 2020,
                "carClass": "GT3",
                "wheelbase": 2.650,
                "setupParameters": {
                    "electronics": {
                        "tC1": {"min": 0, "max": 11, "default": 6},
                        "tC2": {"min": 0, "max": 20, "default": 8}
                    },
                    "aero": {
                        "splitter": {"min": 0, "max": 5, "default": 2},
                        "wing": {"min": 0, "max": 12, "default": 6}
                    },
                    "mechanicalGrip": {
                        "ARBFront": {"min": 0, "max": 30, "default": 16},
                        "ARBRear": {"min": 0, "max": 30, "default": 19}
                    }
                }
            }
        ];

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.populateCarSelection();
        this.setupTabNavigation();
        this.setupSetupControls();
    }

    setupEventListeners() {
        // Car selection
        const carSelect = document.getElementById('carSelect');
        if (carSelect) {
            carSelect.addEventListener('change', (e) => {
                this.selectCar(e.target.value);
            });
        }

        // File upload
        const fileInput = document.getElementById('fileInput');
        const uploadArea = document.getElementById('uploadArea');

        if (fileInput && uploadArea) {
            fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
            uploadArea.addEventListener('click', () => fileInput.click());
            uploadArea.addEventListener('dragover', this.handleDragOver.bind(this));
            uploadArea.addEventListener('dragleave', this.handleDragLeave.bind(this));
            uploadArea.addEventListener('drop', this.handleDrop.bind(this));
        }

        // Buttons
        const loadSampleBtn = document.getElementById('loadSampleBtn');
        if (loadSampleBtn) {
            loadSampleBtn.addEventListener('click', () => this.loadSampleData());
        }

        const processDataBtn = document.getElementById('processDataBtn');
        if (processDataBtn) {
            processDataBtn.addEventListener('click', () => this.processData());
        }

        const resetSetupBtn = document.getElementById('resetSetupBtn');
        if (resetSetupBtn) {
            resetSetupBtn.addEventListener('click', () => this.resetSetup());
        }

        const exportSetupBtn = document.getElementById('exportSetupBtn');
        if (exportSetupBtn) {
            exportSetupBtn.addEventListener('click', () => this.exportSetup());
        }
    }

    populateCarSelection() {
        const select = document.getElementById('carSelect');
        if (!select) return;

        // Clear existing options except the first one
        select.innerHTML = '<option value="">Choose a car...</option>';
        
        this.carDatabase.forEach(car => {
            const option = document.createElement('option');
            option.value = car.carId;
            option.textContent = car.carName;
            select.appendChild(option);
        });
    }

    selectCar(carId) {
        if (!carId) {
            document.getElementById('carInfo').classList.add('hidden');
            this.selectedCar = null;
            return;
        }

        this.selectedCar = this.carDatabase.find(car => car.carId === carId);
        if (this.selectedCar) {
            this.displayCarInfo();
            this.loadDefaultSetup();
        }
    }

    displayCarInfo() {
        document.getElementById('carYear').textContent = this.selectedCar.carModelYear;
        document.getElementById('carClass').textContent = this.selectedCar.carClass;
        document.getElementById('carWheelbase').textContent = `${this.selectedCar.wheelbase}m`;
        document.getElementById('carInfo').classList.remove('hidden');
    }

    loadDefaultSetup() {
        const params = this.selectedCar.setupParameters;
        this.currentSetup = {};

        // Load default values for all parameters
        Object.keys(params).forEach(category => {
            this.currentSetup[category] = {};
            Object.keys(params[category]).forEach(param => {
                if (params[category][param].default !== undefined) {
                    this.currentSetup[category][param] = params[category][param].default;
                }
            });
        });

        this.updateSetupControls();
    }

    handleDragOver(e) {
        e.preventDefault();
        document.getElementById('uploadArea').classList.add('drag-over');
    }

    handleDragLeave(e) {
        e.preventDefault();
        document.getElementById('uploadArea').classList.remove('drag-over');
    }

    handleDrop(e) {
        e.preventDefault();
        document.getElementById('uploadArea').classList.remove('drag-over');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            this.handleFile(files[0]);
        }
    }

    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            this.handleFile(file);
        }
    }

    handleFile(file) {
        if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
            this.showStatus('Please select a CSV file.', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this.parseCSV(e.target.result);
        };
        reader.readAsText(file);
    }

    parseCSV(csvText) {
        const lines = csvText.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        
        this.telemetryData = [];
        for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim()) {
                const values = lines[i].split(',');
                const dataPoint = {};
                headers.forEach((header, index) => {
                    dataPoint[header] = parseFloat(values[index]) || 0;
                });
                this.telemetryData.push(dataPoint);
            }
        }

        this.showDataPreview();
        document.getElementById('processDataBtn').classList.remove('hidden');
        this.showStatus(`Loaded ${this.telemetryData.length} data points`, 'success');
    }

    loadSampleData() {
        // Generate extended sample data with more realistic telemetry patterns
        this.telemetryData = [];
        for (let i = 0; i < 1000; i++) {
            const time = i * 0.05;
            
            // Simulate lap with corners
            const cornerPhase = Math.sin(time * 0.1) * 0.5 + 0.5;
            const straightPhase = 1 - cornerPhase;
            
            const dataPoint = {
                Time: time,
                SPEED: 100 + 140 * straightPhase + Math.random() * 10,
                STEERANGLE: 30 * Math.sin(time * 0.3) * cornerPhase + Math.random() * 3,
                G_LAT: 3.0 * Math.sin(time * 0.25) * cornerPhase + Math.random() * 0.3,
                ROTY: 25 * Math.sin(time * 0.28) * cornerPhase + Math.random() * 2,
                THROTTLE: Math.max(0, 60 + 40 * straightPhase - 30 * cornerPhase + Math.random() * 10),
                BRAKE: Math.max(0, 50 * cornerPhase * Math.sin(time * 0.4) + Math.random() * 5)
            };
            this.telemetryData.push(dataPoint);
        }

        this.showDataPreview();
        const processBtn = document.getElementById('processDataBtn');
        if (processBtn) {
            processBtn.classList.remove('hidden');
        }
        this.showStatus('Sample data loaded successfully', 'success');
    }

    showDataPreview() {
        const preview = document.getElementById('dataPreview');
        const previewTable = document.getElementById('previewTable');
        
        if (this.telemetryData.length > 0) {
            const headers = Object.keys(this.telemetryData[0]);
            const sampleData = this.telemetryData.slice(0, 5);

            let tableHTML = '<table class="preview-table"><thead><tr>';
            headers.forEach(header => {
                tableHTML += `<th>${header}</th>`;
            });
            tableHTML += '</tr></thead><tbody>';

            sampleData.forEach(row => {
                tableHTML += '<tr>';
                headers.forEach(header => {
                    tableHTML += `<td>${row[header].toFixed(2)}</td>`;
                });
                tableHTML += '</tr>';
            });
            tableHTML += '</tbody></table>';

            previewTable.innerHTML = tableHTML;
            preview.classList.remove('hidden');
        }
    }

    processData() {
        if (!this.selectedCar) {
            this.showStatus('Please select a car first', 'error');
            return;
        }

        if (this.telemetryData.length === 0) {
            this.showStatus('Please load telemetry data first', 'error');
            return;
        }

        this.showStatus('Processing telemetry data...', 'info');
        
        // Analyze telemetry data
        this.processedData = this.analyzeTelemetryData();
        
        // Show analysis results
        this.displayAnalysisResults();
        this.generateRecommendations();
        
        // Show analysis sections
        const analysisSection = document.getElementById('analysisSection');
        const recommendationsSection = document.getElementById('recommendationsSection');
        const setupSection = document.getElementById('setupSection');
        
        if (analysisSection) analysisSection.classList.remove('hidden');
        if (recommendationsSection) recommendationsSection.classList.remove('hidden');
        if (setupSection) setupSection.classList.remove('hidden');

        this.showStatus('Analysis complete', 'success');
    }

    analyzeTelemetryData() {
        const wheelbase = this.selectedCar.wheelbase;
        const processed = [];

        for (let i = 0; i < this.telemetryData.length; i++) {
            const point = this.telemetryData[i];
            const understeerAngle = this.calculateUndersteerAngle(
                point.STEERANGLE, 
                point.SPEED, 
                point.G_LAT, 
                wheelbase
            );

            processed.push({
                ...point,
                understeerAngle: understeerAngle,
                isCorner: Math.abs(point.G_LAT) > 0.5 && point.SPEED > 80
            });
        }

        return processed;
    }

    calculateUndersteerAngle(steerAngle, speed, lateralG, wheelbase) {
        if (Math.abs(lateralG) < 0.1 || speed < 50) return 0;
        
        const speedMs = speed / 3.6; // Convert km/h to m/s
        const turnRadius = (speedMs * speedMs) / (Math.abs(lateralG) * 9.81);
        const kinematicSteerAngle = (wheelbase / turnRadius) * 57.3; // Convert to degrees
        
        return steerAngle - kinematicSteerAngle;
    }

    calculateUndersteerGradient() {
        if (!this.processedData || this.processedData.length === 0) return 0;

        const cornerPoints = this.processedData.filter(p => p.isCorner && Math.abs(p.G_LAT) > 0.8);
        if (cornerPoints.length < 10) return 0;

        // Linear regression of steering angle vs lateral acceleration
        let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
        const n = cornerPoints.length;

        cornerPoints.forEach(point => {
            const x = Math.abs(point.G_LAT);
            const y = Math.abs(point.STEERANGLE);
            sumX += x;
            sumY += y;
            sumXY += x * y;
            sumXX += x * x;
        });

        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        return slope || 0;
    }

    detectCorners() {
        if (!this.processedData || this.processedData.length === 0) return [];

        const corners = [];
        let cornerStart = null;

        for (let i = 0; i < this.processedData.length; i++) {
            const point = this.processedData[i];
            
            if (point.isCorner && cornerStart === null) {
                cornerStart = i;
            } else if (!point.isCorner && cornerStart !== null) {
                const cornerData = this.processedData.slice(cornerStart, i);
                if (cornerData.length > 10) { // Only consider substantial corners
                    const avgUndersteer = cornerData.reduce((sum, p) => sum + p.understeerAngle, 0) / cornerData.length;
                    const maxLateralG = Math.max(...cornerData.map(p => Math.abs(p.G_LAT)));
                    
                    let classification = 'neutral';
                    if (avgUndersteer > 1.5) classification = 'understeer';
                    else if (avgUndersteer < -1.0) classification = 'oversteer';

                    corners.push({
                        start: cornerStart,
                        end: i,
                        duration: (i - cornerStart) * 0.05,
                        avgUndersteer: avgUndersteer,
                        maxLateralG: maxLateralG,
                        classification: classification
                    });
                }
                cornerStart = null;
            }
        }

        return corners;
    }

    displayAnalysisResults() {
        // Calculate metrics
        const understeerGradient = this.calculateUndersteerGradient();
        const corners = this.detectCorners();
        const peakLateralG = Math.max(...this.processedData.map(p => Math.abs(p.G_LAT)));
        const avgSpeed = this.processedData.reduce((sum, p) => sum + p.SPEED, 0) / this.processedData.length;
        
        const understeerTime = this.processedData.filter(p => p.understeerAngle > 1.5).length;
        const neutralTime = this.processedData.filter(p => Math.abs(p.understeerAngle) <= 1.5 && Math.abs(p.understeerAngle) >= 1.0).length;
        const oversteerTime = this.processedData.filter(p => p.understeerAngle < -1.0).length;
        const totalTime = this.processedData.length;
        
        const balanceFactor = ((neutralTime / totalTime) * 100).toFixed(1);

        // Update display elements
        const elements = {
            'understeerGradient': understeerGradient.toFixed(2),
            'balanceFactor': balanceFactor,
            'peakLateralG': peakLateralG.toFixed(2),
            'avgSpeed': avgSpeed.toFixed(1)
        };

        Object.keys(elements).forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = elements[id];
            }
        });

        // Create charts
        setTimeout(() => {
            this.createTelemetryCharts();
        }, 100);
        
        this.displayCornersTable(corners);
    }

    createTelemetryCharts() {
        // Telemetry time series chart
        const telemetryCanvas = document.getElementById('telemetryChart');
        if (!telemetryCanvas) return;
        
        const telemetryCtx = telemetryCanvas.getContext('2d');
        
        if (this.charts.telemetry) {
            this.charts.telemetry.destroy();
        }

        const sampleData = this.processedData.filter((_, index) => index % 5 === 0); // Sample every 5th point

        this.charts.telemetry = new Chart(telemetryCtx, {
            type: 'line',
            data: {
                labels: sampleData.map(p => p.Time.toFixed(1)),
                datasets: [
                    {
                        label: 'Speed (km/h)',
                        data: sampleData.map(p => p.SPEED),
                        borderColor: '#1FB8CD',
                        backgroundColor: 'rgba(31, 184, 205, 0.1)',
                        yAxisID: 'y'
                    },
                    {
                        label: 'Steering Angle (deg)',
                        data: sampleData.map(p => p.STEERANGLE),
                        borderColor: '#FFC185',
                        backgroundColor: 'rgba(255, 193, 133, 0.1)',
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left'
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right'
                    }
                }
            }
        });

        // Understeer analysis chart
        const understeerCanvas = document.getElementById('understeerChart');
        if (!understeerCanvas) return;
        
        const understeerCtx = understeerCanvas.getContext('2d');
        
        if (this.charts.understeer) {
            this.charts.understeer.destroy();
        }

        const cornerData = this.processedData.filter(p => p.isCorner);

        this.charts.understeer = new Chart(understeerCtx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Understeer Angle vs Lateral G',
                    data: cornerData.map(p => ({
                        x: Math.abs(p.G_LAT),
                        y: p.understeerAngle
                    })),
                    backgroundColor: '#B4413C',
                    borderColor: '#B4413C'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Lateral G (g)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Understeer Angle (deg)'
                        }
                    }
                }
            }
        });
    }

    displayCornersTable(corners) {
        const tableContainer = document.getElementById('cornersTable');
        if (!tableContainer) return;
        
        let tableHTML = `
            <div class="corner-row header">
                <div class="corner-cell">Corner #</div>
                <div class="corner-cell">Duration (s)</div>
                <div class="corner-cell">Avg Understeer</div>
                <div class="corner-cell">Max Lateral G</div>
                <div class="corner-cell">Classification</div>
            </div>
        `;

        corners.slice(0, 10).forEach((corner, index) => {
            tableHTML += `
                <div class="corner-row">
                    <div class="corner-cell">${index + 1}</div>
                    <div class="corner-cell">${corner.duration.toFixed(2)}</div>
                    <div class="corner-cell">${corner.avgUndersteer.toFixed(2)}</div>
                    <div class="corner-cell">${corner.maxLateralG.toFixed(2)}</div>
                    <div class="corner-cell">
                        <span class="corner-status ${corner.classification}">${corner.classification}</span>
                    </div>
                </div>
            `;
        });

        tableContainer.innerHTML = tableHTML;
    }

    generateRecommendations() {
        if (!this.processedData || this.processedData.length === 0) return;

        const avgUndersteer = this.processedData.reduce((sum, p) => sum + p.understeerAngle, 0) / this.processedData.length;
        
        // Clear existing recommendations
        const containers = ['aeroRecommendations', 'suspensionRecommendations', 'electronicsRecommendations', 'tiresRecommendations'];
        containers.forEach(containerId => {
            const container = document.getElementById(containerId);
            if (container) container.innerHTML = '';
        });

        if (avgUndersteer > 1.0) {
            // Understeer solutions
            this.addRecommendation('aeroRecommendations', 'Reduce front splitter', '-1', 'negative');
            this.addRecommendation('aeroRecommendations', 'Lower front ride height', '-5mm', 'negative');
            this.addRecommendation('suspensionRecommendations', 'Soften front ARB', '-2', 'negative');
            this.addRecommendation('suspensionRecommendations', 'Stiffen rear ARB', '+1', 'positive');
            this.addRecommendation('tiresRecommendations', 'Lower front tire pressure', '-0.5', 'negative');
            this.addRecommendation('tiresRecommendations', 'Increase rear tire pressure', '+0.3', 'positive');
        } else if (avgUndersteer < -0.5) {
            // Oversteer solutions
            this.addRecommendation('aeroRecommendations', 'Increase rear wing', '+1', 'positive');
            this.addRecommendation('aeroRecommendations', 'Raise rear ride height', '+5mm', 'positive');
            this.addRecommendation('suspensionRecommendations', 'Soften rear ARB', '-2', 'negative');
            this.addRecommendation('suspensionRecommendations', 'Stiffen front ARB', '+1', 'positive');
            this.addRecommendation('electronicsRecommendations', 'Increase TC2', '+2', 'positive');
            this.addRecommendation('electronicsRecommendations', 'Increase TC1', '+1', 'positive');
        } else {
            // Neutral balance - fine tuning recommendations
            this.addRecommendation('tiresRecommendations', 'Fine-tune tire pressures', '±0.2', 'neutral');
            this.addRecommendation('electronicsRecommendations', 'Optimize TC settings', '±1', 'neutral');
            this.addRecommendation('aeroRecommendations', 'Balance is good - minor adjustments only', '±0.5', 'neutral');
            this.addRecommendation('suspensionRecommendations', 'Current setup is well balanced', '±1', 'neutral');
        }
    }

    addRecommendation(containerId, text, change, type) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        const item = document.createElement('div');
        item.className = 'recommendation-item';
        
        item.innerHTML = `
            <span class="recommendation-text">${text}</span>
            <span class="recommendation-change ${type}">${change}</span>
        `;
        
        container.appendChild(item);
    }

    setupTabNavigation() {
        // Analysis tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabId = e.target.dataset.tab;
                
                // Update button states
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                // Update content visibility
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                const targetTab = document.getElementById(tabId);
                if (targetTab) {
                    targetTab.classList.add('active');
                }
            });
        });

        // Setup tabs
        document.querySelectorAll('.setup-tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabId = e.target.dataset.tab;
                
                // Update button states
                document.querySelectorAll('.setup-tab-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                // Update content visibility
                document.querySelectorAll('.setup-tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                const targetTab = document.getElementById(tabId);
                if (targetTab) {
                    targetTab.classList.add('active');
                }
            });
        });
    }

    setupSetupControls() {
        // Setup sliders
        const sliders = document.querySelectorAll('.setup-slider');
        sliders.forEach(slider => {
            slider.addEventListener('input', (e) => {
                const valueDisplay = document.getElementById(e.target.id + 'Value');
                if (valueDisplay) {
                    valueDisplay.textContent = e.target.value;
                }
                this.updateCurrentSetup(e.target.id, parseFloat(e.target.value));
            });
        });
    }

    updateCurrentSetup(parameter, value) {
        // Update the current setup object
        console.log(`Updated ${parameter} to ${value}`);
        
        // Could add real-time impact prediction here
        // For example, show color-coded feedback on setup changes
    }

    updateSetupControls() {
        if (!this.selectedCar || !this.currentSetup) return;

        // Update all controls with current setup values
        Object.keys(this.currentSetup).forEach(category => {
            Object.keys(this.currentSetup[category]).forEach(param => {
                const control = document.getElementById(param);
                const valueDisplay = document.getElementById(param + 'Value');
                
                if (control) {
                    control.value = this.currentSetup[category][param];
                    
                    // Set min/max values from car parameters
                    const carParams = this.selectedCar.setupParameters[category];
                    if (carParams && carParams[param]) {
                        control.min = carParams[param].min;
                        control.max = carParams[param].max;
                    }
                }
                if (valueDisplay) {
                    valueDisplay.textContent = this.currentSetup[category][param];
                }
            });
        });
    }

    resetSetup() {
        if (this.selectedCar) {
            this.loadDefaultSetup();
            this.showStatus('Setup reset to defaults', 'info');
        }
    }

    exportSetup() {
        if (!this.currentSetup || !this.selectedCar) {
            this.showStatus('No setup to export', 'error');
            return;
        }

        const setupData = {
            carId: this.selectedCar.carId,
            carName: this.selectedCar.carName,
            setup: this.currentSetup,
            exportDate: new Date().toISOString()
        };

        const dataStr = JSON.stringify(setupData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `${this.selectedCar.carId}_setup.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        this.showStatus('Setup exported successfully', 'success');
    }

    showStatus(message, type) {
        // Create status message element
        const statusDiv = document.createElement('div');
        statusDiv.className = `status-message ${type}`;
        statusDiv.textContent = message;
        
        // Insert at the top of main content
        const main = document.querySelector('main');
        if (main) {
            main.insertBefore(statusDiv, main.firstChild);
            
            // Remove after 5 seconds
            setTimeout(() => {
                if (statusDiv.parentNode) {
                    statusDiv.parentNode.removeChild(statusDiv);
                }
            }, 5000);
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ACCTelemetryApp();
});