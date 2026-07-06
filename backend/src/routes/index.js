const express = require('express');
const authRoutes = require('./authRoutes');
const uploadRoutes = require('./uploadRoutes');

const router = express.Router();

router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Employee Task Manager API is healthy.',
    data: { uptime: process.uptime() },
    errors: [],
    timestamp: new Date().toISOString()
  });
});

router.use('/auth', authRoutes);
router.use('/uploads', uploadRoutes);

module.exports = router;
