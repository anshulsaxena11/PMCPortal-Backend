const express = require('express')
const routes = express.Router()
const UserCtrl = require('../../controller/usercontroller')
const upload   = require('../../middleware/filemidleware')
const authMiddleware = require('../../middleware/authmiddleware')
// post api
routes.post('/perseonalDetails',authMiddleware,upload.single('file'),UserCtrl.perseonalDetails)
routes.post('/deviceList-Post',authMiddleware,UserCtrl.deviceList)
routes.post('/directrate',authMiddleware,UserCtrl.directrate)
routes.post('/ProjectTypeList-Post',authMiddleware,UserCtrl.ProjectTypeList)
routes.post('/report',authMiddleware,upload.any(),UserCtrl.postReport)
routes.post('/roundList',authMiddleware,UserCtrl.addNewRound)
routes.post('/project-mapping', authMiddleware,UserCtrl.projectMapping);
routes.post('/skills',authMiddleware,UserCtrl.skillMapping)
routes.post('/toolsandHardwareMaster',authMiddleware,UserCtrl.postToolsAndHardwareMaster)
routes.post('/toolsAndHardware',authMiddleware,UserCtrl.postToolsAndHardware)
routes.post('/TenderTrackingDetails',authMiddleware,upload.single('file'),UserCtrl.TenderTrackingDetails)
//put
routes.put('/projectDetails/:id',authMiddleware,upload.single('workOrder'),UserCtrl.editProjectDetails)
routes.put('/report/:id',authMiddleware,upload.any(),UserCtrl.updateReportById)
routes.put('/toolsandHardwareMaster/:id',authMiddleware,UserCtrl.editToolsAndData)
routes.put('/toolsAndHardware/:id',authMiddleware,UserCtrl.editToolsAndHardware)
routes.put('/timeline/:id',authMiddleware,UserCtrl.timelinePhase)
routes.put('/tenderTracking/:id',authMiddleware,upload.single('tenderDocument'),UserCtrl.updateTenderById)
routes.put('/reportDeleted/:id',authMiddleware,UserCtrl.deleteTrue)
//get
routes.get('/deviceList',authMiddleware,UserCtrl.getdeviceList)
routes.get('/ProjectTypeList',authMiddleware,UserCtrl.getProjectTypeList)
routes.get('/AllprojectDetails',authMiddleware,UserCtrl.getAllProjectDetails)
routes.get('/projectName',authMiddleware,UserCtrl.getProjectName)
routes.get('/directrate' ,authMiddleware,UserCtrl.getDirectrateList)
routes.get('/projectDetails',authMiddleware,UserCtrl.getProjecDetails)
routes.get('/report',authMiddleware,UserCtrl.getReportDetails);
routes.get('/report/:id',authMiddleware,UserCtrl.getReportById)
routes.get('/allreport',authMiddleware,UserCtrl.getAllReport);
routes.get('/vulnerability',authMiddleware,UserCtrl.getVulnerability);
routes.get('/round',authMiddleware,UserCtrl.getRound)
routes.get('/fullreport',authMiddleware,UserCtrl.getFullReport)
routes.get('/roundList',authMiddleware,UserCtrl.getAllRound)
routes.get('/stpiEmp',authMiddleware,UserCtrl.getStpiEmpListActive)
routes.get('/toolsandHardwareMaster',authMiddleware,UserCtrl.getToolsAndHardware)
routes.get('/toolsAndHardware',authMiddleware,UserCtrl.getToolsAndHardwareList)
routes.get('/Type-Of-Work',authMiddleware,UserCtrl.getTypeOfWork)
routes.get('/VulnerabilityListSpecific',authMiddleware,UserCtrl.getVulnabilityListSpecific)
routes.post('/TenderTrackingDetails',authMiddleware,upload.single('file'),UserCtrl.TenderTrackingDetails)
routes.get('/Tender',authMiddleware,UserCtrl.getTenderDetails)
routes.get('/Alltender',authMiddleware,UserCtrl.getAllTenderList)
routes.get('/state',authMiddleware,UserCtrl.getState)
routes.get('/EmpListTF',authMiddleware,UserCtrl.getEmpListTaskForce)
routes.get('/devices-list',authMiddleware,UserCtrl.getNetworkDeviceList)
//get by id
routes.get('/project/:id',authMiddleware,UserCtrl.getProjectTypeById)
routes.get('/projectDetails/:id',authMiddleware,UserCtrl.getProjecDetailsById)
routes.get('/report/:id',authMiddleware,UserCtrl.getReportDetailsById)
routes.get('/timeline/:id',authMiddleware,UserCtrl.timeline)
routes.get('/tenderTracking/:id',authMiddleware,UserCtrl.getTenderById)
routes.put('/tenderTracking/:id',authMiddleware,upload.single('tenderDocument'),UserCtrl.updateTenderById)
routes.get('/checkTenderName/',authMiddleware,UserCtrl.checkTenderName);
routes.put('/soft-delete/:id',authMiddleware,UserCtrl.deleteTenderById);

module.exports = routes 