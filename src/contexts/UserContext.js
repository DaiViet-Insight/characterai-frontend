import React from "react";
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const UserContext = React.createContext();

export function useUser() {
    return useContext(UserContext)
}

export function UserProvider({ children }) {
    const navigator = useNavigate();
    const [isShowAuthModal, setIsShowAuthModal] = useState(false);
    const [user, setUser] = useState(null);

    const setProfileInfo = async () => {
        // try {
        //     const token = localStorage.getItem('token');
        //     if (!token) {
        //         return;
        //     }
        //     const response = await fetch('http://20.236.83.109:3000/api/users/information', {
        //         headers: {
        //             'Authorization': `Bearer ${token}`
        //         }
        //     });
        //     if (response.ok) {
        //         const data = await response.json();
        //         setUser(data);
        //     }
        // } catch (error) {
        //     console.log(error);
        // }
    }

    useEffect(() => {
        setProfileInfo();
    }, []);

    const login = (user) => {
        setUser(user)
    }

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigator('/login');
        setIsShowAuthModal(true);
    }

    return (
        <UserContext.Provider 
            value={{ 
                user,
                login,
                logout,
                isShowAuthModal,
                setIsShowAuthModal,
                setProfileInfo
            }}
        >
        {
            children
        }
        </UserContext.Provider>
    );
}