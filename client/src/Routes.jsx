import { useNavigate, useRoutes, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { sileo } from 'sileo';
import api from './libs/axiosInstance';

import ContainerIndex from './components/Landing/ContainerIndex'
import Login from './components/Authentication/Login/Login';
import Signup from './components/Authentication/Signup/Form';
import DashboardLayout from './components/Dashboard/DashboardLayout';
import MainContainer from './components/Dashboard/MainContainer';
import Analytics from './components/Dashboard/Analytics/Analytics';
import {Profile} from './components/Dashboard/Profile/Profile';
import Notes from './components/Dashboard/Notes/Notes';
import OAuthCallback from './components/Authentication/OAuthCallback';
import { useEffect, useState } from 'react';

export const ProtectedRoute = ({ children }) => {
    const { currentUser, updateUser } = useAuth();
    const navigate = useNavigate();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const stored = localStorage.getItem('user');
        if (stored) {
            setChecking(false);
            return;
        }
        
        api.get('/api/auth/me', { withCredentials: true })
                .then(({ data }) => {
                    if (data.user) {
                        updateUser(data.user);
                    } else {
                        sileo.error({
                            title: "Unauthorized",
                            description: "You need to login to access that!",
                            duration: 2000,
                            fill: "black!",
                            styles: { title: "text-white!", description: "text-white/75 text-center!" }
                        });
                        navigate("/login", { replace: true });
                    }
                })
                .catch(() => navigate("/login", { replace: true }))
                .finally(() => setChecking(false));
    }, [navigate, updateUser]);

    if (checking && !localStorage.getItem('user')) return null;
    if (!localStorage.getItem('user') && !currentUser) return null;
    return children;
}

const ProjectRoutes = ()=>{
    const {currentUser, setCurrentUser} = useAuth();
    const navigate = useNavigate();

    useEffect(()=>{
        const user = localStorage.getItem('user');

        if(user && !currentUser){
            setCurrentUser(user);
        }

        if(user && window.location.pathname==="/login"){
            navigate("/jobs");
        }
    }, [currentUser, navigate, setCurrentUser]);

    let elements = useRoutes([
        {
            path: "/",
            element: <ContainerIndex/>
        },
        {
            path: "/login",
            element: <Login/>
        },
        {
            path: "/signup",
            element: <Signup/>
        },
        {
            path: "/auth/callback",
            element: <OAuthCallback/>
        },
        {
            element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
            children: [
                {
                    path: "/jobs",
                    element: <MainContainer/>
                },
                {
                    path: "/analytics",
                    element: <Analytics/>
                },
                {
                    path: "/profile",
                    element: <Profile/>
                },
                {
                    path: "/notes",
                    element: <Notes/>
                }
            ]
        }
    ])
    return elements; 
}

export default ProjectRoutes;
