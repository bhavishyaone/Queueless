import { useState,useContext,createContext } from "react";


const AuthContext = createContext(null);

export const authProvider = ({children})=>{
    const [user,setUser]=useState(()=>{
        const stored = localStorage.getItem("user")
        if(stored){
            return JSON.parse(stored)
        }
        else{
            return null
        }
    })

    const login = (data)=>{
        localStorage.setItem("token",data.token)
        localStorage.setItem("user", JSON.stringify(data.user))

        setUser(data.user)
    }

     const logout = () => {
        localStorage.clear();
        setUser(null);
    };


    return (
        <AuthContext.Provider value={{ user, login, logout }}>
        {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);







