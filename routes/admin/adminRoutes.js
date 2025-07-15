const express = require('express')
const routes = express.Router()
const adminCtrl = require('../../controller/admincontroller') 
const authMiddleware = require('../../middleware/authMiddleware');
const allowRoles = require("../../middleware/allowRole");

routes.post('/syncEmp',authMiddleware,allowRoles('Admin'),adminCtrl.sync);
routes.get('/empList', authMiddleware, allowRoles('Admin'), adminCtrl.getStpiEmpList);
routes.put('/empList',authMiddleware,allowRoles('Admin'),adminCtrl.empMapping)
routes.get('/stpiCentre',authMiddleware,allowRoles('Admin','SubAdmin'),adminCtrl.stpiCentre)
routes.get('/srpiEmpType',authMiddleware,allowRoles('Admin','SubAdmin'),adminCtrl.stpiEmpType)
routes.get('/stpiDirectorates',authMiddleware,allowRoles('Admin','SubAdmin'),adminCtrl.stpidir)
routes.put('/taskMember',authMiddleware,allowRoles('Admin'),adminCtrl.taskForceMemberStatus)
routes.post('/register',authMiddleware,allowRoles('Admin'),adminCtrl.register)
routes.post('/login', adminCtrl.login);
routes.get('/validate',authMiddleware)
routes.post('/logout',adminCtrl.logout)

module.exports = routes 