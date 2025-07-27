import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import axiosInstance from "../lib/axios";
const Home: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalType, setModalType] = useState<
    "create" | "join" | "username" | null
  >(null);
  const [projectName, setProjectName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [joinRoomId, setJoinRoomId] = useState<string>("");
  const [projectId, setProjectId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!projectName.trim()) return;

    try {
      const res = await axiosInstance.post("/api/create-project", {
        projectName,
      });
      const data = res.data;
      setProjectId(data.projectId);
      setModalType("username");
      setUsername("");
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Error creating project. Please try again.");
    }
  };

  const handleJoin = async () => {
    if (!joinRoomId.trim()) return;

    try {
      const res = await axiosInstance.get(`/projects/${joinRoomId}`);
      if (res.data.success) {
        setProjectId(res.data.data._id);
        setModalType("username");
        setUsername("");
      } else {
        alert("Room ID not found or invalid.");
      }
    } catch (error) {
      console.error("Error joining room:", error);
      alert("Error joining room. Please try again.");
    }
  };

  const handleUsernameSubmit = () => {
    if (!username.trim()) {
      alert("Please enter a username");
      return;
    }
    localStorage.setItem("username", username);
    navigate(`/editor/${projectId}`, { state: { username } });
    setIsModalOpen(false);
  };

  const openModal = (type: "create" | "join") => {
    setModalType(type);
    setIsModalOpen(true);
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white gap-6">
      <h1 className="text-4xl font-bold mb-4">Team Code</h1>

      <div className="flex gap-6 mb-6">
        <button
          onClick={() => openModal("create")}
          className="bg-blue-600 px-6 py-3 rounded hover:bg-blue-700"
        >
          Create New Project
        </button>

        <button
          onClick={() => openModal("join")}
          className="bg-green-600 px-6 py-3 rounded hover:bg-green-700"
        >
          Join Project
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white text-black p-6 rounded-lg w-80">
            {modalType === "create" && (
              <>
                <h2 className="text-2xl font-bold mb-4">Create New Project</h2>
                <input
                  type="text"
                  placeholder="Enter Project Name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="p-2 rounded mb-4 w-full"
                />
                <button
                  onClick={handleCreate}
                  className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 w-full"
                >
                  Create
                </button>
              </>
            )}

            {modalType === "join" && (
              <>
                <h2 className="text-2xl font-bold mb-4">Join Project</h2>
                <input
                  type="text"
                  placeholder="Enter Room ID"
                  value={joinRoomId}
                  onChange={(e) => setJoinRoomId(e.target.value)}
                  className="p-2 rounded mb-4 w-full"
                />
                <button
                  onClick={handleJoin}
                  className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 w-full"
                >
                  Join
                </button>
              </>
            )}

            {modalType === "username" && (
              <>
                <h2 className="text-2xl font-bold mb-4">Enter Username</h2>
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="p-2 rounded mb-4 w-full"
                />
                <button
                  onClick={handleUsernameSubmit}
                  className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700 w-full"
                >
                  Continue
                </button>
              </>
            )}

            <div className="flex justify-between mt-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-400 px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
