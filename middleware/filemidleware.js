const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Define allowed file types
const FILE_TYPES = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  image: ["image/jpeg", "image/jpg", "image/png", "image/gif"],
};

// Configure Multer storage
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    let uploadDir = "";

    if (file.mimetype === FILE_TYPES.pdf) {
      uploadDir = path.join(__dirname, "../uploads/agreement");
    } else if (
      file.mimetype === FILE_TYPES.doc ||
      file.mimetype === FILE_TYPES.docx
    ) {
      uploadDir = path.join(__dirname, "../uploads/documents");
    } else if (FILE_TYPES.image.includes(file.mimetype)) {
      uploadDir = path.join(__dirname, "../uploads/image");
    } else {
      return callback(new Error("Invalid file type"), null);
    }

    fs.mkdirSync(uploadDir, { recursive: true });

    callback(null, uploadDir);
  },

  filename: function (req, file, callback) {
    const fileName = `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`;

    let relativeFilePath = "";

    if (file.mimetype === FILE_TYPES.pdf) {
      relativeFilePath = `/uploads/agreement/${fileName}`;
    } else if (
      file.mimetype === FILE_TYPES.doc ||
      file.mimetype === FILE_TYPES.docx
    ) {
      relativeFilePath = `/uploads/documents/${fileName}`;
    } else if (FILE_TYPES.image.includes(file.mimetype)) {
      relativeFilePath = `/uploads/image/${fileName}`;
    }

    if (!req.filesPath) req.filesPath = {};
    if (!req.filesPath[file.fieldname]) req.filesPath[file.fieldname] = [];

    req.filesPath[file.fieldname].push(relativeFilePath);

    callback(null, fileName);
  },
});

// Multer configuration
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    const allowedTypes = [
      FILE_TYPES.pdf,
      FILE_TYPES.doc,
      FILE_TYPES.docx,
      ...FILE_TYPES.image,
    ];
    if (allowedTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error("Invalid file type"), false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

module.exports = upload;
