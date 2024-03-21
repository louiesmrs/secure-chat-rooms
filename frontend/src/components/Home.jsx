import { useContext } from "react";
import Navbar from "./Navbar";
import RoomList from "./RoomList";
import { AuthContext } from "../components/AuthUtil";

export default function Home() {
    const { token } = useContext(AuthContext);
    return (
        <>
        <Navbar />
        { token !== "" && <RoomList /> }
        </>
    );
    }