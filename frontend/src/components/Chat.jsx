
import { createRef, useEffect, useRef, useState, useContext, useReducer } from "react";
// @ts-ignore
import { postMessage, postSystemMessage, subscribeOnNewMessages, loadRooms, loadMessagesRoom, loadRoomByName, postLeaveRoom } from "../api/messageApi";
import Message from "./Message";
import { AuthContext } from "./AuthUtil";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { getOrCreateStompClient } from "../api/stompClient";
function Chat() {
    const title = useParams().id;
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
    useEffect(() => {
        if (endOfListRef) {
        const isScrolledToBottom = endOfListRef.current.getBoundingClientRect().bottom <= window.innerHeight;
        if (isScrolledToBottom) {
            endOfListRef.current.scrollIntoView({behavior: 'smooth'});
        }
        }
    }, [endOfListRef]);

    // Scroll to bottom once all messages are loaded
    const areMessagesLoaded = messages.length > 0;
    useEffect(() => {
        if (endOfListRef) {
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
        console.log(room);
        postLeaveRoom(title)
        .then((response) => {
            // @ts-ignore
            leaveGroup(title);
            postSystemMessage({message: `${userName} has left the room`, roomName: title});
            navigate(`/home`);
    });
    }

    return (
        <>
        <Navbar />
        <div className="flex flex-col h-screen">
        <div className="flex justify-between bg-[#202d33] h-[60px] p-3 items-center">
                    <h1 className="text-white font-medium">{room.
// @ts-ignore
                    roomName}: {room.numberMembers} member</h1>
                            <button onClick={() => leaveRoom()} className="flex items-center justify-center space-x-2 bg-red-500 hover:bg-white hover:ring-red-500 hover:ring-offset-red-200 text-white transition ease-in duration-200 text-center shadow-md hover:outline-none hover:ring-2 hover:ring-offset-2 rounded-lg w-32 h-12">
                                Leave Group
                            </button>
            
        </div>
  
        {/* Messages section */}
        {messages.length !== 0 ?
        <div
          className="flex-row shrink min-w-0 bg-gray-700"
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
          
        </div>
         : <p className="text-white text-center">No messages yet</p>
        }
        <div ref={endOfListRef} />
  
        {/* Bottom section */}
        <div className="flex items-center bg-[#202d33] w-100 h-[70px] p-2">

          {/* Input bar */}
          <form onSubmit={sendMessage} className="flex items-center w-full">
          <input
            type="text"
            placeholder="Type a message"
            className="bg-[#2c3943] rounded-lg outline-none text-sm text-neutral-200 w-100 h-100 px-3 placeholder:text-sm placeholder:text-[#8796a1]"
            value={message}
            onChange={changeValue}
          />
            
            {/* Send button */}
            <button className="text-[#8796a1] text-xl p-2 rounded-full hover:bg-[#3c454c]" type="submit">Send</button>
            </form>
        </div>
      </div>
      </>
    );
}

export default Chat;