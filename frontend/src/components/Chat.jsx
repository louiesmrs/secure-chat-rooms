
import { createRef, useEffect, useRef, useState, useContext } from "react";
// @ts-ignore
import { postMessage, postSystemMessage, loadMessagesRoom, loadRoomByName, postLeaveRoom, postLockRoom, postUnlockRoom } from "../api/messageApi";
import Message from "./Message";
import { AuthContext } from "./AuthUtil";
import {
    UnlockOutlined,
    LockOutlined,
    SendOutlined,
} from "@ant-design/icons";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { getOrCreateStompClient } from "../api/stompClient";

import forge from 'node-forge';
function Chat() {
    const title = useParams().id;
    var keys = forge.pki.rsa.generateKeyPair({bits: 2048});
    var cert = forge.pki.createCertificate();
    cert.publicKey = keys.publicKey;
    console.log(cert);
    console.log(keys);
    /**
     * @typedef {Object} room
     * @property {string} roomName
     * @property {number} numberMembers
     * @property {boolean} locked
     */
    const [room, setRoom] = useState({});
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const endOfListRef = createRef();
    const stateRef = useRef();
    const {userName, leaveGroup, chatColor, firstMessage, setFirstMessage } = useContext(AuthContext);
    const navigate = useNavigate();
    
    // @ts-ignore
    stateRef.current = {messages};

    useEffect(() => {
        console.log(firstMessage);
        if(firstMessage) {
            setFirstMessage(false);
            window.location.reload();
        }
    }, []);
    
    // load new messages upon component mounting once setMessages dependency is present
    useEffect(() => {
        // @ts-ignore
        loadMessagesRoom(title)
        .then((response) => {
            const data = response.data;
            setMessages(data);
            // @ts-ignore
            stateRef.current = {messages: data};
    
            // @ts-ignore
        });
    }, [setMessages]);
   

    useEffect(() => {
        loadRoomByName(title)
        .then((response) => {
            setRoom(response.data);
        }
        );
    }, [messages]);


    // subscribe on new messages when component mounts
    useEffect(() => {
        let stompClient = getOrCreateStompClient();
        console.log(title);
        console.log(room);
        stompClient.connect({}, () => {
            console.log("Connected");
            stompClient.subscribe(`/topic/message/${title}`, onNewMessage);
        });
    }, []);


    const onNewMessage = (response) => {
        console.log(JSON.parse(response.body));
        console.log(messages);
        // @ts-ignore
        let newMesages = [...stateRef.current.messages];
        newMesages.push(JSON.parse(response.body));
        console.log(newMesages);
        setMessages(newMesages);
    }
    //Scroll to bottom once new message is retrieved if was already scrolled to bottom
    console.log(messages);
    useEffect(() => {
        if (endOfListRef.current && messages.length > 6) {
        const isScrolledToBottom = endOfListRef.current.getBoundingClientRect().bottom <= window.innerHeight;
        if (isScrolledToBottom  && messages.length > 6) {
            endOfListRef.current.scrollIntoView({behavior: 'smooth'});
        }
        }
    }, [endOfListRef]);

    // Scroll to bottom once all messages are loaded
    const areMessagesLoaded = messages.length > 0;
    useEffect(() => {
        if (endOfListRef.current  && messages.length > 6) {
        endOfListRef.current.scrollIntoView({behavior: 'smooth'});
        }
        // dependencies do not contain endOfListRef as it shall only be triggered once all messages are loaded and not when endOfListRef gets updated
        // eslint-disable-next-line
    }, [areMessagesLoaded]);


    const sendMessage = (e) => {
        e.preventDefault();
        if(userName !== "") {
            if(message !== "") {
                postMessage({userName, message, room, chatColor: chatColor});
                
            } else {
                alert("Please enter a message");
            }
        } else {
            alert("Please login to send messages");
        }
        setMessage("");
    };

    const changeValue = (e) => {
        setMessage(e.target.value);
    }

    const leaveRoom = () => {
        console.log(title);
        postLeaveRoom(title)
        .then((response) => {
            // @ts-ignore
            leaveGroup(title);
            postSystemMessage({message: `${userName} has left the room`, roomName: title});
            navigate(`/home`);
    });
    }

    const lockRoom = () => {
        console.log(title);
        console.log(room);
        postLockRoom(title)
        .then((response) => {
            loadRoomByName(title)
            .then((response) => {
                setRoom(response.data);
            }
            );
            console.log("Room locked")
        })
        .catch((error) => {
            console.warn(error);
        });
    }

    const unLockRoom = () => {
        console.log(title);
        console.log(room);
        postUnlockRoom(title)
        .then((response) => {
            loadRoomByName(title)
            .then((response) => {
                setRoom(response.data);
            }
            );
            console.log("Room unlocked")
        })
        .catch((error) => {
            console.warn(error);
        });
    }

    return (
        <>
        <Navbar />
        <div className="flex flex-col h-screen">
        <div className="sticky top-16 flex justify-between bg-[#202d33] h-[60px] p-3 items-center">
                    <h1 className="text-white font-medium">{room.
// @ts-ignore
                    roomName}: {room.numberMembers} {room.numberMembers === 1 ? "Member" : "Members"}</h1>
                    
                    {
                    // @ts-ignore
                    !room.locked ? <button onClick={lockRoom}><LockOutlined className="hover:ring-red-500 hover:ring-offset-red-200 text-white transition ease-in duration-200 text-center shadow-md hover:outline-none hover:ring-2 hover:ring-offset-2 rounded-l" style={{ fontSize: '200%'}}></LockOutlined></button>
                    : <button onClick={unLockRoom}><UnlockOutlined className="hover:ring-green-500 hover:ring-offset-green-200 text-white transition ease-in duration-200 text-center shadow-md hover:outline-none hover:ring-2 hover:ring-offset-2 rounded-l" style={{ fontSize: '200%'}}></UnlockOutlined></button>
                    }
                    <button onClick={() => leaveRoom()} className="flex items-center justify-center space-x-2 bg-red-500 hover:ring-red-500 hover:ring-offset-red-200 text-white transition ease-in duration-200 text-center shadow-md hover:outline-none hover:ring-2 hover:ring-offset-2 rounded-lg w-32 h-12">
                        Leave Room
                    </button>
            
        </div>
  
        {/* Messages section */}
        {messages.length !== 0 ?
        <div
          className="flex-row shrink min-w-0 bg-[#242424] overflow-y-auto"
          style={{ padding: "12px 7%" }}
        >
         { [...messages]?.map((msg , i) => (
            <Message
              key={i}
              msg={msg.content}
              time={msg.timestamp}
              userName={msg.userName}
              chatColor={msg.chatColor}
            />
          ))}
         <div ref={endOfListRef} />
        </div>
         : <p className="text-white text-center">No messages yet</p>
        }
       
  
        {/* Bottom section */}
        <div className="flex items-center bg-[#202d33] w-100 h-[70px] p-2">

          {/* Input bar */}
          <form onSubmit={sendMessage} className="flex items-center w-full ml-12">
          <input
            type="text"
            placeholder="Type a message"
            className="bg-[#2c3943] rounded-lg outline-none text-sm text-neutral-200 w-100 h-100 px-3 placeholder:text-sm placeholder:text-[#8796a1]"
            value={message}
            onChange={changeValue}
          />
            
            {/* Send button */}
            <button className="text-[#8796a1] text-xl p-2 rounded-full m-2  hover:bg-[#3c454c]" type="submit"><SendOutlined style={{ fontSize:'150%', color:'white' }}></SendOutlined></button>
            </form>
        </div>
      </div>
      </>
    );
}

export default Chat;