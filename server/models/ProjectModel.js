import mongoose from "mongoose";
import User from "./UserModel.js";

const ProjectSchema = new mongoose.Schema(
  {
    projectId: {
      type: String,
      required: true,
    },
    projectName: {
      type: String,
      required: true,
    },
    files: [
      // we are storing path, on frontend we will files.path.split('/') then we make the folders as well
      {
        path: {
          required: true,
          type: String,
        },
        type: {
          type: String,
          enum: ["file", "folder"],
          default: "",
        },
        content: {
          default: "file",
          type: String,
        },
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
    },
    collaborators: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: User,
        },
        permission: {
          type: String,
          enum: ["read", "write"],
          default: "write",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("Project", ProjectSchema);

export default Project;
