import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
 
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useUser();
 
    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                backgroundColor: '#1a1c23',
                color: 'white',
                fontSize: '1.2rem',
                fontFamily: 'Inter, sans-serif'
            }}>
                Loading...
            </div>
        );
    }
 
    if (!user) {
        return <Navigate to="/login" replace />;
    }
 
    return children;
};
 
export default ProtectedRoute;
 
 