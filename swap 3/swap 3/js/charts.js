/* ==========================================================================
   HABITLY — Charts & Calendar Heatmap Engine
   Chart.js for activity graphs + dynamic monthly calendar
   ========================================================================== */

const HabitlyCharts = (() => {
  let chartInstance = null;
  let currentChartType = 'completion';
  let currentMonth, currentYear;

  function initCalendar() {
    const now = new Date();
    currentMonth = now.getMonth();
    currentYear = now.getFullYear();
    renderCalendar();

    const prevBtn = document.getElementById('prevMonthBtn');
    const nextBtn = document.getElementById('nextMonthBtn');
    if (prevBtn) prevBtn.addEventListener('click', () => { currentMonth--; if (currentMonth < 0) { currentMonth = 11; currentYear--; } renderCalendar(); HabitlyAudio.playClick(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { currentMonth++; if (currentMonth > 11) { currentMonth = 0; currentYear++; } renderCalendar(); HabitlyAudio.playClick(); });
  }

  function renderCalendar() {
    const label = document.getElementById('currentMonthYearLabel');
    const grid = document.getElementById('calendarDaysGrid');
    if (!label || !grid) return;

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    label.textContent = `${months[currentMonth]} ${currentYear}`;

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const today = new Date();

    grid.innerHTML = '';

    // Generate calendar heat data
    const heatData = {};
    for (let d = 1; d <= daysInMonth; d++) {
      heatData[d] = Math.floor(Math.random() * 5); // 0-4 intensity
    }

    // Empty cells for offset
    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement('div');
      empty.className = 'calendar-day empty';
      grid.appendChild(empty);
    }

    // Day cells
    for (let d = 1; d <= daysInMonth; d++) {
      const dayEl = document.createElement('div');
      dayEl.className = 'calendar-day';
      dayEl.textContent = d;

      const heat = heatData[d] || 0;
      if (heat > 0) dayEl.classList.add(`heat-${heat}`);
      if (d === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
        dayEl.classList.add('today');
      }

      dayEl.addEventListener('click', () => {
        HabitlyAudio.playClick();
        grid.querySelectorAll('.calendar-day').forEach(el => el.style.outline = '');
        dayEl.style.outline = '2px solid var(--chartreuse-primary)';
      });

      grid.appendChild(dayEl);
    }
  }

  function initChart(historyData) {
    const canvas = document.getElementById('activityChartCanvas');
    if (!canvas || typeof Chart === 'undefined') return;

    const ctx = canvas.getContext('2d');
    renderChart(ctx, historyData, 'completion');

    // Toggle buttons
    document.querySelectorAll('.graph-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.graph-toggle-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentChartType = btn.dataset.chart;
        renderChart(ctx, historyData, currentChartType);
        HabitlyAudio.playClick();
      });
    });
  }

  function renderChart(ctx, data, type) {
    if (chartInstance) chartInstance.destroy();

    const labels = data.map(d => d.day);
    const values = data.map(d => type === 'completion' ? d.completion : d.points);
    const label = type === 'completion' ? 'Completion %' : 'Points Won';

    const gradient = ctx.createLinearGradient(0, 0, 0, 220);
    gradient.addColorStop(0, 'rgba(124, 58, 237, 0.35)');
    gradient.addColorStop(1, 'rgba(124, 58, 237, 0)');

    chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label,
          data: values,
          borderColor: '#d4ff00',
          backgroundColor: gradient,
          borderWidth: 2.5,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#d4ff00',
          pointBorderColor: '#0f0c1a',
          pointBorderWidth: 2,
          pointRadius: 5,
          pointHoverRadius: 8,
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#d4ff00',
          pointHoverBorderWidth: 3,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#110e1c',
            titleColor: '#d4ff00',
            bodyColor: '#f0eef5',
            borderColor: 'rgba(124, 58, 237, 0.3)',
            borderWidth: 1,
            padding: 10,
            cornerRadius: 4,
            titleFont: { family: "'JetBrains Mono'", weight: '700', size: 12 },
            bodyFont: { family: "'Inter'", size: 12 },
          },
        },
        scales: {
          x: {
            grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
            ticks: { color: '#5a5278', font: { family: "'JetBrains Mono'", size: 11, weight: '600' } },
          },
          y: {
            grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
            ticks: { color: '#5a5278', font: { family: "'JetBrains Mono'", size: 11 } },
            beginAtZero: true,
            suggestedMax: type === 'completion' ? 100 : undefined,
          },
        },
        interaction: { intersect: false, mode: 'index' },
        animation: { duration: 800, easing: 'easeOutQuart' },
      },
    });
  }

  function updateChart(historyData) {
    const canvas = document.getElementById('activityChartCanvas');
    if (!canvas || typeof Chart === 'undefined') return;
    const ctx = canvas.getContext('2d');
    renderChart(ctx, historyData, currentChartType);
  }

  return { initCalendar, initChart, renderCalendar, updateChart };
})();
