const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const orderController = require('../controllers/orderController');
const menuController = require('../controllers/menuController');
const analyticsController = require('../controllers/analyticsController');

// Auth & Users
router.post('/auth/login', authController.login);
router.get('/users/profile/:id', authController.getProfile);
router.get('/users', authController.getAllUsers);

// Menu
router.get('/menu', menuController.getMenu);
router.post('/menu', menuController.addMenuItem);
router.put('/menu/:id', menuController.updateMenuItem);

// Orders
router.post('/orders', orderController.createOrder);
router.get('/orders', orderController.getAllOrders);
router.get('/orders/student/:studentId', orderController.getOrdersByStudent);
router.put('/orders/:token/status', orderController.updateOrderStatus);

// Analytics
router.get('/analytics/financials', analyticsController.getFinancialAnalytics);
router.get('/analytics/crowd', analyticsController.getCrowdAnalytics);
router.get('/analytics/demand', analyticsController.getDemandAnalytics);

// Department Departure Timings (RBAC Protected: Admin Only for write operations)
const departmentController = require('../controllers/departmentController');
router.get('/departments', departmentController.getDepartments);
router.post('/departments', departmentController.createDepartment);
router.put('/departments/:code', departmentController.updateDepartmentTiming);
router.delete('/departments/:code', departmentController.deleteDepartment);

module.exports = router;
