/**
 * Department Departure Timings Controller
 * Lourdes Matha College Smart Canteen
 * Provides Role-Based Access Control (RBAC) for department departure schedules.
 */

// In-memory department schedules (shared across campus users)
let departments = [
  { code: "CS", name: "Computer Science", group: "Group C", departureWindow: "11:04 AM", expectedArrival: "11:09 AM", walkTimeMinutes: 5, recessWindow: "11:00 AM – 11:15 AM", studentCount: 145 },
  { code: "CS WITH AI", name: "Computer Science with AI", group: "Group B", departureWindow: "11:02 AM", expectedArrival: "11:07 AM", walkTimeMinutes: 5, recessWindow: "11:00 AM – 11:15 AM", studentCount: 110 },
  { code: "EC", name: "Electronics & Communication", group: "Group D", departureWindow: "11:06 AM", expectedArrival: "11:11 AM", walkTimeMinutes: 5, recessWindow: "11:00 AM – 11:15 AM", studentCount: 95 },
  { code: "EEE", name: "Electrical & Electronics", group: "Group E", departureWindow: "11:08 AM", expectedArrival: "11:13 AM", walkTimeMinutes: 5, recessWindow: "11:00 AM – 11:15 AM", studentCount: 75 },
  { code: "ME", name: "Mechanical Engineering", group: "Group A", departureWindow: "11:00 AM", expectedArrival: "11:05 AM", walkTimeMinutes: 5, recessWindow: "11:00 AM – 11:15 AM", studentCount: 120 },
  { code: "CIVIL", name: "Civil Engineering", group: "Group A+", departureWindow: "11:01 AM", expectedArrival: "11:06 AM", walkTimeMinutes: 5, recessWindow: "11:00 AM – 11:15 AM", studentCount: 85 },
  { code: "ARTS", name: "Applied Arts & Sciences", group: "Group C+", departureWindow: "11:05 AM", expectedArrival: "11:10 AM", walkTimeMinutes: 5, recessWindow: "11:00 AM – 11:15 AM", studentCount: 90 },
  { code: "HOTEL MANAGEMENT", name: "Hotel Management & Catering", group: "Group D+", departureWindow: "11:07 AM", expectedArrival: "11:12 AM", walkTimeMinutes: 5, recessWindow: "11:00 AM – 11:15 AM", studentCount: 65 }
];

// Helper: Verify Admin Role
const isAdmin = (req) => {
  const role = req.headers['x-user-role'] || req.body?.role || req.query?.role;
  return role === 'admin';
};

// GET /api/departments (Accessible by all users: Students, Staff, Admin)
exports.getDepartments = (req, res) => {
  res.json({
    success: true,
    count: departments.length,
    departments
  });
};

// PUT /api/departments/:code (Admin-only RBAC)
exports.updateDepartmentTiming = (req, res) => {
  if (!isAdmin(req)) {
    return res.status(403).json({
      success: false,
      message: "Access Denied: Only administrator users can create, edit, update, or delete department departure timings."
    });
  }

  const { code } = req.params;
  const { departureWindow, expectedArrival, group } = req.body;

  const dept = departments.find(d => d.code.toUpperCase() === code.toUpperCase());
  if (!dept) {
    return res.status(404).json({ success: false, message: "Department not found" });
  }

  if (departureWindow) dept.departureWindow = departureWindow;
  if (expectedArrival) dept.expectedArrival = expectedArrival;
  if (group) dept.group = group;

  res.json({
    success: true,
    message: `Departure timing for ${dept.code} updated to ${dept.departureWindow}`,
    department: dept
  });
};

// POST /api/departments (Admin-only RBAC)
exports.createDepartment = (req, res) => {
  if (!isAdmin(req)) {
    return res.status(403).json({
      success: false,
      message: "Access Denied: Only administrator users can create, edit, update, or delete department departure timings."
    });
  }

  const { code, name, group, departureWindow, expectedArrival, walkTimeMinutes, recessWindow } = req.body;
  if (!code || !departureWindow) {
    return res.status(400).json({ success: false, message: "Department code and departureWindow are required." });
  }

  const existing = departments.find(d => d.code.toUpperCase() === code.toUpperCase());
  if (existing) {
    return res.status(400).json({ success: false, message: "Department code already exists." });
  }

  const newDept = {
    code: code.toUpperCase(),
    name: name || code,
    group: group || "Group C",
    departureWindow,
    expectedArrival: expectedArrival || "11:09 AM",
    walkTimeMinutes: walkTimeMinutes || 5,
    recessWindow: recessWindow || "11:00 AM – 11:15 AM",
    studentCount: 50
  };

  departments.push(newDept);
  res.status(201).json({
    success: true,
    message: `Department ${newDept.code} created successfully`,
    department: newDept
  });
};

// DELETE /api/departments/:code (Admin-only RBAC)
exports.deleteDepartment = (req, res) => {
  if (!isAdmin(req)) {
    return res.status(403).json({
      success: false,
      message: "Access Denied: Only administrator users can create, edit, update, or delete department departure timings."
    });
  }

  const { code } = req.params;
  const index = departments.findIndex(d => d.code.toUpperCase() === code.toUpperCase());
  if (index === -1) {
    return res.status(404).json({ success: false, message: "Department not found." });
  }

  const deleted = departments.splice(index, 1);
  res.json({
    success: true,
    message: `Department ${code} timing deleted successfully`,
    department: deleted[0]
  });
};
