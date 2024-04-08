
import { createRef, useEffect, useRef, useState, useContext } from "react";
import { postMessage, loadMessages, subscribeOnNewMessages } from "../api/messageApi";
import Message from "./Message";
import { AuthContext } from "./AuthUtil";
import Navbar from "./Navbar";
function Feed() {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const endOfListRef = createRef();
    const stateRef = useRef();
    const {userName } = useContext(AuthContext);
    // @ts-ignore
    stateRef.current = {messages};
    console.log(messages)
    // load new messages upon component mounting once setMessages dependency is present
    useEffect(() => {
        loadMessages()
        .then((response) => {
            setMessages(response.data);
        });
    }, [setMessages]);

    // subscribe on new messages when component mounts
    useEffect(() => {
        subscribeOnNewMessages((response) => {
        // @ts-ignore
        let newMessages = [...stateRef.current.messages, JSON.parse(response.body)];
        setMessages(newMessages);
        });
    }, []);
    useEffect(() => {
        if(!endOfListRef.current) return
        if (endOfListRef) {
        const isScrolledToBottom = endOfListRef.current.getBoundingClientRect().bottom <= window.innerHeight-100;
        if (isScrolledToBottom && !endOfListRef.current) {
            endOfListRef.current.scrollIntoView({behavior: 'smooth'});
        }
        }
    }, [endOfListRef]);

    // Scroll to bottom once all messages are loaded
    const areMessagesLoaded = messages.length > 0;
    useEffect(() => {
        if (endOfListRef.current) {
        endOfListRef.current.scrollIntoView({behavior: 'smooth'});
        }
        // dependencies do not contain endOfListRef as it shall only be triggered once all messages are loaded and not when endOfListRef gets updated
        // eslint-disable-next-line
    }, [areMessagesLoaded]);


    

    return (
        <>
        <Navbar />
        <div className="flex flex-col h-screen">
        {/* Contact nav */}
        <div className="flex justify-between bg-[#202d33] h-[60px] p-3">
          {/* Contact info */}
          <div className="flex items-center">

            {/* Info */}
            <div className="flex flex-col">
              {/* Contact */}
              <h1 className="text-white font-medium">Feed</h1>
  
            </div>
          </div>
  
          
        </div>
  
        {/* Messages section */}
        {messages.length !== 0 ?
        <div
          className="flex-col flex-1 shrink min-w-0 bg-gray-700"
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
  
      </div>
      </>
    );
}

export default Feed;