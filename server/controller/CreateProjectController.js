const { v4: uuidv4 } = require("uuid");
import { Project } from "../models/ProjectModel.js";
import ApiError from "../utils/ApiError.js";

const createProject = async (req, res) => {
  const { projectName } = req.body;
  if (!projectName) {
    throw new ApiError(400, "Project name is required");
  }
  if (typeof projectName !== "string") {
    throw new ApiError(400, "Project name must be a string");
  }

  const projectId = uuidv4();
  try {
    const newProject = new Project({
      projectId,
      projectName,
      files: [{ path: `${projectName}`, type: "folder" }],
    });
    await newProject.save();
    console.log("Project created successfully:", newProject);
    res.status(201).json({
      success: true,
      message: "Project created successfully",
      data: newProject,
    });
  } catch (error) {
    console.error("Error creating project:", error);
    throw new ApiError(500, "Server error in createProject :", error);
  }
};

module.exports = {
  createProject,
};
