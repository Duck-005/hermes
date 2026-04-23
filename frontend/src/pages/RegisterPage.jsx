import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { setCredentials } from '../store/authSlice';
import api from '../services/api';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await api.post('/api/v1/auth/register', { username, password });
            dispatch(setCredentials({ user: { username }, token: response.data.token }));
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#313338]">
            <div className="w-full max-w-md p-8 bg-[#2b2d31] rounded-lg shadow-xl">
                <h2 className="text-2xl font-bold text-center text-white mb-2">Create an account</h2>
                
                {error && <div className="p-3 mb-4 text-sm text-red-500 bg-red-500/10 border border-red-500/50 rounded">{error}</div>}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-[#b5bac1] uppercase mb-2">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full p-3 bg-[#1e1f22] text-white rounded border-none focus:ring-2 focus:ring-[#5865f2] outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-[#b5bac1] uppercase mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 bg-[#1e1f22] text-white rounded border-none focus:ring-2 focus:ring-[#5865f2] outline-none"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3 mt-2 font-bold text-white bg-[#5865f2] rounded hover:bg-[#4752c4] transition-colors"
                    >
                        Continue
                    </button>
                </form>
                
                <p className="mt-4 text-sm text-[#b5bac1]">
                    Already have an account? <Link to="/login" className="text-[#00a8fc] hover:underline">Login</Link>
                </p>
                <p className="mt-2 text-xs text-[#b5bac1]">
                    By registering, you agree to our Terms of Service and Privacy Policy.
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;
