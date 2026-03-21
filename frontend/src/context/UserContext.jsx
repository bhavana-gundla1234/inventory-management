import React, { createContext, useState, useContext, useEffect } from 'react';
import { apiRequest } from '../services/api';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const res = await apiRequest('/auth/me', 'GET');
            if (res.success) {
                setUser(res.user);
            }
        } catch (error) {
            console.error("Failed to fetch user:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateUserLocal = (newData) => {
        setUser(prev => ({ ...prev, ...newData }));
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            fetchUser();
        } else {
            setLoading(false);
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, loading, fetchUser, updateUserLocal }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
