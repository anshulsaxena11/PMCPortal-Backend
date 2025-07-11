const express = require('express')
const routes = express.Router()
const adminCtrl = require('../../controller/admincontroller') 
const authMiddleware = require('../../middleware/authMiddleware');
const allowRoles = require("../../middleware/allowRole");

routes.post('/syncEmp',adminCtrl.sync);
routes.get('/empList', authMiddleware, allowRoles('Admin'), adminCtrl.getStpiEmpList);
routes.put('/empList',adminCtrl.empMapping)
routes.get('/stpiCentre',adminCtrl.stpiCentre)
routes.get('/srpiEmpType',adminCtrl.stpiEmpType)
routes.get('/stpiDirectorates',adminCtrl.stpidir)
routes.put('/taskMember',adminCtrl.taskForceMemberStatus)
routes.post('/register',adminCtrl.register)
routes.post('/login', adminCtrl.login);
routes.get('/validate',authMiddleware)
routes.post('/logout',adminCtrl.logout)

module.exports = routes 