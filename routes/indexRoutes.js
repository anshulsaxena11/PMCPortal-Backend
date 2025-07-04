const express = require('express')
router = express.Router();

router.use('/user', require('./web/userRoutes'))
router.use('/admin', require('./admin/adminRoutes'))

module.exports = router;