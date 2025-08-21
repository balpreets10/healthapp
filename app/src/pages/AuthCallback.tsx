// pages/AuthCallback.tsx - OAuth callback handler for both popup and redirect authentication
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SupabaseService from '../services/SupabaseService';

const AuthCallback: React.FC = () => {
    const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
    const [message, setMessage] = useState('Completing sign in...');
    const navigate = useNavigate();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                console.log('Auth callback page loaded');
                setStatus('processing');
                setMessage('Completing sign in...');
                
                // Handle the OAuth callback
                const result = await SupabaseService.handleOAuthCallback();
                
                if (result.success) {
                    console.log('OAuth callback successful');
                    setStatus('success');
                    setMessage('Sign in successful! Redirecting...');
                    
                    // If this is NOT a popup (regular redirect), redirect to home after success
                    if (!window.opener || window.opener === window) {
                        setTimeout(() => {
                            navigate('/', { replace: true });
                        }, 1500);
                    }
                    // If it IS a popup, the SupabaseService will handle closing it
                } else {
                    console.error('OAuth callback failed:', result.error);
                    setStatus('error');
                    setMessage(result.error || 'Authentication failed. Please try again.');
                    
                    // If this is NOT a popup, redirect to home after error
                    if (!window.opener || window.opener === window) {
                        setTimeout(() => {
                            navigate('/', { replace: true });
                        }, 3000);
                    }
                }
            } catch (error) {
                console.error('Auth callback error:', error);
                setStatus('error');
                setMessage('Authentication callback failed. Please try again.');
                
                // Send error message to parent window if this is a popup
                if (window.opener && window.opener !== window) {
                    window.opener.postMessage({
                        type: 'SUPABASE_AUTH_ERROR',
                        error: { message: 'Authentication callback failed' }
                    }, window.location.origin);
                    window.close();
                } else {
                    // If not a popup, redirect to home
                    setTimeout(() => {
                        navigate('/', { replace: true });
                    }, 3000);
                }
            }
        };

        handleCallback();
    }, [navigate]);

    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '100vh',
            fontFamily: 'Arial, sans-serif',
            backgroundColor: '#f5f5f5'
        }}>
            <div style={{
                textAlign: 'center',
                padding: '2rem',
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}>
                {status === 'processing' && (
                    <div style={{
                        width: '40px',
                        height: '40px',
                        border: '3px solid #e3e3e3',
                        borderTop: '3px solid #007bff',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto 1rem'
                    }}></div>
                )}
                {status === 'success' && (
                    <div style={{
                        fontSize: '2rem',
                        color: '#28a745',
                        margin: '0 auto 1rem'
                    }}>✓</div>
                )}
                {status === 'error' && (
                    <div style={{
                        fontSize: '2rem',
                        color: '#dc3545',
                        margin: '0 auto 1rem'
                    }}>✗</div>
                )}
                <p style={{ 
                    margin: 0, 
                    color: status === 'error' ? '#dc3545' : status === 'success' ? '#28a745' : '#666' 
                }}>
                    {message}
                </p>
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        </div>
    );
};

export default AuthCallback;