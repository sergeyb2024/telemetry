
# Advanced Telemetry Analysis Formulas for ACC

## 1. Enhanced USOS (Understeer-Oversteer-Slip) Channel
Based on professional motorsport methodology:

```python
def calculate_enhanced_usos(data, wheelbase=2.665):
    usos_values = []
    for i in range(len(data)):
        speed = data[i]['SPEED'] * 0.277778  # Convert km/h to m/s
        lateral_g = data[i]['G_LAT']
        steer_angle = data[i]['STEERANGLE']

        # Only calculate for meaningful corners (|lateral_g| > 0.3)
        if abs(lateral_g) > 0.3:
            # Calculate turn radius
            radius = (speed * speed) / (abs(lateral_g) * 9.81)

            # Kinematic steering angle (Ackermann)
            kinematic_steer = (wheelbase / radius) * 57.295779513  # Convert to degrees

            # USOS calculation
            usos = steer_angle - kinematic_steer

            # Apply lateral G weighting and sign correction
            usos_weighted = usos * (lateral_g / abs(lateral_g)) * abs(lateral_g)
            usos_values.append(usos_weighted)
        else:
            usos_values.append(0)

    return usos_values
```

## 2. Wheel Slip Ratio Analysis
Critical for traction analysis:

```python
def calculate_slip_ratios(data):
    slip_ratios = {'FL': [], 'FR': [], 'RL': [], 'RR': []}

    for i in range(len(data)):
        vehicle_speed = data[i]['SPEED'] * 0.277778  # m/s

        # Calculate slip ratio for each wheel
        for wheel in ['FL', 'FR', 'RL', 'RR']:
            wheel_speed = data[i][f'WHEEL_SPEED_{wheel}']

            if vehicle_speed > 5:  # Avoid division by zero
                slip_ratio = (wheel_speed - vehicle_speed) / vehicle_speed
                slip_ratios[wheel].append(slip_ratio)
            else:
                slip_ratios[wheel].append(0)

    return slip_ratios
```

## 3. Yaw Rate Analysis
Compare expected vs actual yaw rate:

```python
def analyze_yaw_response(data, wheelbase=2.665):
    yaw_analysis = []

    for i in range(len(data)):
        speed = data[i]['SPEED'] * 0.277778
        lateral_g = data[i]['G_LAT']
        actual_yaw = data[i]['ROTY']

        if abs(lateral_g) > 0.2 and speed > 20:
            # Expected yaw rate
            expected_yaw = (speed * lateral_g * 9.81) / (speed * speed)
            expected_yaw = math.degrees(expected_yaw)

            # Yaw rate deficit/excess
            yaw_deficit = actual_yaw - expected_yaw
            yaw_analysis.append({
                'expected': expected_yaw,
                'actual': actual_yaw,
                'deficit': yaw_deficit
            })
        else:
            yaw_analysis.append({'expected': 0, 'actual': 0, 'deficit': 0})

    return yaw_analysis
```

## 4. Corner Detection and Classification
Identify different corner phases:

```python
def detect_corners(data):
    corners = []
    in_corner = False
    corner_start = 0

    for i in range(len(data)):
        lateral_g = abs(data[i]['G_LAT'])

        if not in_corner and lateral_g > 0.5:
            # Corner entry detected
            in_corner = True
            corner_start = i
        elif in_corner and lateral_g < 0.3:
            # Corner exit detected
            corner_data = data[corner_start:i]
            corner_analysis = analyze_corner_phase(corner_data)
            corners.append(corner_analysis)
            in_corner = False

    return corners

def analyze_corner_phase(corner_data):
    max_g_index = max(range(len(corner_data)), key=lambda i: abs(corner_data[i]['G_LAT']))

    entry = corner_data[:max_g_index]
    apex = corner_data[max_g_index-2:max_g_index+3] if max_g_index > 2 else [corner_data[max_g_index]]
    exit = corner_data[max_g_index:]

    return {
        'entry': analyze_phase_balance(entry),
        'apex': analyze_phase_balance(apex),
        'exit': analyze_phase_balance(exit)
    }
```

## 5. Balance Analysis
Determine handling characteristics per corner phase:

```python
def analyze_phase_balance(phase_data):
    if not phase_data:
        return {'balance': 'neutral', 'severity': 0}

    avg_usos = sum(d.get('usos', 0) for d in phase_data) / len(phase_data)
    avg_yaw_deficit = sum(d.get('yaw_deficit', 0) for d in phase_data) / len(phase_data)

    # Determine balance based on multiple factors
    if avg_usos > 2.0:
        return {'balance': 'understeer', 'severity': min(avg_usos / 5.0, 1.0)}
    elif avg_usos < -1.0:
        return {'balance': 'oversteer', 'severity': min(abs(avg_usos) / 3.0, 1.0)}
    else:
        return {'balance': 'neutral', 'severity': 0}
```



# Intelligent Setup Recommendation System

## 8 Setup Categories with Smart Adjustments

### 1. Aerodynamics Group
def recommend_aero_changes(analysis, current_setup, car_params):
    recommendations = []

    # Front aero (splitter/wing) adjustments
    if analysis['front_understeer'] > 0.3:
        splitter_current = current_setup.get('splitter', car_params['aero']['splitter']['default'])
        if splitter_current > car_params['aero']['splitter']['min']:
            recommendations.append({
                'parameter': 'splitter',
                'change': -1,
                'confidence': 0.8,
                'reason': 'Reduce front downforce to decrease understeer'
            })

    # Rear aero adjustments
    if analysis['rear_oversteer'] > 0.3:
        wing_current = current_setup.get('wing', car_params['aero']['wing']['default'])
        if wing_current < car_params['aero']['wing']['max']:
            recommendations.append({
                'parameter': 'wing',
                'change': +1,
                'confidence': 0.8,
                'reason': 'Increase rear wing for stability'
            })

    # Alternative recommendations
    if len(recommendations) == 0 and analysis['overall_balance'] != 'neutral':
        # Offer ride height adjustments as alternative
        recommendations.append({
            'parameter': 'rideHeight_front',
            'change': -2 if analysis['front_understeer'] > 0 else +2,
            'confidence': 0.6,
            'reason': 'Adjust front ride height to alter aero balance'
        })

    return recommendations

### 2. Suspension Group (ARBs and Springs)
def recommend_suspension_changes(analysis, current_setup, car_params):
    recommendations = []

    # Anti-roll bar recommendations
    if analysis['corner_entry_understeer'] > 0.4:
        arb_front = current_setup.get('ARBFront', car_params['mechanicalGrip']['ARBFront']['default'])
        if arb_front > car_params['mechanicalGrip']['ARBFront']['min'] + 2:
            recommendations.append({
                'parameter': 'ARBFront',
                'change': -2,
                'confidence': 0.9,
                'reason': 'Soften front ARB to increase front grip in corner entry'
            })

    # Alternative: Spring rate adjustments
    if len([r for r in recommendations if 'ARB' in r['parameter']]) == 0:
        recommendations.append({
            'parameter': 'wheelRate_front',
            'change': -10,
            'confidence': 0.7,
            'reason': 'Reduce front spring rates for better compliance'
        })

    return recommendations

### 3. Electronics Group (TC, ABS, Brake Bias)
def recommend_electronics_changes(analysis, current_setup, car_params):
    recommendations = []

    # Traction control based on wheel slip analysis
    if analysis['rear_wheel_slip'] > 0.15:  # 15% slip threshold
        tc2_current = current_setup.get('tC2', car_params['electronics']['tC2']['default'])
        if tc2_current < car_params['electronics']['tC2']['max'] - 2:
            recommendations.append({
                'parameter': 'tC2',
                'change': +2,
                'confidence': 0.85,
                'reason': 'Increase TC2 for better rear traction control'
            })

    # ABS recommendations based on lock-up analysis
    if analysis['front_lockup_frequency'] > 0.1:
        abs_current = current_setup.get('abs', car_params['electronics']['abs']['default'])
        if abs_current < car_params['electronics']['abs']['max'] - 1:
            recommendations.append({
                'parameter': 'abs',
                'change': +1,
                'confidence': 0.8,
                'reason': 'Increase ABS to prevent front wheel lock-up'
            })

    return recommendations

### 4. Tire Pressure Group
def recommend_tire_pressure_changes(analysis, current_setup, car_params):
    recommendations = []

    # Front pressure adjustments
    if analysis['front_understeer'] > 0.3:
        pressure_fl = current_setup.get('pressureLF', car_params['tyres']['pressureLF']['default'])
        if pressure_fl > car_params['tyres']['pressureLF']['min'] + 1.0:
            recommendations.append({
                'parameter': 'pressureLF',
                'change': -0.5,
                'confidence': 0.7,
                'reason': 'Lower front tire pressure for larger contact patch'
            })

    # Rear pressure adjustments
    if analysis['rear_oversteer'] > 0.3:
        pressure_rl = current_setup.get('pressureLR', car_params['tyres']['pressureLR']['default'])
        if pressure_rl > car_params['tyres']['pressureLR']['min'] + 1.0:
            recommendations.append({
                'parameter': 'pressureLR',
                'change': -0.5,
                'confidence': 0.7,
                'reason': 'Lower rear tire pressure for better rear grip'
            })

    return recommendations

### 5. Alignment Group (Toe, Camber, Caster)
def recommend_alignment_changes(analysis, current_setup, car_params):
    recommendations = []

    # Toe adjustments for stability
    if analysis['straight_line_instability'] > 0.2:
        recommendations.append({
            'parameter': 'toe_front',
            'change': +0.05,  # Add toe-in
            'confidence': 0.6,
            'reason': 'Add front toe-in for straight-line stability'
        })

    # Camber optimization
    if analysis['tire_wear_imbalance'] > 0.3:
        recommendations.append({
            'parameter': 'camber_front',
            'change': -0.2,
            'confidence': 0.5,
            'reason': 'Adjust front camber for better tire contact'
        })

    return recommendations

### 6. Damper Group (Compression/Rebound)
def recommend_damper_changes(analysis, current_setup, car_params):
    recommendations = []

    # Damper adjustments for corner entry
    if analysis['corner_entry_instability'] > 0.3:
        recommendations.append({
            'parameter': 'bumpSlow_front',
            'change': +3,
            'confidence': 0.6,
            'reason': 'Increase front bump damping for corner entry stability'
        })

    # Alternative damper strategy
    if analysis['corner_exit_traction'] < 0.7:
        recommendations.append({
            'parameter': 'reboundSlow_rear',
            'change': -2,
            'confidence': 0.6,
            'reason': 'Reduce rear rebound for better traction on exit'
        })

    return recommendations

### 7. Differential Group
def recommend_differential_changes(analysis, current_setup, car_params):
    recommendations = []

    if analysis['corner_exit_oversteer'] > 0.3:
        preload_current = current_setup.get('preload', car_params['mechanicalGrip']['preload']['default'])
        if preload_current < car_params['mechanicalGrip']['preload']['max'] - 20:
            recommendations.append({
                'parameter': 'preload',
                'change': +10,
                'confidence': 0.7,
                'reason': 'Increase differential preload for better corner exit stability'
            })

    return recommendations

### 8. Brake System Group
def recommend_brake_changes(analysis, current_setup, car_params):
    recommendations = []

    # Brake bias adjustments
    if analysis['front_brake_lockup'] > analysis['rear_brake_lockup'] + 0.2:
        bias_current = current_setup.get('brakeBias', car_params['electronics']['brakeBias']['default'])
        if bias_current > car_params['electronics']['brakeBias']['min'] + 2:
            recommendations.append({
                'parameter': 'brakeBias',
                'change': -2,
                'confidence': 0.8,
                'reason': 'Move brake bias rearward to balance braking'
            })

    return recommendations
