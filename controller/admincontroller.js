const axios = require('axios');
const stpiEmpDetailsModel = require('../models/StpiEmpModel')
const loginModel = require('../models/loginModel')
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../Service/email');
const getClientIp = require('../utils/getClientip')

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
            message:"data has benn syncronise suceefully",
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

    const newAdmin = new loginModel({ empId:empId, username:empdetails.empid,email:empdetails.email,password:plainPassword,role });
    await newAdmin.save();
    await sendEmail(
          '', // to
          'Your Login Credentials', // subject
          `Username: ${empdetails.empid} or ${empdetails.email}\nPassword: ${plainPassword}`, // text
          `
            <h3>Welcome!</h3>
            <p>Username: <strong>${empdetails.empid} or ${empdetails.email}</strong></p>
            <p>Password: <strong>${plainPassword}</strong></p>
            <p>This is an <strong>HTML</strong> message.</p>
          ` // html
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
    if (!user){
      return res.status(404).json({
        statusCode:404,
        message:"Incorrect Username or Password "
      })
    }
    const isMatched = await user.comparePassword(password)
    if (!isMatched){
       return res.status(404).json({
        statusCode:404,
        message:"Incorrect Username or Password "
      })
    }
    const ip =await getClientIp(req)

     user.ipAddressLog = {
      ip: ip,
      date: new Date()
    };
    const empId = user.user;
    let name 
    if(empId){
      const emp = await stpiEmpDetailsModel.findById({_id:empId}) 
      name = emp.ename
    }else {
      name = user.role
    }
    await user.save({ validateBeforeSave: false });

    const token =jwt.sign({id:user._id,role:user.role,emp:user.username,name:name},process.env.JWT_SECRET,{
      expiresIn:'1d'
    })

    req.session.user = {
      id: user._id,
      empId: user.username,
      role: user.role,
      token: token 
    };
      
    res.status(200).json({
      statusCode: 200,
      message: 'Login successful',
      user: { name: name, role: user.role }
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
      '', // to
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
        message:"Credentials has benn send to email"
    })

  } catch(error){
    res.status(400).json({
      statusCode:400,
      message:'error'
    })
    console.log(error)
  }
}

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
  forgetPassword
}