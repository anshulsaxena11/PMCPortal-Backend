const express = require('express')
const routes = express.Router()
const UserCtrl = require('../../controller/usercontroller')
const upload   = require('../../middleware/filemidleware')
const authMiddleware = require('../../middleware/authmiddleware');
const allowRoles = require("../../middleware/allowRole");
// post api
routes.post('/perseonalDetails',authMiddleware,allowRoles('Admin','SubAdmin'),upload.single('file'),UserCtrl.perseonalDetails)
routes.post('/deviceList-Post',authMiddleware,allowRoles('Admin'),UserCtrl.deviceList)
routes.post('/directrate',authMiddleware,allowRoles('Admin'),UserCtrl.directrate)
routes.post('/ProjectTypeList-Post',authMiddleware,allowRoles('Admin'),UserCtrl.ProjectTypeList)
routes.post('/report',authMiddleware,allowRoles('Admin','SubAdmin'),upload.any(),UserCtrl.postReport)
routes.put('/report/status',authMiddleware,allowRoles('Admin','SubAdmin'),UserCtrl.updateRoundStatus)
routes.post('/roundList',authMiddleware,allowRoles('Admin','SubAdmin'),UserCtrl.addNewRound)
routes.post('/project-mapping',authMiddleware,allowRoles('Admin','SubAdmin'),UserCtrl.projectMapping);
routes.post('/skills',authMiddleware,allowRoles('Admin'),UserCtrl.skillMapping)
routes.post('/toolsandHardwareMaster',authMiddleware,allowRoles('Admin'),UserCtrl.postToolsAndHardwareMaster)
routes.post('/toolsAndHardware',authMiddleware,allowRoles('Admin','SubAdmin'),UserCtrl.postToolsAndHardware)
routes.post('/checkTenderName',authMiddleware,allowRoles('Admin','SubAdmin'),upload.single('tenderDocument'),UserCtrl.postCreateTender);
routes.post('/typeOfWork',authMiddleware,allowRoles('Admin'),UserCtrl.postTypeOfWork);
routes.post('/certificate',authMiddleware,allowRoles('Admin','SubAdmin','User'),upload.single('file'),UserCtrl.postCertificate),
routes.post('/domainSector',authMiddleware,allowRoles('Admin'),upload.single('file'),UserCtrl.postDomainSector),
routes.post('/certificate-Master',authMiddleware,allowRoles('Admin'),UserCtrl.postCertificateMaster),
routes.post('/certificate-Type-Master',authMiddleware,allowRoles('Admin'),UserCtrl.postCertificateTypeMaster),
//put
routes.put('/projectDetails/:id',authMiddleware,allowRoles('Admin','SubAdmin'),upload.single('workOrder'),UserCtrl.editProjectDetails)
routes.put('/report/:id',authMiddleware,allowRoles('Admin','SubAdmin'),upload.any(),UserCtrl.updateReportById)
routes.put('/toolsandHardwareMaster/:id',authMiddleware,allowRoles('Admin'),UserCtrl.editToolsAndData)
routes.put('/toolsAndHardware/:id',authMiddleware,allowRoles('Admin','SubAdmin','User'),UserCtrl.editToolsAndHardware)
routes.put('/timeline/:id',authMiddleware,allowRoles('Admin','SubAdmin'),upload.fields([{ name: "completetionCertificate", maxCount: 1 },{ name: "clientFeedback", maxCount: 1 },{ name: "anyOtherDocument", maxCount: 1 },]),UserCtrl.timelinePhase)
routes.put('/tenderTracking/:id',authMiddleware,allowRoles('Admin','SubAdmin'),upload.single('tenderDocument'),UserCtrl.updateTenderById)
routes.put('/reportDeleted/:id',authMiddleware,allowRoles('Admin','SubAdmin'),UserCtrl.deleteTrue)
routes.put('/soft-delete/:id',authMiddleware,allowRoles('Admin','SubAdmin'),UserCtrl.deleteTenderById);
routes.put('/projects-soft-delete/:id',authMiddleware,allowRoles('Admin','SubAdmin'),UserCtrl.deleteprojectsById);
routes.put('/typeOfWork/:id',authMiddleware,allowRoles('Admin'),UserCtrl.putTypeOfWorkById)
routes.put('/typeOfWorkDelete/:id',authMiddleware,allowRoles('Admin'),UserCtrl.deleteTypeOfWork)
routes.put('/toolsAndHardwareMasterDelete/:id',authMiddleware,allowRoles('Admin'),UserCtrl.deleteToolsAndHardwareMaster)
routes.put('/toolsAndHardwareDelete/:id',authMiddleware,allowRoles('Admin'),UserCtrl.deleteToolsAndHardware)
routes.put('/ScopeOfWork/:id',authMiddleware,allowRoles('Admin'),UserCtrl.deleteScopeOfWork)
routes.put('/ScopeOfWorkedit/:id',authMiddleware,allowRoles('Admin'),UserCtrl.updateScopeOfWork)
routes.put('/certificate-soft-delete/:id',authMiddleware,allowRoles('Admin','SubAdmin'),UserCtrl.deleteCertificate)
routes.put('/certificate/:id',authMiddleware,allowRoles('Admin','SubAdmin'),upload.single('uploadeCertificate'),UserCtrl.editCertificateDetails)
routes.put('/taskForceMember/:id',authMiddleware,allowRoles('Admin'),UserCtrl.updateTaskForceMember)
routes.put('/domain-Sector/:id',authMiddleware,allowRoles('Admin'),UserCtrl.editDomain)
routes.put('/certificate-Master/:id',authMiddleware,allowRoles('Admin'),UserCtrl.editCertificate)
//get
routes.get('/deviceList',authMiddleware,allowRoles('Admin','SubAdmin','User'),UserCtrl.getdeviceList)
routes.get('/ProjectTypeList',authMiddleware,allowRoles('Admin','SubAdmin','User'),UserCtrl.getProjectTypeList)
routes.get('/AllprojectDetails',authMiddleware,allowRoles('Admin','SubAdmin','User'),UserCtrl.getAllProjectDetails)
routes.get('/projectName',authMiddleware,allowRoles('Admin','SubAdmin','User'),UserCtrl.getProjectName)
routes.get('/directrate' ,authMiddleware,allowRoles('Admin','SubAdmin','User'),UserCtrl.getDirectrateList)
routes.get('/projectDetails',authMiddleware,allowRoles('Admin','SubAdmin','User'),UserCtrl.getProjecDetails)
routes.get('/AllprojectData',authMiddleware,allowRoles('Admin','SubAdmin','User'),UserCtrl.getAllprojectData)
routes.get('/report',authMiddleware,allowRoles('Admin','SubAdmin','User'),UserCtrl.getReportDetails);
routes.get('/report/:id',authMiddleware,allowRoles('Admin','SubAdmin','User'),UserCtrl.getReportById)
routes.get('/allreport',authMiddleware,allowRoles('Admin','SubAdmin','User'),UserCtrl.getAllReport);
routes.get('/vulnerability',authMiddleware,allowRoles('Admin','SubAdmin','User'),UserCtrl.getVulnerability);
routes.get('/round',authMiddleware,allowRoles('Admin','SubAdmin','User'),UserCtrl.getRound)
routes.get('/fullreport',authMiddleware,allowRoles('Admin'),UserCtrl.getFullReport)
routes.get('/roundList',authMiddleware,allowRoles('Admin','SubAdmin','User'),UserCtrl.getAllRound)
routes.get('/stpiEmp',authMiddleware,allowRoles('Admin','SubAdmin','User'),UserCtrl.getStpiEmpListActive)
routes.get('/toolsandHardwareMaster',authMiddleware,allowRoles('Admin','SubAdmin','User'),UserCtrl.getToolsAndHardware)
routes.get('/toolsAndHardware',authMiddleware,allowRoles('Admin','SubAdmin','User'),UserCtrl.getToolsAndHardwareList)
routes.get('/Type-Of-Work',authMiddleware,allowRoles('Admin','SubAdmin','User'),UserCtrl.getTypeOfWork)
routes.get('/VulnerabilityListSpecific',authMiddleware,allowRoles('Admin','SubAdmin','User'),UserCtrl.getVulnabilityListSpecific)
routes.get('/Tender',authMiddleware,allowRoles('Admin','SubAdmin','User'),UserCtrl.getTenderDetails)
routes.get('/Alltender',authMiddleware,allowRoles('Admin','SubAdmin','User'),UserCtrl.getAllTenderList)
routes.get('/state',authMiddleware,allowRoles('Admin','SubAdmin','User'),UserCtrl.getState)
routes.get('/EmpListTF',authMiddleware,allowRoles('Admin','SubAdmin','User'),UserCtrl.getEmpListTaskForce)
routes.get('/EmpListSc',authMiddleware,allowRoles('Admin','SubAdmin','User'),UserCtrl.getEmpListStateCordinator)
routes.get('/devices-list',authMiddleware,allowRoles('Admin','SubAdmin','User'),UserCtrl.getNetworkDeviceList)
routes.get('/searchName',authMiddleware,allowRoles('Admin','SubAdmin'),UserCtrl.reportNameList)
routes.get('/notification',authMiddleware,allowRoles('Admin','SubAdmin','User'),UserCtrl.notification)
routes.get('/certificate',authMiddleware,allowRoles('Admin','SubAdmin','User'),UserCtrl.getCertificate)
routes.get('/certificate-Master',authMiddleware,allowRoles('Admin','SubAdmin','User'),UserCtrl.getCertificateMaster)
routes.get('/types',authMiddleware,allowRoles('Admin'),UserCtrl.getTypeList)
routes.get('/domain-Sector',authMiddleware,allowRoles('Admin','SubAdmin','User'),UserCtrl.getDomainMaster)
routes.get('/certificate-Type-Master',authMiddleware,allowRoles('Admin','SubAdmin','User'),UserCtrl.getCertificateTypeMaster)
//get by id
routes.get('/project/:id',authMiddleware,allowRoles('Admin','SubAdmin','User'),UserCtrl.getProjectTypeById)
routes.get('/projectDetails/:id',authMiddleware,allowRoles('Admin','SubAdmin','User'),UserCtrl.getProjecDetailsById)
routes.get('/report/:id',authMiddleware,allowRoles('Admin'),UserCtrl.getReportDetailsById)
routes.get('/timeline/:id',authMiddleware,allowRoles('Admin','SubAdmin','User'),UserCtrl.timeline)
routes.get('/tenderTracking/:id',authMiddleware,allowRoles('Admin','SubAdmin','User'),UserCtrl.getTenderById)
routes.put('/tenderTracking/:id',authMiddleware,allowRoles('Admin','SubAdmin'),upload.single('tenderDocument'),UserCtrl.updateTenderById)
routes.get('/typeOfWork/:id',authMiddleware,allowRoles('Admin'),UserCtrl.getTypeOfWorkById)
routes.get('/scopeOfWork/:id',authMiddleware,allowRoles('Admin'),UserCtrl.getScopeOfWorkById)
routes.get('/certificate/:id',authMiddleware,allowRoles('Admin','SubAdmin','User'),UserCtrl.getCertificateById)
routes.get('/taskForceMember/:id',authMiddleware,allowRoles('Admin'),UserCtrl.getTaskForceMemberById)
routes.get('/usercertificate/:userid',authMiddleware,allowRoles('Admin','SubAdmin','User'),UserCtrl.getCertificateByUserId)
routes.get('/EmpData/:id',authMiddleware,allowRoles('Admin','SubAdmin','User'),UserCtrl.getEmpDataById)
routes.get('/EmployeeProjects/:id',authMiddleware,allowRoles('Admin','SubAdmin','User'),UserCtrl.getEmployeeProjects)
routes.get('/domain-Sector/:id',authMiddleware,allowRoles('Admin','SubAdmin','User'),UserCtrl.getDomainById)
routes.get('/certificate-Master/:id',authMiddleware,allowRoles('Admin'),UserCtrl.getCertificateMasterById)
 
module.exports = routes 