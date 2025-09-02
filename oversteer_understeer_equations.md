
# Mathematical Equations for Oversteer/Understeer Detection

## 1. Understeer Gradient (K)
The fundamental equation for vehicle dynamics analysis:

**δ = L/R + K × (V²/R)**

Where:
- δ = Steering angle (radians)
- L = Wheelbase (meters)
- R = Turn radius (meters) 
- K = Understeer gradient (rad⋅s²/m)
- V = Vehicle speed (m/s)

**Classification:**
- K > 0: Understeer (requires more steering input at higher speeds)
- K < 0: Oversteer (requires less steering input at higher speeds)
- K = 0: Neutral steer

## 2. Slip Angle Analysis
Compare front and rear slip angles:

**α_f = δ - (L_f/R) - (V²/(g⋅R))⋅(W_f/C_αf)**
**α_r = (L_r/R) + (V²/(g⋅R))⋅(W_r/C_αr)**

Where:
- α_f, α_r = Front and rear slip angles
- L_f, L_r = Distance from CG to front/rear axles
- W_f, W_r = Front and rear axle loads
- C_αf, C_αr = Front and rear cornering stiffness

**Analysis:**
- α_f > α_r: Understeer
- α_f < α_r: Oversteer

## 3. Yaw Rate Response
Expected vs. actual yaw rate comparison:

**ψ_expected = V/R**
**ψ_actual = measured yaw rate**

**Yaw Rate Gradient:**
**K_ψ = (ψ_expected - ψ_actual) / lateral_acceleration**

## 4. Lateral Acceleration Analysis
**a_lat_expected = V²/R**
**a_lat_actual = measured lateral acceleration**

**Lateral G Deficit:**
**ΔG = a_lat_expected - a_lat_actual**

## 5. Practical Implementation Formulas

### A. Understeer Angle (degrees)
**US_angle = steering_angle - (wheelbase/turn_radius) × 57.3**

### B. Normalized Understeer
**US_norm = US_angle × |lateral_g| × sign(lateral_g)**

### C. Cornering Performance Index  
**CPI = actual_lateral_g / theoretical_max_lateral_g**

Where theoretical_max = μ × g (μ ≈ 1.0-1.5 for racing tires)

## 6. Detection Thresholds
- **Significant Understeer:** US_angle > 2°
- **Significant Oversteer:** US_angle < -1°
- **Neutral:** -1° ≤ US_angle ≤ 2°

## 7. Corner Entry/Mid/Exit Analysis
Analyze behavior in different corner phases:
- **Entry:** Braking zone to turn-in
- **Mid:** Maximum lateral G
- **Exit:** Throttle application to straight
