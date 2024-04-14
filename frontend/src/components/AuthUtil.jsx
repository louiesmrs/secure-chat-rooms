// @ts-nocheck
import { useState,  createContext, useEffect } from "react";
import './typedef'
import axios from 'axios';
import { BASE_URL } from "../api/baseApi";

export const AuthContext = createContext();
export const AuthProvider = ({children }) => {
   
 
    const [userName, setUserName] = useState(() => {
      const saved = JSON.parse(localStorage.getItem("username"));
      return saved || "";  
  });
  const [groups, setGroups] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("groups"));
    console.log(saved)
    if(Object.keys(saved).length === 0){
      if(userName !== "") { 
        let groups = [];
        axios.get(`${BASE_URL}/rooms/${userName}`).then((response) => {
          console.log(response.data);
          groups = response.data;
        })
        .catch((error) => {
          console.warn(error);
          
        })
        return groups;
      } else {
        return [];
      }
      } else {
        return saved || [];
      }
  });

  const [chatColor, setChatColor] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("chatColor"));
    return saved || "";
  });

  const [firstMessage, setFirstMessage] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("firstMessage"));
    return saved || false;
  });

  const [cert, setCert] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("cert"));
    return saved || "";
  
  });

  const [privateKey, setPrivateKey] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("privateKey"));
    return saved || "";
  });

    useEffect(() => {
        localStorage.setItem("username", JSON.stringify(userName));
        localStorage.setItem("chatColor", JSON.stringify(chatColor));
    }, [userName]);

    useEffect(() => {
      localStorage.setItem("groups", JSON.stringify(groups));
  }, [groups]);


  useEffect(() => {
    localStorage.setItem("firstMessage", JSON.stringify(firstMessage));
}, [firstMessage]);

  useEffect(() => {
    localStorage.setItem("cert", JSON.stringify(cert));
}, [cert]);

useEffect(() => {
  localStorage.setItem("privateKey", JSON.stringify(privateKey));
}, [privateKey]);



    const leaveGroup = (group) => {
      const newGroups = groups.filter((g) => g !== group);
      setGroups(newGroups);
    }


     const logout = () => {
      localStorage.removeItem("username");
      localStorage.removeItem("groups");
      localStorage.removeItem("chatColor");
      localStorage.removeItem("firstMessage");
      setGroups([]);
      setUserName("");
     }

  return (
    <AuthContext.Provider value={{ userName, setUserName, logout, groups, setGroups, leaveGroup, chatColor, setChatColor, firstMessage, setFirstMessage, setCert, cert, setPrivateKey, privateKey }}>
      {children}</AuthContext.Provider>
  );
};
