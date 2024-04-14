// @ts-nocheck

import { createRef, useEffect, useRef, useState, useContext, useMemo } from "react";
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
import forge from "node-forge/lib/forge";
import axios from "axios";
import { BASE_URL } from "../api/baseApi";
import "./typedef";

function Chat() {
    const title = useParams().id;

    /**
     * @type {room} 
     */
    const [room, setRoom] = useState({});
    /**
     * @type {message[]} 
     */
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    /**
     * @type {decryptionKey[]} 
     */
    const [keys, setKeys] = useState([]);
    const endOfListRef = createRef();
    const stateRef = useRef();
    const {userName, leaveGroup, chatColor, firstMessage, setFirstMessage, cert, privateKey} = useContext(AuthContext);
    const navigate = useNavigate();
    
    
    useEffect(() => {
        console.log(title);
        console.log(userName);
        const formData = new FormData();
        formData.append('username', userName);
        formData.append('roomName', title);
        formData.append('key', privateKey)
        axios({
            method: 'post',
            url: `${BASE_URL}/getKeys`,
            data: formData,
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        .then((response) => {
            console.log(response.data);
            setKeys(response.data);
            loadMessages(response.data);
        })
        .catch(function (error) {
            console.log(error);
        });

    }, []);

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
    const loadMessages = (keys) => {
        // @ts-ignore
        loadMessagesRoom(title)
        .then((response) => {
            const data = response.data;
            let newMessages = [];
            for(let i = 0; i < data.length; i++) {
                newMessages.push(decryptMessage(data[i], keys));
            }
            setMessages(newMessages);
            // @ts-ignore
            stateRef.current = {messages: data};
    
            // @ts-ignore
        });
    };
   

    useEffect(() => {
        loadRoomByName(title)
        .then((response) => {
            setRoom(response.data);
        }
        );
    }, []);


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


    const onNewMessage = (wsResponse) => {
        console.log(JSON.parse(wsResponse.body));
        console.log(messages);
        if(JSON.parse(wsResponse.body).userName !== userName) {
            loadRoomByName(title)
            .then((response) => {
                setRoom(response.data);
            }
            )
            .catch((error) => {
                console.warn(error);
            });
        }
        const formData = new FormData();
        formData.append('username', userName);
        formData.append('roomName', title);
        formData.append('key', privateKey)
        axios({
            method: 'post',
            url: `${BASE_URL}/getKeys`,
            data: formData,
            headers: { 'Content-Type': 'multipart/form-data' }
        })
        .then((response) => {
            console.log(response.data);
            setKeys(response.data);
             // @ts-ignore
            let newMesages = [...stateRef.current.messages];
            const message = decryptMessage(JSON.parse(wsResponse.body), response.data);
            newMesages.push(message);
            console.log(newMesages);
            setMessages(newMesages);
            })
            .catch(function (error) {
                console.log(error);
            });
    
       
    }


    const decryptMessage = (message, keys) => {
        console.log("Decrypting message")
        console.log(message);
        console.log(keys);
        const key = keys.find((key) => key.keyID === message.keyID);
        if (key) {
            const bufferKey = "-----BEGIN RSA PRIVATE KEY-----\n" + key.publicKey + "\n-----END RSA PRIVATE KEY-----";
            const privateKey = forge.pki.privateKeyFromPem(bufferKey);
            console.log(privateKey);
            const decryptedMessage = privateKey.decrypt(forge.util.decode64(message.content));
            console.log(decryptedMessage);
            message.content = decryptedMessage.toString();
        } 
        console.log(message);
        return message;
    }
    //Scroll to bottom once new message is retrieved if was already scrolled to bottom
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
                console.log(cert);
                const certPem = forge.pki.certificateFromPem(cert);
                const publicKey = certPem.publicKey;
                const encrypted = forge.util.encode64(publicKey.encrypt(message));
                postMessage({message: encrypted, room: room, userName: userName, chatColor: chatColor});
                
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
        postLeaveRoom(title, userName)
        .then((response) => {
            // @ts-ignore
            leaveGroup(title);
            // @ts-ignore
            if(room.numberMembers > 1) {
                postSystemMessage({message: `${userName} has left the room`, roomName: title});
            }
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


function _arrayBufferToBase64( buffer ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
}