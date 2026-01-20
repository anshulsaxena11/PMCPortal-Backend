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
const DomainMasterModel = require('../models/domainMasterModel')
const CertificateTypeMaster = require('../models/certificateTypeMasterModel')
const StpiEmpModel = require('../models/StpiEmpModel')
const EmailSetting = require('../models/emailSetting')
const getClientIp = require('../utils/getClientip')
const path = require('path');
const generatePdfFromHtml = require('../utils/generatePdfFromHtml');
const dayjs = require('dayjs');
const fs = require('fs');
const { sendEmail } = require('../Service/email');
const sharp = require('sharp');

const mongoose = require("mongoose");
const State = require('../models/stateModel')

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
        if (projectDetail.projectValueYearly && typeof projectDetail.projectValueYearly === 'string') {
            try {
                projectDetail.projectValueYearly = JSON.parse(projectDetail.projectValueYearly);
            } catch (err) {
                return res.status(400).json({
                statusCode: 400,
                message: "Invalid projectValueYearly format",
                });
            }
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
        })
        .populate({
            path: "phases",
            model: "ProjectPhase",
        }).populate(
            "domain",                 
            "domain"                
        );


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
        const completetionCertificateUrl = project.phases[0]?.completetionCertificate
            ? `${process.env.React_URL}${project.phases[0].completetionCertificate}`
            : null;

        const clientFeedbackUrl = project.phases[0]?.clientFeedback
            ? `${process.env.React_URL}${project.phases[0].clientFeedback}`
            : null;

        const anyOtherDocumentUrl = project.phases[0]?.anyOtherDocument
            ? `${process.env.React_URL}${project.phases[0].anyOtherDocument}`
            : null;

        const domainValue = project.domain?.domain || null;
        const populatedDomain = project.domain?._id ;

        res.status(200).json({
            statusCode: 200,
            success: true,
            data: {
                ...project._doc,
                domain:populatedDomain,
                domainValue,
                workOrderUrl,
                completetionCertificateUrl,
                clientFeedbackUrl ,
                anyOtherDocumentUrl
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

        const project = await projectdetailsModel.findById(id);
        if (!project) {
            return res.status(404).json({
                statusCode: 404,
                message: "Project not found",
            });
        }

        if (updateData.projectValueYearly) {
            try {
                if (typeof updateData.projectValueYearly === "string") {
                    updateData.projectValueYearly = JSON.parse(updateData.projectValueYearly);
                }
            } catch (err) {
                return res.status(400).json({
                    statusCode: 400,
                    message: "Invalid format for projectValueYearly",
                });
            }
        }

        if (!Array.isArray(updateData.projectValueYearly) || updateData.projectValueYearly.length === 0) {
            updateData.projectValueYearly = [];
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
                { _id: 1, projectTypeName: 1 }
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
        });

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

const updateRoundStatus = async (req, res) => {
    try {
        
        console.log('rf44f4f4f4f4f4f');
        const { projectName, round, projectType, Name, ipAddress, devices, roundStatus } = req.body;

        // Use the identifying fields to locate the document
        const reportFilter = { 
            Name,
            projectName, 
            round, 
            projectType,
            devices,
            ipAddress,
            ...(projectType === 'Network Devices' && { Name, ipAddress, devices })
        };
        console.log(reportFilter);
        
        // Find the report and update the roundStatus field
        const updatedReport = await reportModel.findOneAndUpdate(
            reportFilter,
            { roundStatus: roundStatus },
            { new: true, runValidators: true } // Return the updated document and run validation
        );
        if (!updatedReport) {
            return res.status(404).json({ message: "Report not found or identifying fields are incorrect." });
        }

        res.status(200).json({ message: "Round status updated successfully", data: updatedReport });

    } catch (error) {
        console.error("Status Update Error:", error);
        res.status(500).json({ message: "Failed to update round status", error: error.message });
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
         const directrateList = await directrateModel.distinct("directrate");
        
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

            // Pick uploaded files (if any)
            const completetionCertificate = req.files?.completetionCertificate
                ? '/uploads' + req.files.completetionCertificate[0].path.split('uploads')[1].replace(/\\/g, '/')
                : null;

            const clientFeedback = req.files?.clientFeedback
                ? '/uploads' + req.files.clientFeedback[0].path.split('uploads')[1].replace(/\\/g, '/')
                : null;

            const anyOtherDocument = req.files?.anyOtherDocument
                ? '/uploads' + req.files.anyOtherDocument[0].path.split('uploads')[1].replace(/\\/g, '/')
                : null;

            let projectPhase = await ProjectPhase.findOne({ ProjectId: id });

            if (!projectPhase) {

            const newProjectPhase = new ProjectPhase({
                ProjectId: id,
                amountStatus: updateData.amountStatus,
                phase: updateData.phase,
                invoiceGenerated: updateData.invoiceGenerated,
                completetionCertificate: completetionCertificate,
                clientFeedback: clientFeedback,
                anyOtherDocumenr: anyOtherDocument,
                createdByIP: await getClientIp(req),
                createdById: req.session?.user.id,
            });

            await newProjectPhase.save();

            return res.status(200).json({
                statuscode: 200,
                message: "Phase data created successfully",
                data: newProjectPhase,
            });
            } else {

            projectPhase.amountStatus = updateData.amountStatus;
            projectPhase.phase = updateData.phase;
            projectPhase.invoiceGenerated = updateData.invoiceGenerated;

            if (completetionCertificate) projectPhase.completetionCertificate = completetionCertificate;
            if (clientFeedback) projectPhase.clientFeedback = clientFeedback;
            if (anyOtherDocument) projectPhase.anyOtherDocument = anyOtherDocument;

            projectPhase.update.push({
                updatedAt: Date.now(),
                updatedByIp: await getClientIp(req),
                updatedById: req.session?.user.id,
            });

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
    };

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

const getAllTenderList = async (req, res) => {
  try {
    const { isDeleted = false } = req.query;
    const isDeletedBool = isDeleted === "true";

    // ✅ Fetch all tenders
    const tenders = await TenderTrackingModel.find({ isDeleted: isDeletedBool })
      .populate({
        path: "taskforceempid",
        model: "stpiEmp",
        select: "ename",
      })
      .populate({
        path: "state",
        model: "state",
        select: "stateName",
      })
      .lean();

    // ✅ Fetch directorates & sort alphabetically
    const directorates = await directrateModel
      .find()
      .select("stateId directrate")
      .lean();

    directorates.sort((a, b) =>
      a.directrate?.toLowerCase().localeCompare(b.directrate?.toLowerCase())
    );

    // ✅ Match tenders with directorates
    const tendersMapped = tenders.map((tender) => {
      const tenderStateId = tender?.state?._id?.toString();

      const matchedDir = directorates.find(
        (dir) =>
          Array.isArray(dir.stateId) &&
          dir.stateId.map(String).includes(tenderStateId)
      );

      return {
        ...tender,
        taskforceempid: tender.taskforceempid?._id || null,
        ename: tender.taskforceempid?.ename || "N/A",
        stateName: tender.state?.stateName || "N/A",
        directrate: matchedDir?.directrate || "Not Assigned",
      };
    });

    // ✅ Response with sorted dropdown
    res.status(200).json({
      statusCode: 200,
      success: true,
      total: tendersMapped.length,
      data: tendersMapped,
      directorates: directorates.map((d) => d.directrate), // for dropdown (sorted)
    });
  } catch (error) {
    console.error("Error in getAllTenderList:", error);
    res.status(400).json({
      statusCode: 400,
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};



const getTenderDetails = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      isDeleted = "",
      directorate = "",
      state = "",
    } = req.query;

    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);
    const isDeletedBool = isDeleted === "true";

    // ✅ Step 1: Fetch tenders
    let tenders = await TenderTrackingModel.find({ isDeleted: isDeletedBool })
      .populate({
        path: "taskforceempid",
        model: "stpiEmp",
        select: "ename",
      })
      .populate({
        path: "state",
        model: "state",
        select: "stateName",
      })
      .sort({ createdAt: -1 })
      .lean();

    // ✅ Step 2: Fetch all directorates and sort alphabetically
    const directorates = await directrateModel
      .find()
      .select("stateId directrate")
      .lean();

    // Sort alphabetically by name (A → Z)
    directorates.sort((a, b) =>
      a.directrate?.toLowerCase().localeCompare(b.directrate?.toLowerCase())
    );

    // ✅ Step 3: Map tenders with directorate name
    const tendersMapped = tenders.map((t) => {
      const stateId = t.state?._id?.toString();

      // Find the first directorate whose stateId array includes this state
      const dirObj = directorates.find(
        (d) => Array.isArray(d.stateId) && d.stateId.map(String).includes(stateId)
      );

      return {
        ...t,
        taskforceempid: t.taskforceempid?._id || null,
        ename: t.taskforceempid?.ename || null,
        stateName: t.state?.stateName || null,
        directorateName: dirObj?.directrate || null,
      };
    });

    // ✅ Step 4: Apply filters
    let filteredTenders = tendersMapped;

    if (state && state.toLowerCase() !== "all") {
      filteredTenders = filteredTenders.filter(
        (t) => t.state?._id?.toString() === state
      );
    }

    if (directorate && directorate.toLowerCase() !== "all") {
      filteredTenders = filteredTenders.filter(
        (t) => t.directorateName?.toLowerCase() === directorate.toLowerCase()
      );
    }

    if (search.trim()) {
      const regex = new RegExp(search, "i");
      filteredTenders = filteredTenders.filter(
        (t) =>
          regex.test(t.tenderName || "") ||
          regex.test(t.organizationName || "") ||
          regex.test(t.ename || "") ||
          regex.test(t.stateName || "") ||
          regex.test(t.directorateName || "")
      );
    }

    // ✅ Step 5: Pagination
    const totalCount = filteredTenders.length;
    const paginatedTenders = filteredTenders.slice(
      (pageInt - 1) * limitInt,
      pageInt * limitInt
    );

    // ✅ Step 6: Send response
    res.status(200).json({
      statusCode: 200,
      success: true,
      total: totalCount,
      page: pageInt,
      limit: limitInt,
      totalPages: Math.ceil(totalCount / limitInt),
      data: paginatedTenders,
      directorates: directorates.map((d) => d.directrate), // 👈 Added sorted directorate list
    });
  } catch (error) {
    console.error("Error fetching tender details:", error);
    res.status(400).json({
      statusCode: 400,
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};



const getState = async(req,res)=>{
    try{
        const {page, limit, search} = req.query
        let query = {};
        if (search) {
        const empIds = await stpiEmpDetailsModel.find(
            { ename: { $regex: search, $options: "i" } },
            { _id: 1 }
        ).lean();

        const empIdList = empIds.map((e) => e._id);

        query.$or = [
            { stateName: { $regex: search, $options: "i" } },
            { taskForceMember: { $in: empIdList } },
            { stateCordinator: { $in: empIdList } },
        ];
        }
        if (page && limit) {
            const skip = (parseInt(page) - 1) * parseInt(limit);
            const total = await StateModel.countDocuments(query);

            let stateList = await StateModel.find(query).populate('taskForceMember','ename').populate('stateCordinator','ename')
                .skip(skip)
                .limit(parseInt(limit)).lean();
                
                stateList = stateList.map((s) => ({
                    ...s,
                    taskForceMember: s.taskForceMember?.ename || 'Not Assigned',
                    stateCordinator: s.stateCordinator?.ename || 'Not Assigned',
                }));
            
            return res.status(200).json({
                statusCode: 200,
                data: stateList,
                pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / parseInt(limit))
                },
                message: "state has been Fetched with Pagination"
            });
        } else{
        const stateList = await StateModel.find()
        res.status(200).json({
            statusCode:200,
            data:stateList,
            message:'Data Has Been Fetched Succesfully'
        })
    }
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

const getEmpListStateCordinator = async(req,res)=>{
    try{
        const empList= await stpiEmpDetailsModel.find({StateCordinator:true})
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

    const tenderData = await TenderTrackingModel.findById(id)
        .populate({
            path: "comment.commentedBy",    
            select: "empId",                 
            populate: {
                path: "empId",                 
                model: "stpiEmp",
                select: "ename"                
            }
        }).populate('taskforceempid','ename').populate({
            path:"state",
            model:"state",
            select:"stateName"
        });

    if (!tenderData) {
      return res.status(404).json({
        statusCode: 404,
        message: "Tender data does not exist",
      });
    }
    const taskforceempid = tenderData?.taskforceempid?.ename;
    const taskForceemp = tenderData?.taskforceempid?._id
    const stateName = tenderData?.state?.stateName
    const stateId = tenderData?.state?._id

    const filePath = tenderData.tenderDocument
      ? `${process.env.React_URL}/${tenderData.tenderDocument}`
      : null;

    const responseData = {
      ...tenderData._doc,
      tenderDocument: filePath, 
      taskforceempid:taskforceempid,
      taskForceemp,
      stateName,
      state:stateId,
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
    if (updateData.state && typeof updateData.state === "string") {
      updateData.state = new mongoose.Types.ObjectId(updateData.state);
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
            commentedBy: req.session?.user.id,
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
        payload.taskforceempid = parsedTaskForce.id;
        payload.createdById = req.session?.user.id ;
        payload.createdbyIp = await getClientIp(req)
        const empdetails = await stpiEmpDetailsModel.findById({_id:parsedTaskForce.id})
        const newPersonalDetails = new TenderTrackingModel(payload);
        await newPersonalDetails.save();
        const formattedLastDate = new Date(payload.lastDate).toLocaleDateString('en-GB');
        await sendEmail(
        empdetails.email,
        `Tender Allotment Notification – ${payload.tenderName}`, 
        '', 
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
                _id: { $ne: id }, 
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
    today.setHours(0, 0, 0, 0); 
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(today.getDate() + 30);
    thirtyDaysLater.setHours(23, 59, 59, 999); 

    const data = await ToolsAndHardwareModel.find({ isDeleted: false });

    const result = data
      .map(item => {
        const end = item.endDate ? new Date(item.endDate) : null;
        if (!end) return null;

        end.setHours(0, 0, 0, 0); 
        const daysLeft = Math.ceil((end - today) / (1000 * 60 * 60 * 24));

        return {
          ...item._doc,
          daysLeft,
          expiryDate: end
        };
      })
      .filter(item => item !== null)
      .filter(item => {
        return item.expiryDate < today || (item.expiryDate >= today && item.expiryDate <= thirtyDaysLater);
      });

    result.sort((a, b) => {
      const aExpired = a.expiryDate < today;
      const bExpired = b.expiryDate < today;

      if (!aExpired && bExpired) return -1; 
      if (aExpired && !bExpired) return 1;  
      return 0;
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
            const regex = new RegExp(search, 'i');

            const matchingCertificates = await CertificateMaster.find({
                certificateName: { $regex: regex }
            }).select('_id').lean();
            const matchingCertificateIds = matchingCertificates.map(c => c._id);

            const matchingPersons = await stpiEmpDetailsModel.find({
                $or: [
                    { ename: { $regex: regex } },
                    { empid: { $regex: regex } }
                ]
            }).select('_id').lean();
            const matchingPersonIds = matchingPersons.map(p => p._id);

            const ors = [];
            if (matchingCertificateIds.length) {
                ors.push({ certificateName: { $in: matchingCertificateIds } });
            }
            if (matchingPersonIds.length) {
                ors.push({ assignedPerson: { $in: matchingPersonIds } });
            }
            if (ors.length) {
                query.$or = ors;
            } else {
                query.$or = [
                    { issuedDate: { $regex: regex } },
                    { validUpto: { $regex: regex } }
                ];
            }
        }

    const totalCount = await CertificateDetailsModel.countDocuments(query);

    const data = await CertificateDetailsModel.find(query).populate('certificateName',"certificateName").populate('assignedPerson','ename').populate('certificateType',"certificateType")
      .skip((page - 1) * limit)
      .limit(limit) 
      .sort({ createdAt: -1 });

    const certificate = data.map(cert => ({
        _id: cert._id,
        certificateName: cert.certificateName?.certificateName || "", 
        certificateType: cert.certificateType?.certificateType || "",
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
        const project = await CertificateDetailsModel.findById(id).populate('certificateName',"certificateName").populate('assignedPerson','ename').populate('certificateType',"certificateType");

        if (!project) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "Project not found",
            });
        }

        const certificateUrl = project.uploadeCertificate
            ? `${process.env.React_URL}/${project.uploadeCertificate}`
            : null;

        const formatted = {
            _id: project._id,
            certificateView: project.certificateName?.certificateName || "",
            certificateTypeView: project.certificateType?.certificateType || "",
            assignedPersonView: project.assignedPerson?.ename || "",
            certificateName: project.certificateName?._id || "",
            certificateType: project.certificateType?._id || "",
            assignedPerson: project.assignedPerson?._id || "",
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


const getCertificateByUserId = async (req, res) => {
    try {
        const { userid } = req.params;
        if (!userid || userid === 'null' || userid === 'undefined' || !mongoose.isValidObjectId(userid)) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: 'Invalid or missing user id',
            });
        }
        const { page, limit, search, certificateType } = req.query;
         let query = {
            assignedPerson: userid,
            isDeleted: { $ne: true },
        };

        if (certificateType) {
            query.certificateType = certificateType;
        }

        if (page && limit) {
            const pageInt = parseInt(page);
            const limitInt = parseInt(limit);
            const skip = (pageInt - 1) * limitInt;

            if (search) {
                const matchingCertificates = await CertificateDetailsModel.find({
                    assignedPerson: userid,
                    isDeleted: { $ne: true },
                })
                    .populate({
                        path: "certificateName",
                        match: { certificateName: { $regex: search, $options: "i" } },
                        select: "_id",
                    })
                    .populate({
                        path: "certificateType",
                        match: { certificateType: { $regex: search, $options: "i" } },
                        select: "_id",
                    });

                const matchedIds = matchingCertificates
                    .filter(
                        (cert) =>
                            cert.certificateName !== null || cert.certificateType !== null
                    )
                    .map((cert) => cert._id);

                query._id = { $in: matchedIds };
            }

            const total = await CertificateDetailsModel.countDocuments(query);

            const certificates = await CertificateDetailsModel.find(query)
                .populate("certificateName", "certificateName")
                .populate("assignedPerson", "ename")
                .populate("certificateType", "certificateType")
                .skip(skip)
                .limit(limitInt)
                .sort({ createdAt: -1 });

            const certificatesWithUrl = certificates.map((cert) => {
                const certObject = cert.toObject();
                certObject.certificateUrl = certObject.uploadeCertificate
                    ? `${process.env.React_URL}/${certObject.uploadeCertificate}`
                    : null;
                return certObject;
            });

            return res.status(200).json({
                statusCode: 200,
                success: true,
                data: certificatesWithUrl,
                pagination: {
                    total,
                    page: pageInt,
                    limit: limitInt,
                    totalPages: Math.ceil(total / limitInt),
                },
            });
        }

        const certificates = await CertificateDetailsModel.find({ assignedPerson: userid })
            .populate("certificateName", "certificateName")
            .populate("assignedPerson", "ename")
            .populate("certificateType", "certificateType") ;

        if (!certificates || certificates.length === 0) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "Certificates not found for this user",
            });
        }
        const certificatesWithUrl = certificates.map(cert => {
            const certObject = cert.toObject();
            certObject.certificateUrl = certObject.uploadeCertificate 
                ? `${process.env.React_URL}/${certObject.uploadeCertificate}` 
                : null;
            return certObject;
        });

        res.status(200).json({
            statusCode: 200,
            success: true,
            data: certificatesWithUrl,
        });

    } catch (error) {
        console.error("Error fetching certificates:", error);
        res.status(500).json({ 
            statusCode: 500,
            success: false,
            message: "Server Error",
            error: error.message || error,
        });
    }
};


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

const getCertificateMaster = async (req, res) => {
    try {
        const { page, limit, search, certificateType } = req.query;
        let query = { isDeleted: { $ne: true } };

        if (search) {
            const regex = new RegExp(search, 'i');

            const matchingTypes = await CertificateTypeMaster.find({ certificateType: { $regex: regex } })
                .select('_id')
                .lean();
            const matchingTypeIds = matchingTypes.map((t) => t._id);

            query.$or = [{ certificateName: { $regex: regex } }];
            if (matchingTypeIds.length) {
                query.$or.push({ certificateType: { $in: matchingTypeIds } });
            }
        }

        if (page && limit) {
            const pageInt = parseInt(page);
            const limitInt = parseInt(limit);
            const skip = (pageInt - 1) * limitInt;

            const total = await CertificateMaster.countDocuments(query);

            const docs = await CertificateMaster.find(query)
                .skip(skip)
                .limit(limitInt)
                .populate('certificateType', 'certificateType')
                .lean();

            const data = docs.map((d) => ({
                ...d,
                certificateType: d.certificateType ? d.certificateType.certificateType : null,
            }));

            const certificateType = [...new Set(data.map((d) => d.certificateType).filter(Boolean))];

            return res.status(200).json({
                statusCode: 200,
                data,
                certificateType,
                pagination: {
                    total,
                    page: pageInt,
                    limit: limitInt,
                    totalPages: Math.ceil(total / limitInt),
                },
                message: 'Certificate has been Fetched with Pagination',
            });
        } else if (certificateType) {
            const certificate = await CertificateMaster.find({ certificateType, isDeleted: { $ne: true } }).lean();

            return res.status(200).json({
                statusCode: 200,
                data: certificate,
                message: 'Certificate has been Fetched by Certificate Type',
            });
        }

        const list = await CertificateMaster.find({ isDeleted: { $ne: true } })
            .select('_id certificateName certificateType')
            .populate('certificateType', 'certificateType')
            .lean();

        const data = list.map((d) => ({
            _id: d._id,
            certificateName: d.certificateName,
            certificateType: d.certificateType ? d.certificateType.certificateType : null,
        }));

        return res.status(200).json({
            statusCode: 200,
            message: '',
            data,
        });
    } catch (error) {
        res.status(400).json({
            statusCode: 400,
            message: 'unable to get device list',
            data: error.message || error,
        });
    }
};

const getCertificateMasterById = async(req,res) => {
     try {
        const { id } = req.params;
        let responseData = await CertificateMaster.findById(id).populate('certificateType', 'certificateType');
          

        if (!responseData) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "Certificate not found",
            });
        }  
        const certificateType = responseData?.certificateType?._id
        const certificateTypeName = responseData?.certificateType?.certificateType

        const certificateView = {
            ...responseData._doc,
            certificateType,
            certificateTypeName
        };
        res.status(200).json({
            statusCode: 200,
            success: true,
            data: certificateView,
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
const postCertificateMaster = async(req,res) => {
    try{
        const payload = req.body;

        if(!payload){
            return res.status(400).json({
                statusCode:400,
                message :"please enter the require field",
            })
        }
        const existingDomain = await CertificateMaster.findOne({ certificateName: payload.certificateName });

        if (existingDomain) {
            return res.status(400).json({
                statusCode: 400,
                message: "Certificate already exists",
            });
        }

        payload.createdById = req.session?.user.id ;
        payload.createdbyIp = await getClientIp(req)
        const newCertificateDetails = new CertificateMaster(payload);
        await newCertificateDetails.save();
        res.status(200).json({
            statusCode:200,
            message:'Certificate has been Submitted'
        })
    }catch(error){
        res.status(400).json({
            statusCode:200,
            error
        })
    }
}

const editCertificate = async(req,res) =>{
     try{
        const { id } = req.params;
        const updateData = req.body;
        const state = await CertificateMaster.findById(id);
        if (!state) {
            return res.status(404).json({
                statusCode: 404,
                message: "Data not found",
            });
        }
        const duplicate = await CertificateMaster.findOne({
            _id: { $ne: id }, 
            certificateName: updateData.certificateName, 
        });

        if (duplicate) {
            return res.status(400).json({
                statusCode: 400,
                message: "Certificate with the same name already exists",
            });
        }
        const updateLog={
            updatedByIp: await getClientIp(req),
            updatedAt: new Date(),
            updatedById: req.session?.user.id, 
        }
        state.update.push(updateLog);

        await CertificateMaster.findByIdAndUpdate(id, updateData, {
            new: true,
        });

        res.status(200).json({
            statusCode: 200,
            message: "Certificate has Been Updated Successfully",
        });
    }catch(error){
        res.status(400).json({
            statusCode: 400,
            success: false,
            message: "Server Error",
            error: error.message || error,
        });
    }
}

const getEmpDataById = async (req, res) => {
  try {
    const { id } = req.params;
    const empDetails = await stpiEmpDetailsModel
      .findById(id)
      .populate({
        path: "skills.scopeOfWorkId", 
        model: "ProjectType",
        select: "ProjectTypeName",
      })
      .lean();
    if (!empDetails) {
      return res.status(404).json({
        statusCode: 404,
        message: "Employee not found",
      });
    }

    let skills = [];

        if (empDetails?.skills) { 
        skills = empDetails.skills.map(skill => ({
            _id: skill._id,
            rating: skill.Rating,
            ProjectTypeName: skill.scopeOfWorkId?.ProjectTypeName || "N/A",
        }));
        }

    const enrichedUser = {
      ...empDetails,
     ...empDetails,
        empId: empDetails?.empid,
        ename: empDetails?.ename,
        centre: empDetails?.centre,
        dir: empDetails?.dir,
        etpe: empDetails?.etpe,
        edesg: empDetails?.edesg,
        StatusNoida: empDetails?.StatusNoida,
        taskForceMember: empDetails?.taskForceMember,
        skills,
    };

    return res.status(200).json({
      statusCode: 200,
      data: enrichedUser,
    });
  } catch (error) {
    console.error("Error fetching employee data:", error);
    return res.status(400).json({
      statusCode: 400,
      message: error.message || "Something went wrong",
    });
  }
};

async function getEmployeeProjects(req, res) {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        statusCode: 400,
        message: "Invalid employeeId",
      });
    }
   const empObjectId = mongoose.Types.ObjectId.createFromHexString(id);
    const projects = await projectdetailsModel
      .find({ resourseMapping: { $in: [empObjectId] } })
      .select("projectName")
      .lean();

    if (!projects.length) {
      return res.status(200).json({
        statusCode: 200,
        message: "No projects found for this employee",
        data: [],
      });
    }
    const projectIds = projects.map((p) => p._id);

    const phases = await ProjectPhase.find({
      ProjectId: { $in: projectIds },
    })
      .select("ProjectId amountStatus")
      .lean();
    const result = projects.map((project) => {
      const projectPhase = phases.find(
        (p) => String(p.ProjectId) === String(project._id)
      );
      return {
        projectName: project.projectName,
        amountStatus: projectPhase ? projectPhase.amountStatus : null,
      };
    });

    return res.status(200).json({
      statusCode: 200,
      data: result,
    });
  } catch (err) {
    console.error("Error fetching employee projects:", err.message);
    return res.status(500).json({
      statusCode: 500,
      message: "Internal server error",
    });
  }
}

const getTaskForceMemberById = async(req,res) => {
     try {
        const { id } = req.params;
        let state = await StateModel.findById(id).populate('taskForceMember','ename').populate('stateCordinator','ename')

        if (!state) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "Task Force Member not found",
            });
        }
        state = {
            taskForceMember: state.taskForceMember?.ename || "Not Assigned",
            stateCordinator: state.stateCordinator?.ename || "Not Assigned",
            stateName: state.stateName,
            createdAt: state.createdAt,
        };
        
        res.status(200).json({
            statusCode: 200,
            success: true,
            data: state,
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

const updateTaskForceMember = async(req,res)=>{
    try{
        const { id } = req.params;
        const updateData = req.body;
        const state = await StateModel.findById(id);
        if (!state) {
            return res.status(404).json({
                statusCode: 404,
                message: "Data not found",
            });
        }
        const updateLog={
            updatedByIp: await getClientIp(req),
            updatedAt: new Date(),
            updatedById: req.session?.user.id, 
        }
        state.update.push(updateLog);

        await StateModel.findByIdAndUpdate(id, updateData, {
            new: true,
        });

        res.status(200).json({
            statusCode: 200,
            message: "Task Force Member Updated Successfully",
        });
    }catch(error){
        res.status(400).json({
            statusCode: 400,
            success: false,
            message: "Server Error",
            error: error.message || error,
        });
    }
}

const getTypeList = async(req,res)=>{
    try{
        const types = await projectdetailsModel.find().select('type')
        const typeList = [...new Set(types.map(item => item.type))];
        typeList.sort((a, b) => a.localeCompare(b));
        res.status(200).json({
            statusCode:200,
            message:"Data has been fetched",
            data:typeList
        })
    }catch(error){
        res.status(400).json({
            statusCode:400,
            data:error
        })
    }
}

const postDomainSector = async(req,res) => {
    try{
        const payload = req.body;

        if(!payload){
            return res.status(400).json({
                statusCode:400,
                message :"please enter the require field",
            })
        }
        const existingDomain = await DomainMasterModel.findOne({ domain: payload.domain });

        if (existingDomain) {
            return res.status(400).json({
                statusCode: 400,
                message: "Domain already exists",
            });
        }

        payload.createdById = req.session?.user.id ;
        payload.createdbyIp = await getClientIp(req)
        const newDomainDetails = new DomainMasterModel(payload);
        await newDomainDetails.save();
        res.status(200).json({
            statusCode:200,
            message:'Domain has been Submitted'
        })
    }catch(error){
        res.status(400).json({
            statusCode:200,
            error
        })
    }
}

const getDomainMaster = async(req,res)=>{
     try{
        const {page, limit, search,type} = req.query
        let query = { isDeleted: { $ne: true } };
         if (search) {
            query.$or = [
                { domain: { $regex: search, $options: "i" } },
            ];
        }
        if (type) {
            query.type = type;
        }
        if (page && limit) {
            const skip = (parseInt(page) - 1) * parseInt(limit);
            const total = await DomainMasterModel.countDocuments(query);

            const domainList = await DomainMasterModel.find(query)
                .skip(skip)
                .limit(parseInt(limit));

            return res.status(200).json({
                statusCode: 200,
                data: domainList,
                pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / parseInt(limit))
                },
                message: "Domain  has been Fetched with Pagination"
            });
        }
        else{
            const domainList = await DomainMasterModel.find({isDeleted: { $ne: true }}).select('_id domain');;
            res.status(200).json({
                statusCode: 200,
                message:"",
                data:domainList
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

const getDomainById = async(req,res) => {
     try {
        const { id } = req.params;
        let domainList = await DomainMasterModel.findById(id)

        if (!domainList) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "Domain not found",
            });
        }  
        res.status(200).json({
            statusCode: 200,
            success: true,
            data: domainList,
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



const editDomain = async(req,res) =>{
     try{
        const { id } = req.params;
        const updateData = req.body;
        const state = await DomainMasterModel.findById(id);
        if (!state) {
            return res.status(404).json({
                statusCode: 404,
                message: "Data not found",
            });
        }
        const duplicate = await DomainMasterModel.findOne({
            _id: { $ne: id }, 
            domain: updateData.domain, 
        });

        if (duplicate) {
            return res.status(400).json({
                statusCode: 400,
                message: "Domain with the same name already exists",
            });
        }
        const updateLog={
            updatedByIp: await getClientIp(req),
            updatedAt: new Date(),
            updatedById: req.session?.user.id, 
        }
        state.update.push(updateLog);

        await DomainMasterModel.findByIdAndUpdate(id, updateData, {
            new: true,
        });

        res.status(200).json({
            statusCode: 200,
            message: "Domain has Been Updated Successfully",
        });
    }catch(error){
        res.status(400).json({
            statusCode: 400,
            success: false,
            message: "Server Error",
            error: error.message || error,
        });
    }
}

const postCertificateTypeMaster = async(req,res) => {
    try{
        const payload = req.body;

        if(!payload){
            return res.status(400).json({
                statusCode:400,
                message :"please enter the require field",
            })
        }
        const existingDomain = await CertificateTypeMaster.findOne({ certificateType: payload.certificateType });

        if (existingDomain) {
            return res.status(400).json({
                statusCode: 400,
                message: "Certificate already exists",
            });
        }

        payload.createdById = req.session?.user.id ;
        payload.createdbyIp = await getClientIp(req)
        const newCertificateDetails = new CertificateTypeMaster(payload);
        await newCertificateDetails.save();
        res.status(200).json({
            statusCode:200,
            message:'Certificate Type has been Submitted'
        })
    }catch(error){
        res.status(400).json({
            statusCode:200,
            error
        })
    }
}

const getCertificateTypeMaster = async(req,res)=>{
     try{
        const {page, limit, search} = req.query
        let query = { isDeleted: { $ne: true } };
         if (search) {
            query.$or = [
                 { certificateType: { $regex: search, $options: "i" } },
            ];
        }
        if (page && limit) {
            const skip = (parseInt(page) - 1) * parseInt(limit);
            const total = await CertificateTypeMaster.countDocuments(query);

            const projecttypeList = await CertificateTypeMaster.find(query)
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
            const projecttypeList = await CertificateTypeMaster.find({isDeleted: { $ne: true }}).select('_id certificateType');;
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

const postEmailSetting = async (req, res) => {
  try {
    const { enabled, frequency, day, time } = req.body;

    let emailSetting = await EmailSetting.findOne({});

    if (!emailSetting) {
      // CREATE
      emailSetting = new EmailSetting({
        weeklyMailEnabled: enabled,
        frequency,
        day,
        time,
      });
    } else {
      // UPDATE
      emailSetting.weeklyMailEnabled = enabled;
      emailSetting.frequency = frequency;
      emailSetting.day = day;
      emailSetting.time = time;
    }

    await emailSetting.save();

    res.status(200).json({
      statusCode: 200,
      data: {
        enabled: emailSetting.weeklyMailEnabled,
        frequency: emailSetting.frequency,
        day: emailSetting.day,
        time: emailSetting.time,
      },
      message: 'Email settings updated successfully',
    });

  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: 'Failed to update email settings',
      error: error.message,
    });
  }
};

const getEmailSetting = async(req,res) => {
    try{
        let emailSetting = await EmailSetting.findOne({});
        res.status(200).json({
            statusCode:200,
            enabled: emailSetting 
        })
    } catch(error){
        res.status(400).json({
            statusCode:400,
            error
        })
    }
} 

const generateAndEmailReportInternal = async (emailSettings) => {
    try {
        console.log('[generateAndEmailReportInternal] Starting report generation and email...');
        
        if (!emailSettings || !emailSettings.weeklyMailEnabled) {
            console.log('[generateAndEmailReportInternal] Email settings disabled or not found');
            return;
        }

        const currentDay = dayjs().format('dddd');
        if (!(emailSettings.frequency === 'weekly' && emailSettings.day === currentDay) && emailSettings.frequency !== 'daily') {
            console.log(`[generateAndEmailReportInternal] Day/Frequency mismatch. Current: ${currentDay}, Configured: ${emailSettings.day}, Frequency: ${emailSettings.frequency}`);
            return;
        }

        console.log(`[generateAndEmailReportInternal] Processing for frequency: ${emailSettings.frequency}`);

        // period: daily => last 1 day, weekly => last 7 days
        const endDate = dayjs();
        let startDate;
        if (emailSettings.frequency === 'daily') {
            startDate = endDate.subtract(1, 'day');
        } else {
            startDate = endDate.subtract(7, 'day');
        }

        const states = await StateModel.find()
            .populate('taskForceMember', 'email')
            .populate('stateCordinator', 'email')
            .lean();

        console.log(`[generateAndEmailReportInternal] Found ${states.length} states`);

        const allProjectsRaw = await projectdetailsModel.find().lean();
        const allTendersRaw = await TenderTrackingModel.find({ isDeleted: { $ne: true } }).lean();

        // helper normalizer
        const normalize = s => String(s || '').toLowerCase();

        const calcProjectStats = (projects) => {
            const totalProjects = projects.length;
            const totalValue = projects.reduce((sum, p) => sum + (Number(p.projectValue) || 0), 0);
            const completed = projects.filter(p => {
                const st = normalize(p.status);
                return st.includes('completed') || st.includes('closed') || st.includes('done');
            }).length;
            const ongoing = projects.filter(p => {
                const st = normalize(p.status);
                return st.includes('ongoing') || st.includes('in progress') || st.includes('active');
            }).length;
            return { totalProjects, totalValue, completed, ongoing };
        };

        let emailCount = 0;
        for (const state of states) {
            const stateName = state.stateName || 'All';

            // Projects for this state
            const projectsForState = allProjectsRaw.filter(p => String(p.state || '') === String(state._id));

            // Filter projects by period (startDate-endDate)
            const projectDetails = projectsForState.filter(project => {
                if (!project.startDate) return false;
                const pd = dayjs(project.startDate).valueOf();
                return pd >= startDate.startOf('day').valueOf() && pd <= endDate.endOf('day').valueOf();
            });

            // FY projects (use financial year containing endDate)
            const year = endDate.year();
            const month = endDate.month() + 1;
            const financialYear = month >= 4 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
            const fyMatch = financialYear.match(/(\d+)-(\d+)/);
            let projectDetailsFY = projectsForState;
            if (fyMatch) {
                const fyStart = dayjs(`${fyMatch[1]}-04-01`).startOf('day').valueOf();
                const fyEnd = dayjs(`${fyMatch[2]}-03-31`).endOf('day').valueOf();
                projectDetailsFY = projectsForState.filter(project => {
                    if (!project.startDate) return false;
                    const pd = dayjs(project.startDate).valueOf();
                    return pd >= fyStart && pd <= fyEnd;
                });
            }

            // Tenders for this state within period
            const tendersForState = allTendersRaw.filter(t => String(t.state || '') === String(state._id));
            const filteredRows = tendersForState.filter(t => {
                if (!t.createdAt) return false;
                const ts = dayjs(t.createdAt).valueOf();
                return ts >= startDate.startOf('day').valueOf() && ts <= endDate.endOf('day').valueOf();
            });

            // current summary
            const currentSummary = {
                total: filteredRows.length,
                upload: filteredRows.filter(t => normalize(t.status).includes('not submit') || normalize(t.status).includes('not submitted') || normalize(t.status).includes('upload')).length,
                bidding: filteredRows.filter(t => {
                    const st = normalize(t.status);
                    return st.includes('submitted') || st.includes('under evaluation') || st.includes('bidding') || st.includes('in progress');
                }).length,
                notBidding: filteredRows.filter(t => {
                    const st = normalize(t.status);
                    return st.includes('not bidding') || st.includes('not-bidding') || st.includes('no bid') || st.includes('not bid');
                }).length
            };

            // FY summary
            let fyTotalTenders = 0, fyUploadCount = 0, fyBiddingCount = 0, fyNotBiddingCount = 0;
            if (fyMatch) {
                const fyStart = dayjs(`${fyMatch[1]}-04-01`).startOf('day').valueOf();
                const fyEnd = dayjs(`${fyMatch[2]}-03-31`).endOf('day').valueOf();
                const fyTenders = tendersForState.filter(t => t.createdAt && dayjs(t.createdAt).valueOf() >= fyStart && dayjs(t.createdAt).valueOf() <= fyEnd);
                fyTotalTenders = fyTenders.length;
                fyUploadCount = fyTenders.filter(t => normalize(t.status).includes('not submit') || normalize(t.status).includes('not submitted') || normalize(t.status).includes('upload')).length;
                fyBiddingCount = fyTenders.filter(t => {
                    const st = normalize(t.status);
                    return st.includes('submitted') || st.includes('under evaluation') || st.includes('bidding') || st.includes('in progress');
                }).length;
                fyNotBiddingCount = fyTenders.filter(t => {
                    const st = normalize(t.status);
                    return st.includes('not bidding') || st.includes('not-bidding') || st.includes('no bid') || st.includes('not bid');
                }).length;
            }

            const statsFY = calcProjectStats(projectDetailsFY);
            const statsPeriod = calcProjectStats(projectDetails);

            // Build rows: use a conservative set of columns mirroring frontend intent
            const tenderCols = [
                { field: 'tenderName', headerName: 'Tender Name' },
                { field: 'organizationName', headerName: 'Organization' },
                { field: 'lastDate', headerName: 'Last Date' },
                { field: 'status', headerName: 'Status' },
                { field: 'createdAt', headerName: 'Created On' }
            ];

            const projectCols = [
                { field: 'projectName', headerName: 'Project Name' },
                { field: 'startDate', headerName: 'Start Date' },
                { field: 'endDate', headerName: 'End Date' },
                { field: 'projectValue', headerName: 'Project Value' },
                { field: 'status', headerName: 'Status' }
            ];

            const salesDataRows = filteredRows.map(r => {
                const lastDate = r.lastDate ? dayjs(r.lastDate).format('YYYY-MM-DD') : 'N/A';
                const createdOn = r.createdAt ? dayjs(r.createdAt).format('DD/MM/YYYY') : 'N/A';
                const valueINR = r.valueINR ? (Number(r.valueINR) / 100000).toFixed(2) + ' Lakhs' : 'N/A';
                return `<tr><td>${r.tenderName || ''}</td><td>${r.organizationName || ''}</td><td>${lastDate}</td><td>${r.status || ''}</td><td>${createdOn}</td></tr>`;
            }).join('');

            const projectDataRows = projectDetails.map((p, idx) => {
                const sd = p.startDate ? dayjs(p.startDate).format('DD/MM/YYYY') : 'N/A';
                const ed = p.endDate ? dayjs(p.endDate).format('DD/MM/YYYY') : 'N/A';
                const pv = p.projectValue ? `₹${(Number(p.projectValue) / 100000).toFixed(2)} Lakhs` : 'N/A';
                return `<tr><td>${idx + 1}</td><td>${p.projectName || ''}</td><td>${sd}</td><td>${ed}</td><td>${pv}</td><td>${p.status || ''}</td></tr>`;
            }).join('');

            const headerText = `${stateName} - Report for Period: ${startDate.format('DD/MM/YYYY')} to ${endDate.format('DD/MM/YYYY')}`;

            const htmlContent = `<!doctype html><html><head><meta charset="utf-8"/><style>body{font-family:Arial,Helvetica,sans-serif}table{width:100%;border-collapse:collapse}th,td{border:1px solid #ddd;padding:6px;text-align:left}th{background:#1E90FF;color:#fff}thead{display:table-header-group}tr{page-break-inside:avoid}</style></head><body>` +
                `<h2>${headerText}</h2>` +
                `<h3>(1) Summary</h3>` +
                `<div><p><strong>Financial Year:</strong> ${financialYear}</p><p><strong>Period:</strong> ${startDate.format('DD/MM/YYYY')} - ${endDate.format('DD/MM/YYYY')}</p></div>` +
                `<div style="display:flex;gap:40px"><div><p>Total Tenders: ${fyTotalTenders}</p><p>Upload / Bidding: ${fyUploadCount} / ${fyBiddingCount}</p><p>Not Bidding: ${fyNotBiddingCount}</p></div><div><p>Total Tenders: ${currentSummary.total}</p><p>Upload / Bidding: ${currentSummary.upload} / ${currentSummary.bidding}</p><p>Not Bidding: ${currentSummary.notBidding}</p></div></div>` +
                `<h3>(2) Sales Data Added in This Period</h3><table><thead><tr>${tenderCols.map(c=>`<th>${c.headerName}</th>`).join('')}</tr></thead><tbody>${salesDataRows}</tbody></table>` +
                `<h3>(3) Project Data Added in This Period</h3><table><thead><tr><th>S.No</th><th>Project Name</th><th>Start Date</th><th>End Date</th><th>Project Value</th><th>Status</th></tr></thead><tbody>${projectDataRows}</tbody></table>` +
                `</body></html>`;

            // generate pdf
            console.log(`[generateAndEmailReportInternal] Generating PDF for state: ${stateName}`);
            const pdfBuffer = await generatePdfFromHtml(htmlContent);

            const folder = path.join('uploads', 'documents', 'reports');
            await fs.promises.mkdir(folder, { recursive: true });
            const fileName = `${stateName.replace(/\s+/g, '_')}_${startDate.format('YYYYMMDD')}_${endDate.format('YYYYMMDD')}.pdf`;
            const absFilePath = path.resolve(folder, fileName);
            await fs.promises.writeFile(absFilePath, pdfBuffer);

            console.log(`[generateAndEmailReportInternal] PDF saved to: ${absFilePath}`);

            const publicUrl = `${process.env.React_URL}/${path.relative(process.cwd(), absFilePath).replace(/\\/g, '/')}`;
            const recipients = [];
            if (state.taskForceMember && state.taskForceMember.email) recipients.push(state.taskForceMember.email);
            if (state.stateCordinator && state.stateCordinator.email) recipients.push(state.stateCordinator.email);

            if (recipients.length) {
                // Prefer sending to taskForceMember only (as requested)
                const toEmail = state.taskForceMember && state.taskForceMember.email ? state.taskForceMember.email : recipients[0];
                console.log(`[generateAndEmailReportInternal] Sending email to: ${toEmail}`);
                
                const htmlMsg = `<p>Dear User,</p><p>Please find enclosed the project and sales data of the last one month of your Directorate.</p><p>In case some data is missing then please upload in portal</p><p>Regards,<br/>PMC Portal</p>`;
                // Attach generated PDF (absolute path)
                await sendEmail(process.env.Reciver_Email, `Report - ${stateName}`, '', htmlMsg, [{ filename: fileName, path: absFilePath }]);
                emailCount++;
                console.log(`[generateAndEmailReportInternal] Email sent successfully to: ${toEmail}`);
            } else {
                console.log(`[generateAndEmailReportInternal] No recipients found for state: ${stateName}`);
            }
        }
        
        console.log(`[generateAndEmailReportInternal] Report generation completed. Emails sent: ${emailCount}`);

    } catch (error) {
        console.error('Error in generateAndEmailReportInternal:', error);
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
    getCertificateMaster,
    getTaskForceMemberById,
    updateTaskForceMember,
    getEmpListStateCordinator,
    getEmpDataById,
    getEmployeeProjects,
    getCertificateByUserId,
    getTypeList,
    postDomainSector,
    getDomainMaster,
    getDomainById,
    editDomain,
    getCertificateMasterById,
    postCertificateMaster,
    editCertificate,
    updateRoundStatus,
    postCertificateTypeMaster,
    getCertificateTypeMaster,
    postEmailSetting,
    getEmailSetting,
    generateAndEmailReportInternal
}
