const express = require('express')
const routes = express.Router()
const adminCtrl = require('../../controller/admincontroller') 
const authMiddleware = require('../../middleware/authmiddleware');
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
routes.get('/validate', authMiddleware, (req, res) => {
  return res.status(200).json({ message: 'Token is valid' });
});
routes.post('/logout',adminCtrl.logout) 
routes.post('/forget-Password',adminCtrl.forgetPassword)
routes.get('/user',authMiddleware,allowRoles('Admin'),adminCtrl.getloginDetails)
routes.get('/register/:id',authMiddleware,allowRoles('Admin'),adminCtrl.getUserDataById)
routes.put('/register/:id',authMiddleware,allowRoles('Admin'),adminCtrl.updateUserDataById)
routes.post('/check-email',adminCtrl.checkEmail)
routes.post('/password-Change',adminCtrl.passwordReset)
routes.post('/reset-password',adminCtrl.resetPasswordVerify)

module.exports = routes 