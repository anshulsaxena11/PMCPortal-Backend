const express = require('express')
const routes = express.Router()
const UserCtrl = require('../../controller/usercontroller')
const upload   = require('../../middleware/filemidleware')
const authMiddleware = require('../../middleware/authMiddleware');
const allowRoles = require("../../middleware/allowRole");
// post api
routes.post('/perseonalDetails',authMiddleware,allowRoles('Admin','SubAdmin'),upload.single('file'),UserCtrl.perseonalDetails)
routes.post('/deviceList-Post',authMiddleware,allowRoles('Admin'),UserCtrl.deviceList)
routes.post('/directrate',authMiddleware,allowRoles('Admin'),UserCtrl.directrate)
routes.post('/ProjectTypeList-Post',authMiddleware,allowRoles('Admin'),UserCtrl.ProjectTypeList)
routes.post('/report',authMiddleware,allowRoles('Admin','SubAdmin'),upload.any(),UserCtrl.postReport)
routes.post('/roundList',authMiddleware,allowRoles('Admin','SubAdmin'),UserCtrl.addNewRound)
routes.post('/project-mapping',authMiddleware,allowRoles('Admin','SubAdmin'),UserCtrl.projectMapping);
routes.post('/skills',authMiddleware,allowRoles('Admin'),UserCtrl.skillMapping)
routes.post('/toolsandHardwareMaster',authMiddleware,allowRoles('Admin'),UserCtrl.postToolsAndHardwareMaster)
routes.post('/toolsAndHardware',authMiddleware,allowRoles('Admin','SubAdmin'),UserCtrl.postToolsAndHardware)
routes.post('/TenderTrackingDetails',authMiddleware,allowRoles('Admin','SubAdmin'),upload.single('file'),UserCtrl.TenderTrackingDetails)
//put
routes.put('/projectDetails/:id',authMiddleware,allowRoles('Admin','SubAdmin'),upload.single('workOrder'),UserCtrl.editProjectDetails)
routes.put('/report/:id',authMiddleware,allowRoles('Admin','SubAdmin'),upload.any(),UserCtrl.updateReportById)
routes.put('/toolsandHardwareMaster/:id',authMiddleware,allowRoles('Admin'),UserCtrl.editToolsAndData)
routes.put('/toolsAndHardware/:id',authMiddleware,allowRoles('Admin','SubAdmin'),UserCtrl.editToolsAndHardware)
routes.put('/timeline/:id',authMiddleware,allowRoles('Admin','SubAdmin'),UserCtrl.timelinePhase)
routes.put('/tenderTracking/:id',authMiddleware,allowRoles('Admin','SubAdmin'),upload.single('tenderDocument'),UserCtrl.updateTenderById)
routes.put('/reportDeleted/:id',authMiddleware,allowRoles('Admin','SubAdmin'),UserCtrl.deleteTrue)
//get
routes.get('/deviceList',authMiddleware,allowRoles('Admin','SubAdmin'),UserCtrl.getdeviceList)
routes.get('/ProjectTypeList',authMiddleware,allowRoles('Admin','SubAdmin'),UserCtrl.getProjectTypeList)
routes.get('/AllprojectDetails',authMiddleware,allowRoles('Admin'),UserCtrl.getAllProjectDetails)
routes.get('/projectName',authMiddleware,allowRoles('Admin','SubAdmin'),UserCtrl.getProjectName)
routes.get('/directrate' ,authMiddleware,allowRoles('Admin','SubAdmin'),UserCtrl.getDirectrateList)
routes.get('/projectDetails',authMiddleware,allowRoles('Admin','SubAdmin'),UserCtrl.getProjecDetails)
routes.get('/report',authMiddleware,allowRoles('Admin','SubAdmin'),UserCtrl.getReportDetails);
routes.get('/report/:id',authMiddleware,allowRoles('Admin','SubAdmin'),UserCtrl.getReportById)
routes.get('/allreport',authMiddleware,allowRoles('Admin'),UserCtrl.getAllReport);
routes.get('/vulnerability',authMiddleware,allowRoles('Admin','SubAdmin'),UserCtrl.getVulnerability);
routes.get('/round',authMiddleware,allowRoles('Admin'),UserCtrl.getRound)
routes.get('/fullreport',authMiddleware,allowRoles('Admin'),UserCtrl.getFullReport)
routes.get('/roundList',authMiddleware,allowRoles('Admin','SubAdmin'),UserCtrl.getAllRound)
routes.get('/stpiEmp',authMiddleware,allowRoles('Admin','SubAdmin'),UserCtrl.getStpiEmpListActive)
routes.get('/toolsandHardwareMaster',authMiddleware,allowRoles('Admin','SubAdmin'),UserCtrl.getToolsAndHardware)
routes.get('/toolsAndHardware',authMiddleware,allowRoles('Admin','SubAdmin'),UserCtrl.getToolsAndHardwareList)
routes.get('/Type-Of-Work',authMiddleware,allowRoles('Admin','SubAdmin'),UserCtrl.getTypeOfWork)
routes.get('/VulnerabilityListSpecific',authMiddleware,allowRoles('Admin','SubAdmin'),UserCtrl.getVulnabilityListSpecific)
routes.post('/TenderTrackingDetails',authMiddleware,allowRoles('Admin'),upload.single('file'),UserCtrl.TenderTrackingDetails)
routes.get('/Tender',authMiddleware,allowRoles('Admin','SubAdmin'),UserCtrl.getTenderDetails)
routes.get('/Alltender',authMiddleware,allowRoles('Admin'),UserCtrl.getAllTenderList)
routes.get('/state',authMiddleware,allowRoles('Admin','SubAdmin'),UserCtrl.getState)
routes.get('/EmpListTF',authMiddleware,allowRoles('Admin','SubAdmin'),UserCtrl.getEmpListTaskForce)
routes.get('/devices-list',authMiddleware,allowRoles('Admin','SubAdmin'),UserCtrl.getNetworkDeviceList)
//get by id
routes.get('/project/:id',authMiddleware,allowRoles('Admin','SubAdmin'),UserCtrl.getProjectTypeById)
routes.get('/projectDetails/:id',authMiddleware,allowRoles('Admin','SubAdmin'),UserCtrl.getProjecDetailsById)
routes.get('/report/:id',authMiddleware,allowRoles('Admin'),UserCtrl.getReportDetailsById)
routes.get('/timeline/:id',authMiddleware,allowRoles('Admin','SubAdmin'),UserCtrl.timeline)
routes.get('/tenderTracking/:id',authMiddleware,allowRoles('Admin','SubAdmin'),UserCtrl.getTenderById)
routes.put('/tenderTracking/:id',authMiddleware,allowRoles('Admin','SubAdmin'),upload.single('tenderDocument'),UserCtrl.updateTenderById)
routes.get('/checkTenderName/',authMiddleware,allowRoles('Admin','SubAdmin'),UserCtrl.checkTenderName);
routes.put('/soft-delete/:id',authMiddleware,allowRoles('Admin','SubAdmin'),UserCtrl.deleteTenderById);
 
module.exports = routes 