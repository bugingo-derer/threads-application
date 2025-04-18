// SocketContext.jsx
import { io } from "socket.io-client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

export const SocketContextProvider = ({ children }) => {
  const socketRef = useRef(null);
  const user = useRecoilValue(userAtom);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!user?._id || socketRef.current) return;

    socketRef.current = io("http://localhost:5000", {
      query: { userId: user._id }
    });

    socketRef.current.on("getOnlineUsers", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [user?._id]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContextProvider;
