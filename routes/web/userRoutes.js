const express = require('express')
const routes = express.Router()
const UserCtrl = require('../../controller/usercontroller')
const upload   = require('../../middleware/filemidleware')
const authMiddleware = require('../../middleware/authMiddleware');
const allowRoles = require("../../middleware/allowRole");
// post api
routes.post('/perseonalDetails',upload.single('file'),UserCtrl.perseonalDetails)
routes.post('/deviceList-Post',UserCtrl.deviceList)
routes.post('/directrate',UserCtrl.directrate)
routes.post('/ProjectTypeList-Post',UserCtrl.ProjectTypeList)
routes.post('/report',upload.any(),UserCtrl.postReport)
routes.post('/roundList',UserCtrl.addNewRound)
routes.post('/project-mapping',UserCtrl.projectMapping);
routes.post('/skills',UserCtrl.skillMapping)
routes.post('/toolsandHardwareMaster',UserCtrl.postToolsAndHardwareMaster)
routes.post('/toolsAndHardware',UserCtrl.postToolsAndHardware)
routes.post('/TenderTrackingDetails',upload.single('file'),UserCtrl.TenderTrackingDetails)
//put
routes.put('/projectDetails/:id',upload.single('workOrder'),UserCtrl.editProjectDetails)
routes.put('/report/:id',upload.any(),UserCtrl.updateReportById)
routes.put('/toolsandHardwareMaster/:id',UserCtrl.editToolsAndData)
routes.put('/toolsAndHardware/:id',UserCtrl.editToolsAndHardware)
routes.put('/timeline/:id',UserCtrl.timelinePhase)
routes.put('/tenderTracking/:id',upload.single('tenderDocument'),UserCtrl.updateTenderById)
routes.put('/reportDeleted/:id',UserCtrl.deleteTrue)
//get
routes.get('/deviceList',authMiddleware,allowRoles('Admin'),UserCtrl.getdeviceList)
routes.get('/ProjectTypeList',authMiddleware,allowRoles('Admin'),UserCtrl.getProjectTypeList)
routes.get('/AllprojectDetails',authMiddleware,allowRoles('Admin'),UserCtrl.getAllProjectDetails)
routes.get('/projectName',authMiddleware,allowRoles('Admin'),UserCtrl.getProjectName)
routes.get('/directrate' ,authMiddleware,allowRoles('Admin'),UserCtrl.getDirectrateList)
routes.get('/projectDetails',authMiddleware,allowRoles('Admin'),UserCtrl.getProjecDetails)
routes.get('/report',authMiddleware,allowRoles('Admin'),UserCtrl.getReportDetails);
routes.get('/report/:id',authMiddleware,allowRoles('Admin'),UserCtrl.getReportById)
routes.get('/allreport',authMiddleware,allowRoles('Admin'),UserCtrl.getAllReport);
routes.get('/vulnerability',authMiddleware,allowRoles('Admin'),UserCtrl.getVulnerability);
routes.get('/round',authMiddleware,allowRoles('Admin'),UserCtrl.getRound)
routes.get('/fullreport',authMiddleware,allowRoles('Admin'),UserCtrl.getFullReport)
routes.get('/roundList',authMiddleware,allowRoles('Admin'),UserCtrl.getAllRound)
routes.get('/stpiEmp',authMiddleware,allowRoles('Admin'),UserCtrl.getStpiEmpListActive)
routes.get('/toolsandHardwareMaster',authMiddleware,allowRoles('Admin'),authMiddleware,allowRoles('Admin','SubAdmin'),UserCtrl.getToolsAndHardware)
routes.get('/toolsAndHardware',authMiddleware,allowRoles('Admin'),UserCtrl.getToolsAndHardwareList)
routes.get('/Type-Of-Work',authMiddleware,allowRoles('Admin'),UserCtrl.getTypeOfWork)
routes.get('/VulnerabilityListSpecific',authMiddleware,allowRoles('Admin'),UserCtrl.getVulnabilityListSpecific)
routes.post('/TenderTrackingDetails',authMiddleware,allowRoles('Admin'),upload.single('file'),UserCtrl.TenderTrackingDetails)
routes.get('/Tender',authMiddleware,allowRoles('Admin'),UserCtrl.getTenderDetails)
routes.get('/Alltender',authMiddleware,allowRoles('Admin'),UserCtrl.getAllTenderList)
routes.get('/state',authMiddleware,allowRoles('Admin'),UserCtrl.getState)
routes.get('/EmpListTF',authMiddleware,allowRoles('Admin'),UserCtrl.getEmpListTaskForce)
routes.get('/devices-list',authMiddleware,allowRoles('Admin'),UserCtrl.getNetworkDeviceList)
//get by id
routes.get('/project/:id',authMiddleware,allowRoles('Admin'),UserCtrl.getProjectTypeById)
routes.get('/projectDetails/:id',authMiddleware,allowRoles('Admin'),UserCtrl.getProjecDetailsById)
routes.get('/report/:id',authMiddleware,allowRoles('Admin'),UserCtrl.getReportDetailsById)
routes.get('/timeline/:id',authMiddleware,allowRoles('Admin'),UserCtrl.timeline)
routes.get('/tenderTracking/:id',authMiddleware,allowRoles('Admin'),UserCtrl.getTenderById)
routes.put('/tenderTracking/:id',authMiddleware,allowRoles('Admin'),upload.single('tenderDocument'),UserCtrl.updateTenderById)
routes.get('/checkTenderName/',authMiddleware,allowRoles('Admin'),UserCtrl.checkTenderName);
routes.put('/soft-delete/:id',authMiddleware,allowRoles('Admin'),UserCtrl.deleteTenderById);

module.exports = routes 