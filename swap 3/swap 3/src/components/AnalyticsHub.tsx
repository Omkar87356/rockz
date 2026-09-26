import React, { useEffect, useRef } from 'react';
import { useHabitly } from '../context/HabitlyContext';

export const AnalyticsHub: React.FC = () => {
  const { habits, user } = useHabitly();
  const chartCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Generate 7-day labels & completion rates
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
      date: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      percentage: Math.min(100, Math.floor(65 + Math.sin(i * 1.5) * 25 + (i === 6 ? 15 : 0))),
    };
  });

  // Render HTML5 Canvas Line Chart
  useEffect(() => {
    const canvas = chartCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high DPI scale
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const padding = { top: 30, right: 30, bottom: 40, left: 45 };

    ctx.clearRect(0, 0, width, height);

    // Draw grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.lineWidth = 1;

    for (let p = 0; p <= 100; p += 25) {
      const y = padding.top + ((100 - p) / 100) * (height - padding.top - padding.bottom);
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      // Label
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`${p}%`, padding.left - 8, y + 3);
    }

    // Points calculation
    const points = last7Days.map((item, idx) => {
      const x = padding.left + (idx / (last7Days.length - 1)) * (width - padding.left - padding.right);
      const y = padding.top + ((100 - item.percentage) / 100) * (height - padding.top - padding.bottom);
      return { x, y, ...item };
    });

    // Draw gradient fill
    const fillGradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
    fillGradient.addColorStop(0, 'rgba(212, 255, 0, 0.28)');
    fillGradient.addColorStop(1, 'rgba(212, 255, 0, 0.0)');

    ctx.beginPath();
    ctx.moveTo(points[0].x, height - padding.bottom);
    points.forEach((pt, i) => {
      if (i === 0) ctx.lineTo(pt.x, pt.y);
      else {
        const prev = points[i - 1];
        const cx = (prev.x + pt.x) / 2;
        ctx.bezierCurveTo(cx, prev.y, cx, pt.y, pt.x, pt.y);
      }
    });
    ctx.lineTo(points[points.length - 1].x, height - padding.bottom);
    ctx.closePath();
    ctx.fillStyle = fillGradient;
    ctx.fill();

    // Draw Stroke
    ctx.beginPath();
    points.forEach((pt, i) => {
      if (i === 0) ctx.moveTo(pt.x, pt.y);
      else {
        const prev = points[i - 1];
        const cx = (prev.x + pt.x) / 2;
        ctx.bezierCurveTo(cx, prev.y, cx, pt.y, pt.x, pt.y);
      }
    });
    ctx.strokeStyle = '#D4FF00';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#D4FF00';
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Draw Points & X Labels
    points.forEach((pt) => {
      // Circle
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#06040A';
      ctx.fill();
      ctx.strokeStyle = '#00F59B';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Day Label
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.font = '11px Outfit, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(pt.dayName, pt.x, height - 12);
    });
  }, [habits]);

  // Generate 28-day Heatmap Matrix
  const heatmapDays = Array.from({ length: 28 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (27 - i));
    const intensity = Math.floor(Math.abs(Math.sin(i * 1.8 + 0.5)) * 4); // 0 to 3
    return {
      dateStr: d.toISOString().split('T')[0],
      dayNumber: d.getDate(),
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      intensity,
    };
  });

  return (
    <section id="analytics" className="dashboard-section section-analytics-hub">
      <div className="section-header-row">
        <div>
          <div className="section-eyebrow">TELEMETRY & HEATMAPS</div>
          <h2 className="section-main-title">Analytics & Consistency Matrix</h2>
          <p className="section-subtitle">
            Visualize your compounding trajectory with 7-day velocity curves and a 4-week activity heatmap.
          </p>
        </div>
        <div className="analytics-score-pill">
          <span className="score-title">CONSISTENCY INDEX</span>
          <span className="score-val highlight-chartreuse">92.4%</span>
        </div>
      </div>

      <div className="analytics-grid">
        {/* 7-Day Trend Canvas Chart */}
        <div className="glass-card chart-card">
          <div className="card-top-tag-row">
            <span className="card-top-tag">7-DAY COMPLETION VELOCITY</span>
            <span className="card-top-hint text-chartreuse">↑ 14% vs Last Week</span>
          </div>

          <div className="canvas-wrapper">
            <canvas ref={chartCanvasRef} className="analytics-canvas" />
          </div>
        </div>

        {/* 28-Day Heatmap Contribution Matrix */}
        <div className="glass-card heatmap-card">
          <div className="card-top-tag-row">
            <span className="card-top-tag">4-WEEK CONTRIBUTION HEATMAP</span>
            <div className="heatmap-legend">
              <span className="legend-label">Less</span>
              <span className="legend-box level-0" />
              <span className="legend-box level-1" />
              <span className="legend-box level-2" />
              <span className="legend-box level-3" />
              <span className="legend-label">More</span>
            </div>
          </div>

          <div className="heatmap-grid-matrix">
            {heatmapDays.map((d, idx) => (
              <div
                key={idx}
                className={`heatmap-cell cell-level-${d.intensity}`}
                title={`${d.dateStr} (${d.dayName}): Level ${d.intensity} activity`}
              >
                <span className="cell-date-num">{d.dayNumber}</span>
              </div>
            ))}
          </div>

          <div className="heatmap-footer-stats">
            <div className="h-stat">
              <span className="h-stat-label">Active Habits Logged</span>
              <span className="h-stat-num">{user.totalHabitsCompleted}</span>
            </div>
            <div className="h-stat">
              <span className="h-stat-label">Longest Continuous Run</span>
              <span className="h-stat-num text-chartreuse">{user.bestStreak} Days</span>
            </div>
            <div className="h-stat">
              <span className="h-stat-label">Current Streak Armor</span>
              <span className="h-stat-num text-cyan">{user.streakShields} Shields</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
