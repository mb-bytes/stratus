import { createContext, useContext, useState, useEffect } from 'react';
import api from '../libs/axiosInstance';
import { sileo } from "sileo";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(() => {
        
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored) : null;
    });

    useEffect(() => {
        api.get('/api/auth/me')
            .then(({ data }) => {
                if (data.user) {
                    updateUser(data.user);
                } else {
                    updateUser(null);
                }
            })
            .catch(() => {
                updateUser(null);
            });
    }, []);

    useEffect(() => {
        const syncLogout = (e) => {
            if (e.key === 'user') {
                setCurrentUser(e.newValue ? JSON.parse(e.newValue) : null);
            }
        };
        window.addEventListener('storage', syncLogout);
        return () => window.removeEventListener('storage', syncLogout);
    }, []);

    const updateUser = (user) => {
        setCurrentUser(user);
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    };

    const login = async (username, password) => {
        try {
            const { data } = await api.post('/api/auth/login', { username, password });
            updateUser(data.user);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.error || 'Login failed' };
        }
    };

    const signup = async (name, username, email, password) => {
        try {
            const { data } = await api.post('/api/auth/signup', { name, username, email, password });
            updateUser(data.user);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.error || 'Signup failed' };
        }
    };

    const deleteAccount = async (username) => {
        try {
            await api.delete('/api/auth/delete-account', { data: { username } });
            updateUser(null);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.error || 'Failed to delete account' };
        }
    };

    const logout = async () => {
        try {
            await api.get('/api/auth/logout');
            sileo.success({
                title: "Logged out succesfully",
                duration: 5000,
                fill: "black!",
                styles:{
                    title: "text-white!"
                }
            })
        } catch (error) {
            console.error('Logout error:', error);
        }
        updateUser(null);
    };

    return (
        <AuthContext.Provider value={{ currentUser, setCurrentUser, updateUser, login, signup, logout, deleteAccount }}>
            {children}
        </AuthContext.Provider>
    );
};
