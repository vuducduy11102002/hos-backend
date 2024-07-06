const Predict = require("../models/predictModel");
const asyncHandler = require("express-async-handler");
const axios = require("axios");
const csvParser = require("csv-parser");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const moment = require("moment");
const createPredict = asyncHandler(async (req, res) => {
  try {
    // Extract relevant data from req.body
    let { id, data, columns } = req.body;

    // Convert id to string if it's not already
    id = String(id);
    console.log("Request Data:", { id, data, columns });

    // Make a POST request to the Python API
    const response = await axios.post("http://localhost:8100/predict", {
      id,
      data,
      columns,
    });

    // Assuming the Python API returns data in a specific format
    const pythonApiResponse = response.data;
    console.log("Response Data:", response.data);

    // Save the response data to MongoDB
    const newPredict = await Predict.create({
      id: pythonApiResponse.id,
      predictions: pythonApiResponse.predictions,
      out_come: pythonApiResponse.out_come,
    });

    // Send the mapped response to the client
    res.json(newPredict);
    console.log(newPredict);
  } catch (error) {
    // Handle errors
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
const createPredictwithPatient = asyncHandler(async (req, res) => {
  try {
    // Extract relevant data from req.body
    let { id, data, columns, patientName } = req.body;

    // Convert id to string if it's not already
    id = String(id);
    console.log("Request Data:", { id, data, columns, patientName });

    // Make a POST request to the Python API
    const response = await axios.post("http://localhost:8100/predict", {
      id,
      data,
      columns,
    });

    // Assuming the Python API returns data in a specific format
    const pythonApiResponse = response.data;
    console.log("Response Data:", response.data);

    // Create a new object with the desired fields
    const newPredictData = {
      id: pythonApiResponse.id,
      predictions: pythonApiResponse.predictions,
      out_come: pythonApiResponse.out_come,
      patientName: patientName,
    };

    // Save the response data to MongoDB
    const newPredict = await Predict.create(newPredictData);

    // Send the mapped response to the client
    res.json(newPredict);
    console.log(newPredict);
  } catch (error) {
    // Handle errors
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
const getPredict = asyncHandler(async (req, res) => {
  try {
    const getPredict = await Predict.find({}, "_id out_come");
    res.json(getPredict);
  } catch (error) {
    throw new Error(error);
  }
});
const getPredictPatientName = asyncHandler(async (req, res) => {
  try {
    const getPredict = await Predict.find({}, "patientName out_come createdAt");
    res.json(getPredict);
  } catch (error) {
    throw new Error(error);
  }
});

const storage = multer.memoryStorage(); // Using memory storage for handling files
const upload = multer({ storage: storage });
const FILE_SIZE_LIMIT_MB = 5; // Đặt giới hạn file size là 5 MB (đơn vị là megabytes)
function generateRandomId(length) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
const createPredictFileCsv = asyncHandler(async (req, res) => {
  try {
    // Handle file upload using multer
    upload.single("csvFile")(req, res, async function (err) {
      if (err instanceof multer.MulterError) {
        console.error("Multer Error:", err.message);
        return res.status(400).json({ error: "File upload error" });
      } else if (err) {
        console.error("Error:", err.message);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      // Check the size of the uploaded file
      const fileSize = req.file.size;
      if (fileSize > FILE_SIZE_LIMIT_MB * 1024 * 1024) {
        console.error("File size exceeds limit");
        return res.status(400).json({ error: "File size exceeds limit" });
      }

      // Access the uploaded file content
      const fileContent = req.file.buffer.toString("utf8");

      // Generate a random id
      const id = generateRandomId(8);

      // Parse CSV data
      const csvData = [];
      const columns = [];

      // Process CSV content
      const lines = fileContent.split("\n");
      lines.forEach((line, index) => {
        const trimmedLine = line.trim();

        if (trimmedLine) {
          const row = trimmedLine.split(",");

          if (index === 0) {
            columns.push(...row);
          } else {
            csvData.push(row);
          }
        }
      });

      // Make a POST request to the Python API
      const response = await axios.post("http://localhost:8100/predict", {
        id,
        data: csvData,
        columns,
      });

      const pythonApiResponse = response.data;

      // Check if 'out_come' is an array and has data
      if (
        Array.isArray(pythonApiResponse.out_come) &&
        pythonApiResponse.out_come.length > 0
      ) {
        // Create a new CSV file with outcomes
        let resultCsv = `id,${columns.join(",")},outcome\n`;
        pythonApiResponse.out_come.forEach((outcome, index) => {
          resultCsv += `${id},${csvData[index].join(",")},${outcome}\n`;
        });

        // Save the result CSV to a file in the 'result' folder
        const resultFolderPath = "result";
        if (!fs.existsSync(resultFolderPath)) {
          fs.mkdirSync(resultFolderPath);
        }

        const resultFilePath = path.join(resultFolderPath, `result_${id}.csv`);
        fs.writeFileSync(resultFilePath, resultCsv);

        // Send the result CSV path to the client
        res.json({ resultCsvPath: resultFilePath });
      } else {
        console.error("Invalid or empty 'out_come' array");
        res.status(500).json({ error: "Invalid or empty 'out_come' array" });
      }
    });
  } catch (error) {
    // Handle errors
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
const resultFolderPath = "C:\\Hospital\\hos-backend\\result";

const getFileCsv = asyncHandler(async (req, res) => {
  try {
    // Check and create the result folder if it doesn't exist
    if (!fs.existsSync(resultFolderPath)) {
      fs.mkdirSync(resultFolderPath);
    }

    // Read files from the result folder
    const files = await fs.promises.readdir(resultFolderPath);

    // Get detailed information of each file
    const fileDetails = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(resultFolderPath, file);
        const stats = await fs.promises.stat(filePath);
        return {
          name: file,
          path: filePath,
          mtime: moment(stats.mtime).format("YYYY-MM-DD"), // Format mtime to YYYY-MM-DD
        };
      })
    );

    // Filter and sort CSV files by modified time (mtime)
    const csvFiles = fileDetails
      .filter((file) => path.extname(file.name).toLowerCase() === ".csv")
      .sort(
        (a, b) =>
          moment(b.mtime, "YYYY-MM-DD").valueOf() -
          moment(a.mtime, "YYYY-MM-DD").valueOf()
      ); // Sort by mtime (descending)

    res.json(csvFiles);
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const getCsvContent = asyncHandler(async (req, res) => {
  try {
    const fileName = req.params.fileName;
    const filePath = path.join(resultFolderPath, fileName);

    // Kiểm tra xem file có tồn tại không
    await fs.promises.access(filePath);

    // Đọc nội dung file
    const content = await fs.promises.readFile(filePath, "utf-8");

    res.setHeader("Content-Type", "text/csv");
    res.send(content);
  } catch (error) {
    console.error("Error reading CSV file:", error);
    if (error.code === "ENOENT") {
      res.status(404).json({ error: "File not found" });
    } else {
      res.status(500).json({ error: "Unable to read file" });
    }
  }
});

module.exports = {
  createPredict,
  getPredict,
  createPredictwithPatient,
  getPredictPatientName,
  createPredictFileCsv,
  getFileCsv,
  getCsvContent,
};
