import { useEffect, useState, useRef, useContext } from 'react';
import { loadRooms, postJoinRoom, postRoom, postSystemMessage, subscribeOnNewMessages} from '../api/messageApi';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from './AuthUtil';
import { getOrCreateStompClient } from '../api/stompClient';
function RoomList() {
    const { groups, setGroups, userName, setFirstMessage } = useContext(AuthContext);
    const [rooms, setRooms] = useState([]);
    const [addRoom, setAddRoom] = useState("");
    const stateRef = useRef();
    const navigate = useNavigate();
    //console.log(rooms);
    useEffect(() => {
        loadRooms()
        .then((response) => {
            setRooms(response.data);
            getOrCreateStompClient();
        });
    }, [setRooms]);

    // @ts-ignore
    stateRef.current = {rooms};


    const handleChange = (e) => {
        e.persist();
        setAddRoom(e.target.value);
    }

    const handleAddRoom = (e) => {
        e.preventDefault();
        if(addRoom !== "" && userName !== "") {
            postRoom(addRoom)
            .then(() => {
                loadRooms()
                .then((response) => {
                    setRooms(response.data);
                });
                setGroups([...groups, addRoom]);
                postSystemMessage({ message: `${userName} has created the room`, roomName: addRoom});
                setFirstMessage(true);
                navigate(`/chat/${addRoom}`);
            })
            .catch((error) => {
                console.warn(error);
                alert("Room already exists");
            });   
        }
    }



    const JoinRoom = (roomName) => {
        if(userName === "") {
            alert("Please login to join a room");
            return;
        }
        postJoinRoom(roomName)
        .then(() => {
            setGroups([...groups, roomName]);
            console.log(userName, roomName);
            postSystemMessage({message: `${userName} has joined the room`, roomName: roomName});
            setFirstMessage(true);
            navigate(`/chat/${roomName}`);
        })
        .catch((error) => {
            console.warn(error);
            alert(error.response.data.message)
        });

    }

    const handleEnter = (roomName) => {
        return () => {
            setFirstMessage(true);
            navigate(`/chat/${roomName}`);
        }
    }



    return (
       <>
        {/* Archived container */}
        <div className="text-center px-3 m-2 hover:bg-[#202d33]">
          <div >
                <label htmlFor="website" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Room Name</label>
                <div className="flex justify-center">
                <form onSubmit={(e) => handleAddRoom(e)}>
                <input  
                    onChange={handleChange}
                    value={addRoom || ""}
                    type="text" 
                    id="room"
                    className="w-3/4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="e.g. Study Room" required />
                
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full m-2" type='submit'>Add Room</button>
                </form>
                </div>
            </div>
          
        </div>
         <div className="flex flex-col overflow-y-scroll cursor-pointer h-100">
        {/* Chats */}
        {rooms.length !== 0 ? rooms?.map((room, i) => (  
             <div key={i} className="flex content-center justify-between shadow-lg rounded-full bg-grey-700 hover:bg-blue-900 p-4 text-xl">
                { groups.includes(room.roomName) ? 
                <div onClick={handleEnter(room.roomName)}>ENTER {room.roomName} : {room.numberMembers} {room.numberMembers === 1 ? "Member" : "Members"}</div>
                    : <button onClick={()=> JoinRoom(room.roomName)}>JOIN {room.roomName} : {room.numberMembers} {room.numberMembers === 1 ? "Member" : "Members"}</button>
                }
             </div>   
           
        )
        ) : <p className="text-white text-center">No rooms yet</p>}
      </div>
      </>
    );

}

export default RoomList;