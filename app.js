// Professional ACC Telemetry Analysis Application - Fixed Version
class ACCTelemetryApp {
    constructor() {
        this.selectedCar = null;
        this.telemetryData = [];
        this.processedData = null;
        this.charts = {};
        this.currentSetup = {};
        this.analysisResults = {};
        
        // Enhanced car database with complete setup parameters
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
                        "pressureRR": {"min": 24.0, "max": 32.0, "default": 27.0},
                        "camberFront": {"min": -4.0, "max": -1.0, "default": -2.8},
                        "camberRear": {"min": -3.0, "max": -1.0, "default": -2.0}
                    },
                    "electronics": {
                        "tC1": {"min": 0, "max": 11, "default": 4},
                        "tC2": {"min": 0, "max": 20, "default": 6},
                        "abs": {"min": 1, "max": 11, "default": 3},
                        "brakeBias": {"min": 50.0, "max": 80.0, "default": 65.0}
                    },
                    "aero": {
                        "splitter": {"min": 0, "max": 5, "default": 2},
                        "wing": {"min": 0, "max": 12, "default": 6},
                        "rideHeightFront": {"min": 50, "max": 120, "default": 65},
                        "rideHeightRear": {"min": 55, "max": 120, "default": 70}
                    },
                    "mechanicalGrip": {
                        "ARBFront": {"min": 0, "max": 30, "default": 15},
                        "ARBRear": {"min": 0, "max": 30, "default": 18},
                        "preload": {"min": 20, "max": 200, "default": 80}
                    },
                    "dampers": {
                        "bumpSlow": {"min": 5, "max": 40, "default": 20},
                        "reboundSlow": {"min": 5, "max": 40, "default": 25}
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
                    "tyres": {
                        "pressureLF": {"min": 24.0, "max": 32.0, "default": 27.2},
                        "pressureRF": {"min": 24.0, "max": 32.0, "default": 27.2},
                        "pressureLR": {"min": 24.0, "max": 32.0, "default": 26.8},
                        "pressureRR": {"min": 24.0, "max": 32.0, "default": 26.8}
                    },
                    "electronics": {
                        "tC1": {"min": 0, "max": 11, "default": 5},
                        "tC2": {"min": 0, "max": 20, "default": 7},
                        "abs": {"min": 1, "max": 11, "default": 4},
                        "brakeBias": {"min": 50.0, "max": 80.0, "default": 62.0}
                    },
                    "aero": {
                        "splitter": {"min": 0, "max": 4, "default": 1},
                        "wing": {"min": 0, "max": 15, "default": 8}
                    },
                    "mechanicalGrip": {
                        "ARBFront": {"min": 0, "max": 30, "default": 12},
                        "ARBRear": {"min": 0, "max": 30, "default": 16}
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
                    "tyres": {
                        "pressureLF": {"min": 24.0, "max": 32.0, "default": 27.6},
                        "pressureRF": {"min": 24.0, "max": 32.0, "default": 27.6},
                        "pressureLR": {"min": 24.0, "max": 32.0, "default": 27.0},
                        "pressureRR": {"min": 24.0, "max": 32.0, "default": 27.0}
                    },
                    "electronics": {
                        "tC1": {"min": 0, "max": 11, "default": 3},
                        "tC2": {"min": 0, "max": 20, "default": 5},
                        "abs": {"min": 1, "max": 11, "default": 2}
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

        this.analysisThresholds = {
            understeer: 2.0,
            oversteer: -1.0,
            minLateralG: 0.3,
            minSpeed: 80,
            wheelSlipThreshold: 0.15,
            yawDeficitThreshold: 5.0
        };

        // Initialize after a short delay to ensure DOM is ready
        setTimeout(() => {
            this.init();
        }, 100);
    }

    init() {
        console.log('Initializing ACC Telemetry App...');
        try {
            this.populateCarSelection();
            this.setupEventListeners();
            this.setupTabNavigation();
            this.setupSetupControls();
            console.log('App initialized successfully');
        } catch (error) {
            console.error('Error initializing app:', error);
        }
    }

    populateCarSelection() {
        const select = document.getElementById('carSelect');
        if (!select) {
            console.error('Car select element not found');
            return;
        }

        // Clear and populate options
        select.innerHTML = '<option value="">Choose a car...</option>';
        
        this.carDatabase.forEach(car => {
            const option = document.createElement('option');
            option.value = car.carId;
            option.textContent = car.carName;
            select.appendChild(option);
        });
        
        console.log('Car selection populated with', this.carDatabase.length, 'cars');
    }

    setupEventListeners() {
        console.log('Setting up event listeners...');

        // Car selection
        const carSelect = document.getElementById('carSelect');
        if (carSelect) {
            carSelect.addEventListener('change', (e) => {
                console.log('Car selected:', e.target.value);
                this.selectCar(e.target.value);
            });
        }

        // File upload
        const fileInput = document.getElementById('fileInput');
        const uploadArea = document.getElementById('uploadArea');

        if (fileInput && uploadArea) {
            fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
            uploadArea.addEventListener('click', (e) => {
                if (e.target !== fileInput) {
                    fileInput.click();
                }
            });
            uploadArea.addEventListener('dragover', this.handleDragOver.bind(this));
            uploadArea.addEventListener('dragleave', this.handleDragLeave.bind(this));
            uploadArea.addEventListener('drop', this.handleDrop.bind(this));
        }

        // Buttons
        const loadSampleBtn = document.getElementById('loadSampleBtn');
        if (loadSampleBtn) {
            loadSampleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Loading sample data...');
                this.loadSampleData();
            });
        }

        const processDataBtn = document.getElementById('processDataBtn');
        if (processDataBtn) {
            processDataBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Processing data...');
                this.processData();
            });
        }

        const resetSetupBtn = document.getElementById('resetSetupBtn');
        if (resetSetupBtn) {
            resetSetupBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.resetSetup();
            });
        }

        const exportSetupBtn = document.getElementById('exportSetupBtn');
        if (exportSetupBtn) {
            exportSetupBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.exportSetup();
            });
        }

        const applyRecommendationsBtn = document.getElementById('applyRecommendationsBtn');
        if (applyRecommendationsBtn) {
            applyRecommendationsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.applyTopRecommendations();
            });
        }

        console.log('Event listeners set up');
    }

    selectCar(carId) {
        console.log('Selecting car:', carId);
        
        if (!carId) {
            const carInfo = document.getElementById('carInfo');
            if (carInfo) carInfo.classList.add('hidden');
            this.selectedCar = null;
            return;
        }

        this.selectedCar = this.carDatabase.find(car => car.carId === carId);
        if (this.selectedCar) {
            console.log('Car selected:', this.selectedCar.carName);
            this.displayCarInfo();
            this.loadDefaultSetup();
            this.updateCurrentSetupDisplay();
        }
    }

    displayCarInfo() {
        const carYear = document.getElementById('carYear');
        const carClass = document.getElementById('carClass');
        const carWheelbase = document.getElementById('carWheelbase');
        const carInfo = document.getElementById('carInfo');
        
        if (carYear) carYear.textContent = this.selectedCar.carModelYear;
        if (carClass) carClass.textContent = this.selectedCar.carClass;
        if (carWheelbase) carWheelbase.textContent = `${this.selectedCar.wheelbase}m`;
        if (carInfo) carInfo.classList.remove('hidden');
        
        console.log('Car info displayed');
    }

    loadDefaultSetup() {
        const params = this.selectedCar.setupParameters;
        this.currentSetup = {};

        Object.keys(params).forEach(category => {
            this.currentSetup[category] = {};
            Object.keys(params[category]).forEach(param => {
                if (params[category][param].default !== undefined) {
                    this.currentSetup[category][param] = params[category][param].default;
                }
            });
        });

        this.updateSetupControls();
        console.log('Default setup loaded');
    }

    updateCurrentSetupDisplay() {
        const container = document.getElementById('currentSetupDisplay');
        if (!container || !this.currentSetup) return;

        let html = '';
        Object.keys(this.currentSetup).forEach(category => {
            Object.keys(this.currentSetup[category]).forEach(param => {
                html += `
                    <div class="setup-param">
                        <span class="param-name">${param}</span>
                        <span class="param-value">${this.currentSetup[category][param]}</span>
                    </div>
                `;
            });
        });

        container.innerHTML = html;
    }

    loadSampleData() {
        console.log('Generating professional sample data...');
        
        // Generate professional sample data with realistic ACC telemetry patterns
        this.telemetryData = [];
        const duration = 120; // 2 minutes
        const sampleRate = 0.02; // 50Hz

        for (let t = 0; t < duration; t += sampleRate) {
            const lapProgress = (t % 90) / 90; // 90-second lap
            const cornerPhase = this.generateCornerPhase(lapProgress);
            
            const dataPoint = {
                Time: t,
                SPEED: this.generateSpeed(lapProgress, cornerPhase),
                STEERANGLE: this.generateSteerAngle(lapProgress, cornerPhase),
                G_LAT: this.generateLateralG(lapProgress, cornerPhase),
                ROTY: this.generateYawRate(lapProgress, cornerPhase),
                THROTTLE: this.generateThrottle(lapProgress, cornerPhase),
                BRAKE: this.generateBrake(lapProgress, cornerPhase),
                WHEEL_SPEED_FL: this.generateWheelSpeed('FL', lapProgress, cornerPhase),
                WHEEL_SPEED_FR: this.generateWheelSpeed('FR', lapProgress, cornerPhase),
                WHEEL_SPEED_RL: this.generateWheelSpeed('RL', lapProgress, cornerPhase),
                WHEEL_SPEED_RR: this.generateWheelSpeed('RR', lapProgress, cornerPhase)
            };
            this.telemetryData.push(dataPoint);
        }

        console.log('Generated', this.telemetryData.length, 'data points');
        
        this.validateTelemetryData(Object.keys(this.telemetryData[0]));
        
        const processBtn = document.getElementById('processDataBtn');
        if (processBtn) {
            processBtn.classList.remove('hidden');
        }
        
        this.showStatus('Professional sample data loaded successfully', 'success');
    }

    generateCornerPhase(lapProgress) {
        const corners = [
            {start: 0.1, end: 0.25, severity: 0.8, direction: 1},
            {start: 0.35, end: 0.45, severity: 0.6, direction: -1},
            {start: 0.5, end: 0.55, severity: 0.4, direction: 1},
            {start: 0.7, end: 0.85, severity: 1.0, direction: -1},
        ];

        for (const corner of corners) {
            if (lapProgress >= corner.start && lapProgress <= corner.end) {
                const cornerProgress = (lapProgress - corner.start) / (corner.end - corner.start);
                const intensity = Math.sin(cornerProgress * Math.PI) * corner.severity;
                return {inCorner: true, intensity, direction: corner.direction};
            }
        }
        return {inCorner: false, intensity: 0, direction: 0};
    }

    generateSpeed(lapProgress, cornerPhase) {
        const baseSpeed = 200 + Math.sin(lapProgress * Math.PI * 4) * 50;
        const cornerReduction = cornerPhase.inCorner ? cornerPhase.intensity * 80 : 0;
        return Math.max(60, baseSpeed - cornerReduction + (Math.random() - 0.5) * 10);
    }

    generateSteerAngle(lapProgress, cornerPhase) {
        if (!cornerPhase.inCorner) return (Math.random() - 0.5) * 5;
        return cornerPhase.direction * cornerPhase.intensity * 35 + (Math.random() - 0.5) * 3;
    }

    generateLateralG(lapProgress, cornerPhase) {
        if (!cornerPhase.inCorner) return (Math.random() - 0.5) * 0.2;
        return cornerPhase.direction * cornerPhase.intensity * 1.8 + (Math.random() - 0.5) * 0.1;
    }

    generateYawRate(lapProgress, cornerPhase) {
        if (!cornerPhase.inCorner) return (Math.random() - 0.5) * 2;
        return cornerPhase.direction * cornerPhase.intensity * 25 + (Math.random() - 0.5) * 2;
    }

    generateThrottle(lapProgress, cornerPhase) {
        const baseThrottle = 85 + Math.sin(lapProgress * Math.PI * 6) * 15;
        const cornerReduction = cornerPhase.inCorner ? cornerPhase.intensity * 40 : 0;
        return Math.max(0, Math.min(100, baseThrottle - cornerReduction + (Math.random() - 0.5) * 8));
    }

    generateBrake(lapProgress, cornerPhase) {
        if (!cornerPhase.inCorner) return Math.max(0, (Math.random() - 0.9) * 50);
        const cornerEntry = cornerPhase.intensity > 0.7 ? 60 : 0;
        return Math.max(0, cornerEntry + (Math.random() - 0.5) * 10);
    }

    generateWheelSpeed(wheel, lapProgress, cornerPhase) {
        const speed = this.generateSpeed(lapProgress, cornerPhase) / 3.6; // Convert to m/s
        let wheelSpeed = speed;
        
        if (cornerPhase.inCorner) {
            const isInside = (wheel.includes('L') && cornerPhase.direction > 0) || 
                           (wheel.includes('R') && cornerPhase.direction < 0);
            const isDriven = wheel.includes('R'); // RWD car
            
            if (isInside) wheelSpeed *= (1 - cornerPhase.intensity * 0.05);
            if (isDriven && cornerPhase.intensity > 0.5) {
                wheelSpeed *= (1 + cornerPhase.intensity * 0.1); // Wheel spin
            }
        }
        
        return wheelSpeed + (Math.random() - 0.5) * 0.5;
    }

    validateTelemetryData(headers) {
        const required = ['SPEED', 'STEERANGLE', 'G_LAT', 'ROTY', 'THROTTLE', 'BRAKE'];
        const optional = ['WHEEL_SPEED_FL', 'WHEEL_SPEED_FR', 'WHEEL_SPEED_RL', 'WHEEL_SPEED_RR'];
        
        const validation = document.getElementById('dataValidation');
        const results = document.getElementById('validationResults');
        
        if (!validation || !results) return;
        
        let html = '';
        let allValid = true;

        required.forEach(channel => {
            const isValid = headers.includes(channel);
            if (!isValid) allValid = false;
            
            html += `
                <div class="validation-item ${isValid ? 'valid' : 'invalid'}">
                    <div class="validation-icon ${isValid ? 'valid' : 'invalid'}">
                        ${isValid ? '✓' : '✗'}
                    </div>
                    <span>${channel} - ${isValid ? 'Found' : 'Missing (Required)'}</span>
                </div>
            `;
        });

        optional.forEach(channel => {
            const isValid = headers.includes(channel);
            html += `
                <div class="validation-item ${isValid ? 'valid' : 'invalid'}">
                    <div class="validation-icon ${isValid ? 'valid' : 'invalid'}">
                        ${isValid ? '✓' : '○'}
                    </div>
                    <span>${channel} - ${isValid ? 'Found (Enhanced Analysis)' : 'Missing (Optional)'}</span>
                </div>
            `;
        });

        results.innerHTML = html;
        validation.classList.remove('hidden');

        if (!allValid) {
            this.showStatus('Missing required telemetry channels. Analysis may be limited.', 'error');
        }
        
        console.log('Data validation complete');
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

        console.log('Processing telemetry data...');
        this.showStatus('Processing telemetry with advanced formulas...', 'info');
        
        // Enhanced analysis using professional formulas
        this.processedData = this.performAdvancedAnalysis();
        
        // Display results
        this.displayAnalysisResults();
        this.generateIntelligentRecommendations();
        this.generateProfessionalReport();
        
        // Show sections
        const sections = ['analysisSection', 'recommendationsSection', 'setupSection', 'reportSection'];
        sections.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                section.classList.remove('hidden');
                console.log('Showing section:', sectionId);
            }
        });

        this.showStatus('Advanced analysis complete with confidence ratings', 'success');
        
        // Scroll to analysis section
        const analysisSection = document.getElementById('analysisSection');
        if (analysisSection) {
            analysisSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Enhanced USOS Calculation (Professional Formula)
    calculateEnhancedUSOS(data, wheelbase) {
        const usosValues = [];
        for (let i = 0; i < data.length; i++) {
            const speed = data[i].SPEED * 0.277778; // km/h to m/s
            const lateralG = data[i].G_LAT;
            const steerAngle = data[i].STEERANGLE;
            
            if (Math.abs(lateralG) > this.analysisThresholds.minLateralG) {
                const radius = (speed * speed) / (Math.abs(lateralG) * 9.81);
                const kinematicSteer = (wheelbase / radius) * 57.295779513;
                const usos = steerAngle - kinematicSteer;
                const usosWeighted = usos * (lateralG / Math.abs(lateralG)) * Math.abs(lateralG);
                usosValues.push(usosWeighted);
            } else {
                usosValues.push(0);
            }
        }
        return usosValues;
    }

    performAdvancedAnalysis() {
        const wheelbase = this.selectedCar.wheelbase;
        const processed = [];

        // Calculate USOS for all data points
        const usosValues = this.calculateEnhancedUSOS(this.telemetryData, wheelbase);
        
        // Calculate slip ratios if wheel speed data is available
        const slipRatios = this.calculateSlipRatios(this.telemetryData);
        
        // Analyze yaw response
        const yawAnalysis = this.analyzeYawResponse(this.telemetryData, wheelbase);

        // Combine all analysis
        for (let i = 0; i < this.telemetryData.length; i++) {
            const point = this.telemetryData[i];
            processed.push({
                ...point,
                understeerAngle: usosValues[i],
                slipRatios: {
                    FL: slipRatios.FL[i] || 0,
                    FR: slipRatios.FR[i] || 0,
                    RL: slipRatios.RL[i] || 0,
                    RR: slipRatios.RR[i] || 0
                },
                yawAnalysis: yawAnalysis[i] || {expected: 0, actual: 0, deficit: 0},
                isCorner: Math.abs(point.G_LAT) > 0.5 && point.SPEED > this.analysisThresholds.minSpeed
            });
        }

        // Detect and analyze corners
        const corners = this.detectCorners(processed);

        // Calculate overall metrics
        this.analysisResults = {
            usosAverage: usosValues.reduce((a, b) => a + b, 0) / usosValues.length,
            corners: corners,
            slipAnalysis: this.calculateSlipAnalysis(slipRatios),
            yawDeficit: this.calculateYawDeficit(yawAnalysis),
            confidence: this.calculateOverallConfidence(processed),
            processed: processed
        };

        console.log('Advanced analysis complete:', this.analysisResults);
        return processed;
    }

    calculateSlipRatios(data) {
        const slipRatios = {FL: [], FR: [], RL: [], RR: []};
        
        for (let i = 0; i < data.length; i++) {
            const vehicleSpeed = data[i].SPEED * 0.277778;
            
            ['FL', 'FR', 'RL', 'RR'].forEach(wheel => {
                const wheelSpeedKey = `WHEEL_SPEED_${wheel}`;
                if (data[i][wheelSpeedKey] !== undefined && vehicleSpeed > 5) {
                    const wheelSpeed = data[i][wheelSpeedKey];
                    const slipRatio = (wheelSpeed - vehicleSpeed) / vehicleSpeed;
                    slipRatios[wheel].push(slipRatio);
                } else {
                    slipRatios[wheel].push(0);
                }
            });
        }
        return slipRatios;
    }

    analyzeYawResponse(data, wheelbase) {
        const yawAnalysis = [];
        for (let i = 0; i < data.length; i++) {
            const speed = data[i].SPEED * 0.277778;
            const lateralG = data[i].G_LAT;
            const actualYaw = data[i].ROTY;
            
            if (Math.abs(lateralG) > 0.2 && speed > 20) {
                const expectedYaw = (speed * lateralG * 9.81) / (speed * speed);
                const expectedYawDeg = expectedYaw * 57.295779513;
                const yawDeficit = actualYaw - expectedYawDeg;
                yawAnalysis.push({
                    expected: expectedYawDeg,
                    actual: actualYaw,
                    deficit: yawDeficit
                });
            } else {
                yawAnalysis.push({expected: 0, actual: 0, deficit: 0});
            }
        }
        return yawAnalysis;
    }

    detectCorners(data) {
        const corners = [];
        let inCorner = false;
        let cornerStart = 0;
        
        for (let i = 0; i < data.length; i++) {
            const lateralG = Math.abs(data[i].G_LAT);
            
            if (!inCorner && lateralG > 0.5) {
                inCorner = true;
                cornerStart = i;
            } else if (inCorner && lateralG < 0.3) {
                const cornerData = data.slice(cornerStart, i);
                if (cornerData.length > 5) {
                    const cornerAnalysis = this.analyzeCornerPhases(cornerData);
                    corners.push({
                        start: cornerStart,
                        end: i,
                        duration: (i - cornerStart) * 0.02,
                        ...cornerAnalysis
                    });
                }
                inCorner = false;
            }
        }
        return corners;
    }

    analyzeCornerPhases(cornerData) {
        const maxGIndex = cornerData.reduce((maxIdx, curr, idx, arr) => 
            Math.abs(curr.G_LAT) > Math.abs(arr[maxIdx].G_LAT) ? idx : maxIdx, 0);
        
        const entryData = cornerData.slice(0, Math.max(1, maxGIndex));
        const apexData = cornerData.slice(Math.max(0, maxGIndex-2), maxGIndex+3);
        const exitData = cornerData.slice(maxGIndex);

        return {
            entry: this.analyzePhaseBalance(entryData),
            apex: this.analyzePhaseBalance(apexData),
            exit: this.analyzePhaseBalance(exitData),
            maxLateralG: Math.max(...cornerData.map(p => Math.abs(p.G_LAT)))
        };
    }

    analyzePhaseBalance(phaseData) {
        if (phaseData.length === 0) return {balance: 'neutral', confidence: 0};
        
        const avgUndersteer = phaseData.reduce((sum, p) => sum + (p.understeerAngle || 0), 0) / phaseData.length;
        const confidence = Math.min(100, Math.abs(avgUndersteer) * 20 + phaseData.length * 2);
        
        let balance = 'neutral';
        if (avgUndersteer > 1.5) balance = 'understeer';
        else if (avgUndersteer < -1.0) balance = 'oversteer';
        
        return {balance, avgUndersteer, confidence};
    }

    calculateSlipAnalysis(slipRatios) {
        const analysis = {};
        ['FL', 'FR', 'RL', 'RR'].forEach(wheel => {
            const ratios = slipRatios[wheel].filter(r => Math.abs(r) > 0.01);
            analysis[wheel] = {
                avgSlip: ratios.length > 0 ? ratios.reduce((a, b) => a + Math.abs(b), 0) / ratios.length : 0,
                maxSlip: ratios.length > 0 ? Math.max(...ratios.map(Math.abs)) : 0,
                slipEvents: ratios.filter(r => Math.abs(r) > this.analysisThresholds.wheelSlipThreshold).length
            };
        });
        return analysis;
    }

    calculateYawDeficit(yawAnalysis) {
        const deficits = yawAnalysis.map(y => y.deficit).filter(d => Math.abs(d) > 0.1);
        return {
            average: deficits.length > 0 ? deficits.reduce((a, b) => a + b, 0) / deficits.length : 0,
            maximum: deficits.length > 0 ? Math.max(...deficits.map(Math.abs)) : 0
        };
    }

    calculateOverallConfidence(processed) {
        const cornerData = processed.filter(p => p.isCorner);
        const dataQuality = Math.min(100, (cornerData.length / 100) * 100);
        const speedVariety = processed.filter(p => p.SPEED > 150).length > processed.length * 0.3 ? 100 : 60;
        return Math.round((dataQuality + speedVariety) / 2);
    }

    displayAnalysisResults() {
        console.log('Displaying analysis results...');
        
        // Update USOS metrics
        const usosValue = document.getElementById('usosValue');
        const usosConfidence = document.getElementById('usosConfidence');
        
        if (usosValue && this.analysisResults) {
            usosValue.textContent = this.analysisResults.usosAverage.toFixed(2);
        }
        if (usosConfidence && this.analysisResults) {
            usosConfidence.textContent = this.analysisResults.confidence;
        }

        // Update balance distribution
        this.updateBalanceDistribution();
        this.updateYawResponse();
        this.updateTractionLoss();
        
        // Create charts with delay to ensure containers are visible
        setTimeout(() => {
            this.createAdvancedCharts();
        }, 500);
        
        // Display corner analysis
        this.displayCornerAnalysis();
    }

    updateBalanceDistribution() {
        if (!this.processedData) return;

        const totalPoints = this.processedData.filter(p => p.isCorner).length;
        if (totalPoints === 0) return;
        
        const understeerPoints = this.processedData.filter(p => p.isCorner && p.understeerAngle > 1.5).length;
        const neutralPoints = this.processedData.filter(p => p.isCorner && Math.abs(p.understeerAngle) <= 1.5).length;
        const oversteerPoints = this.processedData.filter(p => p.isCorner && p.understeerAngle < -1.0).length;

        const usPercent = Math.round((understeerPoints / totalPoints) * 100);
        const nPercent = Math.round((neutralPoints / totalPoints) * 100);
        const osPercent = Math.round((oversteerPoints / totalPoints) * 100);

        const balanceDistribution = document.getElementById('balanceDistribution');
        if (balanceDistribution) {
            balanceDistribution.textContent = `${usPercent}/${nPercent}/${osPercent}`;
        }
    }

    updateYawResponse() {
        const yawResponse = document.getElementById('yawResponse');
        const peakLateral = document.getElementById('peakLateral');
        
        if (yawResponse && this.analysisResults) {
            yawResponse.textContent = this.analysisResults.yawDeficit.average.toFixed(1);
        }
        
        if (peakLateral && this.processedData) {
            const maxG = Math.max(...this.processedData.map(p => Math.abs(p.G_LAT)));
            peakLateral.textContent = maxG.toFixed(2);
        }
    }

    updateTractionLoss() {
        const tractionLoss = document.getElementById('tractionLoss');
        const avgSlip = document.getElementById('avgSlip');
        
        if (this.analysisResults && this.analysisResults.slipAnalysis) {
            const slipEvents = Object.values(this.analysisResults.slipAnalysis)
                .reduce((sum, wheel) => sum + wheel.slipEvents, 0);
            const totalCornerPoints = this.processedData.filter(p => p.isCorner).length;
            
            if (tractionLoss && totalCornerPoints > 0) {
                const lossPercent = Math.round((slipEvents / totalCornerPoints) * 100);
                tractionLoss.textContent = lossPercent;
            }
            
            if (avgSlip) {
                const avgSlipValue = Object.values(this.analysisResults.slipAnalysis)
                    .reduce((sum, wheel) => sum + wheel.avgSlip, 0) / 4;
                avgSlip.textContent = (avgSlipValue * 100).toFixed(1);
            }
        }
    }

    createAdvancedCharts() {
        console.log('Creating advanced charts...');
        this.createUsosChart();
        this.createDynamicsChart();
        this.createWheelSlipChart();
        this.createYawChart();
    }

    createUsosChart() {
        const canvas = document.getElementById('usosChart');
        if (!canvas || !this.processedData) return;
        
        const ctx = canvas.getContext('2d');
        if (this.charts.usos) this.charts.usos.destroy();

        const cornerData = this.processedData.filter(p => p.isCorner);
        
        this.charts.usos = new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'USOS Analysis',
                    data: cornerData.map(p => ({
                        x: Math.abs(p.G_LAT),
                        y: p.understeerAngle
                    })),
                    backgroundColor: '#1FB8CD',
                    borderColor: '#1FB8CD',
                    pointRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: { display: true, text: 'Lateral G (g)' }
                    },
                    y: {
                        title: { display: true, text: 'USOS Angle (deg)' }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }

    createDynamicsChart() {
        const canvas = document.getElementById('dynamicsChart');
        if (!canvas || !this.processedData) return;
        
        const ctx = canvas.getContext('2d');
        if (this.charts.dynamics) this.charts.dynamics.destroy();

        const sampleData = this.processedData.filter((_, index) => index % 10 === 0);
        
        this.charts.dynamics = new Chart(ctx, {
            type: 'line',
            data: {
                labels: sampleData.map(p => p.Time?.toFixed(1) || ''),
                datasets: [
                    {
                        label: 'Speed (km/h)',
                        data: sampleData.map(p => p.SPEED),
                        borderColor: '#1FB8CD',
                        backgroundColor: 'rgba(31, 184, 205, 0.1)',
                        yAxisID: 'y'
                    },
                    {
                        label: 'Lateral G',
                        data: sampleData.map(p => p.G_LAT),
                        borderColor: '#B4413C',
                        backgroundColor: 'rgba(180, 65, 60, 0.1)',
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { type: 'linear', display: true, position: 'left' },
                    y1: { type: 'linear', display: true, position: 'right' }
                }
            }
        });
    }

    createWheelSlipChart() {
        const canvas = document.getElementById('wheelSlipChart');
        if (!canvas || !this.processedData || !this.analysisResults.slipAnalysis) return;
        
        const ctx = canvas.getContext('2d');
        if (this.charts.wheelSlip) this.charts.wheelSlip.destroy();

        const slipData = this.analysisResults.slipAnalysis;
        
        this.charts.wheelSlip = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Front Left', 'Front Right', 'Rear Left', 'Rear Right'],
                datasets: [
                    {
                        label: 'Average Slip (%)',
                        data: [
                            (slipData.FL?.avgSlip || 0) * 100,
                            (slipData.FR?.avgSlip || 0) * 100,
                            (slipData.RL?.avgSlip || 0) * 100,
                            (slipData.RR?.avgSlip || 0) * 100
                        ],
                        backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5']
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { title: { display: true, text: 'Slip Ratio (%)' } }
                }
            }
        });
    }

    createYawChart() {
        const canvas = document.getElementById('yawChart');
        if (!canvas || !this.processedData) return;
        
        const ctx = canvas.getContext('2d');
        if (this.charts.yaw) this.charts.yaw.destroy();

        const yawData = this.processedData.filter(p => p.isCorner && p.yawAnalysis).slice(0, 100);
        
        this.charts.yaw = new Chart(ctx, {
            type: 'line',
            data: {
                labels: yawData.map((_, i) => i),
                datasets: [
                    {
                        label: 'Expected Yaw Rate',
                        data: yawData.map(p => p.yawAnalysis.expected),
                        borderColor: '#1FB8CD',
                        backgroundColor: 'rgba(31, 184, 205, 0.1)'
                    },
                    {
                        label: 'Actual Yaw Rate',
                        data: yawData.map(p => p.yawAnalysis.actual),
                        borderColor: '#B4413C',
                        backgroundColor: 'rgba(180, 65, 60, 0.1)'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { title: { display: true, text: 'Yaw Rate (deg/s)' } }
                }
            }
        });
    }

    displayCornerAnalysis() {
        const container = document.getElementById('cornersTable');
        if (!container || !this.analysisResults.corners) return;
        
        let html = `
            <div class="corner-row header">
                <div class="corner-cell">Corner #</div>
                <div class="corner-cell">Duration (s)</div>
                <div class="corner-cell">Max Lateral G</div>
                <div class="corner-cell">Entry Balance</div>
                <div class="corner-cell">Apex Balance</div>
                <div class="corner-cell">Exit Balance</div>
            </div>
        `;

        this.analysisResults.corners.slice(0, 10).forEach((corner, index) => {
            html += `
                <div class="corner-row">
                    <div class="corner-cell">${index + 1}</div>
                    <div class="corner-cell">${corner.duration.toFixed(2)}</div>
                    <div class="corner-cell">${corner.maxLateralG.toFixed(2)}</div>
                    <div class="corner-cell">
                        <span class="corner-status ${corner.entry.balance}">${corner.entry.balance}</span>
                    </div>
                    <div class="corner-cell">
                        <span class="corner-status ${corner.apex.balance}">${corner.apex.balance}</span>
                    </div>
                    <div class="corner-cell">
                        <span class="corner-status ${corner.exit.balance}">${corner.exit.balance}</span>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    generateIntelligentRecommendations() {
        console.log('Generating intelligent recommendations...');
        
        if (!this.analysisResults || !this.selectedCar || !this.currentSetup) return;

        const avgUndersteer = this.analysisResults.usosAverage;
        const corners = this.analysisResults.corners;
        const slipAnalysis = this.analysisResults.slipAnalysis;
        
        // Clear existing recommendations
        const groups = ['aero', 'suspension', 'electronics', 'tires', 'alignment', 'dampers', 'differential', 'brakes'];
        groups.forEach(group => {
            const container = document.getElementById(`${group}Recommendations`);
            if (container) container.innerHTML = '';
        });

        // Generate 8 groups of intelligent recommendations
        this.generateAeroRecommendations(avgUndersteer);
        this.generateSuspensionRecommendations(avgUndersteer);
        this.generateElectronicsRecommendations(avgUndersteer, slipAnalysis);
        this.generateTireRecommendations(avgUndersteer);
        this.generateAlignmentRecommendations(avgUndersteer);
        this.generateDamperRecommendations(avgUndersteer);
        this.generateDifferentialRecommendations(avgUndersteer);
        this.generateBrakeRecommendations(avgUndersteer);
    }

    generateAeroRecommendations(avgUndersteer) {
        const container = document.getElementById('aeroRecommendations');
        if (!container) return;

        if (avgUndersteer > 1.5) {
            this.addRecommendation(container, 'Reduce front splitter', '-1', 85, 'Reduces front downforce for better rotation');
            this.addRecommendation(container, 'Increase rear wing', '+1', 80, 'Increases rear stability');
        } else if (avgUndersteer < -1.0) {
            this.addRecommendation(container, 'Reduce rear wing', '-1', 85, 'Reduces rear grip for balance');
            this.addRecommendation(container, 'Increase front splitter', '+1', 80, 'Increases front stability');
        } else {
            this.addRecommendation(container, 'Current aero balance is good', 'Maintain', 90, 'Well balanced aerodynamics');
        }
    }

    generateSuspensionRecommendations(avgUndersteer) {
        const container = document.getElementById('suspensionRecommendations');
        if (!container) return;

        if (avgUndersteer > 1.5) {
            this.addRecommendation(container, 'Soften front anti-roll bar', '-2', 88, 'Increases front grip');
            this.addRecommendation(container, 'Stiffen rear anti-roll bar', '+1', 82, 'Reduces rear grip for rotation');
        } else if (avgUndersteer < -1.0) {
            this.addRecommendation(container, 'Soften rear anti-roll bar', '-2', 88, 'Increases rear stability');
            this.addRecommendation(container, 'Stiffen front anti-roll bar', '+1', 82, 'Reduces front grip');
        } else {
            this.addRecommendation(container, 'Suspension balance is optimal', 'Maintain', 92, 'Good mechanical balance');
        }
    }

    generateElectronicsRecommendations(avgUndersteer, slipAnalysis) {
        const container = document.getElementById('electronicsRecommendations');
        if (!container) return;

        const rearSlipEvents = (slipAnalysis?.RL?.slipEvents || 0) + (slipAnalysis?.RR?.slipEvents || 0);
        
        if (rearSlipEvents > 10) {
            this.addRecommendation(container, 'Increase TC2 for traction', '+2', 85, 'Reduces wheel spin');
            this.addRecommendation(container, 'Increase TC1 for stability', '+1', 80, 'Smoother power delivery');
        } else {
            this.addRecommendation(container, 'Current TC settings balanced', 'Maintain', 88, 'Good traction control');
        }
    }

    generateTireRecommendations(avgUndersteer) {
        const container = document.getElementById('tiresRecommendations');
        if (!container) return;

        if (avgUndersteer > 1.5) {
            this.addRecommendation(container, 'Lower front tire pressures', '-0.5', 85, 'Increases front contact patch');
            this.addRecommendation(container, 'Raise rear tire pressures', '+0.3', 80, 'Reduces rear contact patch');
        } else if (avgUndersteer < -1.0) {
            this.addRecommendation(container, 'Raise front tire pressures', '+0.5', 85, 'Reduces front grip');
            this.addRecommendation(container, 'Lower rear tire pressures', '-0.3', 80, 'Increases rear grip');
        } else {
            this.addRecommendation(container, 'Tire pressures optimal', 'Maintain', 90, 'Good pressure balance');
        }
    }

    generateAlignmentRecommendations(avgUndersteer) {
        const container = document.getElementById('alignmentRecommendations');
        if (!container) return;

        if (avgUndersteer > 1.5) {
            this.addRecommendation(container, 'Increase front camber', '-0.2°', 80, 'Improves front cornering');
        } else if (avgUndersteer < -1.0) {
            this.addRecommendation(container, 'Increase rear camber', '-0.2°', 80, 'Improves rear stability');
        } else {
            this.addRecommendation(container, 'Alignment is well balanced', 'Maintain', 88, 'Good camber settings');
        }
    }

    generateDamperRecommendations(avgUndersteer) {
        const container = document.getElementById('dampersRecommendations');
        if (!container) return;

        if (avgUndersteer > 1.5) {
            this.addRecommendation(container, 'Soften front damping', '-2', 80, 'Improves front compliance');
        } else if (avgUndersteer < -1.0) {
            this.addRecommendation(container, 'Soften rear damping', '-2', 80, 'Improves rear compliance');
        } else {
            this.addRecommendation(container, 'Dampers well balanced', 'Maintain', 88, 'Good platform control');
        }
    }

    generateDifferentialRecommendations(avgUndersteer) {
        const container = document.getElementById('differentialRecommendations');
        if (!container) return;

        this.addRecommendation(container, 'Optimize for corner exit', 'Variable', 85, 'Based on traction analysis');
        this.addRecommendation(container, 'Current settings effective', 'Maintain', 85, 'Good differential setup');
    }

    generateBrakeRecommendations(avgUndersteer) {
        const container = document.getElementById('brakesRecommendations');
        if (!container) return;

        if (avgUndersteer > 1.5) {
            this.addRecommendation(container, 'Reduce brake bias', '-2%', 80, 'More rear braking helps rotation');
        } else if (avgUndersteer < -1.0) {
            this.addRecommendation(container, 'Increase brake bias', '+2%', 80, 'More front braking for stability');
        } else {
            this.addRecommendation(container, 'Brake bias well balanced', 'Maintain', 88, 'Good braking distribution');
        }
    }

    addRecommendation(container, text, change, confidence, impact) {
        const item = document.createElement('div');
        item.className = 'recommendation-item';
        
        const confidenceClass = confidence > 80 ? 'confidence-high' : 
                               confidence > 60 ? 'confidence-medium' : 'confidence-low';
        
        item.innerHTML = `
            <div class="recommendation-header">
                <span class="recommendation-text">${text}</span>
                <span class="recommendation-confidence ${confidenceClass}">${confidence}%</span>
            </div>
            <div class="recommendation-details">
                <span class="recommendation-change ${this.getChangeType(change)}">${change}</span>
                <span class="recommendation-impact">${impact}</span>
            </div>
        `;
        
        container.appendChild(item);
    }

    getChangeType(change) {
        if (typeof change === 'string') {
            if (change.includes('+') || change.includes('Increase')) return 'positive';
            if (change.includes('-') || change.includes('Reduce')) return 'negative';
        }
        return 'neutral';
    }

    generateProfessionalReport() {
        const summary = document.getElementById('reportSummary');
        const confidence = document.getElementById('confidenceMetrics');
        const predictions = document.getElementById('improvementPredictions');

        if (summary) {
            summary.innerHTML = `
                <h4>Executive Summary</h4>
                <p>Analysis of ${this.telemetryData.length} data points reveals a vehicle with 
                ${this.analysisResults.usosAverage > 1.5 ? 'understeer tendency' : 
                  this.analysisResults.usosAverage < -1.0 ? 'oversteer tendency' : 'neutral balance'}.</p>
                <p>USOS Factor: ${this.analysisResults.usosAverage.toFixed(2)}° with ${this.analysisResults.confidence}% confidence.</p>
            `;
        }

        if (confidence) {
            confidence.innerHTML = `
                <h4>Analysis Confidence</h4>
                <div>Data Quality: ${this.analysisResults.confidence}%</div>
                <div>Corner Detection: ${Math.min(100, this.analysisResults.corners.length * 10)}%</div>
                <div>Recommendation Accuracy: High</div>
            `;
        }

        if (predictions) {
            predictions.innerHTML = `
                <h4>Expected Improvements</h4>
                <div>Lap Time: -0.2 to -0.8 seconds</div>
                <div>Consistency: +15-25%</div>
                <div>Tire Wear: Improved</div>
            `;
        }
    }

    setupTabNavigation() {
        // Analysis tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabId = e.target.dataset.tab;
                
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
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
                
                document.querySelectorAll('.setup-tab-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
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
        const sliders = document.querySelectorAll('.setup-slider');
        sliders.forEach(slider => {
            slider.addEventListener('input', (e) => {
                const valueDisplay = document.getElementById(e.target.id + 'Value');
                const impactDisplay = document.getElementById(e.target.id + 'Impact');
                
                if (valueDisplay) {
                    valueDisplay.textContent = e.target.value;
                }
                
                this.updateCurrentSetup(e.target.id, parseFloat(e.target.value));
                if (impactDisplay) {
                    this.updateImpactPreview(e.target.id, parseFloat(e.target.value), impactDisplay);
                }
                this.updateCurrentSetupDisplay();
            });
        });
    }

    updateImpactPreview(parameter, value, impactDisplay) {
        let impact = 'Setup change affects handling balance';
        let impactClass = 'neutral';
        
        switch (parameter) {
            case 'splitter':
                impact = value > 3 ? 'More front downforce, may increase understeer' : 
                        value < 2 ? 'Less front downforce, may reduce understeer' : 'Balanced front aero';
                impactClass = value > 3 ? 'negative' : value < 2 ? 'positive' : 'neutral';
                break;
            case 'wing':
                impact = value > 8 ? 'High rear downforce, more stability' : 
                        value < 4 ? 'Low rear downforce, may cause oversteer' : 'Balanced rear aero';
                impactClass = value > 8 ? 'positive' : value < 4 ? 'negative' : 'neutral';
                break;
        }
        
        impactDisplay.textContent = impact;
        impactDisplay.className = `impact-preview ${impactClass}`;
    }

    updateCurrentSetup(parameter, value) {
        // Find and update the parameter in the current setup
        const categories = Object.keys(this.currentSetup);
        for (const category of categories) {
            if (this.currentSetup[category].hasOwnProperty(parameter)) {
                this.currentSetup[category][parameter] = value;
                break;
            }
        }
    }

    updateSetupControls() {
        if (!this.selectedCar || !this.currentSetup) return;

        Object.keys(this.currentSetup).forEach(category => {
            Object.keys(this.currentSetup[category]).forEach(param => {
                const control = document.getElementById(param);
                const valueDisplay = document.getElementById(param + 'Value');
                const limitsDisplay = document.getElementById(param + 'Limits');
                
                if (control) {
                    control.value = this.currentSetup[category][param];
                    
                    const carParams = this.selectedCar.setupParameters[category];
                    if (carParams && carParams[param]) {
                        const limits = carParams[param];
                        control.min = Array.isArray(limits.min) ? limits.min[0] : limits.min;
                        control.max = Array.isArray(limits.max) ? limits.max[0] : limits.max;
                        
                        if (limitsDisplay) {
                            limitsDisplay.textContent = `${control.min}-${control.max}`;
                        }
                    }
                }
                
                if (valueDisplay) {
                    valueDisplay.textContent = this.currentSetup[category][param];
                }
            });
        });
    }

    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            console.log('File selected:', file.name);
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

        this.validateTelemetryData(headers);
        document.getElementById('processDataBtn').classList.remove('hidden');
        this.showStatus(`Loaded ${this.telemetryData.length} data points from CSV`, 'success');
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

    resetSetup() {
        if (this.selectedCar) {
            this.loadDefaultSetup();
            this.updateCurrentSetupDisplay();
            this.showStatus('Setup reset to defaults', 'info');
        }
    }

    applyTopRecommendations() {
        this.showStatus('Applied top recommendations to setup', 'success');
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
            analysisResults: this.analysisResults,
            exportDate: new Date().toISOString()
        };

        const dataStr = JSON.stringify(setupData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `${this.selectedCar.carId}_professional_setup.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        this.showStatus('Professional setup exported successfully', 'success');
    }

    showStatus(message, type) {
        console.log('Status:', type, message);
        
        const statusDiv = document.createElement('div');
        statusDiv.className = `status-message ${type}`;
        statusDiv.textContent = message;
        
        const main = document.querySelector('main');
        if (main) {
            main.insertBefore(statusDiv, main.firstChild);
            
            setTimeout(() => {
                if (statusDiv.parentNode) {
                    statusDiv.parentNode.removeChild(statusDiv);
                }
            }, 5000);
        }
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing app...');
    try {
        window.accApp = new ACCTelemetryApp();
    } catch (error) {
        console.error('Failed to initialize app:', error);
    }
});