import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Dumbbell, Eye, EyeOff, Loader2 } from 'lucide-react';

const RegisterPage = () => {
    const { register, user } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'user' });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Redirect already logged-in users to their dashboard
    useEffect(() => {
        if (user) {
            if (user.role === 'gymOwner') navigate('/owner/dashboard', { replace: true });
            else if (user.role === 'admin') navigate('/admin', { replace: true });
            else navigate('/dashboard', { replace: true });
        }
    }, [user, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (form.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            await register(form.name, form.email, form.password, form.role);
            navigate(form.role === 'gymOwner' ? '/owner/onboarding' : '/onboarding');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-10 hero-gradient">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4">
                        <Dumbbell className="w-7 h-7 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Join GymBuddy</h1>
                    <p className="text-sm text-dark-300 mt-1">Create your account and find your workout partner</p>
                </div>

                <div className="glass-card p-6 sm:p-8">
                    {error && (
                        <div className="mb-4 p-3 rounded-lg bg-danger/10 border border-danger/20 text-sm text-danger-light">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-dark-200 mb-1.5">Full Name</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={e => setForm({ ...form, name: e.target.value })}
                                className="input-field"
                                placeholder="Gunasekhar"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark-200 mb-1.5">Email</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                className="input-field"
                                placeholder="Guna@example.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark-200 mb-1.5">I am a</label>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { value: 'user', label: '🏋️ Gym User', desc: 'Find workout partners' },
                                    { value: 'gymOwner', label: '🏢 Gym Owner', desc: 'List your gym' },
                                ].map(role => (
                                    <button
                                        key={role.value}
                                        type="button"
                                        onClick={() => setForm({ ...form, role: role.value })}
                                        className={`p-3 rounded-xl border text-left transition-all ${form.role === role.value
                                            ? 'border-primary bg-primary/10 text-white'
                                            : 'border-dark-500 bg-dark-700/50 text-dark-300 hover:border-dark-400'
                                            }`}
                                    >
                                        <div className="text-sm font-semibold">{role.label}</div>
                                        <div className="text-[10px] text-dark-400 mt-0.5">{role.desc}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark-200 mb-1.5">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={e => setForm({ ...form, password: e.target.value })}
                                    className="input-field pr-10"
                                    placeholder="Min 6 characters"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-white"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-dark-200 mb-1.5">Confirm Password</label>
                            <input
                                type="password"
                                value={form.confirmPassword}
                                onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                                className="input-field"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full justify-center py-3 text-sm disabled:opacity-60"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Account'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-dark-300">
                            Already have an account?{' '}
                            <Link to="/login" className="text-primary-light font-semibold hover:underline">
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
