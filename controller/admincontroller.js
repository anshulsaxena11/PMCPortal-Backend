const axios = require('axios');
const stpiEmpDetailsModel = require('../models/StpiEmpModel')
const loginModel = require('../models/loginModel')
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../Service/email');
const adminModel = require('../models/adminModel.js')
const getClientIp = require('../utils/getClientip')
const bcrypt = require('bcrypt');

function generateRandomPassword(length = 12) {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const number = '0123456789';
  const special = '@$!%*?#&';

  const all = upper + lower + number + special;

  const getRandom = (chars) => chars[Math.floor(Math.random() * chars.length)];

 
  let password = [
    getRandom(upper),
    getRandom(lower),
    getRandom(number),
    getRandom(special),
  ];

 
  for (let i = password.length; i < length; i++) {
    password.push(getRandom(all));
  }

 
  return password
    .sort(() => Math.random() - 0.5)
    .join('');
}

const sync = async(req,res) =>{
    try{
        const response = await axios.get(process.env.API_URL,{
            headers:{'x-api-key': process.env.API_Key}
        })
  
        const data = response.data

        if (!Array.isArray(data)) {
            return res.status(400).json({ message: 'Unexpected API response' });
        }

        for (const item of data) {
            const existing = await stpiEmpDetailsModel.findOne({ empid: item.empid });
          
            if (existing) {
              const needsUpdate =
                existing.centre !== item.centre ||
                existing.empid !== item.empid ||
                existing.ename !== item.ename ||
                existing.egender !== item.egender ||
                existing.edesg !== item.edesg ||
                existing.elvl !== item.elvl ||
                existing.etpe !== item.etpe ||
                existing.edob !== item.edob ||
                existing.doij !== item.doij ||
                existing.stat !== item.stat ||
                existing.edocj !== item.edocj ||
                existing.dir !== item.dir ||
                existing.email !== item.email;
          
              if (needsUpdate) {
                await stpiEmpDetailsModel.updateOne(
                  { empid: item.empid },
                  {
                    $set: {
                        centre: item.centre,
                        ename: item.ename,
                        egender: item.egender,
                        edesg: item.edesg,
                        elvl: item.elvl,
                        etpe: item.etpe,
                        edob: item.edob,
                        doij: item.doij,
                        stat: item.stat,
                        email: item.email,
                        edocj: item.edocj,
                        dir: item.dir,
                    }
                  }
                );
              }
            } else {
             await stpiEmpDetailsModel.create({
                centre: item.centre,
                empid: item.empid,
                ename: item.ename,
                egender: item.egender,
                edesg: item.edesg,
                elvl: item.elvl,
                etpe: item.etpe,
                edob: item.edob,
                doij: item.doij,
                stat: item.stat,
                email: item.email,
                edocj: item.edocj,
                dir: item.dir
              });
            }
          }
        
        res.status(200).json({
            statusCode:200,
            message:"data has been syncronise suceefully",
        })
        
    }catch(error){
        res.status(400).json({
            statusCode:400,
            message: error,
        })
    }
}

const getStpiEmpList = async (req, res) => {
  try {
    const { page = "", limit = "", search=" ",centre=" " ,StatusNoida=" ",etpe=" ",dir=" "} = req.query;
    const query = {
      ...(search.trim()
        ? {
            $or: [
              { centre: { $regex: search, $options: "i" } },
              { etpe: { $regex: search, $options: "i" } },
              { ename: { $regex: search, $options: "i" } },
              { empid: { $regex: search, $options: "i" } },
              { dir: { $regex: search, $options: "i" } },
              ...(search.toLowerCase() === "active" || search.toLowerCase() === "not active"
                ? [
                    {
                      StatusNoida: search.toLowerCase() === "active" ? true : false,
                    },
                  ]
                : []),
            ],
          }
        : {}),
        ...(centre.trim() ? { centre: centre } : {}),  
        ...(dir.trim() ? { dir: dir } : {}),  
        ...(StatusNoida.trim() ? { StatusNoida: StatusNoida } : {}), 
        ...(etpe.trim() ? { etpe: etpe } : {}),  
    };

    const totalCount = await stpiEmpDetailsModel.countDocuments(query);
    const data = await stpiEmpDetailsModel.find(query).skip((page - 1) * limit).limit(parseInt(limit)).sort({ createdAt: -1 });
    
    res.status(200).json({
      statusCode: 200,
      success: true,
      total: totalCount,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(totalCount / limit),
      data: data,
    });
  } catch (error) {
    res.status(400).json({
      statusCode: 400,
      message: error.message || "Something went wrong",
    });
  }
};

const empMapping = async(req,res) => {
  try{
    const payload = req.body;
    if (!payload.id || typeof payload.StatusNoida !== 'boolean') {
      res.status(400).json({ message: 'empid and status are required' });
    }
    
    const updated = await stpiEmpDetailsModel.findOneAndUpdate(
      { _id:payload.id },
      { $set: { StatusNoida: payload.StatusNoida }},
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.status(200).json({
      statuCode:200,
      message: `Employee status updated to ${payload.StatusNoida ? 'Active' : 'Not Active'}`,
    });
  } catch(error){
    res.status(400).json({
      statusCode:400,
      message:error.message
    })
  }
}

const stpiCentre = async(req,res) => {
  try {
    const centres = await stpiEmpDetailsModel.distinct('centre');
    const sortedCentres = centres
      .filter(Boolean)  
      .sort((a, b) => a.localeCompare(b));

    res.status(200).json({
      statusCode: 200,
      message: 'Fetched centres successfully',
      data: sortedCentres,
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: 'Failed to fetch centres',
      error: error.message,
    });
  }

}

const stpidir = async(req,res) => {
  try {
    const dir = await stpiEmpDetailsModel.distinct('dir');
    const sorteddir = dir
      .filter(Boolean)  
      .sort((a, b) => a.localeCompare(b));

    res.status(200).json({
      statusCode: 200,
      message: 'Fetched sorteddir successfully',
      data: sorteddir,
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: 'Failed to fetch centres',
      error: error.message,
    });
  }

}

const stpiEmpType = async(req,res) => {
  try {
    const empType = await stpiEmpDetailsModel.distinct('etpe');
    const sortedetp = empType
      .filter(Boolean)  
      .sort((a, b) => a.localeCompare(b));

    res.status(200).json({
      statusCode: 200,
      message: 'Fetched centres successfully',
      data: sortedetp,
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: 'Failed to fetch centres',
      error: error.message,
    });
  }

}

const taskForceMemberStatus = async(req,res)=>{
  try{
    const payload = req.body
    const findEmp = await stpiEmpDetailsModel.findById({_id:payload.id})

    if(!findEmp){
      return res.status(404).json({ message: "Employee not found" });
    }

    const newStatus = findEmp.taskForceMember ==="No" ?"Yes":"No";

    findEmp.taskForceMember = newStatus

    await findEmp.save();

    res.status(200).json({
      statusCode:200,
      message:"Employee has been mapped"
    })

  }catch(error){
    res.status(400).json({
      statusCode:400,
      message:error
    })

  }
}

const register = async(req,res) =>{
  try{
    const {empId, role} =  req.body;

    if (!empId || !role) {
      return res.status(400).json({
        statusCode: 400,
        message: "UserDetails and role are required",
      });
    }
    const userExist = await loginModel.findOne({ empId:empId });
    if (userExist) {
      return res.status(409).json({
        statusCode: 409,
        message: "User already exists",
      });
    }

    const empdetails = await stpiEmpDetailsModel.findById({_id:empId})
    const plainPassword = generateRandomPassword();

    const newAdmin = new loginModel({ empId:empId, 
      username:empdetails.empid,
      email:empdetails.
      email,password:plainPassword,
      role,
      createdByIp:await getClientIp(req),
      createdById:req.session?.user.id,
    });
    await newAdmin.save();
    await sendEmail(
          empdetails.email, 
          'Your Login Credentials', 
          `Username: ${empdetails.empid} or ${empdetails.email}\nPassword: ${plainPassword}`, // text
          `
            <h3>Welcome!</h3>
            <p>Username: <strong>${empdetails.empid} or ${empdetails.email}</strong></p>
            <p>Password: <strong>${plainPassword}</strong></p>
            <p>This is an <strong>HTML</strong> message.</p>
            <p>Please <a href="https://pmcportal.stpi.in">pmcportal.stpi.in</a> click here to access PMC Portal</a>.</p>
          ` 
        );
    res.status(200).json({
      statusCode:200,
      message:"Login sucessfully created"
    })
  }catch(error){
    res.status(400).json({
      statusCode:400,
      message:'Error creating login'
    })
  }
}

const login = async (req,res)=>{
  try {
    const {username, password} = req.body;
    const user = await loginModel.findOne({
       $or:[
        {username:username},
        {email:username}
      ]
    }).select("+password");
    const admin = await adminModel.findOne({
       $or:[
        {username:username},
        {email:username}
      ]
    }).select("+password");
    if (!user && !admin){
      return res.status(404).json({
        statusCode:404,
        message:"Incorrect Username or Password "
      })
    }
    const account = user || admin;
    const isMatched = await account.comparePassword(password)
    if (!isMatched){
       return res.status(404).json({
        statusCode:404,
        message:"Incorrect Username or Password "
      })
    }
    const ip =await getClientIp(req)

     account.ipAddressLog = {
      ip: ip,
      date: new Date()
    };
    let name 
    if(user){
      const empId = user.empId;
      const emp = await stpiEmpDetailsModel.findById({_id:empId}) 
      name = emp.ename
    }else {
      name = admin.role
    }
    await account.save({ validateBeforeSave: false });

    const token =jwt.sign({id:account._id,role:account.role,emp:account.username,name:name},process.env.JWT_SECRET,{
      expiresIn:'1d'
    })

    req.session.user = {
      id: account._id,
      empId: name,
      role: account.role,
      token: token 
    };
      
    res.status(200).json({
      statusCode: 200,
      message: 'Login successful',
      user: { name: name, role: account.role }
    });
  }catch(error){
    res.status(400).json({
      statusCode:400,
      message:error
    })
  }
}

const logout = async(req,res) =>{
  try{
    req.session.destroy((err) => {
      if (err) {
        console.error("Session destroy error:", err);
        return res.status(500).json({
          statusCode: 500,
          message: "Logout failed (session error)",
        });
      }
      
    res.clearCookie("connect.sid", {
        httpOnly: true,
        secure: process.env.ENVIROMENT === "production",
        sameSite: "Lax",
      });

    res.status(200).json({
      statusCode: 200,
      message: 'Logout successful'
    });
  })
  } catch(error){
    res.status(400).json({
      statusCode:400,
      message:error
    })
  }
}

const forgetPassword = async(req,res) =>{
  try{
    const {username} = req.body;
    const user = await loginModel.findOne({
      $or:[
        {username:username},
        {email:username}
      ]
    });

    if(!user){
      return res.status(404).json({
        statusCode:404,
        message:"Username doesnot exist Contact Admin"
      })
    }

    const updatedPassword = generateRandomPassword();
    user.password =updatedPassword
  
    await user.save()

    await sendEmail(
      user.email, // to
      'Your Password has been Reset', // subject
      `Username: ${user.username} or ${user.email}\nPassword: ${updatedPassword}`, // text
      `
        <h3>Welcome!</h3>
        <p>Username: <strong>${user.username} or ${user.email}</strong></p>
        <p>Password: <strong>${updatedPassword}</strong></p>
        <p>This is an <strong>HTML</strong> message.</p>
      ` // html
    );
 
    res.status(200).json({
        statusCode:200,
        message:"Credentials has been send to email"
    })

  } catch(error){
    res.status(400).json({
      statusCode:400,
      message:'error'
    })
    console.log(error)
  }
}

const getloginDetails = async (req, res) => {
  try {
    const {role = "",search = "",dir = "",centre = "",etype = "",taskForceMember = "",page,limit,StatusNoida = ""} = req.query;
    const shouldFilter =role.trim() || dir.trim() || centre.trim() || etype.trim() || taskForceMember.trim() || StatusNoida.trim();
    let filter = {};
    if (shouldFilter) {
      if (role.trim()) filter.role = role;
      if (dir.trim()) filter.dir = new RegExp(dir, "i");
      if (centre.trim()) filter.centre = new RegExp(centre, "i");
      if (etype.trim()) filter.etpe = new RegExp(etype, "i");
      if (taskForceMember.trim()) filter.taskForceMember = new RegExp(taskForceMember, "i");
      if (StatusNoida.trim()) filter.StatusNoida = new RegExp(StatusNoida, "i");
    }
    const users = await loginModel.find(filter).select('-password -ipAddressLog -__v -username');
    const enrichedUsers = await Promise.all(
      users.map(async (user) => {
        const empDetails = await stpiEmpDetailsModel.findById(user.empId).lean();
        return {
          ...user.toObject(),
          empId: empDetails?.empid,
          ename: empDetails?.ename,
          centre: empDetails?.centre,
          dir: empDetails?.dir,
          etpe: empDetails?.etpe,
          StatusNoida: empDetails?.StatusNoida,
          taskForceMember: empDetails?.taskForceMember,
        };
      })
    );
    let filteredUsers = enrichedUsers;
    if (search.trim()) {
      filteredUsers = filteredUsers.filter(user =>
        user.ename?.toLowerCase().includes(search.toLowerCase()) ||
        user.empId?.toLowerCase().includes(search.toLowerCase())
      );
    }
    const start = (parseInt(page) - 1) * parseInt(limit);
    const paginatedData = filteredUsers.slice(start, start + parseInt(limit));
    return res.status(200).json({
      success: true,
      message: 'Login details fetched successfully',
      data: paginatedData,
      total: filteredUsers.length,
      page: parseInt(page),
      limit: parseInt(limit),
    });
  } catch (error) {
    console.error('Error in getloginDetails:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error',
      error: error.message,
    });
  }
};

const getUserDataById = async(req,res)=>{
  try{
    const { id } = req.params;
    const users = await loginModel.findById(id).select('-password -ipAddressLog -__v -username');
    if (!users) {
      return res.status(404).json({
        statusCode: 404,
        message: 'User not found',
      });
    }
    let enrichedUser;
      const empDetails = await stpiEmpDetailsModel.findById(users.empId).lean();
      enrichedUser = {
        ...users.toObject(),
        empId: empDetails?.empid,
        ename: empDetails?.ename,
        centre: empDetails?.centre,
        dir: empDetails?.dir,
        etpe: empDetails?.etpe,
        edesg: empDetails?.edesg,
        StatusNoida: empDetails?.StatusNoida,
        taskForceMember: empDetails?.taskForceMember,
      };
    res.status(200).json({
      statusCode:200,
      data:enrichedUser,
    })
  }
  catch(error){
    res.status(400).json({
      statusCode:400,
      message:error
    })
  }
}

const updateUserDataById = async(req,res)=>{
  try{
    const { id } = req.params;
    const payload = req.body;
    const user = await loginModel.findById({_id:id})
    if(!user){
      return res.status(401).json({
        statusCode:401,
        message:'User Doesnt exist!!'
      })
    }
    user.role = payload.role;
    await user.save();

    res.status(200).json({
      statusCode:200,
      message:"Role has been Updated"
    })
  } catch(error){
    res.status(400).json({
      statusCode:400,
      message:error
    })
  }
}

const checkEmail = async(req,res)=>{
  try{
    const {username} = req.body;
    const user = await loginModel.findOne({
      $or:[
        {username:username},
        {email:username}
      ]
    });
    if (!user){
      return res.status(401).json({
        statusCode:401,
        exists: false,
        message:'User does not exist'
      })
    }
    res.status(200).json({
      statusCode:200,
      exists: true,
      message:'Email Exist'
    })
  }catch(error){
    res.status(400).json({
      statusCode:400,
      message: error
    })
  }
}

const passwordReset = async(req,res) =>{
  try{
    const payload = req.body
    const user = await loginModel.findOne({
      $or:[
        {username:payload.username},
        {email:payload.username}
      ]
    }).select('+password +email');;
   if (!user){
      return res.status(401).json({
        statusCode:401,
        exists: false,
        message:'User does not exist'
      })
    }
    
    if (payload.newPassword !== payload.confirmPassword ){
      return res.status(401).json({
        statusCode:401,
        exists: false,
        message:'Password Not matched'
      })
    }
     if (!payload.newPassword || !payload.confirmPassword ){
      return res.status(401).json({
        statusCode:401,
        exists: false,
        message:'Please Enter Password'
      })
    }

    const isSamePassword = await bcrypt.compare(payload.newPassword, user.password);
     if (isSamePassword) {
      return res.status(401).json({
        statusCode: 400,
        message: 'New password must be different from the old password'
      });
    }
     const token = jwt.sign(
      { username: user._id, hashedPassword:payload.newPassword },
      process.env.JWT_SECRET,
      { expiresIn: '10m' }
    );

    const empdetails = await stpiEmpDetailsModel.findById({_id:user.empId}) 
    const FRONTEND_URL = process.env.React_URL ;

    const resetLink = `${FRONTEND_URL}/reset-password?token=${token}`;

      await sendEmail(
      user.email, // to
      'Password Reset Link - PMC Portal', // subject
      '', // text
      `
        <p>Dear <strong>${empdetails.ename}</strong>,</p>

        <p>You requested to reset your password. Click the link below to confirm your new password:</p>
        <a href="${resetLink}" style="padding:10px 15px;background-color:#1976d2;color:white;text-decoration:none;border-radius:5px;">Reset Password</a>
        <p>This link will expire in 10 minutes.</p>

        <p>Thank you,<br />
          <strong>PMC Portal</strong><br/>
          <a href="https://pmcportal.stpi.in">pmcportal.stpi.in</a>
        </p>
      ` 
    );

    res.status(200).json({
      statusCode:200,
      message:'An email has been sent to your STPI email ID. Please verify it there — only then will the changed password take effect.',
    })
  }catch(error){
    res.status(400).json({
      statusCode: 400,
      message:error
    });
  }
}

const resetPasswordVerify = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(401).json({
        statusCode: 401,
        message: 'Token is not available'
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
          statusCode: 401,
          message: 'The reset link has expired. Please request a new one.'
        });
      } else if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
          statusCode: 401,
          message: 'Invalid reset link.'
        });
      } else {
        return res.status(400).json({
          statusCode: 401,
          message: 'Token verification failed.'
        });
      }
    }
      const user = await loginModel.findById({_id:decoded.username})
      if (!user){
        return res.status(401).json({
          statusCode:401,
          message:"User Not Found"
        })
      }
    
      user.password =decoded.hashedPassword;
      await user.save();

      decoded = null;

    res.status(200).json({
      statusCode: 200,
      message: 'Password has been reset successfully.'
    });

  } catch (error) {
    res.status(400).json({
      statusCode: 400,
      message: error
    });
  }
};

module.exports = {
  sync,
  getStpiEmpList,
  empMapping,
  stpiCentre,
  stpiEmpType,
  stpidir,
  taskForceMemberStatus,
  register,
  login,
  logout,
  forgetPassword,
  getloginDetails,
  getUserDataById,
  updateUserDataById,
  checkEmail,
  passwordReset,
  resetPasswordVerify
}