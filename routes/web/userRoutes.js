const express = require('express')
const routes = express.Router()
const UserCtrl = require('../../controller/usercontroller')
const upload   = require('../../middleware/filemidleware')
// post api
routes.post('/perseonalDetails',upload.single('file'),UserCtrl.perseonalDetails)
routes.post('/deviceList-Post',UserCtrl.deviceList)
routes.post('/directrate',UserCtrl.directrate)
routes.post('/ProjectTypeList-Post',UserCtrl.ProjectTypeList)
routes.post('/report',upload.any(),UserCtrl.postReport)
routes.post('/roundList',UserCtrl.addNewRound)
routes.post('/project-mapping', UserCtrl.projectMapping);
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
routes.get('/deviceList',UserCtrl.getdeviceList)
routes.get('/ProjectTypeList',UserCtrl.getProjectTypeList)
routes.get('/AllprojectDetails',UserCtrl.getAllProjectDetails)
routes.get('/projectName',UserCtrl.getProjectName)
routes.get('/directrate' ,UserCtrl.getDirectrateList)
routes.get('/projectDetails',UserCtrl.getProjecDetails)
routes.get('/report',UserCtrl.getReportDetails);
routes.get('/report/:id',UserCtrl.getReportById)
routes.get('/allreport',UserCtrl.getAllReport);
routes.get('/vulnerability',UserCtrl.getVulnerability);
routes.get('/round',UserCtrl.getRound)
routes.get('/fullreport',UserCtrl.getFullReport)
routes.get('/roundList',UserCtrl.getAllRound)
routes.get('/stpiEmp',UserCtrl.getStpiEmpListActive)
routes.get('/toolsandHardwareMaster',UserCtrl.getToolsAndHardware)
routes.get('/toolsAndHardware',UserCtrl.getToolsAndHardwareList)
routes.get('/Type-Of-Work',UserCtrl.getTypeOfWork)
routes.get('/VulnerabilityListSpecific',UserCtrl.getVulnabilityListSpecific)
routes.post('/TenderTrackingDetails',upload.single('file'),UserCtrl.TenderTrackingDetails)
routes.get('/Tender',UserCtrl.getTenderDetails)
routes.get('/Alltender',UserCtrl.getAllTenderList)
routes.get('/state',UserCtrl.getState)
routes.get('/EmpListTF',UserCtrl.getEmpListTaskForce)
routes.get('/devices-list',UserCtrl.getNetworkDeviceList)
//get by id
routes.get('/project/:id',UserCtrl.getProjectTypeById)
routes.get('/projectDetails/:id',UserCtrl.getProjecDetailsById)
routes.get('/report/:id',UserCtrl.getReportDetailsById)
routes.get('/timeline/:id',UserCtrl.timeline)
routes.get('/tenderTracking/:id',UserCtrl.getTenderById)
routes.put('/tenderTracking/:id',upload.single('tenderDocument'),UserCtrl.updateTenderById)
routes.get('/checkTenderName/', UserCtrl.checkTenderName);
routes.put('/soft-delete/:id',UserCtrl.deleteTenderById);

module.exports = routes 