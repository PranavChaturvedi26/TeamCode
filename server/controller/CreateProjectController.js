import { v4 as uuidv4 } from "uuid";
import Project from "../models/ProjectModel.js";
import ApiError from "../utils/ApiError.js";

export const createProject = async (req, res) => {
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
    console.log("Creating project with ID:", newProject);
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

export const joinProject = async (req, res) => {
  const { projectId } = req.body;
  if (!projectId) {
    throw new ApiError(400, "Project ID is required");
  }

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    // Add user to project collaborators
    project.collaborators.push({
      user: req.user.id,
      permission: "read",
    });
    await project.save();

    res.status(200).json({
      success: true,
      message: "Joined project successfully",
      data: project,
    });
  } catch (error) {
    console.error("Error joining project:", error);
    throw new ApiError(500, "Server error in joinProject :", error);
  }
};

export default {
  createProject,
  joinProject,
};
