import { useParams, useLocation } from "react-router-dom";
import EditorComponent from "./Editor";
import { useEffect, useRef, useState } from "react";
import socket from "../lib/socket";
import Terminal from "./Terminal";

interface LocationState {
  username?: string;
}

interface Params {
  projectId?: string;
}

interface Notification {
  status: "join" | "left";
  username: string;
}

interface UserEvent {
  username: string;
}

const CodeSpace = () => {
  const location = useLocation();
  const { projectId } = useParams<Params>();
  const [projectUsers, setProjectUsers] = useState<Record<string, any> | null>(
    null
  );
  const [notification, setNotification] = useState<Notification | null>(null);
  const [output, setOutput] = useState<string>("");

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!projectId) return;

    const state = location.state as LocationState;
    const username = state?.username;
    console.log("username :", username);

    socket.auth = {
      userId: "u123",
      username: username,
    };

    const projectRoomId = `room-${projectId}`;

    if (!socket.connected) {
      socket.connect();
      socket.once("connect", () => {
        console.log("🟢 Connected:", socket.id);
        socket.emit("join-project-room", projectRoomId);
        console.log("projectRoomId joined :", projectRoomId);
      });
    } else {
      socket.emit("join-project-room", projectRoomId);
      console.log("projectRoomId joined :", projectRoomId);
    }

    socket.on("project-user-map", (users: Record<string, any>) => {
      console.log("👥 Users in project with active files:", users);
      setProjectUsers(users);
    });

    return () => {
      socket.off("connect");
      socket.off("project-user-map");
      socket.emit("leave-project-room", projectId);
      socket.disconnect();
    };
  }, [projectId]);

  useEffect(() => {
    const handleUserJoined = ({ username }: UserEvent) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setNotification({ status: "join", username });
      timeoutRef.current = setTimeout(() => setNotification(null), 3000);
    };

    const handleUserLeft = ({ username }: UserEvent) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setNotification({ status: "left", username });
      timeoutRef.current = setTimeout(() => setNotification(null), 3000);
    };

    socket.on("project-user-joined", handleUserJoined);
    socket.on("project-user-left", handleUserLeft);

    return () => {
      socket.off("project-user-joined", handleUserJoined);
      socket.off("project-user-left", handleUserLeft);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex flex-col flex-1">
        <div className="flex-1 overflow-hidden">
          <EditorComponent projectId={projectId!} setOutput={setOutput} />
        </div>

        <div className="h-60 border-t border-gray-700 overflow-y-scroll bg-black text-white scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          <Terminal output={output} />
        </div>
      </div>

      {notification && (
        <div className="fixed bottom-4 right-4 z-50">
          <div
            className={`px-4 py-2 rounded shadow-md text-white transition-all duration-300 ease-out ${
              notification.status === "join" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {notification.username}{" "}
            {notification.status === "join" ? "joined" : "left"} the project
          </div>
        </div>
      )}
    </div>
  );
};

export default CodeSpace;
