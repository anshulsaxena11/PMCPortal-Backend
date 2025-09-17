const projectdetailsModel = require('../models/projectDetailsModel')
const deviceListModel = require('../models/deviceslistModel')
const projectTypeModel = require('../models/projectTypeModel')
const reportModel = require('../models/reportModel')
const directrateModel = require('../models/directrateModel')
const vulnerabilityModel = require('../models/vulnerabilityTypesModel')
const webVulnarabilityModel = require('../models/webVulnabilityModel')
const apiVulnabilityModel = require('../models/apiVulnabilityModel')
const MobileApplicationModel = require('../models/mobileApplicationModel')
const SourceCodeModel = require('../models/sourceCodeModel')
const DesktopModel = require('../models/desktopVulnabelityModel')
const SwitchLThreeModel = require('../models/switchLThreeModel')
const SwitchLTwoModel = require('../models/switchLTwo')
const AttendanceSystemModel = require('../models/AttendanceSystemModel')
const CameraModel = require('../models/camera')
const WifiModel = require('../models/WiFiModel')
const ServerHardwareModel = require("../models/serverHardwareModel")
const VcEquipmentModel = require("../models/vcEquipmentModel")
const RouterModel = require('../models/routerVulmerabilityModel')
const RoundModel = require('../models/roundModel')
const stpiEmpDetailsModel = require('../models/StpiEmpModel')
const ToolsAndHardwareMasterMdel = require('../models/toolsandHardwareMasterModel')
const ToolsAndHardwareModel= require("../models/toolsAndHardwareModel") 
const ProjectPhase = require("../models/ProjectPhase")
const TypeOfWorkModel = require("../models/typeOfWorkModel")
const TenderTrackingModel = require("../models/tenderTrackingModel")
const StateModel = require('../models/stateModel');
const CertificateDetailsModel = require('../models/certificateModel')
const CertificateMaster = require('../models/certificateMasterModel')
const getClientIp = require('../utils/getClientip')
const path = require('path');
const { sendEmail } = require('../Service/email');
const sharp = require('sharp');

const mongoose = require("mongoose");

//Project Details API
const perseonalDetails = async (req, res) => {
    try {
        const projectDetail = req.body;
        if(!projectDetail){
            res.status(400).json({
                statusCode:400,
                message :"please enter the require field",
            })
        }
        const existingWorkOrder = await projectdetailsModel.findOne({ workOrderNo: projectDetail.workOrderNo });
        if (existingWorkOrder) {
            return res.status(400).json({
                statusCode: 400,
                message: "Work Order Number already exists. It must be unique.",
            });
        }
        const existingProjectName = await projectdetailsModel.findOne({ projectName: projectDetail.projectName });
        if (existingProjectName) {
            return res.status(400).json({
                statusCode: 400,
                message: "Project Name already exists. It must be unique.",
            });
        }
        const file = req.file;    
        if (projectDetail.projectType) {
            if (typeof projectDetail.projectType === "string") {

                projectDetail.projectType = projectDetail.projectType.split(',');
            }
            if (!Array.isArray(projectDetail.projectType)) {
                return res.status(400).json({
                    statusCode: 400,
                    message: "projectType should be an array of ObjectIds.",
                });
            }
                projectDetail.projectType = projectDetail.projectType
                    .filter(id => mongoose.Types.ObjectId.isValid(id) && id.trim() !== "") 
                    .map(id => new mongoose.Types.ObjectId(id)); 
        } else {
            projectDetail.projectType = [];
        }
    
        if (file) {
            const fileExtension = file.mimetype.split('/')[1];
            if (!['jpeg', 'jpg', 'png', 'pdf'].includes(fileExtension)) {
                return res.status(400).json({
                    statusCode: 400,
                    message: "Invalid file type. Only image or PDF files are allowed.",
                });
            }

            let fileFolder = 'uploads/documents'; 
            if (file.mimetype.startsWith('image/')) {
                fileFolder = 'uploads/image';
            } else if (file.mimetype === 'application/pdf') {
                fileFolder = 'uploads/agreement'; 
            }

            projectDetail.workOrder = `/${fileFolder}/${file.filename}`;
        }
        projectDetail.createdById = req.session?.user.id ;
        projectDetail.createdbyIp = await getClientIp(req)
        const newPersonalDetails = new projectdetailsModel(projectDetail);
        await newPersonalDetails.save();

        res.status(200).json({
            statusCode: 200,
            message: "Project Created Successfully",
            personalDetails: newPersonalDetails,
        });

    } catch (error) {
        console.error("Error saving project:", error);
        res.status(400).json({
            statusCode: 400,
            message: "Unable to save Data",
            data: error.message || error,
        });
    }
};
// saving device data In dropdown
const deviceList = async (req,res) => {
    try{
        const devicelist = req.body;
        const existdevicelist = await deviceListModel.findOne({ devicesName:devicelist.devicesName  });
        if (existdevicelist){
            res.status(400).json({
                statusCode:400,
                message:"Name Of Device already exist "
            })
        } else{
            const newdevicelist = await deviceListModel(devicelist);
            await newdevicelist.save();
            res.status(200).json({
                statusCode:200,
                message:"Device has been Updated",
                data:newdevicelist
            })
        }
    } catch(error){
        res.status(400).json({
            statusCode:400,
            message:"unable to Update Devices",
            data: error.message || error
        })
    }
}
//getting device list for dropdown
const getdeviceList = async(req,res) =>{
    try{
        const deviceList = await deviceListModel.find().select('_id devicesName');;
        res.status(200).json({
            statusCode: 200,
            message:"",
            data:deviceList
        })

    }catch(error){
        res.status(400).json({
            statusCode:400,
            message:"unable to get device list",
            data:error.message || error
        })
    }
}
// saving list of scopeOfWork
const ProjectTypeList = async (req,res) => {
    try{
        const projectType = req.body;
        const existProjectTypeList = await projectTypeModel.findOne({ ProjectTypeName:projectType.ProjectTypeName  });
        if (existProjectTypeList){
            res.status(400).json({
                statusCode:400,
                message:"Scope of work already exist"
            })
        } else{
            const newProjectTypeList = new projectTypeModel({
                ...projectType,
                createdIP: await getClientIp(req),
                createdId: req.session?.user.id,
            });   
            await newProjectTypeList.save();
            res.status(200).json({
                statusCode:200,
                message:"Scope of work has been Updated",
            })
        }
    } catch(error){
        res.status(400).json({
            statusCode:400,
            message:"unable to Update Devices",
            data: error.message || error
        })
    }
}
//gettng list for ScopeofWork
const getProjectTypeList = async(req,res) =>{
    try{
        const {category,page, limit, search} = req.query
        let query = { isDeleted: { $ne: true } };
        if (category) {
            query.category = category;
        }
         if (search) {
            query.$or = [
                { category: { $regex: search, $options: "i" } },
                { ProjectTypeName: { $regex: search, $options: "i" } }
            ];
        }
        if (page && limit) {
            const skip = (parseInt(page) - 1) * parseInt(limit);
            const total = await projectTypeModel.countDocuments(query);

            const projecttypeList = await projectTypeModel.find(query)
                .skip(skip)
                .limit(parseInt(limit));

            return res.status(200).json({
                statusCode: 200,
                data: projecttypeList,
                pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / parseInt(limit))
                },
                message: "Scope Of Work has been Fetched with Pagination"
            });
        }
        if (!category){
             const projecttypeList = await projectTypeModel.find({isDeleted: { $ne: true }}).select('_id ProjectTypeName');;
            res.status(200).json({
                statusCode: 200,
                message:"",
                data:projecttypeList
            })
        }
        else{
            const projecttypeList = await projectTypeModel.find({category:category, isDeleted: { $ne: true }}).select('_id ProjectTypeName');;
            res.status(200).json({
                statusCode: 200,
                message:"",
                data:projecttypeList
            })
        }


    }catch(error){
        res.status(400).json({
            statusCode:400,
            message:"unable to get device list",
            data: error.message || error
        })
    }
}
//use to get scope ofwork in dropdown
const getProjectName = async(req,res) =>{
    try{
        //const projectName = await projectdetailsModel.find().select('_id projectName');
        const projectName = await projectdetailsModel.find({isDeleted: false }).select('_id projectName');
        res.status(200).json({
            statusCode:200,
            message : "list has been fetched",
            data : projectName
        })
    }catch(error){
        res.status(400).json({
            statusCode:400,
            message:"unable to get device list",
            data: error.message || error
        })
    }
}


const getAllProjectDetails = async (req, res) => {

    try {
      
      const projects = await projectdetailsModel.find();

      res.status(200).json({
        statuscode: 200,
        success: true,
        data: projects,
      });
    } catch (error) {
      res.status(400).json({
        statusCode: 400,
        success: false,
        message: "Server Error",
        error,
      });
    }
  };
  
  const getAllprojectData = async (req, res) => {

      try {
      
      const projects = await projectdetailsModel.find()
      .populate({
        path: 'phases', // virtual field
        select: 'amountRecived amountBuild amountStatus', // optional fields
      })
      .sort({ createdAt: -1 }); // optional sorting

      res.status(200).json({
        statuscode: 200,
        success: true,
        data: projects,
      });
    } catch (error) {
      res.status(400).json({
        statusCode: 400,
        success: false,
        message: "Server Error",
        error,
      });
    }
}
  
// getting projrct List API
const getProjecDetails = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    let query = { isDeleted: false };

    if (search) {
      query.$or = [
        { orderType: { $regex: search, $options: "i" } },
        { projectName: { $regex: search, $options: "i" } },
        { projectManager: { $regex: search, $options: "i" } },
        { type: { $regex: search, $options: "i" } },
        { orginisationName: { $regex: search, $options: "i" } },
        { typeOfWork: { $regex: search, $options: "i" } },
      ];
    }

    const totalCount = await projectdetailsModel.countDocuments(query);

    const projects = await projectdetailsModel.find(query)
      .populate({
        path: "projectType",
        model: "ProjectType",
        select: "ProjectTypeName",
      })
      .populate({
        path: "phases", 
        select: "amountStatus", 
      })
      .skip((page - 1) * limit)
      .limit(limit) 
      .sort({ createdAt: -1 });

    res.status(200).json({
      statuscode: 200,
      success: true,
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      data: projects,
    });
  } catch (error) {
    res.status(400).json({
      statusCode: 400,
      success: false,
      message: "Server Error",
      error,
    });
  }
};



//get project details by Id

  const getProjecDetailsById = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await projectdetailsModel.findById(id).populate({
            path: "projectType",
            model: "ProjectType",
            select: "ProjectTypeName",
        });


        if (!project) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "Project not found",
            });
        }

        // Construct full URL for workOrder (PDF file)
        const workOrderUrl = project.workOrder
            ? `${process.env.React_URL}/${project.workOrder}`
            : null;

        res.status(200).json({
            statusCode: 200,
            success: true,
            data: {
                ...project._doc,
                workOrderUrl, 
            },
        });
    } catch (error) {
        res.status(400).json({
            statusCode: 400,
            success: false,
            message: "Server Error",
            error: error.message || error,
        });
    }
};

// edit perseonal Details

const editProjectDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const file = req.file;


        const project = await projectdetailsModel.findById(id)
        if (!project) {
            return res.status(404).json({
                statusCode: 404,
                message: "Project not found",
            });
        }


        if (updateData.workOrderNo) {
            const existingProject = await projectdetailsModel.findOne({
                workOrderNo: updateData.workOrderNo,
                _id: { $ne: id }, 
            });

            if (existingProject) {
                return res.status(400).json({
                    statusCode: 400,
                    message: "workOrderNo must be unique. A project with this workOrderNo already exists.",
                });
            }
        }

        if (updateData.projectName) {
            const existingProject = await projectdetailsModel.findOne({
                projectName: updateData.projectName,
                _id: { $ne: id }, 
            });

            if (existingProject) {
                return res.status(401).json({
                    statusCode: 401,
                    message: "Project Name must be unique. A project with this workOrderNo already exists.",
                });
            }
        }


        let projectTypeNames = [];
        if (updateData.projectType) {
            if (typeof updateData.projectType === "string") {
                updateData.projectType = updateData.projectType.split(",");
            }
            if (!Array.isArray(updateData.projectType)) {
                return res.status(400).json({
                    statusCode: 400,
                    message: "projectType should be an array of ObjectIds.",
                });
            }

            updateData.projectType = updateData.projectType
                .filter((id) => mongoose.Types.ObjectId.isValid(id) && id.trim() !== "")
                .map((id) => new mongoose.Types.ObjectId(id));

            const validProjectTypes = await projectTypeModel.find(
                { _id: { $in: updateData.projectType } },
                { _id: 1, projectTypeName: 1 } // Only fetching names
            );

            if (validProjectTypes.length !== updateData.projectType.length) {
                return res.status(400).json({
                    statusCode: 400,
                    message: "Invalid projectType IDs provided.",
                });
            }

            projectTypeNames = validProjectTypes.map((type) => type.projectTypeName);
        }
        if (file) {
            const relativePath = file.path.split("uploads")[1];
            updateData.workOrder = `/uploads${relativePath.replace(/\\/g, "/")}`;
        } else {
            updateData.workOrder = project.workOrder; 
        }
        updateData.updatedById = req.session?.user?.id || "system";
        updateData.updatedByIp = await getClientIp(req);
        updateData.updatedAt = new Date();
        const updatedProject = await projectdetailsModel.findByIdAndUpdate(id, updateData, {
            new: true,
        }).populate({
            path: "projectType",
            model: "ProjectType",
            select: "ProjectTypeName",
        });;

        const workOrderUrl = updatedProject.workOrder
        
        ? `${process.env.React_URL}/${updatedProject.workOrder}`
        : null;

        res.status(200).json({
            statusCode: 200,
            message: "Project Updated Successfully",
            projectDetails: updatedProject,
            projectTypeNames, 
            filePreviewUrl: workOrderUrl,
        });
    } catch (error) {
        console.error("Error updating project:", error);
        res.status(500).json({
            statusCode: 500,
            message: "Internal Server Error",
            error: error.message || error,
        });
    }
};
//fetch project type by Id in Report
const getProjectTypeById = async(req,res) =>{
    try{
	const {id} = req.params;
        const ProjectDetails = await projectdetailsModel.findById(id);
        
        if (!Array.isArray(ProjectDetails.projectType)) {
            return res.status(400).json({
              statusCode: 400,
              message: "projectType should be an array",
              data: null,
            });
          }
          const projectTypeList = await projectTypeModel.find({
            _id: { $in: ProjectDetails.projectType },
          });
        if (projectTypeList.length === 0) {
            return res.status(404).json({
            statusCode: 404,
            message: "No matching project types found",
            data: [],
            });
        }

        const projectTypeNames = projectTypeList.map((type) => type.ProjectTypeName);

        res.status(200).json({
            statusCode:200,
            message:"ProjectTYpe has been fetched",
            data:projectTypeNames
        })

    }catch(error){
        res.status(400).json({
            statusCode:400,
            message:"Unable to get projct Details",
            data: error.message || error,
        })
    }
}
//save report
const postReport = async (req, res) => {
    try {
        const { proofOfConcept, ...ReportDetails } = req.body;
        let parsedProofOfConcept = [];

        if(ReportDetails){
            const ProjectName = await reportModel.find({projectName:ReportDetails.projectName,round:ReportDetails.round,devices:ReportDetails.devices,ipAddress:ReportDetails.ipAddress,Name:ReportDetails.Name })
            const alreadyExists = ProjectName.some(
                report => report.vulnerabilityName === ReportDetails.vulnerabilityName
            );
            if (alreadyExists){
               return res.status(400).json({
                statusCode:400,
                message: "This vulnerability already exists" 
            });
            }
        }

        if (proofOfConcept) {
            try {
                parsedProofOfConcept = typeof proofOfConcept === "string" 
                    ? JSON.parse(proofOfConcept) 
                    : proofOfConcept;
            } catch (error) {
                return res.status(400).json({
                    statusCode: 400,
                    message: "Invalid proofOfConcept format",
                    error: "proofOfConcept must be a valid JSON array",
                });
            }
        }

        // Ensure parsedProofOfConcept is an array
        if (!Array.isArray(parsedProofOfConcept)) {
            return res.status(400).json({
                statusCode: 400,
                message: "proofOfConcept must be an array of steps",
            });
        }

        let proofFiles = [];

if (req.files && Array.isArray(req.files)) {
    await Promise.all(req.files.map(async (file) => {
        const match = file.fieldname.match(/\[(\d+)\]/); // Extract index from proof[0], proof[1]
        if (match) {
            const index = parseInt(match[1], 10); // Ensure index is a number

            // Define paths
            const inputPath = path.join(__dirname, '../uploads/image', file.filename); // Full path to original image
            const outputFilename = `resized-${file.filename}`;
            const outputDir = path.join(__dirname, '../uploads/image'); // One step back into /uploads/image/
            const outputPath = path.join(outputDir, outputFilename);    // Full output file path
            const outputUrl = `/uploads/image/${outputFilename}`;

            // Resize and compress
            await sharp(inputPath)
                .resize(600, 400, {
                    fit: 'inside', 
                    withoutEnlargement: true 
                })              
                .jpeg({ quality: 70 })
                .toFile(outputPath);

            // Save result
            proofFiles[index] = outputUrl;
        }
    }));
}

        parsedProofOfConcept = parsedProofOfConcept.map((step, index) => ({
            noOfSteps: step.noOfSteps,
            description: step.description,
            proof: proofFiles[index] || "", // Get file path if exists
        }));


        const newReport = new reportModel({
            ...ReportDetails,
            proofOfConcept: parsedProofOfConcept,
            createdId: req.session?.user.id,
            createdIp:await getClientIp(req)
        });

        await newReport.save();

        return res.status(201).json({
            statusCode: 201,
            message: "Report created successfully",
            data: newReport,
        });

    } catch (error) {

        return res.status(500).json({
            statusCode: 500,
            message: "Unable to save report details",
            error: error.message || error,
        });
    }
};

// save directorates
const directrate = async (req,res) => {
    try{
        const directrate = req.body;
        const existdirectrate = await directrateModel.findOne({ directrate:directrate.directrate  });
        if (existdirectrate){
            res.status(400).json({
                statusCode:400,
                message:"Directorates already exist "
            })
        } else{
            const newDirectrate = await directrateModel(directrate);
            await newDirectrate.save();
            res.status(200).json({
                statusCode:200,
                message:"Directorates has been Updated",
                data:newDirectrate
            })
        }
    } catch(error){
        res.status(400).json({
            statusCode:400,
            message:"unable to Update Directorates",
            data: error.message || error
        })
    }
}
// get Directorate List
const getDirectrateList = async(req,res) =>{
    try{
        const directrateList = await directrateModel.find().select('_id directrate');
        res.status(200).json({
            statusCode: 200,
            message:"",
            data:directrateList
        })

    }catch(error){
        res.status(400).json({
            statusCode:400,
            message:"unable to get directrate list",
            data: error.message || error
        })
    }
}

// get Report List 

const getAllReport = async (req, res) => {
  try {
    const report = await reportModel
      .find({ isDeleted: false },)
      .populate({
        path: "projectName",
        model: "ProjectDetails",
        select: "projectName -_id",
      })

    res.status(200).json({
      statuscode: 200,
      success: true,
      data: report,
    });
  } catch (error) {
    res.status(400).json({
      statusCode: 400,
      success: false,
      message: "Server Error",
      error,
    });
  }
};

const getReportDetails = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", round = "", devices = "", projectType = "", projectName = "" } = req.query;

    const query = {
      isDeleted: { $ne: true }, 
      ...(round.trim() ? { round } : {}),
      ...(devices.trim() ? { devices } : {}),
      ...(projectType.trim() ? { projectType } : {}),
      ...(projectName.trim() ? { projectName } : {}),
    };

    let report = await reportModel.find(query)
      .populate({
        path: "projectName",
        model: "ProjectDetails",
        select: "projectName -_id",
      })
      .lean()
      .sort({ createdAt: -1 });

    report.forEach(item => {
      if (item.projectName && item.projectName.projectName) {
        item.projectName = item.projectName.projectName;
      }
    });

    if (search.trim()) {
      const regex = new RegExp(search, "i");
      report = report.filter(item =>
        regex.test(item.round) ||
        regex.test(item.devices) ||
        regex.test(item.projectType) ||
        regex.test(item.projectName) ||
        regex.test(item.Name) ||
        regex.test(item.ipAddress) 
      );
    }

    const totalCount = report.length;

    const paginatedReport = report.slice((page - 1) * limit, page * limit);

    res.status(200).json({
      statuscode: 200,
      success: true,
      total: totalCount,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(totalCount / limit),
      data: paginatedReport,
    });
  } catch (error) {
    res.status(400).json({
      statusCode: 400,
      success: false,
      message: "Server Error",
      error,
    });
  }
};

 // get details of vulnerability
 const getVulnerabilityDetails = async (req, res) => {
    try {
      const { page = 1, limit = 10, search = "", ProjectType } = req.query; // Extract from query params
  
      let query = {};
  

      if (search) {
        query.$or = [{ vulnerabilityModel: { $regex: search, $options: "i" } }];
      }
  
      if (ProjectType) {
        query.criteria = ProjectType;
      }

      const totalCount = await vulnerabilityModel.countDocuments(query);
  
      const report = await vulnerabilityModel
        .find(query)
        .lean()
        .skip((parseInt(page) - 1) * parseInt(limit))
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });
  
      res.status(200).json({
        statuscode: 200,
        success: true,
        total: totalCount,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalCount / limit),
        data: report,
      });
    } catch (error) {
      res.status(500).json({
        statusCode: 500,
        success: false,
        message: "Server Error",
        error: error.message,
      });
    }
  };
  //webVulnability
  const getVulnerability = async (req, res) => {
    const { page, limit , search = "", ProjectType } = req.query;
    let query = {};

    if (search) {
        query.$or = [{ vulnerabilityModel: { $regex: search, $options: "i" } }];
    }

    try {
        let Model;

        if (ProjectType === "Website") {
            Model = webVulnarabilityModel; 
        } else if (ProjectType === "API") {
            Model = apiVulnabilityModel; 
        } else if (ProjectType === "Mobile Application"){
            Model = MobileApplicationModel; 
        } else if (ProjectType ==="Source Code"){
            Model = SourceCodeModel; 
        } else if(ProjectType === "Desktop"){
            Model = DesktopModel;
        } else if(ProjectType === "Switch-L3"){
            Model = SwitchLThreeModel
        }else if (ProjectType === "Switch-L2"){
            Model = SwitchLTwoModel
        }else if (ProjectType === "Attendance System"){
            Model = AttendanceSystemModel
        }else if (ProjectType === "Camera"){
            Model = CameraModel
        }else if (ProjectType === "Wi-Fi"){
            Model = WifiModel
        } else if(ProjectType === "Server Hardware"){
            Model = ServerHardwareModel
        }else if(ProjectType === "VC Equipment"){
            Model = VcEquipmentModel
        } else if (ProjectType === "Router"){
            Model=RouterModel
        }else {
            return res.status(400).json({ message: "Invalid ProjectType" });
        }
        const totalCount = await Model.countDocuments(query);
        const vulnerabilities = await Model .find(query)
        .lean()
        .skip((parseInt(page) - 1) * parseInt(limit))
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });

        res.status(200).json({
            statuscode: 200,
            success: true,
            total: totalCount,
            page: parseInt(page),
            limit: parseInt(limit),
            totalPages: Math.ceil(totalCount / limit),
            data: vulnerabilities,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
};
  
  //get ReportDetailsById
const getReportDetailsById = async (req,res) =>{
    try{
        const { id } = req.params
        const report = await reportModel.findById(id)
        .populate({
        path: "projectName",
        model: "ProjectDetails",
        select: "projectName -_id", 
        })
        .lean()
        report.projectName = report.projectName?.projectName || "";

        if (Array.isArray(report.proofOfConcept)) {
            report.proofOfConcept = report.proofOfConcept
                .filter((item) => item.description?.trim() || item.proof?.trim())
                .map((item) => ({
                    ...item,
                    proof: item.proof ? `${process.env.React_URL}/${item.proof}` : "",
                }));
        }
        
        res.status(200).json({
        statuscode: 200,
        success: true,
        data:report,
        })
    }catch(error){
        res.status(400).json({
            statuscode: 400,
            success: false,
            messagae:'Server Error',
            data:error,
        })
    }
}

const updateReportById = async (req, res) => {
    try {
        const { id } = req.params;
        const { vulnerabilityName, proofOfConcept, ...updatedDetails } = req.body;
        const files = req.files || [];

        if (Array.isArray(vulnerabilityName)) {
            updatedDetails.vulnerabilityName = [...new Set(vulnerabilityName)].join(", ");
        } else {
            updatedDetails.vulnerabilityName = vulnerabilityName?.trim();
        }

        // Find the report
        const report = await reportModel.findById(id);
        if (!report) {
            return res.status(404).json({ statusCode: 404, message: "Report not found" });
        }

        let parsedProofOfConcept = Array.isArray(report.proofOfConcept) ? [...report.proofOfConcept] : [];

        if (proofOfConcept) {
            try {
                parsedProofOfConcept = typeof proofOfConcept === "string" ? JSON.parse(proofOfConcept) : proofOfConcept;
            } catch (error) {
                return res.status(400).json({
                    statusCode: 400,
                    message: "Invalid proofOfConcept format",
                    error: error.message,
                });
            }
        }

        if (!Array.isArray(parsedProofOfConcept)) {
            return res.status(400).json({
                statusCode: 400,
                message: "proofOfConcept must be an array of steps",
            });
        }

        if (files.length > parsedProofOfConcept.length) {
            return res.status(400).json({
                statusCode: 400,
                message: "Too many proof files uploaded. Each proofOfConcept step should have one file.",
            });
        }

        const normalizePath = (filePath) => filePath.replace(/\\/g, "/").replace(/^.*uploads\//, "/uploads/");

        // Organize files based on fieldname (proofOfConcept[0][proof], proofOfConcept[1][proof], etc.)
        const fileMap = {};
        files.forEach((file) => {
            const match = file.fieldname.match(/\[(\d+)]\[\w+]/); // Extract index from fieldname
            if (match) {
                const index = parseInt(match[1], 10);
                fileMap[index] = normalizePath(file.path); // Map file to index
            }
        });

        // Update proofOfConcept array with corresponding files
        parsedProofOfConcept = parsedProofOfConcept.map((step, index) => ({
            noOfSteps: step.noOfSteps?.trim() || `Step ${index + 1}`,
            description: step.description?.trim() || "",
            proof: fileMap[index] || step.proof, // Replace only if a new file exists
        }));

        // Save relative path for proofDocument (if uploaded)
        if (files.length > 0) {
            updatedDetails.proofDocument = normalizePath(files[0].path);
        }

        const updatedReport = await reportModel.findByIdAndUpdate(
            id,
            { ...updatedDetails, proofOfConcept: parsedProofOfConcept },
            { new: true, runValidators: true }
        ).lean();

        if (!updatedReport) {
            return res.status(404).json({ statusCode: 404, message: "Report not found after update" });
        }

        const baseUrl = `${process.env.React_URL}/`;
        updatedReport.proofDocument = updatedReport.proofDocument ? `${baseUrl}/${updatedReport.proofDocument}` : null;
        updatedReport.proofOfConcept = updatedReport.proofOfConcept.map((step) => ({
            ...step,
            proof: step.proof ? `${step.proof}` : null,
            proofPreviwe: step.proof ? `${baseUrl}${step.proof}` : null,
        }));

        res.status(200).json({
            statusCode: 200,
            message: "Report updated successfully",
            reportDetails: updatedReport,
        });

    } catch (error) {
        console.error("Error updating report:", error);
        return res.status(500).json({
            statusCode: 500,
            message: "Unable to update report details",
            error: error.message || error,
        });
    }
};

const getRound = async (req, res) => {
    try {
        const { projectName, projectType, devices='null' } = req.query; 

        if (!projectName || !projectType) {
            return res.status(400).json({
                statusCode: 400,
                message: "Missing projectName or projectType",
            });
        }

        const rounds = await reportModel
            .find({ projectName, projectType, devices })
            .select("round");

       
        const roundList = [...new Set(rounds.map(item => Number(item.round)))]
            .filter(num => !isNaN(num)) 
            .sort((a, b) => a - b);

        return res.status(200).json({
            statusCode: 200,
            message: "Rounds retrieved successfully",
            data: roundList,
        });

    } catch (error) {
        console.error("Error retrieving rounds:", error);
        return res.status(500).json({
            statusCode: 500,
            message: "Unable to retrieve round details",
            error: error.message || error,
        });
    }
};

const getFullReport = async (req, res) => {
    try {
        const { projectName, projectType, round, devices='null' } = req.query;


        const fullReport = await reportModel.find({ projectName, projectType, round, devices });


        const projectDetails = await projectdetailsModel.find({ _id: projectName });


        const updatedReports = fullReport.map((report) => {
            if (Array.isArray(report.proofOfConcept)) {
                report.proofOfConcept = report.proofOfConcept
                    .filter((item) => item.description?.trim() || item.proof?.trim())
                    .map((item) => ({
                        ...item,
                        proof: item.proof ? `${process.env.React_URL}/${item.proof}` : "",
                    }));
            }
            return report;
        });

        res.status(200).json({
            statusCode: 200,
            message: "Rounds retrieved successfully",
            data: projectDetails , 
            response: updatedReports , 
        });

    } catch (error) {
        console.error("Error fetching report:", error);
        res.status(400).json({
            statusCode: 400,
            message: "Unable to get full report details",
            error: error.message || error,
        });
    }
};

const getAllRound = async (req,res) => {
    try{
        const rounds = await RoundModel.find().sort({value: 1});
        res.status(200).json({
            statuscode:200,
            data:rounds
        })
    } catch(error){
        console.error("Error fetching round:", error);
        res.status(400).json({
            statusCode: 400,
            message: "Unable to get rounds",
            error: error.message || error,
        });
    }
}

const addNewRound = async (req,res) => {
    try{
        const existingRound = await RoundModel.find({}, 'value') 
        const usedValues = existingRound.map(round => Number(round.value));
        let  newValue = 1;
        while (usedValues.includes(newValue)) {
            newValue++;
          }

        const newRound = await RoundModel.create({
            label: `Round ${newValue}`,
            value: newValue
        })

        res.status(200).json({
            statuscode:200,
            message:'new Round Added',
            data:newRound
        })
        
    }catch(err){
        res.status(400).json({
            statuscode:400,
            message: 'Failed to add round', 
            error: err
        })
    }
}

const getStpiEmpListActive = async (req, res) => {
    try {
      const { page="" , limit="" , search=" ",centre=" " ,etpe=" ", projectId = "", dir=" "} = req.query;
      let mappedEmployeeIds = [];
      if (projectId.trim()) {
        const project = await projectdetailsModel.findById(projectId).select('resourseMapping');
        if (project) {
          mappedEmployeeIds = project.resourseMapping.map(id => id.toString());
        }
      }
      const query = {
        StatusNoida: true,
        ...(search.trim()
          ? {
              $or: [
                { centre: { $regex: search, $options: "i" } },
                { etpe: { $regex: search, $options: "i" } },
                { ename: { $regex: search, $options: "i" } },
                { empid: { $regex: search, $options: "i" } },
                { dir: { $regex: search, $options: "i" } },
              ],
            }
          : {}),
          ...(centre.trim() ? { centre: centre } : {}), 
          ...(dir.trim() ? { dir: dir } : {}),   
          ...(etpe.trim() ? { etpe: etpe } : {}),  
      };
  
      const totalCount = await stpiEmpDetailsModel.countDocuments(query);
      const allData = await stpiEmpDetailsModel.find(query)
      .sort({ createdAt: -1 }) // initial sort
      .lean(); 

  
    const finalData = allData
      .map(emp => ({
        ...emp,
        isChecked: mappedEmployeeIds.includes(emp._id.toString()),
      }))
      .sort((a, b) => (b.isChecked === true) - (a.isChecked === true)) // true on top
      .slice((page - 1) * limit, page * limit); 
    
      const finalCheckedData = allData
        .map(emp => ({
            ...emp,
            isChecked: mappedEmployeeIds.includes(emp._id.toString()),
        }))
        .filter(emp => emp.isChecked) // only checked ones
        .slice((page - 1) * limit, page * limit);
        const fullData = await stpiEmpDetailsModel.find({ StatusNoida: true }) .sort({ createdAt: -1 });
        const fullDataEdit = await stpiEmpDetailsModel.find({ StatusNoida: true,dir:dir }) .sort({ createdAt: -1 });
   
  
      res.status(200).json({
        statusCode: 200,
        success: true,
        total: totalCount,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(totalCount / limit),
        data: finalData,
        dropData:fullData,
        dropEdit:fullDataEdit,
        response:finalCheckedData
      });
    } catch (error) {
      res.status(400).json({
        statusCode: 400,
        message: error.message || "Something went wrong",
      });
    }
  };

  const projectMapping = async(req,res) => {
    try{
        const payload = req.body;

        const projectId= payload.projectId;
        const employeeId = payload.employeeIds;

        const project = await projectdetailsModel.findById({_id:projectId})

        if (!projectId || !Array.isArray(employeeId)) {
             res.status(400).json({
              statusCode: 400,
              message: "Invalid projectId or employeeId",
            });
        }
        const currentMapping = new Set(project.resourseMapping.map(id => id.toString()));
        const incomingEmpId = new Set(employeeId.map(id => id.toString()));

        employeeId.forEach(id => currentMapping.add(id.toString()));

        project.resourseMapping.forEach(id => {
            if (!incomingEmpId.has(id.toString())) {
              currentMapping.delete(id.toString());
            }
          });

          project.resourseMapping = Array.from(currentMapping).map(id => new mongoose.Types.ObjectId(id));
        await project.save();
        res.status(200).json({
            statusCode:200,
            message: 'Resource mapping updated successfully', 
            data: project.resourseMapping 
        });
    } catch(error){
        res.status(400).json({
            statuscode:400,
            message :error,
        })
    }

  }

  const skillMapping = async(req,res)  => {
    try{
        const payload=req.body
        const mappedSkills = (payload.skills || []).map(([scopeOfWorkId, Rating]) => ({
            scopeOfWorkId: new mongoose.Types.ObjectId(scopeOfWorkId),
            Rating: Rating
          }));
        await stpiEmpDetailsModel.findByIdAndUpdate(
            payload._id,
            { skills: mappedSkills },
            { new: true }
        );
        res.status(200).json({
            statuscode:200,
            success:true,
            message:"Employe kills has been updated"
        })
    }catch(error){
        res.status(400).json({
            statusCode:400,
            message:error
        })
    }
  }
  const postToolsAndHardwareMaster = async(req,res) => {
    try{
        const payload=req.body;
        const toolsAndHardware = await ToolsAndHardwareMasterMdel.findOne({tollsName:payload.tollsName});
        if(toolsAndHardware){
            res.status(400).json({
                statusCode:400,
                message:"Tools And Hardware already exist"
            })
        }else{
            const newtoolsAndHardware = new ToolsAndHardwareMasterMdel({
                tollsName:payload.tollsName,
                toolsAndHardwareType:payload.toolsAndHardwareType,
                createdById:req.session?.user.id ,
                createdbyIp:await getClientIp(req)
            })
            await newtoolsAndHardware.save();
            res.status(200).json({
                statusCode:200,
                message:"Tool and Hardware has been updated",
            })
        }
    }catch(error){
        res.status(400).json({
            status:400,
            message:error
        })
    }
  }

    const getToolsAndHardware = async (req, res) => {
    try {
        let {
        page = 1,
        limit = 10,
        search = " ",
        toolsAndHardwareType = " ",
        } = req.query;

        // ✅ convert to integers
        page = parseInt(page);
        limit = parseInt(limit);

        const query = {
            isDeleted: { $ne: true },
        ...(search.trim()
            ? {
                $or: [
                { tollsName: { $regex: search, $options: "i" } },
                { toolsAndHardwareType: { $regex: search, $options: "i" } },
                ],
            }
            : {}),
        ...(toolsAndHardwareType.trim()
            ? { toolsAndHardwareType: toolsAndHardwareType }
            : {}),
        };

        const totalCount = await ToolsAndHardwareMasterMdel.countDocuments(query);
        const data = await ToolsAndHardwareMasterMdel.find(query)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 });

        res.status(200).json({
        statusCode: 200,
        success: true,
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
        data,
        });
    } catch (error) {
        res.status(400).json({
        statusCode: 400,
        message: error.message || "Something went wrong",
        });
    }
    };

    const editToolsAndData = async (req, res) => {
        try {
            const { id } = req.params;
            const updateData = req.body;
    
            // Check if document exists
            const ToolAndHardware = await ToolsAndHardwareMasterMdel.findById(id);
            if (!ToolAndHardware) {
                return res.status(404).json({
                    statusCode: 404,
                    message: "Tools And Hardware NOT FOUND",
                });
            }
    
            // If req.body is empty -> treat as GET
            const isUpdate = Object.keys(updateData).length > 0;
    
            let projectDetails;
            if (isUpdate) {
                updateData.updatedAt = new Date();
                updateData.updatedIP = await getClientIp(req),
                updateData.updatedId= req.session?.user.id,
                // Perform update
                projectDetails = await ToolsAndHardwareMasterMdel.findByIdAndUpdate(
                    id,
                    { $set: updateData },
                    { new: true }
                );
            } else {
                // No update data -> just return existing document
                projectDetails = ToolAndHardware;
            }
    
            res.status(200).json({
                statusCode: 200,
                message: isUpdate ? "Project Updated Successfully" : "Project Retrieved Successfully",
                projectDetails,
            });
    
        } catch (error) {
            console.error("Error in editToolsAndData:", error);
            res.status(500).json({
                statusCode: 500,
                message: "Internal Server Error",
                error: error.message || error,
            });
        }
    };

    const postToolsAndHardware = async(req,res) => {
        try{
            const payload=req.body;
            const newtoolsAndHardware = new ToolsAndHardwareModel({
                tollsName:payload.tollsName,
                quantity:payload.quantity,
                startDate:payload.startDate,
                endDate:payload.endDate,
                assignedTo:payload.assignedTo,
                directorates:payload.directorates,
                purchasedOrder:payload.purchasedOrder,
                description:payload.description,
                createdIp: await getClientIp(req),
                createdId: req.session?.user.id 
            })
            await newtoolsAndHardware.save();
            res.status(200).json({
                statusCode:200,
                message:"Tool and Hardware has been updated",
            })
        }catch(error){
            res.status(400).json({
                status:400,
                message:error
            })
        }
      }

      const getToolsAndHardwareList = async (req, res) => {
        try {
            const { page = 1, limit = 10, search=" ",directorates=" " } = req.query;
            const query = {
                isDeleted: { $ne: true },
            ...(search.trim()
                ? {
                    $or: [
                    { tollsName: { $regex: search, $options: "i" } },
                    { quantity: { $regex: search, $options: "i" } },
                    { directorates: { $regex: search, $options: "i" } },
                    ],
                }
                : {}),
                ...(directorates.trim() ? { directorates: directorates } : {}),  
            };

            const totalCount = await ToolsAndHardwareModel.countDocuments(query);
            const data = await ToolsAndHardwareModel.find(query).skip((page - 1) * limit).limit(parseInt(limit)).sort({ createdAt: -1 });
            
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

    const editToolsAndHardware = async (req, res) => {
        try {
            const { id } = req.params;
            const updateData = req.body;
    
            // Check if document exists
            const ToolAndHardware = await ToolsAndHardwareModel.findById(id);
            if (!ToolAndHardware) {
                return res.status(404).json({
                    statusCode: 404,
                    message: "Tools And Hardware NOT FOUND",
                });
            }
    
            // If req.body is empty -> treat as GET
            const isUpdate = Object.keys(updateData).length > 0;
    
            let projectDetails;
            if (isUpdate) {
                updateData.updatedAt = new Date();
                updateData.updatedIP = await getClientIp(req),
                updateData.updatedId= req.session?.user.id,
                // Perform update
                projectDetails = await ToolsAndHardwareModel.findByIdAndUpdate(
                    id,
                    { $set: updateData },
                    { new: true }
                );
                
            } else {
                // No update data -> just return existing document
                projectDetails = ToolAndHardware;
            }
    
            res.status(200).json({
                statusCode: 200,
                message: isUpdate ? "Project Updated Successfully" : "Project Retrieved Successfully",
                projectDetails,
            });
    
        } catch (error) {
            console.error("Error in editToolsAndData:", error);
            res.status(500).json({
                statusCode: 500,
                message: "Internal Server Error",
                error: error.message || error,
            });
        }
    };

   const timeline = async (req, res) => {
    try {
        const { id } = req.params;
        const projectPhase = await ProjectPhase.findOne({ ProjectId: id });

        const project = await projectdetailsModel.findById(id).populate({
            path: 'projectType',
            select: 'ProjectTypeName'
        });

        if (!project) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: 'Project not found',
            });
        }
        const employeeIds = project.resourseMapping;
        const employeeDetails = await stpiEmpDetailsModel.find({
            _id: { $in: employeeIds }
        }).select('empid ename centre dir edesg'); 

        res.status(200).json({
            statusCode: 200,
            success: true,
            data: {
                ...project._doc,
                resourseMapping: employeeDetails, 
                projectPhase:projectPhase
            },
        });

        } catch (error) {
            console.error('Timeline error:', error);
            res.status(500).json({
            statusCode: 500,
            success: false,
            message: 'Server error',
            error: error.message || error,
            });
        }
    };

const timelinePhase = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;
    try {
        if (!updateData.phase || !Array.isArray(updateData.phase)) {
            return res.status(400).json({
                statuscode: 400,
                message: "Phase data must be a valid array.",
            });
        }

         if (!updateData.invoiceGenerated || !Array.isArray(updateData.invoiceGenerated)) {
            return res.status(400).json({
                statuscode: 400,
                message: "Invoice must be a valid array.",
            });
        }

        let projectPhase = await ProjectPhase.findOne({ ProjectId: id });

        if (!projectPhase) {
            // Create new document
            const newProjectPhase = new ProjectPhase({
                ProjectId: id,
                amountStatus:updateData.amountStatus,
                phase: updateData.phase,
                invoiceGenerated:updateData.invoiceGenerated,
                createdByIP:await getClientIp(req),
                createdById:req.session?.user.id, 
            });

            await newProjectPhase.save();

            return res.status(200).json({
                statuscode: 200,
                message: "Phase data created successfully",
                data: newProjectPhase,
            });
        } else {
            projectPhase.amountStatus=updateData.amountStatus
            projectPhase.phase = updateData.phase;
            projectPhase.invoiceGenerated = updateData.invoiceGenerated;
            projectPhase.updatedAt=Date.now(),
            projectPhase.updatedByIp = await getClientIp(req),
            projectPhase.updatedById = req.session?.user.id, 

            await projectPhase.save();

            return res.status(200).json({
                statuscode: 200,
                message: "Phase data updated successfully",
                data: projectPhase,
            });
        }
    } catch (error) {
        console.error("Error in timelinePhase API:", error);
        return res.status(500).json({
            statuscode: 500,
            message: "Internal Server Error",
            error: error.message,
        });
    }
}

const getTypeOfWork = async(req,res)=>{
    try{
        const { page, limit, search } = req.query;
         let query = { isDeleted: { $ne: true } };
        if (search) {
            query = {
                typeOfWork: { $regex: search, $options: "i" },
            };
        }
        if (page && limit) {
            const skip = (parseInt(page) - 1) * parseInt(limit);
            const total = await TypeOfWorkModel.countDocuments(query);

            const typeOfWork = await TypeOfWorkModel.find(query)
                .skip(skip)
                .limit(parseInt(limit));

            return res.status(200).json({
                statusCode: 200,
                data: typeOfWork,
                pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / parseInt(limit))
                },
                message: "Type Of Work has been Fetched with Pagination"
            });
        }

        const typeOfWork = await TypeOfWorkModel.find(query);
            res.status(200).json({
            statusCode: 200,
            data: typeOfWork,
            message: "Type Of Work has been Fetched"
        });
        
    } catch(error){
        res.status(400).json({
            statusCode:400,
            message:error
        })
    }
}

const getVulnabilityListSpecific = async(req,res) =>{
    try{
         const {projectName, projectType,round,devices,Name,ipAddress,} = req.query;

          const filter = {};
            if (projectName) filter.projectName = projectName;
            if (projectType) filter.projectType = projectType;
            if (round) filter.round = round;
            if (devices) filter.devices = devices;
            if (Name) filter.Name = Name;
            if (ipAddress) filter.ipAddress = ipAddress;
        
        const vulList = await reportModel
        .find(filter)
        .select('vulnerabilityName sevirty description path impact vulnerableParameter references recomendation proofOfConcept')
        .lean(); 
          const processedList = vulList.map((report) => {
            if (Array.isArray(report.proofOfConcept)) {
                report.proofOfConcept = report.proofOfConcept
                .filter((item) => item.description?.trim() || item.proof?.trim())
                .map((item) => ({
                    ...item,
                    proof: item.proof ? `${process.env.React_URL}/${item.proof}` : "",
                }));
            }
            return report;
        });

        res.status(200).json({
            statusCode:200,
            data:processedList,
            message:"Data has been fetched Succesful"
        })
    } catch(error){
        res.status(400).json({
            statusCode:400,
            data:error,
            message:"Data has not been fetched Succesful"
        })
    }

}

//Tender Detail
// const TenderTrackingDetails = async (req, res) => {
//   try {
//     const tenderDetail = req.body;
//     const file = req.file;

//     if (!tenderDetail || Object.keys(tenderDetail).length === 0) {
//       return res.status(400).json({
//         statusCode: 400,
//         message: "Please enter the required fields",
//       });
//     }

//     // Handle file upload
//     if (file) {
// 		const fileExtension = path.extname(file.originalname).toLowerCase();
//       //const fileExtension = file.mimetype.split("/")[1];

//       // Validate file type
//       const allowedExtensions = [".jpeg", ".png", ".jpg", ".pdf", ".doc", ".docx"];
//       if (!allowedExtensions.includes(fileExtension)) {
//         return res.status(400).json({
//           statusCode: 400,
//           message: "Invalid file type. Only image, doc, or PDF files are allowed.",
//         });
//       }

//             tenderDetail.tenderDocument = '/${fileFolder}/${file.filename}';
//         }

//       const filePath =
//         req.filesPath && req.filesPath[file.fieldname]
//           ? req.filesPath[file.fieldname][0]
//           : `/uploads/tender/${file.filename}`; 


//       tenderDetail.tenderDocument = filePath;
    

//     const newTenderDetails = new TenderTrackingModel(tenderDetail);
//     await newTenderDetails.save();

//     sendEmail(
//         'Test Email via Gmail',
//         'This is a plain text message',
//         '<p>This is an <strong>HTML</strong> message.</p>'
//     );

//     return res.status(200).json({
//       statusCode: 200,
//       message: "Tender Created Successfully",
//       tenderDetails: newTenderDetails,
//     });

//   } catch (error) {
//     console.error("Error saving tender details:", error);
//     return res.status(500).json({
//       statusCode: 500,
//       message: "Unable to save data",
//       error: error.message || error,
//     });
//   }
// };

// getting Tender List API
const getAllTenderList = async (req, res) => {
  try {
    const { isDeleted = false } = req.query;

    // Convert isDeleted string to boolean
    const isDeletedBool = isDeleted === "false";

    // Build query
    const query = { 
      isDeleted: isDeleted,
    };

    const projects = await TenderTrackingModel.find(query);
    res.status(200).json({
      statuscode: 200,
      success: true,
      data: projects,

    });
  } catch (error) {
    res.status(400).json({
      statusCode: 400,
      success: false,
      message: "Server Error",
      error,
    });
  }
};

const getTenderDetails = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = "", isDeleted = "" } = req.query;

    // Convert isDeleted string to boolean
    const isDeletedBool = isDeleted ;

    // Build query
    const query = { 
      isDeleted: isDeletedBool,
      ...(search && {
        $or: [
          { tenderName: { $regex: search, $options: "i" } },
          { organizationName: { $regex: search, $options: "i" } },
          { taskForce: { $regex: search, $options: "i" } },
        ]
      })
    };

    const totalCount = await TenderTrackingModel.countDocuments(query);
    const projects = await TenderTrackingModel.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.status(200).json({
      statuscode: 200,
      success: true,
      total: totalCount,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(totalCount / limit),
      data: projects,

    });
  } catch (error) {
    res.status(400).json({
      statusCode: 400,
      success: false,
      message: "Server Error",
      error,
    });
  }
};



const getState = async(req,res)=>{
    try{
        const stateList = await StateModel.find()
        res.status(200).json({
            statusCode:200,
            data:stateList,
            message:'Data Has Been Fetched Succesfully'
        })

    }catch(error){
        res.status(400).json({
            statusCode:400,
            message:error
        })
    }
}

const getEmpListTaskForce = async(req,res)=>{
    try{
        const empList= await stpiEmpDetailsModel.find({taskForceMember:"Yes"})
        res.status(200).json({
            statusCode:200,
            data:empList,
            messsage:"Data Has Been Fetched"
        })
    }catch(error){
        res.status(400).json({
            statusCode:400,
            message:error
        })
    }
}

const getTenderById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find tender by ID
    const tenderData = await TenderTrackingModel.findById(id)
        .populate({
            path: "comment.commentedBy",    
            select: "empId",                 
            populate: {
                path: "empId",                 
                model: "stpiEmp",
                select: "ename"                
            }
        });

    if (!tenderData) {
      return res.status(404).json({
        statusCode: 404,
        message: "Tender data does not exist",
      });
    }

    // Prepend full URL for tenderDocument if exists
    const filePath = tenderData.tenderDocument
      ? `${process.env.React_URL}/${tenderData.tenderDocument}`
      : null;

    const responseData = {
      ...tenderData._doc,
      tenderDocument: filePath, 
      comment: tenderData.comment.map(c => ({
    ...c._doc,
    displayName: c.commentedBy?.empId?.ename || "Admin"
  }))
    };

    return res.status(200).json({
      statusCode: 200,
      message: "Data fetched successfully",
      data: responseData,
    });

  } catch (error) {
    console.error("Error fetching tender by ID:", error);
    return res.status(500).json({
      statusCode: 500,
      message: "Error fetching tender data",
      error: error.message || error,
    });
  }
};


const updateTenderById = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const file = req.filesPath?.tenderDocument?.[0]; 
    const tender = await TenderTrackingModel.findById(id);
    if (!tender) {
      return res.status(404).json({
        statusCode: 404,
        message: "Tender not found",
      });
    }

    if (file) {
      updateData.tenderDocument = file;
    } else {
      updateData.tenderDocument = tender.tenderDocument;
    }
      const updateLog={
        updatedByIp: await getClientIp(req),
        StatusChangeDate: new Date(),
        updatedById: req.session?.user.id, 
    }
    let updateQuery = { $set: updateData };
    updateQuery.$push = {
      update: {
        $each: [updateLog],
        $position: 0, 
      },
    };
    if (updateData.comments !== undefined && updateData.comments !== null && updateData.comments.trim() !== "" && updateData.comments !== 'undefined') {
        updateQuery.$push = {
            comment: {
            comments: updateData.comments,
            commentedBy: req.session?.user.id, // adjust based on your auth
            commentedOn: new Date(),
        },
      };
    }
    delete updateData.comments; 
    
    if(updateData.status==="Not Bidding"){updateData.messageStatus = null; }
    const updatedTender = await TenderTrackingModel.findByIdAndUpdate(id, updateQuery, {
      new: true,
    });

    res.status(200).json({
      statusCode: 200,
      message: "Tender Updated Successfully",
      tenderDetails: updatedTender,
    });
  } catch (error) {
    console.error("Error updating tender:", error);
    res.status(500).json({
      statusCode: 500,
      message: "Internal Server Error",
      error: error.message || error,
    });
  }
};

const deleteTenderById = async(req,res) =>{
    try {
        const { id } = req.params;

        const deletedUser = await TenderTrackingModel.findByIdAndUpdate(
        id,
        { isDeleted: true, deletedAt: new Date(),deletedByIp:await getClientIp(req),deletedById:req.session?.user.id },
        { new: true },
        
        );

        if (!deletedUser) {
            return res.status(404).json({ message: 'Tender not found' });
        }

        return res.json({
        message: 'Tender deleted successfully',
        data: deletedUser ,
        });

  } catch (error) {
    console.error('Tender delete error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
const deleteprojectsById = async(req,res) =>{

    try {
    const { id } = req.params;

    const GetprojectPhase = await ProjectPhase.findOne({ ProjectId: id });
     
     if (GetprojectPhase){    
        if (GetprojectPhase.amountStatus=="Ongoing" || GetprojectPhase.amountStatus=="On Hold")  {
         return res.json({ statuscode: 401, message: 'Ongoing or On Hold project can not be delete' });
        }
    }

    const deletedProject = await projectdetailsModel.findByIdAndUpdate(
      id,
      { isDeleted: true, deletedAt: new Date(),deletedByIp: await getClientIp(req),deletedById:req.session?.user.id },
      { new: true },
      
    );

    if(deletedProject){
        const deletedReports = await reportModel.updateMany(
        { projectName: id }, 
        {
            isDeleted: true,
            deletedAt: new Date()
        }
        );
    }

    if (!deletedProject)  {
      return res.status(404).json({ message: 'Project not found' });
    }

    return res.json({
      message: 'Project deleted successfully',
      statuscode:200,
      data: deletedProject ,
    });

  } catch (error) {
    console.error('Project delete error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const deleteTrue = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await reportModel.findByIdAndUpdate(
      id, 
      { isDeleted: true },
      { new: true }
    );

    if (!updated) {
      return res.status(400).json({
        statusCode:400,
        message: `No report found with id: ${id}`,
      });
    }

    res.status(200).json({
      statusCode:200,
      message: "Report has been deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
        statusCode:400,
        message: "Server Error",
        error: error.message,
    });
  }
};
const getNetworkDeviceList = async(req,res)=>{
    try{
        const { projectName, projectType } = req.query; 

        if (!projectName || !projectType) {
            return res.status(400).json({
                statusCode: 400,
                message: "Missing projectName or projectType",
            });
        }

        const reports  = await reportModel
            .find({ projectName, projectType })
            .select("devices")
            .lean();

        const allDevices = reports.flatMap(report =>
            Array.isArray(report.devices)
                ? report.devices
                : report.devices ? [report.devices] : []
            );

            const uniqueDevices = [...new Set(allDevices)];


        res.status(200).json({
            statusCode:200,
            data:uniqueDevices,
            message:'Devices has been fetched '
        })
    }catch(error){
        res.status(400).json({
            statusCode:400,
            message:error
        })
    }

}

const getReportById = async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch the report by ID
        const report = await reportModel.findById(id).lean();

        if (!report) {
            return res.status(404).json({
                statusCode: 404,
                message: "Report not found",
            });
        }

        const baseUrl = `${process.env.React_URL}/`;

        report.proofDocument = report.proofDocument ? `${baseUrl}/${report.proofDocument}` : null;


        report.proofOfConcept = Array.isArray(report.proofOfConcept)
            ? report.proofOfConcept.map((step) => ({
                  ...step,
                  proof: step.proof || null,
                  proofPreviwe: step.proof ? `${baseUrl}${step.proof}` : null,
              }))
            : [];
            const project = await projectdetailsModel.findById({_id:report.projectName}).lean();
            report.projectName = project?.projectName


        res.status(200).json({
            statusCode: 200,
            message: "Report fetched successfully",
            reportDetails: report,
        });
    } catch (error) {
        console.error("Error fetching report:", error);
        return res.status(500).json({
            statusCode: 500,
            message: "Unable to fetch report details",
            error: error.message || error,
        });
    }
};

 const postCreateTender = async(req,res)=>{
     try {
        const payload = req.body;
        if(!payload){
            res.status(400).json({
                statusCode:400,
                message :"please enter the require field",
            })
        }
        const existingWorkOrder = await TenderTrackingModel.findOne({ tenderName: payload.tenderName });
        if (existingWorkOrder) {
            return res.status(400).json({
                statusCode: 400,
                message: "Tender already exists. It must be unique.",
            });
        }
        const file = req.file;    
    
        if (file) {
            const fileExtension = file.originalname.split('.').pop().toLowerCase();
            if (!['jpeg', 'png','jpg', 'pdf','docx', 'doc'].includes(fileExtension)) {
                return res.status(400).json({
                    statusCode: 400,
                    message: "Invalid file type. Only image or PDF files are allowed.",
                });
            }

            let fileFolder = 'uploads/documents'; 
            if (file.mimetype.startsWith('image/')) {
                fileFolder = 'uploads/image';
            } else if (file.mimetype === 'application/pdf') {
                fileFolder = 'uploads/agreement'; 
            }

            payload.tenderDocument = `/${fileFolder}/${file.filename}`;
        }
        const parsedTaskForce = JSON.parse(payload.taskForce);
        payload.taskForce = parsedTaskForce.name;
        payload.createdById = req.session?.user.id ;
        payload.createdbyIp = await getClientIp(req)
        const empdetails = await stpiEmpDetailsModel.findById({_id:parsedTaskForce.id})
        const newPersonalDetails = new TenderTrackingModel(payload);
        await newPersonalDetails.save();
        const formattedLastDate = new Date(payload.lastDate).toLocaleDateString('en-GB');
        await sendEmail(
        empdetails.email, // to
        `Tender Allotment Notification – ${payload.tenderName}`, // subject
        '', // plain text (optional, or you can add a summary string)
        `
            <p>Dear <strong>${parsedTaskForce.name}</strong>,</p>

            <p>We are pleased to inform you that the tender <strong>${payload.tenderName}</strong> of 
            <strong>${payload.organizationName}</strong> has been allotted to you.</p>

            <h4>Allotment Details:</h4>
            <ul>
            <li><strong>Tender Name:</strong> ${payload.tenderName}</li>
            <li><strong>Organization Name:</strong> ${payload.organizationName}</li>
            <li><strong>Last Day of Bidding:</strong> ${formattedLastDate}</li>
            <li><strong>State:</strong> ${payload.state}</li>
            <li><strong>Link:</strong> <a href="https://pmcportal.stpi.in" target="_blank">pmcportal.stpi.in</a></li>
            </ul>

            <p>We look forward to your response. For more details, please refer to the portal.</p>

            <p>Thank you,<br />
            <strong>PMC Portal</strong><br/>
            <a href="https://pmcportal.stpi.in">pmcportal.stpi.in</a>
            </p>
        `
        );
        res.status(200).json({
            statusCode: 200,
            message: "Project Created Successfully",
            personalDetails: newPersonalDetails,
        });

    } catch (error) {
        console.error("Error saving project:", error);
        res.status(400).json({
            statusCode: 400,
            message: "Unable to save Data",
            data: error.message || error,
        });
    }
}

const getTypeOfWorkById = async(req,res)=>{
    try{
        const { id } = req.params;
        
        const data = await TypeOfWorkModel.findById(id);

        res.status(200).json({
            statusCode:200,
            data:data,
            message:'Data has Been fetched'
        })
    } catch(error){
        res.status(400).json({
            statusCode:400,
            message:error
        })
    }
}

const putTypeOfWorkById = async(req,res)=>{
    try{
        const { id } = req.params;
        const updateData = req.body;
        const project = await TypeOfWorkModel.findById(id)
        if (!project) {
            return res.status(404).json({
                statusCode: 404,
                message: "Type Of Work not found",
            });
        }
        if (updateData.typeOfWork) {
            const existingProject = await TypeOfWorkModel.findOne({
                typeOfWork: updateData.typeOfWork, 
            });

            if (existingProject) {
                return res.status(401).json({
                    statusCode: 401,
                    message: "Type Of Work must be unique. A Type Of Work already exists.",
                });
            }
        }

        await TypeOfWorkModel.findByIdAndUpdate(
            id,
            { $set: {
                    ...updateData,
                    updatedAt:Date.now(),
                    updatedIp: await getClientIp(req), 
                    updatedId: req.session?.user.id
                } 
            },
            { new: true, runValidators: true },
        );

        res.status(200).json({
            statusCode: 200,
            message: "Type Of Work updated successfully",
        });

    } catch (error) {
         res.status(400).json({
            statusCode: 400,
            message: error,
        });
    }

}

const postTypeOfWork = async(req,res)=>{
    try{
        const payload = req.body;
        if(!payload){
            return res.status(401).json({
                statusCode:401,
                message:'Type Of Work is not empty'
            })
        }
        if (payload.typeOfWork){
            const existTypeOfWork = await TypeOfWorkModel.findOne({
                typeOfWork: payload.typeOfWork, 
            });

            if(existTypeOfWork){
                 return res.status(401).json({
                    statusCode: 401,
                    message: "Type Of Work must be unique. A Type Of Work already exists.",
                });
            }
        }

        const newTypeOfWork = new TypeOfWorkModel({
            typeOfWork: payload.typeOfWork,
            createdIp: await getClientIp(req),
            createdId: req.session?.user.id 
        });

        await newTypeOfWork.save();

        res.status(200).json({
            statusCode:200,
            message:"Types of Work Created Sucessfully"
        })

    }catch(error){
       res.status(400).json({
            statusCode:400,
            message:error
        })
    }
}

const deleteTypeOfWork = async(req,res)=>{
    try{
        const {id} = req.params
        const deleted = await TypeOfWorkModel.findByIdAndUpdate(
        id, 
        { isDeleted: true ,
            isDeletedAt:Date.now(),
            isDeletedIp:await getClientIp(req),
            isDeletedId: req.session?.user.id 
        },
        { new: true }
        );

        if (!deleted) {
        return res.status(400).json({
            statusCode:400,
            message: `Type of work does not exist`,
        });
        }

        res.status(200).json({
            statusCode:200,
            message: "Type Of Work has been deleted successfully",
        });

    }catch (error){
        res.status(400).json({
            statusCode:400,
            messahe:error
        })
    }
}

const reportNameList = async(req,res) =>{
    try{
        const query = req.query.search

        const results = await reportModel.aggregate([
            {
                $match: {
                Name: { $regex: query, $options: 'i' }, 
                },
            },
            {
                $group: {
                _id: '$Name', 
                },
            },
            {
                $project: {
                _id: 0,
                Name: '$_id', 
                },
            },
            {
                $sort: { Name: 1 }, 
            },
        ]);

        res.status(200).json(results);

    } catch(error){
        res.status(400).json({
            statusCode:400,
            message:error
        })
    }
}

const deleteScopeOfWork = async(req,res) =>{
     try{
        const {id} = req.params
        const deleted = await projectTypeModel.findByIdAndUpdate(
        id, 
        { isDeleted: true ,
            isDeletedAt:Date.now(),
            isDeletedIp:await getClientIp(req),
            isDeletedId: req.session?.user.id 
        },
        { new: true }
        );

        if (!deleted) {
        return res.status(400).json({
            statusCode:400,
            message: `Scope of work does not exist`,
        });
        }

        res.status(200).json({
            statusCode:200,
            message: "Scope Of Work has been deleted successfully",
        });

    }catch (error){
        res.status(400).json({
            statusCode:400,
            messahe:error
        })
    }

}

const getScopeOfWorkById = async(req,res)=>{
      try{
        const { id } = req.params;
        
        const data = await projectTypeModel.findById(id);

        res.status(200).json({
            statusCode:200,
            data:data,
            message:'Data has Been fetched'
        })
    } catch(error){
        res.status(400).json({
            statusCode:400,
            message:error
        })
    }

}

const updateScopeOfWork = async (req,res)=>{
    try{
        const {id} = req.params
        const updateData = req.body;
        const scopeOfwork = await projectTypeModel.findById(id)
        if(!scopeOfwork){
            return res.status(401).json({
                statusCode:401,
                message:'Scope Of Work not found'
            })
        }
        if (updateData.ProjectTypeName) {
            const exist = await projectTypeModel.findOne({
                ProjectTypeName: updateData.ProjectTypeName,
                _id: { $ne: id }, // exclude current id
            });
            if (exist) {
                return res.status(401).json({
                statusCode: 401,
                message: "Scope of work with this name already exists",
            });
        }
    }
    await projectTypeModel.findByIdAndUpdate(
      id,
      {
        ...updateData,
        updatedIP: await getClientIp(req),
        updatedId: req.session?.user.id,
        updatedAt: Date.now(),
      },
      { new: true } 
    );
    res.status(200).json({
      statusCode: 200,
      message: "Scope of work has been updated successfully",
    });
    }catch(error){
        res.status(400).json({
            statusCode: 400,
            message: error.message || "Unable to update Scope of Work",
        });
    }
}

const deleteToolsAndHardwareMaster = async(req,res)=>{
    try{
        const {id} = req.params
        const deleted = await ToolsAndHardwareMasterMdel.findByIdAndUpdate(
        id, 
        { isDeleted: true ,
            isDeletedAt:Date.now(),
            isDeletedIp:await getClientIp(req),
            isDeletedId: req.session?.user.id 
        },
        { new: true }
        );

        if (!deleted) {
        return res.status(400).json({
            statusCode:400,
            message: `Tool and Hardware does not exist`,
        });
        }

        res.status(200).json({
            statusCode:200,
            message: "Tool and hardware has been deleted successfully",
        });

    }catch (error){
        res.status(400).json({
            statusCode:400,
            messahe:error
        })
    }
}

const deleteToolsAndHardware = async(req,res)=>{
    try{
        const {id} = req.params
        const deleted = await ToolsAndHardwareModel.findByIdAndUpdate(
        id, 
        { isDeleted: true ,
            isDeletedAt:Date.now(),
            isDeletedIp:await getClientIp(req),
            isDeletedId: req.session?.user.id 
        },
        { new: true }
        );

        if (!deleted) {
        return res.status(400).json({
            statusCode:400,
            message: `Tool and Hardware does not exist`,
        });
        }

        res.status(200).json({
            statusCode:200,
            message: "Tool and hardware has been deleted successfully",
        });

    }catch (error){
        res.status(400).json({
            statusCode:400,
            messahe:error
        })
    }
}

const notification = async (req, res) => {
  try {
    const today = new Date();
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(today.getDate() + 30);

    const data = await ToolsAndHardwareModel.find({
      isDeleted: false, 
      endDate: { $gte: today, $lte: thirtyDaysLater }
    });

    const result = data.map(item => {
      const end = new Date(item.endDate);
      const timeDiff = end - today; 
      const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); 

      return {
        ...item._doc,   
        daysLeft
      };
    });

    res.status(200).json({
      statusCode: 200,
      message: "Data fetched successfully",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: error.message || "Something went wrong"
    });
  }
};

const postCertificate = async(req,res)=>{
    try {
        const certificateDetail = req.body;
        if(!certificateDetail){
            res.status(400).json({
                statusCode:400,
                message :"please enter the require field",
            })
        }
        const file = req.file;        
        if (file) {
            const fileExtension = file.mimetype.split('/')[1];
            if (!['jpeg', 'jpg', 'png', 'pdf'].includes(fileExtension)) {
                return res.status(400).json({
                    statusCode: 400,
                    message: "Invalid file type. Only image or PDF files are allowed.",
                });
            }

            let fileFolder = 'uploads/documents'; 
            if (file.mimetype.startsWith('image/')) {
                fileFolder = 'uploads/image';
            } else if (file.mimetype === 'application/pdf') {
                fileFolder = 'uploads/agreement'; 
            }

            certificateDetail.uploadeCertificate = `/${fileFolder}/${file.filename}`;
        }
        certificateDetail.createdById = req.session?.user.id ;
        certificateDetail.createdbyIp = await getClientIp(req)
        const newCertificateDetails = new CertificateDetailsModel(certificateDetail);
        await newCertificateDetails.save();

        res.status(200).json({
            statusCode: 200,
            message: "Project Created Successfully",
        });

    } catch (error) {
        console.error("Error saving project:", error);
        res.status(400).json({
            statusCode: 400,
            message: "Unable to save Data",
            data: error.message || error,
        });
    }

}

const getCertificate = async(req,res)=>{
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    let query = { isDeleted: false };

    if (search) {
      query.$or = [
        { certificateName: { $regex: search, $options: "i" } },
        { assignedPerson: { $regex: search, $options: "i" } },
      ];
    }

    const totalCount = await CertificateDetailsModel.countDocuments(query);

    const data = await CertificateDetailsModel.find(query).populate('certificateName',"certificateName").populate('assignedPerson','ename')
      .skip((page - 1) * limit)
      .limit(limit) 
      .sort({ createdAt: -1 });

    const certificate = data.map(cert => ({
        _id: cert._id,
        certificateName: cert.certificateName?.certificateName || "", // flatten
        assignedPerson: cert.assignedPerson?.ename || "",
        empid: cert.assignedPerson?.empid || "",
        issuedDate: cert.issuedDate,
        validUpto: cert.validUpto,
        uploadeCertificate: cert.uploadeCertificate,
        createdAt: cert.createdAt
    }));

    res.status(200).json({
      statuscode: 200,
      success: true,
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      data: certificate,
    });
  } catch (error) {
    res.status(400).json({
      statusCode: 400,
      success: false,
      message: "Server Error",
      error,
    });
  }
}

const deleteCertificate = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await CertificateDetailsModel.findByIdAndUpdate(
      id,
      {
        $set: { isDeleted: true },
        $push: {
          deleted: {
            deletedAt: Date.now(),
            deletedByIp: await getClientIp(req),
            deletedById: req.session?.user.id
          }
        }
      },
      { new: true }
    );

    if (!deleted) {
      return res.status(400).json({
        statusCode: 400,
        message: `Certificate does not exist`,
      });
    }

    res.status(200).json({
      statusCode: 200,
      message: "Certificate has been deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      statusCode: 400,
      message: error.message || error
    });
  }
}

const getCertificateById = async(req,res)=>{
    try {
        const { id } = req.params;
        const project = await CertificateDetailsModel.findById(id).populate('certificateName',"certificateName").populate('assignedPerson','ename')

        if (!project) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "Project not found",
            });
        }

        // Construct full URL for workOrder (PDF file)
        const certificateUrl = project.uploadeCertificate
            ? `${process.env.React_URL}/${project.uploadeCertificate}`
            : null;

        const formatted = {
            _id: project._id,
            certificateName: project.certificateName?.certificateName || "",
            assignedPerson: project.assignedPerson?.ename || "",
            issuedDate: project.issuedDate,
            validUpto: project.validUpto,
            uploadeCertificate: project.uploadeCertificate,
            certificateUrl,
            createdAt: project.createdAt,
        };

        res.status(200).json({
            statusCode: 200,
            success: true,
            data: formatted,
        });
    } catch (error) {
        res.status(400).json({
            statusCode: 400,
            success: false,
            message: "Server Error",
            error: error.message || error,
        });
    }
}

const editCertificateDetails = async(req,res)=>{
    try {
    const { id } = req.params;
    const updateData = req.body;
    const file = req.filesPath?.uploadeCertificate?.[0]; 
    const certificate = await CertificateDetailsModel.findById(id);
    if (!certificate) {
      return res.status(404).json({
        statusCode: 404,
        message: "Certificate not found",
      });
    }

    if (file) {
      updateData.uploadeCertificate = file;
    } else {
      updateData.uploadeCertificate = certificate.uploadeCertificate;
    }

    const updateLog={
        updatedByIp: await getClientIp(req),
        updatedAt: new Date(),
        updatedById: req.session?.user.id, 
    }
    
    certificate.update.push(updateLog);

    await CertificateDetailsModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    res.status(200).json({
      statusCode: 200,
      message: "Certificate Updated Successfully",
    });
  } catch (error) {
    console.error("Error updating Certificate:", error);
    res.status(500).json({
      statusCode: 500,
      message: "Internal Server Error",
      error: error.message || error,
    });
  }
}

const getCertificateMaster = async(req,res)=>{
     try{
        const {page, limit, search} = req.query
        let query = { isDeleted: { $ne: true } };
         if (search) {
            query.$or = [
                 { certificateName: { $regex: search, $options: "i" } },
            ];
        }
        if (page && limit) {
            const skip = (parseInt(page) - 1) * parseInt(limit);
            const total = await CertificateMasterModel.countDocuments(query);

            const projecttypeList = await CertificateMaster.find(query)
                .skip(skip)
                .limit(parseInt(limit));

            return res.status(200).json({
                statusCode: 200,
                data: projecttypeList,
                pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / parseInt(limit))
                },
                message: "Certificate has been Fetched with Pagination"
            });
        }
        else{
            const projecttypeList = await CertificateMaster.find({isDeleted: { $ne: true }}).select('_id certificateName');;
            res.status(200).json({
                statusCode: 200,
                message:"",
                data:projecttypeList
            })
        }


    }catch(error){
        res.status(400).json({
            statusCode:400,
            message:"unable to get device list",
            data: error.message || error
        })
    }
}

module.exports = {
    perseonalDetails,
    deviceList,
    getdeviceList,
    ProjectTypeList,
    getProjectTypeList,
    getProjectName,
    getProjectTypeById,
    postReport,
    directrate,
    getDirectrateList,
    getProjecDetails,
    getAllprojectData,
    getProjecDetailsById,
    editProjectDetails,
    getReportDetails,
    getVulnerabilityDetails,
    getReportDetailsById,
    updateReportById,
    getVulnerability,
    getRound,
    getFullReport,
    getAllRound,
    addNewRound,
    getStpiEmpListActive,
    projectMapping,
    skillMapping,
    postToolsAndHardwareMaster,
    getToolsAndHardware,
    editToolsAndData,
    postToolsAndHardware,
    getToolsAndHardwareList,
    editToolsAndHardware,
    timeline,
    timelinePhase,
    getTypeOfWork,
    getVulnabilityListSpecific,
    getTenderDetails,
    getState,
    getEmpListTaskForce,
    updateTenderById,
    getTenderById,
    deleteTenderById,
    deleteTrue,
    getNetworkDeviceList,
    getAllReport,
    getReportById,
	getAllProjectDetails,
    getAllTenderList,
    deleteprojectsById,
    postCreateTender,
    getTypeOfWorkById,
    putTypeOfWorkById,
    postTypeOfWork,
    deleteTypeOfWork,
    reportNameList,
    deleteScopeOfWork,
    getScopeOfWorkById,
    updateScopeOfWork,
    deleteToolsAndHardwareMaster,
    deleteToolsAndHardware,
    notification,
    postCertificate,
    getCertificate,
    deleteCertificate,
    getCertificateById,
    editCertificateDetails,
    getCertificateMaster
}
