import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../libs/axiosInstance';

export default function OAuthCallback() {
    const { updateUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        api.get('/api/auth/me')
            .then(({ data }) => {
                if (data.user) {
                    localStorage.setItem('user', JSON.stringify(data.user));
                    updateUser(data.user);
                    navigate('/jobs', { replace: true });
                } else {
                    navigate('/login?error=auth_failed', { replace: true });
                }
            })
            .catch(() => {
                navigate('/login?error=auth_failed', { replace: true });
            });
    }, [navigate, updateUser]);

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            fontFamily: 'sans-serif',
            color: '#888'
        }}>
            Signing you in...
        </div>
    );
}
