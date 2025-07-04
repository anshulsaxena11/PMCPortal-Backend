const axios = require('axios');
const stpiEmpDetailsModel = require('../models/StpiEmpModel')

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
module.exports = {
  sync,
  getStpiEmpList,
  empMapping,
  stpiCentre,
  stpiEmpType,
  stpidir,
  taskForceMemberStatus
}