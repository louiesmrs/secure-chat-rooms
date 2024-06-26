import {
    PhoneFilled
} from "@ant-design/icons";
import { useContext, useState } from "react";
import { AuthContext } from "./AuthUtil";
import { Link, useNavigate} from "react-router-dom";
import axios from "axios";
function Navbar() {
    const [open, setOpen] = useState(false);
    const { userName, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const handleClick = () => {
        setOpen(!open);
    };

    const handleLogout = (e) => {
        e.preventDefault();
        logout();
        navigate("/home")
        // axios.post("http://localhost:8000/auth/logout")
        // .then((response) => {
        //     if(response.status === 200) {
        //         logout();
        //     }
        // })
        // .catch(function (error) {
        //     alert("Error logging out");
        //     console.log(error);
        // });
        
    }




return (
    <nav className="sticky top-0 bg-white border-gray-200 dark:bg-[#202d33]">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <PhoneFilled style={{fontSize:'125%'}}className="h-3 max-w-xl" alt=" Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Secure Social Media</span>
        </Link>
        <button type="button" className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false" onClick={handleClick}>
        <span className="sr-only">Open main menu</span>
        <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
        </svg>
        </button>
        <div className={
            "w-full md:block md:w-auto " +
            (open ? "grid grid-cols-3" : " hidden")
        }>
        <ul className={"col-start-3 relative z-50 font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 md:bg-white dark:bg-[#202d33] md:dark:bg-[#202d33] dark:bg-[#202d33]"}>
            { userName === "" ? 
            <li>
                <Link to="/login" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Login</Link>
            </li>
            :
            <>
            <li>
                <Link onClick={(e) => handleLogout(e)} to="/home" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Logout</Link>
            </li>
            <li>
            <Link to="/your-rooms" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Your Rooms</Link>
             </li>
             </>
            }
            <li>
                <Link to="/feed" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent">Feed</Link>
            </li>
            

        </ul>
        </div>
  </div>
</nav>
    );
}
export default Navbar;
