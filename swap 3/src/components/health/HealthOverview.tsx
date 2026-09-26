import React, { useState, useMemo } from 'react';
import { useHealth } from '../../context/HealthContext';
import { kgToLb, cmToFtIn, litersToOz, cmToIn } from '../../utils/healthCalculations';

type ChartMetric = 'weight' | 'heart_rate' | 'blood_pressure' | 'sleep' | 'steps' | 'water' | 'body_fat' | 'waist';
type TimeRange = 7 | 14 | 30;

export const HealthOverview: React.FC = () => {
  const {
    profile,
    checkIns,
    metrics,
    unitPreferences,
    setIsCheckInModalOpen,
    setIsProfileModalOpen,
    setActiveHealthTab,
  } = useHealth();

  const [selectedMetric, setSelectedMetric] = useState<ChartMetric>('weight');
  const [selectedRange, setSelectedRange] = useState<TimeRange>(14);
  const [hoveredPoint, setHoveredPoint] = useState<{
    date: string;
    value: string;
    secondaryValue?: string;
    x: number;
    y: number;
  } | null>(null);

  // Unit conversions
  const isLb = unitPreferences.weight === 'lb';
  const isOz = unitPreferences.water === 'oz';
  const isFtIn = unitPreferences.height === 'ft_in';
  const isInch = unitPreferences.waist === 'in';

  const displayWeight = isLb ? `${kgToLb(profile.weightKg)} lb` : `${profile.weightKg} kg`;
  const displayTargetWeight = isLb
    ? `${kgToLb(profile.targetWeightKg)} lb`
    : `${profile.targetWeightKg} kg`;

  const weightDeltaKg = Math.round((profile.weightKg - profile.targetWeightKg) * 10) / 10;
  const displayWeightDelta = isLb
    ? `${Math.abs(kgToLb(weightDeltaKg))} lb`
    : `${Math.abs(weightDeltaKg)} kg`;

  const displayHeight = isFtIn
    ? cmToFtIn(profile.heightCm).label
    : `${profile.heightCm} cm`;

  const displayWaist = profile.waistCm
    ? isInch
      ? `${cmToIn(profile.waistCm)} in`
      : `${profile.waistCm} cm`
    : 'Not Recorded';

  const displayWaterTarget = isOz
    ? `${litersToOz(metrics.waterTargetLiters)} oz`
    : `${metrics.waterTargetLiters} L`;

  // Latest check-in data
  const sortedCheckIns = useMemo(() => {
    return [...checkIns].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [checkIns]);

  const latestCheckIn = sortedCheckIns[sortedCheckIns.length - 1];

  const todaySteps = latestCheckIn ? latestCheckIn.steps : 0;
  const todaySleep = latestCheckIn ? latestCheckIn.sleepHours : profile.sleepTargetHours;
  const todayWater = latestCheckIn ? latestCheckIn.waterLiters : 0;
  const displayTodayWater = isOz ? `${litersToOz(todayWater)} oz` : `${todayWater} L`;

  // Filtered dataset for charts
  const chartData = useMemo(() => {
    const sliceCount = Math.min(selectedRange, sortedCheckIns.length);
    const data = sortedCheckIns.slice(-sliceCount);

    return data.map((item) => {
      let val1 = 0;
      let val2: number | undefined = undefined;
      let displayVal = '';

      switch (selectedMetric) {
        case 'weight':
          val1 = isLb ? kgToLb(item.weightKg) : item.weightKg;
          displayVal = `${val1} ${unitPreferences.weight}`;
          break;
        case 'heart_rate':
          val1 = item.restingHeartRateBpm || profile.restingHeartRateBpm || 65;
          displayVal = `${val1} BPM`;
          break;
        case 'blood_pressure':
          val1 = item.bloodPressureSystolic || profile.bloodPressureSystolic || 120;
          val2 = item.bloodPressureDiastolic || profile.bloodPressureDiastolic || 80;
          displayVal = `${val1}/${val2} mmHg`;
          break;
        case 'sleep':
          val1 = item.sleepHours;
          displayVal = `${val1} hrs`;
          break;
        case 'steps':
          val1 = item.steps;
          displayVal = `${val1.toLocaleString()} steps`;
          break;
        case 'water':
          val1 = isOz ? litersToOz(item.waterLiters) : item.waterLiters;
          displayVal = `${val1} ${unitPreferences.water}`;
          break;
        case 'body_fat':
          val1 = profile.bodyFatPercentage || 18.0;
          displayVal = `${val1}%`;
          break;
        case 'waist':
          val1 = profile.waistCm
            ? isInch
              ? cmToIn(profile.waistCm)
              : profile.waistCm
            : 80;
          displayVal = `${val1} ${unitPreferences.waist}`;
          break;
      }

      return {
        date: item.date,
        formattedDate: new Date(item.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        value: val1,
        secondaryValue: val2,
        display: displayVal,
      };
    });
  }, [sortedCheckIns, selectedRange, selectedMetric, isLb, isOz, isInch, unitPreferences, profile]);

  // Compute SVG dimensions and path points
  const { pathD, areaD, points, secondaryPoints, yMin, yMax } = useMemo(() => {
    if (chartData.length === 0) {
      return { pathD: '', areaD: '', points: [], secondaryPoints: [], yMin: 0, yMax: 100 };
    }

    const values = chartData.map((d) => d.value);
    if (selectedMetric === 'blood_pressure') {
      chartData.forEach((d) => {
        if (d.secondaryValue !== undefined) values.push(d.secondaryValue);
      });
    }

    let min = Math.min(...values);
    let max = Math.max(...values);
    if (min === max) {
      min = min * 0.9;
      max = max * 1.1;
    }
    const pad = (max - min) * 0.15 || 5;
    const yMinCalc = Math.floor(min - pad);
    const yMaxCalc = Math.ceil(max + pad);

    const width = 600;
    const height = 180;
    const margin = { top: 15, right: 25, bottom: 25, left: 35 };
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    const getX = (index: number) => {
      if (chartData.length === 1) return margin.left + innerW / 2;
      return margin.left + (index / (chartData.length - 1)) * innerW;
    };

    const getY = (val: number) => {
      const pct = (val - yMinCalc) / (yMaxCalc - yMinCalc);
      return margin.top + innerH - pct * innerH;
    };

    const pts = chartData.map((d, i) => ({
      x: getX(i),
      y: getY(d.value),
      date: d.formattedDate,
      display: d.display,
    }));

    const secPts =
      selectedMetric === 'blood_pressure'
        ? chartData.map((d, i) => ({
            x: getX(i),
            y: getY(d.secondaryValue || 80),
            date: d.formattedDate,
            display: `${d.secondaryValue} mmHg (Diastolic)`,
          }))
        : [];

    let pD = '';
    pts.forEach((p, i) => {
      if (i === 0) pD += `M ${p.x} ${p.y}`;
      else {
        const prev = pts[i - 1];
        const cx1 = prev.x + (p.x - prev.x) / 2;
        const cy1 = prev.y;
        const cx2 = prev.x + (p.x - prev.x) / 2;
        const cy2 = p.y;
        pD += ` C ${cx1} ${cy1}, ${cx2} ${cy2}, ${p.x} ${p.y}`;
      }
    });

    const aD =
      pts.length > 0
        ? `${pD} L ${pts[pts.length - 1].x} ${margin.top + innerH} L ${pts[0].x} ${margin.top + innerH} Z`
        : '';

    return {
      pathD: pD,
      areaD: aD,
      points: pts,
      secondaryPoints: secPts,
      yMin: yMinCalc,
      yMax: yMaxCalc,
    };
  }, [chartData, selectedMetric]);

  return (
    <div className="health-overview-container">
      {/* Quick Action Bar */}
      <div className="health-quick-bar">
        <div className="quick-bar-left">
          <span className="live-pulse-badge">
            <span className="pulse-emerald-dot" />
            BIO-TELEMETRY ACTIVE
          </span>
          <span className="sync-timestamp">
            Last Synced: {new Date(profile.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <div className="quick-bar-actions">
          <button
            className="btn-health-action btn-log-checkin"
            onClick={() => setIsCheckInModalOpen(true)}
            id="btn-quick-checkin"
          >
            <span className="action-icon">⚡</span>
            <span>+ Daily Check-In</span>
          </button>
          <button
            className="btn-health-action btn-edit-profile"
            onClick={() => setIsProfileModalOpen(true)}
            id="btn-edit-health-profile"
          >
            <span className="action-icon">⚙️</span>
            <span>Edit Profile</span>
          </button>
          <button
            className="btn-health-action btn-goto-plan"
            onClick={() => setActiveHealthTab('plan')}
            id="btn-quick-view-plan"
          >
            <span className="action-icon">📋</span>
            <span>View Plan</span>
          </button>
          <button
            className="btn-health-action btn-goto-chat"
            onClick={() => setActiveHealthTab('chat')}
            id="btn-quick-ask-ai"
          >
            <span className="action-icon">🤖</span>
            <span>Ask AI</span>
          </button>
        </div>
      </div>

      {/* Primary Vital Stats Grid */}
      <div className="health-vitals-grid">
        {/* Card 1: Weight Progress */}
        <div className="health-card system-window">
          <div className="health-card-header">
            <span className="card-label">CURRENT WEIGHT</span>
            <span className="card-badge goal-pill">GOAL: {displayTargetWeight}</span>
          </div>
          <div className="card-primary-value">
            {displayWeight}
            <span className="card-sub-value">
              {weightDeltaKg === 0
                ? 'Target Met!'
                : `${displayWeightDelta} ${profile.weightKg > profile.targetWeightKg ? 'to lose' : 'to gain'}`}
            </span>
          </div>
          <div className="health-progress-bar">
            <div
              className="health-progress-fill cyan-glow"
              style={{
                width: `${Math.max(10, Math.min(100, Math.round((profile.targetWeightKg / profile.weightKg) * 100)))}%`,
              }}
            />
          </div>
          <div className="card-footer-meta">
            <span>Baseline: {profile.targetWeightKg} kg target</span>
            <span className="meta-highlight">Active Tracking</span>
          </div>
        </div>

        {/* Card 2: BMI & Height */}
        <div className="health-card system-window">
          <div className="health-card-header">
            <span className="card-label">CALCULATED BMI</span>
            <span className="card-badge" style={{ color: metrics.bmiColor, borderColor: metrics.bmiColor }}>
              {metrics.bmiCategory.toUpperCase()}
            </span>
          </div>
          <div className="card-primary-value" style={{ color: metrics.bmiColor }}>
            {metrics.bmi}
            <span className="card-sub-value">Height: {displayHeight}</span>
          </div>
          <div className="bmi-meter-track">
            <div
              className="bmi-meter-pointer"
              style={{
                left: `${Math.max(5, Math.min(95, ((metrics.bmi - 15) / (35 - 15)) * 100))}%`,
                borderColor: metrics.bmiColor,
              }}
            />
          </div>
          <div className="card-footer-meta">
            <span title="BMI is a screening tool, not a diagnostic measure of body composition.">
              ℹ️ Screening Metric Only
            </span>
            <span className="meta-highlight">BMR: ~{metrics.bmr} kcal</span>
          </div>
        </div>

        {/* Card 3: Resting Heart Rate */}
        <div className="health-card system-window">
          <div className="health-card-header">
            <span className="card-label">RESTING HEART RATE</span>
            <span
              className="card-badge"
              style={{ color: metrics.hrStatus.color, borderColor: metrics.hrStatus.color }}
            >
              {metrics.hrStatus.label}
            </span>
          </div>
          <div className="card-primary-value">
            <span className="heart-beat-icon">❤️</span> {profile.restingHeartRateBpm}
            <span className="card-unit">BPM</span>
          </div>
          <p className="card-health-tip">{metrics.hrStatus.advice}</p>
          <div className="card-footer-meta">
            <span>Optimal Range: 50-80 BPM</span>
            {metrics.hrStatus.isConcerning && (
              <span className="alert-flag">⚠️ Clinical Advisory</span>
            )}
          </div>
        </div>

        {/* Card 4: Blood Pressure */}
        <div className="health-card system-window">
          <div className="health-card-header">
            <span className="card-label">BLOOD PRESSURE</span>
            <span
              className="card-badge"
              style={{ color: metrics.bpStatus.color, borderColor: metrics.bpStatus.color }}
            >
              {metrics.bpStatus.label}
            </span>
          </div>
          <div className="card-primary-value">
            {profile.bloodPressureSystolic}/{profile.bloodPressureDiastolic}
            <span className="card-unit">mmHg</span>
          </div>
          <p className="card-health-tip">{metrics.bpStatus.advice}</p>
          <div className="card-footer-meta">
            <span>Target: &lt;120/80 mmHg</span>
            {metrics.bpStatus.isConcerning && (
              <span className="alert-flag">⚠️ Consult Physician</span>
            )}
          </div>
        </div>

        {/* Card 5: Body Fat & Waist */}
        <div className="health-card system-window">
          <div className="health-card-header">
            <span className="card-label">BODY COMPOSITION</span>
            <span className="card-badge purple-pill">MORPHOLOGY</span>
          </div>
          <div className="composition-split-row">
            <div className="split-item">
              <span className="split-label">Body Fat</span>
              <span className="split-val">
                {profile.bodyFatPercentage ? `${profile.bodyFatPercentage}%` : '—'}
              </span>
            </div>
            <div className="split-divider" />
            <div className="split-item">
              <span className="split-label">Waistline</span>
              <span className="split-val">{displayWaist}</span>
            </div>
          </div>
          <div className="card-footer-meta">
            <span>Method: Bio-Impedance / Tape</span>
            <span className="meta-highlight">Visceral Baseline</span>
          </div>
        </div>

        {/* Card 6: Daily Movement & Steps */}
        <div className="health-card system-window">
          <div className="health-card-header">
            <span className="card-label">DAILY STEPS</span>
            <span className="card-badge cyan-pill">
              TARGET: {profile.dailyStepTarget.toLocaleString()}
            </span>
          </div>
          <div className="card-primary-value">
            {todaySteps.toLocaleString()}
            <span className="card-unit">steps</span>
          </div>
          <div className="health-progress-bar">
            <div
              className="health-progress-fill emerald-glow"
              style={{
                width: `${Math.min(100, Math.round((todaySteps / profile.dailyStepTarget) * 100))}%`,
              }}
            />
          </div>
          <div className="card-footer-meta">
            <span>{Math.round((todaySteps / profile.dailyStepTarget) * 100)}% of Daily Cadence</span>
            <span className="meta-highlight">~{((todaySteps * 0.75) / 1000).toFixed(1)} km</span>
          </div>
        </div>

        {/* Card 7: Sleep & Circadian Sync */}
        <div className="health-card system-window">
          <div className="health-card-header">
            <span className="card-label">SLEEP RECOVERY</span>
            <span className="card-badge purple-pill">
              TARGET: {profile.sleepTargetHours}h
            </span>
          </div>
          <div className="card-primary-value">
            {todaySleep}
            <span className="card-unit">hours</span>
          </div>
          <div className="health-progress-bar">
            <div
              className="health-progress-fill violet-glow"
              style={{
                width: `${Math.min(100, Math.round((todaySleep / profile.sleepTargetHours) * 100))}%`,
              }}
            />
          </div>
          <div className="card-footer-meta">
            <span>Slow-Wave Restoration</span>
            <span className="meta-highlight">REM Optimization</span>
          </div>
        </div>

        {/* Card 8: Hydration & Fueling */}
        <div className="health-card system-window">
          <div className="health-card-header">
            <span className="card-label">HYDRATION STATUS</span>
            <span className="card-badge cyan-pill">TARGET: {displayWaterTarget}</span>
          </div>
          <div className="card-primary-value">
            {displayTodayWater}
            <span className="card-unit">today</span>
          </div>
          <div className="health-progress-bar">
            <div
              className="health-progress-fill cyan-glow"
              style={{
                width: `${Math.min(100, Math.round((todayWater / metrics.waterTargetLiters) * 100))}%`,
              }}
            />
          </div>
          <div className="card-footer-meta">
            <span>Cellular Fluid Equilibrium</span>
            <span className="meta-highlight">TDEE: {metrics.tdee} kcal</span>
          </div>
        </div>
      </div>

      {/* Interactive Telemetry Chart Section */}
      <div className="health-chart-wrapper system-window">
        <div className="chart-header-controls">
          <div className="chart-title-box">
            <h3 className="chart-section-title">
              <span className="title-icon">📈</span> BIOMETRIC TRAJECTORY MATRIX
            </h3>
            <span className="chart-subtitle">
              Interactive timeline visualizing fluctuations and trend telemetry
            </span>
          </div>

          <div className="chart-button-controls">
            {/* Metric Selector Pills */}
            <div className="metric-pill-group">
              {[
                { id: 'weight', label: 'Weight' },
                { id: 'heart_rate', label: 'Heart Rate' },
                { id: 'blood_pressure', label: 'Blood Pressure' },
                { id: 'sleep', label: 'Sleep' },
                { id: 'steps', label: 'Steps' },
                { id: 'water', label: 'Hydration' },
              ].map((m) => (
                <button
                  key={m.id}
                  className={`btn-metric-toggle ${selectedMetric === m.id ? 'active' : ''}`}
                  onClick={() => setSelectedMetric(m.id as ChartMetric)}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Range Selector Pills */}
            <div className="range-pill-group">
              {[7, 14, 30].map((days) => (
                <button
                  key={days}
                  className={`btn-range-toggle ${selectedRange === days ? 'active' : ''}`}
                  onClick={() => setSelectedRange(days as TimeRange)}
                >
                  {days}D
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* SVG Interactive Canvas */}
        <div className="chart-svg-container">
          <svg viewBox="0 0 600 180" className="health-metric-svg" preserveAspectRatio="none">
            <defs>
              <linearGradient id="cyberAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#00E5FF" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="cyberLineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00E5FF" />
                <stop offset="50%" stopColor="#00FF9C" />
                <stop offset="100%" stopColor="#7C3AED" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid Lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
              const yVal = 15 + (1 - pct) * 140;
              const labelVal = Math.round(yMin + pct * (yMax - yMin));
              return (
                <g key={idx}>
                  <line
                    x1="35"
                    y1={yVal}
                    x2="575"
                    y2={yVal}
                    stroke="rgba(120, 144, 168, 0.12)"
                    strokeDasharray="4 4"
                  />
                  <text
                    x="28"
                    y={yVal + 3}
                    textAnchor="end"
                    fill="#7890A8"
                    fontSize="9"
                    fontFamily="'JetBrains Mono', monospace"
                  >
                    {labelVal}
                  </text>
                </g>
              );
            })}

            {/* Area Fill */}
            {areaD && <path d={areaD} fill="url(#cyberAreaGradient)" />}

            {/* Main Metric Line */}
            {pathD && (
              <path
                d={pathD}
                fill="none"
                stroke="url(#cyberLineGradient)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Secondary Line for Diastolic BP */}
            {selectedMetric === 'blood_pressure' && secondaryPoints.length > 1 && (
              <path
                d={secondaryPoints.reduce(
                  (acc, p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`),
                  ''
                )}
                fill="none"
                stroke="#FF8400"
                strokeWidth="2"
                strokeDasharray="3 3"
              />
            )}

            {/* Interactive Data Points */}
            {points.map((p, i) => (
              <g key={i}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="4"
                  fill="#020611"
                  stroke="#00E5FF"
                  strokeWidth="2"
                  className="chart-data-circle"
                  onMouseEnter={() =>
                    setHoveredPoint({
                      date: p.date,
                      value: p.display,
                      x: p.x,
                      y: p.y,
                    })
                  }
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              </g>
            ))}
          </svg>

          {/* Dynamic Tooltip */}
          {hoveredPoint && (
            <div
              className="chart-hover-tooltip"
              style={{
                left: `${(hoveredPoint.x / 600) * 100}%`,
                top: `${(hoveredPoint.y / 180) * 100}%`,
              }}
            >
              <div className="tooltip-date">{hoveredPoint.date}</div>
              <div className="tooltip-val">{hoveredPoint.value}</div>
            </div>
          )}
        </div>

        {/* Chart Legend / Context */}
        <div className="chart-legend-row">
          <div className="legend-item">
            <span className="legend-dot cyan" />
            <span>Primary Metric ({selectedMetric.replace('_', ' ').toUpperCase()})</span>
          </div>
          {selectedMetric === 'blood_pressure' && (
            <div className="legend-item">
              <span className="legend-dot orange dashed" />
              <span>Diastolic Baseline</span>
            </div>
          )}
          <span className="legend-hint">
            Hover over telemetry nodes to inspect chronological records
          </span>
        </div>
      </div>

      {/* Prominent Clinical & Medical Disclaimer */}
      <div className="health-disclaimer-box system-window">
        <div className="disclaimer-icon-col">⚕️</div>
        <div className="disclaimer-content-col">
          <div className="disclaimer-title">IMPORTANT CLINICAL & WELLNESS NOTICE</div>
          <p className="disclaimer-text">
            Habitly Bio-Sync and its AI Assistant provide general fitness, training, and nutritional
            guidance for informational and self-optimization purposes only. They do not constitute
            medical advice, diagnosis, or treatment. Body Mass Index (BMI) and metabolic calculations
            are screening approximations. If you experience persistent concerning measurements
            (such as unusually high/low blood pressure, abnormal heart rates, or acute physical
            symptoms), please seek immediate evaluation from an appropriately qualified healthcare
            professional.
          </p>
        </div>
      </div>
    </div>
  );
};
