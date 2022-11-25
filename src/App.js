
import React from 'react'
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const socket = io("ws://localhost:1234");


export default function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);

  const [profileSender, setProfileSender] = useState();

  const [profileReceiver, setProfileReceiver] = useState();
  const [notification, setNotification] = useState();

  const notify = (data) => toast(`${data}`);

  useEffect(() => {
    //listening on the event connect to server's socket
    socket.on("join_room", (payload) => {
      setIsConnected(true);
      notify(payload);
    });

    //listening to the event receiving the notification
    socket.on("receive_notification", (payload) => {
      notify(payload);


    
    });
    return () => {
      //Remove the event that you listened 
      socket.off('join_room');
      socket.off('receive_notification');
    };
  }, [isConnected]);

  const handleConnectionToSocket = () => {
    if (profileSender) {
      // COMPULSORY
      //Sending the event to server's socket -> assign this user is online -> this event will be sent when the profile login to the system
      socket.emit("join_room", {
        profile_id: profileSender,
      });
    }
  }

  const sendNotification = () => {
    console.log(profileReceiver)
    console.log(notification)
    //Sending notification to the specific receiver
    if (profileReceiver && notification) {
      socket.emit("send_notification", {
        profile_id: profileReceiver,
        notification: notification
      });
    }
  }

  return (
    <>
      <h1>Connect with socket io</h1>
      <div>
        <h3>Sender Profile Id</h3>
        <input
          type="text"
          value={profileSender}
          onChange={(e) => setProfileSender(e.target.value)}
        />
        <button onClick={handleConnectionToSocket}>CONNECT</button>
      </div>
      -------------------------------------------------------------------------------------------------------
      <h1>Send notification to receiver with socket io</h1>
      <div>
        <p>Receiver Profile Id</p>
        <input
          type="text"
          value={profileReceiver}
          onChange={(e) => setProfileReceiver(e.target.value)}
        />
        <p>Notification</p>
        <input
          defaultValue={`Xin chào tôi là profile`}
          type="text"
          value={notification}
          onChange={(e) => setNotification(e.target.value)}
        />
        <button onClick={sendNotification}>SEND</button>
      </div>

      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}