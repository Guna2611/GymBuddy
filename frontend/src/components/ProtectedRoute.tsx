import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, Mail } from 'lucide-react';

interface ProtectedRouteProps {
    children: React.ReactNode;
    roles?: string[];
}

const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
    const { user, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Role check: if specific roles are required and user doesn't match
    if (roles && !roles.includes(user.role)) {
        if (user.role === 'gymOwner') {
            return <Navigate to="/owner/dashboard" replace />;
        }
        return <Navigate to="/dashboard" replace />;
    }

    // Gym owner email verification check
    // Allow access to onboarding page (to complete gym setup which triggers verification email)
    // Block access to owner dashboard until verified
    if (user.role === 'gymOwner' && !user.isEmailVerified && !location.pathname.startsWith('/owner/onboarding')) {
        if (roles && roles.includes('gymOwner')) {
            return (
                <div className="flex items-center justify-center min-h-screen px-4">
                    <div className="max-w-md w-full text-center glass-card p-8">
                        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                            <Mail className="w-8 h-8 text-primary" />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">Verify Your Email</h2>
                        <p className="text-sm text-dark-300 mb-4">
                            Please check your inbox at <strong className="text-primary-light">{user.email}</strong> and click the verification link to access your dashboard.
                        </p>
                        <p className="text-xs text-dark-400">
                            Didn't receive the email? Check your spam folder.
                        </p>
                    </div>
                </div>
            );
        }
    }

    // If no roles specified, block gymOwners from user-only routes
    if (!roles && user.role === 'gymOwner') {
        return <Navigate to="/owner/dashboard" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
