/**
 * Lourdes Matha College Smart Canteen — Main Application Controller
 * Handles full state management, role authentication, cart checkout,
 * live countdown timers, QR code generation, Chart.js analytics, and real-time order sync.
 */

class SmartCanteenApp {
  constructor() {
    this.currentUser = null;
    this.cart = {}; // { foodId: qty }
    this.orders = [...CANTEEN_DATA.initialOrders];
    this.notifications = [...CANTEEN_DATA.notifications];
    this.currentRole = 'student';
    this.selectedPaymentMode = 'cash';
    this.isUpiPaid = false;

    // Active Timers
    this.departureSeconds = 155; // 2 min 35 sec
    this.prepSeconds = 455;      // 7 min 35 sec
    this.departureTimerInterval = null;
    this.prepTimerInterval = null;

    // Charts references
    this.charts = {};

    this.init();
  }

  init() {
    this.setupEventListeners();
    this.renderPublicMenu();
    this.renderDemoChips('student');
    this.startLiveClocks();
    this.startDepartureCountdown();
    this.startPrepCountdown();
  }

  /* -------------------------------------------------------------
     1. NAVIGATION & PAGE ROUTING
     ------------------------------------------------------------- */
  hideAllPages() {
    document.querySelectorAll('.page-view').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.portal-layout').forEach(p => p.classList.add('hidden'));
  }

  showLanding() {
    this.hideAllPages();
    document.getElementById('page-landing').classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  showPublicMenu() {
    this.hideAllPages();
    document.getElementById('page-public-menu').classList.add('active');
    this.renderPublicMenu();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  showLogin() {
    this.hideAllPages();
    document.getElementById('page-login').classList.add('active');
    this.selectRole(this.currentRole || 'student');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  quickDemoStudent() {
    const student = CANTEEN_DATA.users.find(u => u.role === 'student');
    this.loginSuccess(student);
  }

  /* -------------------------------------------------------------
     2. AUTHENTICATION & ROLE SELECTION (Section 2)
     ------------------------------------------------------------- */
  selectRole(role) {
    this.currentRole = role;
    document.querySelectorAll('.role-segment').forEach(b => b.classList.remove('active'));
    const btn = document.getElementById(`role-btn-${role}`);
    if (btn) btn.classList.add('active');

    const idLabel = document.getElementById('login-id-label');
    const idInput = document.getElementById('login-id');
    const pwdInput = document.getElementById('login-password');

    if (role === 'student') {
      idLabel.textContent = 'Student ID Number';
      idInput.placeholder = 'e.g. LM2026CS101';
    } else if (role === 'staff') {
      idLabel.textContent = 'Canteen Staff ID';
      idInput.placeholder = 'e.g. LMC-STAFF-04';
    } else {
      idLabel.textContent = 'Administrator ID';
      idInput.placeholder = 'e.g. LMC-ADMIN-01';
    }

    idInput.value = '';
    pwdInput.value = '';
    this.renderDemoChips(role);
  }

  renderDemoChips(role) {
    const container = document.getElementById('demo-chips-container');
    if (!container) return;
    const users = CANTEEN_DATA.users.filter(u => u.role === role);

    container.innerHTML = users.map(u => `
      <button type="button" class="demo-chip-btn" onclick="app.fillCredentials('${u.id}', '${u.password}')">
        <span><strong class="chip-role">${u.name}</strong> (${u.department})</span>
        <span>ID: <code>${u.id}</code> / Pass: <code>${u.password}</code></span>
      </button>
    `).join('');
  }

  fillCredentials(id, pass) {
    document.getElementById('login-id').value = id;
    document.getElementById('login-password').value = pass;
    document.getElementById('login-error-msg').classList.add('hidden');
  }

  handleLoginSubmit(event) {
    event.preventDefault();
    const id = document.getElementById('login-id').value.trim();
    const pass = document.getElementById('login-password').value.trim();
    const errBox = document.getElementById('login-error-msg');

    const matchedUser = CANTEEN_DATA.users.find(u => u.id.toLowerCase() === id.toLowerCase() && u.password === pass);

    if (matchedUser) {
      errBox.classList.add('hidden');
      this.loginSuccess(matchedUser);
    } else {
      errBox.textContent = 'Invalid credentials. Please click one of the demo quick-fill buttons above.';
      errBox.classList.remove('hidden');
    }
  }

  loginSuccess(user) {
    this.currentUser = user;
    this.hideAllPages();

    if (user.role === 'student') {
      const portal = document.getElementById('portal-student');
      portal.classList.remove('hidden');
      this.initStudentPortal();
      this.showStudentView('dashboard');
      this.showToast(`Welcome back, ${user.name}! Departure assigned at ${user.assignedDeparture}`, '🎓');
    } else if (user.role === 'staff') {
      const portal = document.getElementById('portal-staff');
      portal.classList.remove('hidden');
      this.initStaffPortal();
      this.showStaffView('dashboard');
      this.showToast(`Staff console active. Kitchen queue synced.`, '👨‍🍳');
    } else if (user.role === 'admin') {
      const portal = document.getElementById('portal-admin');
      portal.classList.remove('hidden');
      this.initAdminPortal();
      this.showAdminView('dashboard');
      this.showToast(`Executive dashboard loaded with campus analytics.`, '🛡️');
    }
  }

  logout() {
    this.currentUser = null;
    this.cart = {};
    this.hideAllPages();
    this.showLanding();
    this.showToast('You have safely signed out of the Smart Canteen system.', '🚪');
  }

  showForgotPassword() {
    alert("In this demo prototype, please use the quick-fill credentials: Student ID: LM2026CS101, Staff ID: LMC-STAFF-04, Admin ID: LMC-ADMIN-01 with passwords 'pass', 'staff', 'admin'.");
  }

  toggleSidebar(portalType) {
    const sidebar = document.getElementById(`${portalType}-sidebar`);
    if (sidebar) sidebar.classList.toggle('open');
  }

  /* -------------------------------------------------------------
     3. STUDENT PORTAL LOGIC & VIEWS
     ------------------------------------------------------------- */
  initStudentPortal() {
    if (!this.currentUser) return;
    const u = this.currentUser;

    // Header & sidebar details
    document.getElementById('student-header-name').textContent = u.name;
    document.getElementById('student-header-dept').textContent = `${u.department} • ${u.year}`;
    document.getElementById('student-side-name').textContent = u.name;
    document.getElementById('student-side-dept').textContent = u.departmentFull;
    document.getElementById('student-greeting-title').textContent = `Good Morning, ${u.name} 👋`;

    // Stagger Schedule details (Section 4 & 5)
    document.getElementById('disp-departure-time').textContent = u.assignedDeparture;
    document.getElementById('disp-arrival-time').textContent = u.assignedArrival;
    document.getElementById('countdown-instruction').textContent = `Classroom departure scheduled at ${u.assignedDeparture}. Walking time: 5 minutes.`;

    // Profile Tab details (Section 3)
    document.getElementById('prof-disp-name').textContent = u.name;
    document.getElementById('prof-disp-id').textContent = u.id;
    document.getElementById('prof-disp-dept-badge').textContent = u.department;
    document.getElementById('prof-disp-year').textContent = u.year;
    document.getElementById('prof-disp-class').textContent = u.class;

    document.getElementById('prof-val-name').textContent = u.name;
    document.getElementById('prof-val-id').textContent = u.id;
    document.getElementById('prof-val-dept').textContent = u.departmentFull;
    document.getElementById('prof-val-year').textContent = u.year;
    document.getElementById('prof-val-departure').textContent = u.assignedDeparture;
    document.getElementById('prof-val-arrival').textContent = u.assignedArrival;

    this.renderDeptSwitchButtons();
    this.renderStudentFoodGrid('all');
    this.renderStudentNotifications();
    this.renderStudentOrdersHistory();
    this.updateActiveOrderDisplay();
    this.renderDeptScheduleTable();
    this.renderStudentCrowdChart();
  }

  showStudentView(viewId) {
    document.querySelectorAll('.student-view-pane').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('#student-sidebar .sidebar-nav-item').forEach(b => b.classList.remove('active'));

    const pane = document.getElementById(`sview-${viewId}`);
    if (pane) pane.classList.add('active');

    const navBtn = document.getElementById(`snav-${viewId}`);
    if (navBtn) navBtn.classList.add('active');

    // Close mobile drawer if open
    const sidebar = document.getElementById('student-sidebar');
    if (sidebar) sidebar.classList.remove('open');

    if (viewId === 'cart') this.renderCart();
    if (viewId === 'canteen-status') this.renderStudentCrowdChart();
    if (viewId === 'orders') this.renderStudentOrdersHistory();
    if (viewId === 'notifications') {
      this.notifications.forEach(n => n.read = true);
      this.updateNotifBadges();
    }
    if (viewId === 'profile') this.renderProfileBarcode();

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* Department Switcher on Profile (Section 6) */
  renderDeptSwitchButtons() {
    const container = document.getElementById('dept-switch-buttons');
    if (!container) return;

    const isAdmin = this.currentUser && this.currentUser.role === 'admin';

    container.innerHTML = CANTEEN_DATA.departments.map(d => `
      <button class="btn btn-xs ${this.currentUser && this.currentUser.department === d.code ? 'btn-primary' : 'btn-outline'}" 
              ${isAdmin ? `onclick="app.switchDepartment('${d.code}')"` : 'disabled title="View only - Department departure timings can only be modified by administrators."'}
              style="${isAdmin ? '' : 'cursor: default; opacity: 0.95;'}">
        ${d.code} (${d.departureWindow})
      </button>
    `).join('');
  }

  switchDepartment(deptCode) {
    if (!this.currentUser || this.currentUser.role !== 'admin') {
      this.showToast('Access Denied: Only administrators can modify department departure timings.', '⛔');
      return;
    }

    const dept = CANTEEN_DATA.departments.find(d => d.code === deptCode);
    if (!dept) return;

    this.currentUser.department = dept.code;
    this.currentUser.departmentFull = dept.name;
    this.currentUser.assignedDeparture = dept.departureWindow;
    this.currentUser.assignedArrival = dept.expectedArrival;
    this.currentUser.group = dept.group;

    this.initStudentPortal();
    this.showToast(`Updated to ${dept.name}: Departure set to ${dept.departureWindow}`, '⏰');
  }

  /* -------------------------------------------------------------
     4. COUNTDOWN TIMERS (Sections 5 & 11)
     ------------------------------------------------------------- */
  startDepartureCountdown() {
    if (this.departureTimerInterval) clearInterval(this.departureTimerInterval);

    this.departureTimerInterval = setInterval(() => {
      if (this.departureSeconds > 0) {
        this.departureSeconds--;
        const mins = String(Math.floor(this.departureSeconds / 60)).padStart(2, '0');
        const secs = String(this.departureSeconds % 60).padStart(2, '0');
        const timerElem = document.getElementById('live-departure-countdown');
        if (timerElem) timerElem.textContent = `${mins}:${secs}`;
      } else {
        const timerElem = document.getElementById('live-departure-countdown');
        const statusElem = document.getElementById('countdown-status-text');
        const banner = document.getElementById('countdown-strip-container');
        if (timerElem) timerElem.textContent = "00:00";
        if (statusElem) statusElem.textContent = "🔔 It's time to leave for the canteen!";
        if (banner) banner.classList.add('pulse-urgent');
      }
    }, 1000);
  }

  startPrepCountdown() {
    if (this.prepTimerInterval) clearInterval(this.prepTimerInterval);

    this.prepTimerInterval = setInterval(() => {
      if (this.prepSeconds > 0) {
        this.prepSeconds--;
        const mins = String(Math.floor(this.prepSeconds / 60)).padStart(2, '0');
        const secs = String(this.prepSeconds % 60).padStart(2, '0');
        const prepElem = document.getElementById('prep-countdown-timer');
        if (prepElem) prepElem.textContent = `${mins}:${secs}`;
      } else {
        const prepElem = document.getElementById('prep-countdown-timer');
        if (prepElem) prepElem.textContent = "00:00 - READY!";
        this.triggerOrderReadyState();
      }
    }, 1000);
  }

  triggerOrderReadyState() {
    const readyBanner = document.getElementById('ready-pickup-banner');
    if (readyBanner) readyBanner.classList.remove('hidden');

    const stepNode3 = document.getElementById('step-node-3');
    if (stepNode3) {
      stepNode3.classList.add('active');
      stepNode3.classList.add('completed');
    }
    const stepConn2 = document.getElementById('step-conn-2');
    if (stepConn2) stepConn2.classList.add('active');

    const statusBadge = document.getElementById('track-current-status-badge');
    if (statusBadge) {
      statusBadge.textContent = "🔔 Ready for Pickup";
      statusBadge.style.background = "#dcfce7";
      statusBadge.style.color = "#166534";
    }

    // Update active order in list
    const activeOrder = this.orders.find(o => o.token === "SC-127");
    if (activeOrder && activeOrder.status !== "Collected") {
      activeOrder.status = "Ready";
    }
  }

  /* -------------------------------------------------------------
     5. FOOD MENU & CART RESERVATION (Sections 7, 8, 9, 10)
     ------------------------------------------------------------- */
  renderPublicMenu(filter = 'all') {
    const grid = document.getElementById('public-food-grid');
    if (!grid) return;
    const items = filter === 'all' ? CANTEEN_DATA.menu : CANTEEN_DATA.menu.filter(i => i.category === filter);

    grid.innerHTML = items.map(f => this.createFoodCardHtml(f, false)).join('');
  }

  filterPublicMenu(cat, btn) {
    document.querySelectorAll('#page-public-menu .pill-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    this.renderPublicMenu(cat);
  }

  renderStudentFoodGrid(filter = 'all') {
    const grid = document.getElementById('student-food-grid');
    if (!grid) return;
    const items = filter === 'all' ? CANTEEN_DATA.menu : CANTEEN_DATA.menu.filter(i => i.category === filter);

    grid.innerHTML = items.map(f => this.createFoodCardHtml(f, true)).join('');
  }

  filterMenu(cat, btn) {
    document.querySelectorAll('#sview-menu .pill-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    this.renderStudentFoodGrid(cat);
  }

  createFoodCardHtml(f, isInteractive) {
    const currentQty = this.cart[f.id] || 0;

    return `
      <div class="food-card" id="food-card-${f.id}">
        <div class="food-card-img-wrapper">
          <img src="${f.image}" alt="${f.name}" class="food-card-img" loading="lazy" />
          <div class="food-diet-tag">
            <span class="${f.isVeg ? 'diet-dot-veg' : 'diet-dot-nonveg'}"></span>
            <span>${f.isVeg ? 'VEG' : 'NON-VEG'}</span>
          </div>
          <div class="food-avail-badge ${f.inStock ? '' : 'out-of-stock'}">
            ${f.inStock ? 'Available Fresh' : 'Sold Out'}
          </div>
        </div>
        <div class="food-card-body">
          <div>
            <div class="food-card-header">
              <h3 class="food-name">${f.name}</h3>
              <span class="food-price">₹${f.price}</span>
            </div>
            <p class="food-desc">${f.description}</p>
          </div>

          <div class="food-card-action">
            ${isInteractive ? `
              ${currentQty > 0 ? `
                <div class="qty-stepper">
                  <button class="qty-btn" onclick="app.changeQty('${f.id}', -1)">−</button>
                  <span class="qty-count">${currentQty}</span>
                  <button class="qty-btn" onclick="app.changeQty('${f.id}', 1)">+</button>
                </div>
              ` : `
                <button class="btn-add-food" onclick="app.changeQty('${f.id}', 1)">
                  + Reserve Item
                </button>
              `}
            ` : `
              <button class="btn btn-outline btn-sm" onclick="app.showLogin()">Login to Order</button>
            `}
          </div>
        </div>
      </div>
    `;
  }

  changeQty(foodId, delta) {
    const current = this.cart[foodId] || 0;
    const newQty = Math.max(0, current + delta);

    if (newQty === 0) {
      delete this.cart[foodId];
    } else {
      this.cart[foodId] = newQty;
    }

    this.updateCartUi();
    this.renderStudentFoodGrid(document.querySelector('#sview-menu .pill-btn.active')?.dataset?.cat || 'all');
  }

  clearCart() {
    this.cart = {};
    this.updateCartUi();
    this.renderCart();
    this.renderStudentFoodGrid('all');
    this.showToast('Reservation cart cleared.', '🛒');
  }

  updateCartUi() {
    const entries = Object.entries(this.cart);
    let totalCount = 0;
    let totalCost = 0;

    entries.forEach(([id, qty]) => {
      const food = CANTEEN_DATA.menu.find(f => f.id === id);
      if (food) {
        totalCount += qty;
        totalCost += food.price * qty;
      }
    });

    // Update badges and bars
    document.querySelectorAll('.header-cart-count').forEach(e => e.textContent = totalCount);
    const sideBadge = document.getElementById('snav-cart-badge');
    if (sideBadge) sideBadge.textContent = totalCount;

    const floatBar = document.getElementById('student-floating-cart');
    if (floatBar) {
      if (totalCount > 0) {
        floatBar.classList.remove('hidden');
        document.getElementById('fc-item-count').textContent = totalCount;
        document.getElementById('fc-total-amount').textContent = `₹${totalCost}`;
      } else {
        floatBar.classList.add('hidden');
      }
    }
  }

  renderCart() {
    const container = document.getElementById('cart-items-container');
    const emptyState = document.getElementById('cart-empty-state');
    const summaryLines = document.getElementById('summary-line-items');
    const subtotalElem = document.getElementById('summary-subtotal');
    const totalElem = document.getElementById('summary-total');
    const upiPayAmount = document.getElementById('upi-pay-amount');

    const entries = Object.entries(this.cart);

    if (entries.length === 0) {
      if (container) container.innerHTML = '';
      if (emptyState) emptyState.classList.remove('hidden');
      if (summaryLines) summaryLines.innerHTML = '<div class="text-muted" style="font-size: 0.85rem;">No items in cart</div>';
      if (subtotalElem) subtotalElem.textContent = '₹0';
      if (totalElem) totalElem.textContent = '₹0';
      return;
    }

    if (emptyState) emptyState.classList.add('hidden');

    let total = 0;
    let itemsHtml = '';
    let summaryHtml = '';

    entries.forEach(([id, qty]) => {
      const food = CANTEEN_DATA.menu.find(f => f.id === id);
      if (!food) return;
      const sub = food.price * qty;
      total += sub;

      itemsHtml += `
        <div class="cart-item-row">
          <div class="cart-item-info">
            <img src="${food.image}" alt="${food.name}" class="cart-item-thumb" />
            <div>
              <div class="cart-item-title">${food.name}</div>
              <div class="cart-item-rate">₹${food.price} each</div>
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 1.5rem;">
            <div class="qty-stepper">
              <button class="qty-btn" onclick="app.changeQty('${food.id}', -1)">−</button>
              <span class="qty-count">${qty}</span>
              <button class="qty-btn" onclick="app.changeQty('${food.id}', 1)">+</button>
            </div>
            <div class="cart-item-subtotal">₹${sub}</div>
          </div>
        </div>
      `;

      summaryHtml += `
        <div class="summary-line-row">
          <span>${food.name} × ${qty}</span>
          <strong>₹${sub}</strong>
        </div>
      `;
    });

    if (container) container.innerHTML = itemsHtml;
    if (summaryLines) summaryLines.innerHTML = summaryHtml;
    if (subtotalElem) subtotalElem.textContent = `₹${total}`;
    if (totalElem) totalElem.textContent = `₹${total}`;
    if (upiPayAmount) upiPayAmount.textContent = `₹${total}`;

    // Render demo UPI QR on canvas
    this.renderUpiQrCanvas(total);
  }

  selectPaymentMode(mode) {
    this.selectedPaymentMode = mode;
    document.querySelectorAll('.payment-choice-label').forEach(l => l.classList.remove('active'));

    const cashPanel = document.getElementById('cash-info-panel');
    const upiPanel = document.getElementById('upi-sim-panel');

    if (mode === 'cash') {
      document.getElementById('label-pay-cash').classList.add('active');
      if (cashPanel) cashPanel.classList.remove('hidden');
      if (upiPanel) upiPanel.classList.add('hidden');
    } else {
      document.getElementById('label-pay-upi').classList.add('active');
      if (cashPanel) cashPanel.classList.add('hidden');
      if (upiPanel) upiPanel.classList.remove('hidden');
    }
  }

  renderUpiQrCanvas(amount) {
    const canvas = document.getElementById('upi-canvas');
    if (!canvas || typeof QRCode === 'undefined') return;
    const upiString = `upi://pay?pa=lourdesmatha.canteen@sbi&pn=LMC+Canteen&am=${amount}&cu=INR`;
    QRCode.toCanvas(canvas, upiString, { width: 130, margin: 1 }, function (error) {
      if (error) console.error(error);
    });
  }

  simulateUpiPay() {
    const btn = document.getElementById('btn-simulate-upi');
    const success = document.getElementById('upi-success-indicator');
    btn.textContent = 'Verifying UPI pin...';
    btn.disabled = true;

    setTimeout(() => {
      this.isUpiPaid = true;
      btn.textContent = '✅ Payment Verified';
      btn.disabled = false;
      if (success) success.classList.remove('hidden');
      this.showToast('UPI Payment of verified! Token generation ready.', '📱');
    }, 1200);
  }

  /* ORDER CONFIRMATION & TOKEN QR GENERATION (Section 10) */
  createOrderReservation() {
    const entries = Object.entries(this.cart);
    if (entries.length === 0) {
      alert("Please add at least one item from the menu to confirm a reservation.");
      this.showStudentView('menu');
      return;
    }

    const u = this.currentUser || CANTEEN_DATA.users[0];
    const token = `SC-${Math.floor(100 + Math.random() * 899)}`;
    let total = 0;
    const itemsList = [];

    entries.forEach(([id, qty]) => {
      const food = CANTEEN_DATA.menu.find(f => f.id === id);
      if (food) {
        total += food.price * qty;
        itemsList.push({ name: food.name, qty: qty, price: food.price });
      }
    });

    const newOrder = {
      token: token,
      studentId: u.id,
      studentName: u.name,
      department: u.department,
      items: itemsList,
      total: total,
      paymentMethod: this.selectedPaymentMode === 'upi' ? 'UPI / Google Pay' : 'Cash at Canteen',
      arrivalTime: u.assignedArrival || "11:09 AM",
      departureTime: u.assignedDeparture || "11:04 AM",
      status: "Preparing",
      timestamp: "10:59 AM",
      prepRemainingSeconds: 455
    };

    // Prepend to orders
    this.orders.unshift(newOrder);

    // Populate Confirmation View (Section 10)
    document.getElementById('conf-token-id').textContent = token;
    document.getElementById('conf-student-name').textContent = u.name;
    document.getElementById('conf-student-id').textContent = u.id;
    document.getElementById('conf-dept').textContent = `${u.department} (${u.departmentFull || 'Computer Science'})`;
    document.getElementById('conf-items-summary').textContent = itemsList.map(i => `${i.name} × ${i.qty}`).join(', ');
    document.getElementById('conf-total-amount').textContent = `₹${total}`;
    document.getElementById('conf-departure-time').textContent = u.assignedDeparture || "11:04 AM";
    document.getElementById('conf-arrival-time').textContent = `${u.assignedArrival || "11:09 AM"} (5-min walk)`;
    document.getElementById('conf-payment-method').textContent = newOrder.paymentMethod;

    // Generate Official QR Code
    this.renderTokenQrCode(token, u.id, total);

    // Clear cart and show confirmation pane
    this.cart = {};
    this.updateCartUi();
    this.showStudentView('confirmation');
    this.showToast(`Order confirmed! Token: ${token} issued.`, '🎫');

    // Also update active order tracking
    this.updateActiveOrderDisplay(newOrder);
  }

  renderTokenQrCode(token, studentId, amount) {
    const container = document.getElementById('conf-qrcode-container');
    if (!container || typeof QRCode === 'undefined') return;
    container.innerHTML = '';

    const qrPayload = JSON.stringify({
      college: "LMC-CANTEEN",
      token: token,
      studentId: studentId,
      amount: amount,
      break: "11:00-11:15"
    });

    const canvas = document.createElement('canvas');
    QRCode.toCanvas(canvas, qrPayload, { width: 150, margin: 1 }, function (error) {
      if (error) console.error(error);
    });
    container.appendChild(canvas);
  }

  renderProfileBarcode(token) {
    let activeToken = token;
    if (!activeToken) {
      const active = this.orders && this.orders.find(o => o.studentId === (this.currentUser?.id || "LM2026CS101"));
      activeToken = active ? active.token : (this.currentUser?.token || "SC-127");
    }

    const svgElem = document.getElementById('profile-barcode-svg');
    const labelElem = document.getElementById('profile-barcode-token');

    if (labelElem) {
      labelElem.textContent = `Token: ${activeToken}`;
    }

    if (!svgElem) return;

    if (typeof JsBarcode === 'function') {
      try {
        JsBarcode(svgElem, activeToken, {
          format: "CODE128",
          lineColor: "#0f172a",
          width: 2,
          height: 48,
          displayValue: false,
          margin: 6,
          background: "#ffffff"
        });
        return;
      } catch (err) {
        console.warn("JsBarcode generation failed, falling back to native SVG:", err);
      }
    }

    this.drawNativeBarcodeSvg(svgElem, activeToken);
  }

  drawNativeBarcodeSvg(svgElem, text) {
    const CODE39 = {
      '0': '000110100', '1': '100100001', '2': '001100001', '3': '101100000',
      '4': '000110001', '5': '100110000', '6': '001110000', '7': '000100101',
      '8': '100100100', '9': '001100100', 'A': '100001001', 'B': '001001001',
      'C': '101001000', 'D': '000011001', 'E': '100011000', 'F': '001011000',
      'G': '000001101', 'H': '100001100', 'I': '001001100', 'J': '000011100',
      'K': '100000011', 'L': '001000011', 'M': '101000010', 'N': '000010011',
      'O': '100010010', 'P': '001010010', 'Q': '000000111', 'R': '100000110',
      'S': '001000110', 'T': '000010110', 'U': '110000001', 'V': '011000001',
      'W': '111000000', 'X': '010010001', 'Y': '110010000', 'Z': '011010000',
      '-': '010000101', '.': '110000100', ' ': '011000100', '$': '010101000',
      '/': '010100010', '+': '010001010', '%': '000101010', '*': '010010100'
    };

    const cleanText = (text || 'SC-127').toUpperCase().replace(/[^0-9A-Z\-\. \$\/\+\%]/g, '');
    const encoded = '*' + cleanText + '*';
    const narrow = 2;
    const wide = 5;
    const height = 48;
    let x = 12;
    let rects = '';

    for (let i = 0; i < encoded.length; i++) {
      const pattern = CODE39[encoded[i]];
      if (!pattern) continue;
      for (let j = 0; j < 9; j++) {
        const isBar = (j % 2 === 0);
        const isWide = pattern[j] === '1';
        const w = isWide ? wide : narrow;
        if (isBar) {
          rects += `<rect x="${x}" y="0" width="${w}" height="${height}" fill="#0f172a" />`;
        }
        x += w;
      }
      x += narrow;
    }

    const totalWidth = x + 12;
    svgElem.setAttribute('viewBox', `0 0 ${totalWidth} ${height}`);
    svgElem.setAttribute('width', `${totalWidth}`);
    svgElem.setAttribute('height', `${height}`);
    svgElem.innerHTML = rects;
  }

  updateActiveOrderDisplay(order) {
    const active = order || this.orders.find(o => o.studentId === (this.currentUser?.id || "LM2026CS101"));
    if (!active) return;

    // Track tab displays
    document.getElementById('track-token-display').textContent = `Token: ${active.token}`;
    document.getElementById('disp-active-token').textContent = active.token;
    document.getElementById('student-side-token').innerHTML = `Token: <strong>${active.token}</strong>`;

    const itemsElem = document.getElementById('track-order-items-list');
    if (itemsElem) {
      itemsElem.innerHTML = active.items.map(i => `
        <div class="aot-item-row">
          <span>${i.name} × ${i.qty}</span>
          <strong>₹${i.price * i.qty}</strong>
        </div>
      `).join('');
    }

    document.getElementById('track-order-payment').textContent = active.paymentMethod;
    document.getElementById('track-order-total').textContent = `₹${active.total}`;
    this.renderProfileBarcode(active.token);
  }

  simulateOrderStep() {
    const active = this.orders[0];
    if (!active) return;

    if (active.status === "Pending") {
      active.status = "Preparing";
      this.showToast(`Order ${active.token} is now Preparing on stoves!`, '🍳');
    } else if (active.status === "Preparing") {
      active.status = "Ready";
      this.triggerOrderReadyState();
      this.showToast(`Order ${active.token} is READY for pickup at counter!`, '🔔');
    } else if (active.status === "Ready") {
      active.status = "Collected";
      this.markOrderCollected();
    } else {
      active.status = "Pending";
      this.showToast(`Order reset to Pending for demo.`, '🔄');
    }

    this.renderStudentOrdersHistory();
  }

  markOrderCollected() {
    const active = this.orders.find(o => o.token === "SC-127" || o.status === "Ready");
    if (active) active.status = "Collected";

    const banner = document.getElementById('ready-pickup-banner');
    if (banner) banner.classList.add('hidden');

    const stepNode4 = document.getElementById('step-node-4');
    if (stepNode4) {
      stepNode4.classList.add('active');
      stepNode4.classList.add('completed');
    }
    const stepConn3 = document.getElementById('step-conn-3');
    if (stepConn3) stepConn3.classList.add('active');

    const statusBadge = document.getElementById('track-current-status-badge');
    if (statusBadge) {
      statusBadge.textContent = "🍽️ Collected";
      statusBadge.style.background = "#e0f2fe";
      statusBadge.style.color = "#0369a1";
    }

    this.showToast('Meal collected! Enjoy your breakfast inside the canteen.', '🍽️');
    this.renderStudentOrdersHistory();
  }

  renderStudentOrdersHistory() {
    const tbody = document.getElementById('student-history-tbody');
    if (!tbody) return;

    tbody.innerHTML = this.orders.map(o => `
      <tr>
        <td><strong style="font-family: monospace; color: var(--primary-maroon);">${o.token}</strong></td>
        <td>${o.timestamp}</td>
        <td>${o.items.map(i => `${i.name} × ${i.qty}`).join(', ')}</td>
        <td><strong>₹${o.total}</strong></td>
        <td>${o.paymentMethod}</td>
        <td><span class="badge ${o.status === 'Ready' ? 'badge-green' : o.status === 'Preparing' ? 'badge-accent' : 'badge-primary'}">${o.status}</span></td>
      </tr>
    `).join('');
  }

  /* -------------------------------------------------------------
     6. NOTIFICATIONS & LIVE CROWD STATUS (Sections 12, 17, 19)
     ------------------------------------------------------------- */
  renderStudentNotifications() {
    const feed = document.getElementById('student-notifs-feed');
    if (!feed) return;

    feed.innerHTML = this.notifications.map(n => `
      <div class="notif-card ${n.read ? '' : 'unread'} alert-${n.type}">
        <div class="notif-icon-circle">${n.icon}</div>
        <div>
          <div class="notif-title">${n.title}</div>
          <div class="notif-body">${n.body}</div>
          <div class="notif-time">${n.time}</div>
        </div>
      </div>
    `).join('');

    this.updateNotifBadges();
  }

  updateNotifBadges() {
    const unreadCount = this.notifications.filter(n => !n.read).length;
    document.querySelectorAll('#student-notif-badge, #snav-notif-badge').forEach(b => b.textContent = unreadCount);
  }

  markAllStudentNotifsRead() {
    this.notifications.forEach(n => n.read = true);
    this.renderStudentNotifications();
    this.showToast('All notifications marked as read.', '✓');
  }

  renderDeptScheduleTable() {
    const tbody = document.getElementById('student-dept-schedule-tbody');
    if (!tbody) return;

    tbody.innerHTML = CANTEEN_DATA.departments.map(d => `
      <tr>
        <td><strong>${d.code}</strong> (${d.name})</td>
        <td>${d.breakTime}</td>
        <td><strong class="text-maroon">${d.departureWindow}</strong></td>
        <td>${d.expectedArrival}</td>
        <td>${d.studentsCount} Students</td>
        <td>${d.impact}</td>
      </tr>
    `).join('');
  }

  refreshCrowdSimulation() {
    const newCrowd = Math.floor(35 + Math.random() * 25);
    const capacity = 100;
    const pct = Math.round((newCrowd / capacity) * 100);

    const bar = document.getElementById('canteen-meter-bar');
    const pctElem = document.getElementById('canteen-meter-pct');
    const badge = document.getElementById('canteen-meter-badge');
    const currentElem = document.getElementById('canteen-count-current');
    const availElem = document.getElementById('canteen-count-avail');
    const microFill = document.getElementById('micro-crowd-fill');
    const microLabel = document.getElementById('micro-crowd-label');
    const microCount = document.getElementById('micro-crowd-count');

    if (bar) bar.style.width = `${pct}%`;
    if (pctElem) pctElem.textContent = `${pct}%`;
    if (currentElem) currentElem.textContent = newCrowd;
    if (availElem) availElem.textContent = capacity - newCrowd;
    if (microFill) microFill.style.width = `${pct}%`;
    if (microCount) microCount.textContent = `${newCrowd} / ${capacity}`;

    let statusText = '🟢 LOW CROWD';
    let statusColor = '#2e7d32';
    let statusBg = '#e8f5e9';

    if (pct > 75) {
      statusText = '🔴 HIGH CROWD';
      statusColor = '#dc2626';
      statusBg = '#fee2e2';
    } else if (pct > 50) {
      statusText = '🟡 MEDIUM CROWD';
      statusColor = '#ca8a04';
      statusBg = '#fef9c3';
    }

    if (badge) {
      badge.textContent = statusText;
      badge.style.color = statusColor;
      badge.style.background = statusBg;
    }
    if (microLabel) microLabel.textContent = statusText;

    this.showToast(`Telemetry updated: ${newCrowd} students currently inside.`, '📡');
  }

  /* -------------------------------------------------------------
     7. STAFF PORTAL LOGIC & QUEUES (Sections 13 & 14)
     ------------------------------------------------------------- */
  initStaffPortal() {
    this.renderStaffMetrics();
    this.renderStaffLiveStream();
    this.renderStaffArrivalWaves();
    this.renderStaffQueueGrid('all');
    this.renderStaffDemandTable();
    this.renderStaffDemandChart();
    this.renderStaffCrowdChart();
  }

  showStaffView(viewId) {
    document.querySelectorAll('.staff-view-pane').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('#staff-sidebar .sidebar-nav-item').forEach(b => b.classList.remove('active'));

    const pane = document.getElementById(`sfview-${viewId}`);
    if (pane) pane.classList.add('active');

    const navBtn = document.getElementById(`sfnav-${viewId === 'dashboard' ? 'dash' : viewId}`);
    if (navBtn) navBtn.classList.add('active');

    if (viewId === 'demand') this.renderStaffDemandChart();
    if (viewId === 'canteen') this.renderStaffCrowdChart();

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  renderStaffMetrics() {
    const total = this.orders.length + 180;
    const preparing = this.orders.filter(o => o.status === 'Preparing').length + 22;
    const ready = this.orders.filter(o => o.status === 'Ready').length + 11;
    const completed = 151;

    document.getElementById('sf-stat-total').textContent = total;
    document.getElementById('sf-stat-preparing').textContent = preparing;
    document.getElementById('sf-stat-ready').textContent = ready;
    document.getElementById('sf-stat-completed').textContent = completed;
    document.getElementById('sf-pending-badge').textContent = preparing;
  }

  renderStaffLiveStream() {
    const stream = document.getElementById('sf-live-orders-stream');
    if (!stream) return;

    stream.innerHTML = this.orders.slice(0, 4).map(o => `
      <div class="stream-order-card">
        <div class="soc-header">
          <span class="soc-token">${o.token}</span>
          <span class="badge ${o.status === 'Ready' ? 'badge-green' : o.status === 'Preparing' ? 'badge-accent' : 'badge-primary'}">${o.status}</span>
        </div>
        <div class="soc-items">${o.items.map(i => `${i.name} × ${i.qty}`).join(', ')}</div>
        <div class="soc-footer">
          <span>${o.studentName} (${o.department}) &bull; Arrival: <strong>${o.arrivalTime}</strong></span>
          <div class="soc-actions">
            <button class="btn btn-xs btn-outline" onclick="app.updateStaffOrderStatus('${o.token}', 'Ready')">Ready</button>
            <button class="btn btn-xs btn-success" onclick="app.updateStaffOrderStatus('${o.token}', 'Collected')">Done</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  renderStaffArrivalWaves() {
    const waves = document.getElementById('sf-arrival-waves-list');
    if (!waves) return;

    waves.innerHTML = CANTEEN_DATA.departments.slice(0, 5).map(d => `
      <div class="stream-order-card" style="border-left: 4px solid var(--primary-maroon);">
        <div class="soc-header">
          <strong>${d.code} (${d.name})</strong>
          <span class="badge badge-accent">${d.studentsCount} Students</span>
        </div>
        <div style="font-size: 0.85rem; color: var(--text-secondary);">
          Leaves class: <strong>${d.departureWindow}</strong> &bull; Reaches counter: <strong>${d.expectedArrival}</strong>
        </div>
      </div>
    `).join('');
  }

  renderStaffQueueGrid(filter = 'all') {
    const grid = document.getElementById('sf-incoming-cards-grid');
    if (!grid) return;

    const list = filter === 'all' ? this.orders : this.orders.filter(o => o.status.toLowerCase() === filter.toLowerCase());

    grid.innerHTML = list.map(o => `
      <div class="kitchen-order-card status-${o.status.toLowerCase()}">
        <div class="koc-header">
          <span class="koc-token">${o.token}</span>
          <span class="badge ${o.status === 'Ready' ? 'badge-green' : o.status === 'Preparing' ? 'badge-accent' : 'badge-primary'}">${o.status}</span>
        </div>
        <div class="koc-student-dept">
          <strong>${o.studentName}</strong> &bull; ${o.department} (${o.studentId})
        </div>
        <table class="koc-items-table">
          ${o.items.map(i => `
            <tr>
              <td>${i.name}</td>
              <td class="text-right"><strong>× ${i.qty}</strong></td>
            </tr>
          `).join('')}
        </table>
        <div class="koc-meta-row">
          <span>Arrival: <strong>${o.arrivalTime}</strong></span>
          <span>${o.paymentMethod} &bull; <strong>₹${o.total}</strong></span>
        </div>
        <div class="koc-action-row">
          <button class="btn btn-xs btn-outline" onclick="app.updateStaffOrderStatus('${o.token}', 'Preparing')">🍳 Preparing</button>
          <button class="btn btn-xs btn-success" onclick="app.updateStaffOrderStatus('${o.token}', 'Ready')">🔔 Ready</button>
          <button class="btn btn-xs btn-primary" onclick="app.updateStaffOrderStatus('${o.token}', 'Collected')">🍽️ Collected</button>
        </div>
      </div>
    `).join('');
  }

  filterStaffQueue(filter, btn) {
    document.querySelectorAll('#sfview-incoming .filter-pill').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    this.renderStaffQueueGrid(filter);
  }

  updateStaffOrderStatus(token, newStatus) {
    const order = this.orders.find(o => o.token === token);
    if (!order) return;

    order.status = newStatus;
    this.renderStaffMetrics();
    this.renderStaffLiveStream();
    this.renderStaffQueueGrid(document.querySelector('#sfview-incoming .filter-pill.active')?.textContent.toLowerCase() || 'all');

    this.showToast(`Token ${token} updated to ${newStatus}.`, '👨‍🍳');

    // If it's Amal Krishna's order, sync live view
    if (token === "SC-127") {
      this.updateActiveOrderDisplay(order);
      if (newStatus === "Ready") this.triggerOrderReadyState();
      if (newStatus === "Collected") this.markOrderCollected();
    }
  }

  simulateRandomNewOrder() {
    const token = `SC-${Math.floor(130 + Math.random() * 50)}`;
    const newOrd = {
      token: token,
      studentId: "LM2026ME088",
      studentName: "Jibin Mathew",
      department: "ME",
      items: [{ name: "Puffs", qty: 2, price: 25 }, { name: "Tea", qty: 1, price: 15 }],
      total: 65,
      paymentMethod: "UPI / Google Pay",
      arrivalTime: "11:05 AM",
      departureTime: "11:00 AM",
      status: "Preparing",
      timestamp: "Just Now",
      prepRemainingSeconds: 300
    };

    this.orders.unshift(newOrd);
    this.renderStaffMetrics();
    this.renderStaffLiveStream();
    this.renderStaffQueueGrid('all');
    this.showToast(`New reservation incoming: Token ${token} (ME Department)`, '🔔');
  }

  renderStaffDemandTable() {
    const tbody = document.getElementById('sf-demand-table-tbody');
    if (!tbody) return;

    tbody.innerHTML = CANTEEN_DATA.foodDemand.map(d => `
      <tr>
        <td><strong>${d.name}</strong></td>
        <td><strong class="text-orange">${d.expectedDemand} portions</strong></td>
        <td><strong class="text-green">${d.planned} portions</strong></td>
        <td>${d.readyStock} ready</td>
        <td><span class="badge badge-primary">${d.kitchenAction}</span></td>
      </tr>
    `).join('');
  }

  printKitchenSheet() {
    window.print();
  }

  /* -------------------------------------------------------------
     8. ADMIN PORTAL LOGIC & ANALYTICS (Sections 15, 16, 17, 18)
     ------------------------------------------------------------- */
  initAdminPortal() {
    this.renderAdminOrdersMasterTable();
    this.renderAdminMenuTable();
    this.renderAdminDemandAnalytics();
    this.renderAdminUsersTable();
    this.renderAdminCharts();
    this.renderAdminDeptScheduleTable();
  }

  showAdminView(viewId) {
    if (!this.currentUser || this.currentUser.role !== 'admin') {
      this.showToast('Access Denied: Administrator privileges required.', '⛔');
      if (this.currentUser && this.currentUser.role === 'student') {
        this.showStudentView('dashboard');
      } else if (this.currentUser && this.currentUser.role === 'staff') {
        this.showStaffView('queue');
      } else {
        this.logout();
      }
      return;
    }

    document.querySelectorAll('.admin-view-pane').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('#admin-sidebar .sidebar-nav-item').forEach(b => b.classList.remove('active'));

    const pane = document.getElementById(`adview-${viewId}`);
    if (pane) pane.classList.add('active');

    const navBtn = document.getElementById(`adnav-${viewId === 'dashboard' ? 'dash' : viewId}`);
    if (navBtn) navBtn.classList.add('active');

    if (viewId === 'dashboard' || viewId === 'crowd' || viewId === 'demand' || viewId === 'revenue') {
      setTimeout(() => this.renderAdminCharts(), 50);
    }
    if (viewId === 'settings') {
      this.renderAdminDeptScheduleTable();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  renderAdminOrdersMasterTable() {
    const tbody = document.getElementById('ad-orders-master-tbody');
    if (!tbody) return;

    tbody.innerHTML = this.orders.map(o => `
      <tr>
        <td><strong style="font-family: monospace; color: var(--primary-maroon);">${o.token}</strong></td>
        <td>${o.studentName}</td>
        <td>${o.department} &bull; <code>${o.studentId}</code></td>
        <td>${o.items.map(i => `${i.name} (${i.qty})`).join(', ')}</td>
        <td><strong>₹${o.total}</strong></td>
        <td>${o.paymentMethod}</td>
        <td><span class="badge ${o.status === 'Ready' ? 'badge-green' : o.status === 'Preparing' ? 'badge-accent' : 'badge-primary'}">${o.status}</span></td>
        <td>Leave ${o.departureTime} → Arrive ${o.arrivalTime}</td>
      </tr>
    `).join('');
  }

  renderAdminMenuTable() {
    const tbody = document.getElementById('ad-menu-table-tbody');
    if (!tbody) return;

    tbody.innerHTML = CANTEEN_DATA.menu.map(f => `
      <tr>
        <td><img src="${f.image}" style="width: 44px; height: 44px; border-radius: 6px; object-fit: cover;" /></td>
        <td><strong>${f.name}</strong></td>
        <td><span class="badge badge-primary">${f.category}</span></td>
        <td><strong>₹${f.price}</strong></td>
        <td>${f.dailyStock} portions</td>
        <td><span class="badge ${f.inStock ? 'badge-green' : 'badge-accent'}">${f.inStock ? 'In Stock' : 'Out of Stock'}</span></td>
        <td>
          <button class="btn btn-xs btn-outline" onclick="app.toggleMenuStock('${f.id}')">Toggle Stock</button>
        </td>
      </tr>
    `).join('');
  }

  toggleMenuStock(id) {
    const item = CANTEEN_DATA.menu.find(f => f.id === id);
    if (!item) return;
    item.inStock = !item.inStock;
    this.renderAdminMenuTable();
    this.renderStudentFoodGrid('all');
    this.showToast(`Updated stock status for ${item.name}`, '🍽️');
  }

  openAddMenuModal() {
    const name = prompt("Enter food item name (e.g. Kappa & Meen Curry):");
    if (!name) return;
    const price = parseInt(prompt("Enter portion price in ₹ (e.g. 80):") || "50", 10);
    const category = prompt("Enter category (breakfast / meals / snacks / beverages):") || "snacks";

    const newItem = {
      id: `f${CANTEEN_DATA.menu.length + 1}`,
      name: name,
      category: category,
      price: price,
      isVeg: true,
      description: "Freshly prepared campus special in Lourdes Matha College canteen.",
      image: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=600&q=80",
      inStock: true,
      dailyStock: 40,
      soldCount: 0,
      isPopular: false
    };

    CANTEEN_DATA.menu.push(newItem);
    this.renderAdminMenuTable();
    this.renderStudentFoodGrid('all');
    this.showToast(`Added ${name} (₹${price}) to campus menu!`, '✅');
  }

  renderAdminDemandAnalytics() {
    const tbody = document.getElementById('ad-demand-analytics-tbody');
    if (!tbody) return;

    tbody.innerHTML = CANTEEN_DATA.foodDemand.map(d => `
      <tr>
        <td><strong>${d.name}</strong></td>
        <td>${d.planned}</td>
        <td>${d.prepared}</td>
        <td><strong class="text-green">${d.sold}</strong></td>
        <td>${d.remaining}</td>
        <td><strong class="${parseFloat(d.wastePct) > 10 ? 'text-orange' : 'text-green'}">${d.wastePct}</strong></td>
        <td><span class="badge ${d.remaining <= 3 ? 'badge-green' : 'badge-accent'}">${d.remaining <= 3 ? 'Optimal Prep' : 'Surplus'}</span></td>
      </tr>
    `).join('');
  }

  renderAdminUsersTable() {
    const tbody = document.getElementById('ad-users-tbody');
    if (!tbody) return;

    tbody.innerHTML = CANTEEN_DATA.users.map(u => `
      <tr>
        <td><code>${u.id}</code></td>
        <td><strong>${u.name}</strong></td>
        <td><span class="badge ${u.role === 'admin' ? 'badge-blue' : u.role === 'staff' ? 'badge-accent' : 'badge-primary'}">${u.role.toUpperCase()}</span></td>
        <td>${u.department}</td>
        <td>${u.year}</td>
        <td><span class="badge badge-green">Active Campus ID</span></td>
      </tr>
    `).join('');
  }

  saveCapacitySettings() {
    const cap = document.getElementById('cfg-capacity').value;
    const walk = document.getElementById('cfg-walk-time').value;
    const intv = document.getElementById('cfg-interval').value;

    CANTEEN_DATA.college.canteenCapacity = parseInt(cap, 10);
    CANTEEN_DATA.college.walkingTimeMinutes = parseInt(walk, 10);

    this.showToast(`Canteen settings saved: Capacity ${cap}, Walking ${walk} mins, Stagger interval ${intv} mins.`, '⚙️');
  }

  renderAdminDeptScheduleTable() {
    const tbody = document.getElementById('ad-dept-schedule-tbody');
    if (!tbody) return;

    tbody.innerHTML = CANTEEN_DATA.departments.map(d => {
      const safeId = d.code.replace(/[^a-zA-Z0-9]/g, '_');
      return `
        <tr>
          <td><strong>${d.name}</strong> <span class="badge badge-primary" style="margin-left: 0.25rem;">${d.code}</span></td>
          <td><span class="badge badge-accent">${d.group}</span></td>
          <td>
            <input type="text" id="cfg-dep-${safeId}" class="form-control form-control-sm" value="${d.departureWindow}" style="width: 120px;" />
          </td>
          <td>
            <input type="text" id="cfg-arr-${safeId}" class="form-control form-control-sm" value="${d.expectedArrival}" style="width: 120px;" />
          </td>
          <td>
            <button class="btn btn-sm btn-primary" onclick="app.updateDepartmentTiming('${d.code}')">
              Update
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  async updateDepartmentTiming(deptCode) {
    if (!this.currentUser || this.currentUser.role !== 'admin') {
      this.showToast('Access Denied: Only administrators can modify department departure timings.', '⛔');
      return;
    }

    const safeId = deptCode.replace(/[^a-zA-Z0-9]/g, '_');
    const depInput = document.getElementById(`cfg-dep-${safeId}`);
    const arrInput = document.getElementById(`cfg-arr-${safeId}`);

    const newDep = depInput ? depInput.value.trim() : null;
    const newArr = arrInput ? arrInput.value.trim() : null;

    if (!newDep) {
      this.showToast('Please enter a valid departure time.', '⚠️');
      return;
    }

    // Call backend API with admin role header for RBAC verification
    try {
      const res = await fetch(`/api/departments/${encodeURIComponent(deptCode)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': this.currentUser.role
        },
        body: JSON.stringify({
          departureWindow: newDep,
          expectedArrival: newArr,
          role: this.currentUser.role
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        this.showToast(errData.message || 'Access Denied: Admin authorization failed.', '⛔');
        return;
      }
    } catch (e) {
      console.warn("Backend API timing update notice:", e);
    }

    // Update in-memory data so it immediately reflects across all users
    const dept = CANTEEN_DATA.departments.find(d => d.code === deptCode);
    if (dept) {
      dept.departureWindow = newDep;
      if (newArr) dept.expectedArrival = newArr;
    }

    // Also update any student user records that belong to this department
    CANTEEN_DATA.users.forEach(u => {
      if (u.department === deptCode) {
        u.assignedDeparture = newDep;
        if (newArr) u.assignedArrival = newArr;
      }
    });

    if (this.currentUser && this.currentUser.department === deptCode) {
      this.currentUser.assignedDeparture = newDep;
      if (newArr) this.currentUser.assignedArrival = newArr;
    }

    // Re-render all schedule views and displays across the application
    this.renderDeptScheduleTable();
    this.renderDeptSwitchButtons();
    this.renderAdminDeptScheduleTable();

    this.showToast(`Updated ${deptCode} departure timing to ${newDep} (Synchronized campus-wide)`, '✓');
  }

  /* -------------------------------------------------------------
     9. CHART.JS VISUALIZATIONS (Sections 16, 17, 18)
     ------------------------------------------------------------- */
  renderAdminCharts() {
    if (typeof Chart === 'undefined') return;

    // 1. Revenue & Expense Trend
    const revCtx = document.getElementById('ad-rev-chart');
    if (revCtx) {
      if (this.charts.adRev) this.charts.adRev.destroy();
      this.charts.adRev = new Chart(revCtx, {
        type: 'line',
        data: {
          labels: ['Fri', 'Sat', 'Mon', 'Tue', 'Wed', 'Thu', 'Today'],
          datasets: [
            {
              label: 'Revenue (₹)',
              data: [14200, 15800, 16900, 17200, 16400, 17800, 18450],
              borderColor: '#16a34a',
              backgroundColor: 'rgba(22, 163, 74, 0.1)',
              tension: 0.3,
              fill: true
            },
            {
              label: 'Expenses (₹)',
              data: [10500, 11000, 10800, 11200, 10900, 11100, 11250],
              borderColor: '#e65100',
              backgroundColor: 'rgba(230, 81, 0, 0.05)',
              borderDash: [5, 5],
              tension: 0.3
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom' } }
        }
      });
    }

    // 2. Crowd Staggering Effect Comparison (Section 17)
    const crowdCompareCtx = document.getElementById('ad-crowd-compare-chart');
    if (crowdCompareCtx) {
      if (this.charts.adCrowdCompare) this.charts.adCrowdCompare.destroy();
      this.charts.adCrowdCompare = new Chart(crowdCompareCtx, {
        type: 'line',
        data: {
          labels: CANTEEN_DATA.crowdFlow.labels,
          datasets: [
            {
              label: 'Controlled Curve (With Smart Staggering)',
              data: CANTEEN_DATA.crowdFlow.withStaggering,
              borderColor: '#16a34a',
              backgroundColor: 'rgba(22, 163, 74, 0.2)',
              fill: true,
              tension: 0.4
            },
            {
              label: 'Bottleneck Spike (Without Staggering)',
              data: CANTEEN_DATA.crowdFlow.withoutStaggering,
              borderColor: '#dc2626',
              borderDash: [4, 4],
              tension: 0.4
            },
            {
              label: 'Canteen Capacity Limit (100 Students)',
              data: CANTEEN_DATA.crowdFlow.capacityLimit,
              borderColor: '#64748b',
              borderDash: [2, 2],
              pointRadius: 0
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom' } }
        }
      });
    }

    // 3. Section 17 Detailed Timeline
    const crowdTimeCtx = document.getElementById('ad-crowd-timeline-chart');
    if (crowdTimeCtx) {
      if (this.charts.adCrowdTime) this.charts.adCrowdTime.destroy();
      this.charts.adCrowdTime = new Chart(crowdTimeCtx, {
        type: 'bar',
        data: {
          labels: ["10:55 AM", "11:00 AM", "11:05 AM (Peak)", "11:10 AM", "11:15 AM", "11:20 AM"],
          datasets: [
            {
              label: 'Active Students in Canteen Hall',
              data: [20, 35, 65, 40, 15, 8],
              backgroundColor: ['#bbf7d0', '#86efac', '#fdba74', '#86efac', '#bbf7d0', '#e2e8f0']
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } }
        }
      });
    }

    // 4. Planned vs Sold Bar Chart (Section 18)
    const demandBarCtx = document.getElementById('ad-demand-bar-chart');
    if (demandBarCtx) {
      if (this.charts.adDemand) this.charts.adDemand.destroy();
      this.charts.adDemand = new Chart(demandBarCtx, {
        type: 'bar',
        data: {
          labels: CANTEEN_DATA.foodDemand.map(d => d.name),
          datasets: [
            {
              label: 'Planned Quantity',
              data: CANTEEN_DATA.foodDemand.map(d => d.planned),
              backgroundColor: '#94a3b8'
            },
            {
              label: 'Sold to Students',
              data: CANTEEN_DATA.foodDemand.map(d => d.sold),
              backgroundColor: '#16a34a'
            },
            {
              label: 'Remaining Portions',
              data: CANTEEN_DATA.foodDemand.map(d => d.remaining),
              backgroundColor: '#e65100'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom' } }
        }
      });
    }

    // 5. Category Revenue Breakdown
    const revCatCtx = document.getElementById('ad-rev-category-chart');
    if (revCatCtx) {
      if (this.charts.adRevCat) this.charts.adRevCat.destroy();
      this.charts.adRevCat = new Chart(revCatCtx, {
        type: 'doughnut',
        data: {
          labels: ['Breakfast Specials', 'Meals & Biriyani', 'Hot Snacks', 'Beverages'],
          datasets: [{
            data: [6400, 7850, 3600, 600],
            backgroundColor: ['#720026', '#e65100', '#2e7d32', '#0284c7']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom' } }
        }
      });
    }
  }

  renderStudentCrowdChart() {
    const ctx = document.getElementById('student-crowd-chart');
    if (!ctx || typeof Chart === 'undefined') return;

    if (this.charts.studentCrowd) this.charts.studentCrowd.destroy();
    this.charts.studentCrowd = new Chart(ctx, {
      type: 'line',
      data: {
        labels: CANTEEN_DATA.crowdFlow.labels,
        datasets: [
          {
            label: 'Today\'s Seated Count',
            data: CANTEEN_DATA.crowdFlow.withStaggering,
            borderColor: '#720026',
            backgroundColor: 'rgba(114, 0, 38, 0.1)',
            fill: true,
            tension: 0.35
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }
      }
    });
  }

  renderStaffDemandChart() {
    const ctx = document.getElementById('staff-demand-chart');
    if (!ctx || typeof Chart === 'undefined') return;

    if (this.charts.staffDemand) this.charts.staffDemand.destroy();
    this.charts.staffDemand = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: CANTEEN_DATA.foodDemand.map(d => d.name),
        datasets: [
          {
            label: 'Expected Demand',
            data: CANTEEN_DATA.foodDemand.map(d => d.expectedDemand),
            backgroundColor: '#e65100'
          },
          {
            label: 'Ready Stock',
            data: CANTEEN_DATA.foodDemand.map(d => d.readyStock),
            backgroundColor: '#16a34a'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom' } }
      }
    });
  }

  renderStaffCrowdChart() {
    const ctx = document.getElementById('staff-crowd-chart');
    if (!ctx || typeof Chart === 'undefined') return;

    if (this.charts.staffCrowd) this.charts.staffCrowd.destroy();
    this.charts.staffCrowd = new Chart(ctx, {
      type: 'line',
      data: {
        labels: CANTEEN_DATA.crowdFlow.labels,
        datasets: [
          {
            label: 'Live Hall Density',
            data: CANTEEN_DATA.crowdFlow.withStaggering,
            borderColor: '#e65100',
            backgroundColor: 'rgba(230, 81, 0, 0.15)',
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  /* -------------------------------------------------------------
     10. CLOCK & TOAST UTILITIES
     ------------------------------------------------------------- */
  startLiveClocks() {
    setInterval(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const clock = document.getElementById('staff-live-clock');
      if (clock) clock.textContent = timeStr;
    }, 1000);
  }

  showToast(message, icon = '🔔') {
    const container = document.getElementById('app-toast');
    const msgElem = document.getElementById('toast-message');
    const iconElem = document.getElementById('toast-icon');
    if (!container || !msgElem) return;

    msgElem.textContent = message;
    if (iconElem) iconElem.textContent = icon;
    container.classList.remove('hidden');

    setTimeout(() => {
      container.classList.add('hidden');
    }, 3800);
  }

  setupEventListeners() {
    // Escape key closes modals or floating overlays
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const studentSidebar = document.getElementById('student-sidebar');
        if (studentSidebar) studentSidebar.classList.remove('open');
      }
    });
  }
}

// Instantiate global app controller
const app = new SmartCanteenApp();
