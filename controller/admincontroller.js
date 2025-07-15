const axios = require('axios');
const stpiEmpDetailsModel = require('../models/StpiEmpModel')
const loginModel = require('../models/loginModel')
const jwt = require('jsonwebtoken');
const getClientIp = require('../utils/getClientip')

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
                existing.dir !== item.dir;
          
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
    const { page = 1, limit = 10, search=" ",centre=" " ,StatusNoida=" ",etpe=" ",dir=" "} = req.query;
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
	console.log('qwdqwdqwqwqd');
  try {
    const centres = await stpiEmpDetailsModel.distinct('centre');
    const sortedCentres = centres
      .filter(Boolean)  
      .sort((a, b) => a.localeCompare(b));

    res.status(200).json({
      statusCode: 200,
      message: 'Fetched centres successfully22',
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
    const {username, password, role} =  req.body;

    if (!username || !password || !role) {
      return res.status(400).json({
        statusCode: 400,
        message: "Username, password, and role are required",
      });
    }

    const userExist = await loginModel.findOne({ username });
    if (userExist) {
      return res.status(409).json({
        statusCode: 409,
        message: "User already exists",
      });
    }
    const newAdmin = new loginModel({ username, password, role });
    await newAdmin.save();
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
    const user = await loginModel.findOne({username}).select("+password");
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

    user.ipAddressLog.push({ip})
    await user.save({ validateBeforeSave: false });

    const token =jwt.sign({id:user._id,role:user.role},process.env.JWT_SECRET,{
      expiresIn:'1d'
    })
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.ENVIROMENT === 'production', 
      sameSite: 'Lax',
      maxAge: 24 * 60 * 60 * 1000
    });
    

    res.status(200).json({
      statusCode: 200,
      message: 'Login successful',
      user: { username: user.username, role: user.role }
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
   res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.ENVIROMENT === 'production',
      sameSite: 'Lax'
    });

    res.status(200).json({
      statusCode: 200,
      message: 'Logout successful'
    });
  } catch(error){
    res.status(400).json({
      statusCode:400,
      message:error
    })
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
  logout
}