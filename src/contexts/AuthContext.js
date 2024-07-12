import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
export const AuthContext = createContext();
const { default: jwtDecode } = require("jwt-decode");
const baseUrl = require('../utils/config')

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            console.log(token)

            if (token) {
                try {
                    const res = await axios.get(`${baseUrl}/api/users/profile`, {
                        headers: { 'Authorization': token }
                    });

                    setUser(res.data);
                    // console.log("user Data we got",res.data)
                } catch (error) {
                    console.error(error);
                }
            }

            setLoading(false);
        };

        fetchUser();
    }, []);

    const login = (token) => {
        localStorage.setItem('token', token);
        // const decoded = jwtDecode(token);
        setUser(token);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout ,loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;


