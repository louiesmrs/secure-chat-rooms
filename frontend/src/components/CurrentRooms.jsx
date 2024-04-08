import { useContext } from "react";
import Navbar from "./Navbar";
import { AuthContext } from "./AuthUtil";
import { useNavigate } from "react-router-dom";
function CurrentRooms() {
    const { groups, setFirstMessage } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleEnter = (roomName) => {
        return () => {
            setFirstMessage(true);
            navigate(`/chat/${roomName}`);
        }
    }

    return (
        <>
        <Navbar />
        <div className="flex flex-col overflow-y-scroll cursor-pointer h-100 shadow-lg mt-2 ">
        {/* Chats */}
        {groups.length !== 0 ? groups?.map((room, i) => (  
             <div key={i} className="flex content-center justify-between rounded-full hover:bg-blue-900  p-4 text-xl">
                <div onClick={handleEnter(room)}>ENTER {room} </div>
                    
             </div>   
           
        )
        ) : <p className="text-white text-center">No rooms yet</p>}
      </div>
        </>
    )

}

export default CurrentRooms;