import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/lib/axios";

const CreateProject: React.FC = () => {
  const [projectName, setProjectName] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!projectName.trim()) return;

    try {
      const res = await axiosInstance.post("/projects/create", {
        name: projectName,
      });
      console.log("res in CreateProject:", res);

      const data = res.data.data;
      if (res.data.success) {
        navigate(`/editor/${data}/`);
      } else {
        alert(res.data.error);
      }
    } catch (error: any) {
      console.error("Error creating project:", error);
      alert("An error occurred while creating the project.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>🛠️ Create a New Project</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Project Name"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          required
          style={{ padding: "0.5rem", fontSize: "1rem", width: "300px" }}
        />
        <button
          type="submit"
          style={{ marginLeft: "1rem", padding: "0.5rem 1rem" }}
        >
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateProject;
