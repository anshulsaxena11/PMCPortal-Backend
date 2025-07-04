const express = require('express')
const routes = express.Router()
const adminCtrl = require('../../controller/admincontroller') 

routes.post('/syncEmp',adminCtrl.sync);
routes.get('/empList', adminCtrl.getStpiEmpList)
routes.put('/empList',adminCtrl.empMapping)
routes.get('/stpiCentre',adminCtrl.stpiCentre)
routes.get('/srpiEmpType',adminCtrl.stpiEmpType)
routes.get('/stpiDirectorates',adminCtrl.stpidir)
routes.put('/taskMember',adminCtrl.taskForceMemberStatus)

module.exports = routes 