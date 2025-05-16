const express = require('express');
const router = express.Router();

const { categoryStat, dashboardStat, salesWithFilter, getReportStat, getSalesTrend, getTopCategories, getCustomerActivity } = require('../controllers/statController');

router.get('/menu-to-category', categoryStat);
router.get('/dashboard-statistics', dashboardStat);
router.get('/sales-by-filter', salesWithFilter);
router.get('/reports-statistics', getReportStat);
router.get('/sales-trend', getSalesTrend);
router.get('/top-categories', getTopCategories);
router.get('/customer-activity', getCustomerActivity);

module.exports = router;