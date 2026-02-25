import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../services/userService';
import Sidebar from '../components/Sidebar';
import { User, Save, Target, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const ProfilePage = () => {
    const { user, updateUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState('');
    const [form, setForm] = useState({
        name: '',
        age: '',
        gender: '',
        city: '',
        area: '',
        fitnessGoals: [] as string[],
        preferredWorkoutTime: '',
        experienceLevel: '',
        bio: '',
        hobbies: '',
        motivation: ''
    });

    // Load real profile from the API
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const data = await userService.getProfile();
                const u = data.user;
                setForm({
                    name: u.name || '',
                    age: u.age ? String(u.age) : '',
                    gender: u.gender || '',
                    city: u.location?.city || '',
                    area: u.location?.area || '',
                    fitnessGoals: u.fitnessGoals || [],
                    preferredWorkoutTime: u.preferredWorkoutTime || '',
                    experienceLevel: u.experienceLevel || '',
                    bio: u.bio || '',
                    hobbies: Array.isArray(u.hobbies) ? u.hobbies.join(', ') : (u.hobbies || ''),
                    motivation: u.motivation || ''
                });
            } catch (err) {
                setError('Failed to load profile. Please refresh.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const toggleGoal = (goal: string) => {
        setForm(prev => ({
            ...prev,
            fitnessGoals: prev.fitnessGoals.includes(goal)
                ? prev.fitnessGoals.filter(g => g !== goal)
                : [...prev.fitnessGoals, goal]
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        setError('');
        try {
            const profileData = {
                name: form.name,
                age: form.age ? parseInt(form.age) : undefined,
                gender: form.gender || undefined,
                location: (form.city || form.area) ? { city: form.city, area: form.area } : undefined,
                fitnessGoals: form.fitnessGoals,
                preferredWorkoutTime: form.preferredWorkoutTime || undefined,
                experienceLevel: form.experienceLevel || undefined,
                bio: form.bio || undefined,
                hobbies: form.hobbies ? form.hobbies.split(',').map(h => h.trim()).filter(Boolean) : [],
                motivation: form.motivation || undefined,
            };
            const result = await userService.updateProfile(profileData);
            // Update context with latest info
            updateUser({
                name: form.name,
                isProfileComplete: result.user?.isProfileComplete ?? true
            });
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen pt-16">
                <Sidebar />
                <main className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </main>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen pt-16">
            <Sidebar />
            <main className="flex-1 p-4 lg:p-8 overflow-auto">
                <div className="max-w-3xl mx-auto">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                                <User className="w-6 h-6 text-primary" /> My Profile
                            </h1>
                            <p className="text-sm text-dark-300 mt-1">Manage your fitness profile and preferences</p>
                        </div>
                        <button onClick={handleSave} disabled={saving} className="btn-primary text-sm py-2">
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" />
                                : saved ? <><CheckCircle2 className="w-4 h-4" /> Saved!</>
                                    : <><Save className="w-4 h-4" /> Save Changes</>}
                        </button>
                    </div>

                    {error && (
                        <div className="glass-card p-4 mb-4 border-danger/30 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-danger flex-shrink-0" />
                            <p className="text-sm text-danger-light">{error}</p>
                        </div>
                    )}

                    {/* Avatar & Name */}
                    <div className="glass-card p-6 mb-6">
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold">
                                {form.name.charAt(0).toUpperCase() || '?'}
                            </div>
                            <div className="flex-1">
                                <input type="text" value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    className="input-field text-lg font-semibold" placeholder="Your Name" />
                                <p className="text-xs text-dark-400 mt-1 flex items-center gap-1">
                                    {user?.email} • <span className="capitalize text-primary-light">{user?.role}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Basic Info */}
                    <div className="glass-card p-6 mb-6">
                        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                            <User className="w-4 h-4 text-primary" /> Basic Information
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-dark-300 mb-1">Age</label>
                                <input type="number" value={form.age}
                                    onChange={e => setForm({ ...form, age: e.target.value })}
                                    className="input-field" placeholder="e.g. 25" min="16" max="80" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-dark-300 mb-1">Gender</label>
                                <select value={form.gender}
                                    onChange={e => setForm({ ...form, gender: e.target.value })}
                                    className="input-field">
                                    <option value="">Select gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                    <option value="prefer-not-to-say">Prefer not to say</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-dark-300 mb-1">City</label>
                                <input type="text" value={form.city}
                                    onChange={e => setForm({ ...form, city: e.target.value })}
                                    className="input-field" placeholder="e.g. Hyderabad" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-dark-300 mb-1">Area / Locality</label>
                                <input type="text" value={form.area}
                                    onChange={e => setForm({ ...form, area: e.target.value })}
                                    className="input-field" placeholder="e.g. Gachibowli" />
                            </div>
                        </div>
                    </div>

                    {/* Fitness Profile */}
                    <div className="glass-card p-6 mb-6">
                        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                            <Target className="w-4 h-4 text-secondary" /> Fitness Profile
                        </h3>

                        <div className="mb-4">
                            <label className="block text-xs font-medium text-dark-300 mb-2">Fitness Goals</label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {[
                                    { value: 'weight-loss', label: '🔥 Weight Loss' },
                                    { value: 'muscle-gain', label: '💪 Muscle Gain' },
                                    { value: 'general-fitness', label: '🏃 General Fitness' },
                                    { value: 'flexibility', label: '🧘 Flexibility' },
                                    { value: 'endurance', label: '🚴 Endurance' },
                                    { value: 'strength', label: '🏋️ Strength' },
                                ].map(goal => (
                                    <button key={goal.value} type="button" onClick={() => toggleGoal(goal.value)}
                                        className={`p-2.5 rounded-xl border text-xs font-medium transition-all ${form.fitnessGoals.includes(goal.value)
                                            ? 'border-primary bg-primary/10 text-white'
                                            : 'border-dark-500 text-dark-300 hover:border-dark-400'
                                            }`}>{goal.label}</button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-dark-300 mb-1">Experience Level</label>
                                <select value={form.experienceLevel}
                                    onChange={e => setForm({ ...form, experienceLevel: e.target.value })}
                                    className="input-field">
                                    <option value="">Select level</option>
                                    <option value="beginner">🌱 Beginner</option>
                                    <option value="intermediate">🌿 Intermediate</option>
                                    <option value="advanced">🌳 Advanced</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-dark-300 mb-1">Preferred Workout Time</label>
                                <select value={form.preferredWorkoutTime}
                                    onChange={e => setForm({ ...form, preferredWorkoutTime: e.target.value })}
                                    className="input-field">
                                    <option value="">Select time</option>
                                    <option value="early-morning">🌅 Early Morning (5-7 AM)</option>
                                    <option value="morning">☀️ Morning (7-10 AM)</option>
                                    <option value="afternoon">🌤️ Afternoon (12-4 PM)</option>
                                    <option value="evening">🌆 Evening (5-8 PM)</option>
                                    <option value="night">🌙 Night (8-11 PM)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="glass-card p-6">
                        <h3 className="text-base font-bold text-white mb-4">About & Bio</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-dark-300 mb-1">Bio</label>
                                <textarea value={form.bio}
                                    onChange={e => setForm({ ...form, bio: e.target.value })}
                                    className="input-field min-h-[80px] resize-none"
                                    placeholder="Tell potential gym buddies about yourself..."
                                    maxLength={300} />
                                <p className="text-[10px] text-dark-400 mt-1">{form.bio.length}/300</p>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-dark-300 mb-1">Hobbies / Interests</label>
                                <input type="text" value={form.hobbies}
                                    onChange={e => setForm({ ...form, hobbies: e.target.value })}
                                    className="input-field" placeholder="football, swimming, yoga (comma separated)" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-dark-300 mb-1">Motivation for Gym</label>
                                <textarea value={form.motivation}
                                    onChange={e => setForm({ ...form, motivation: e.target.value })}
                                    className="input-field min-h-[60px] resize-none"
                                    placeholder="What drives you to workout?" />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProfilePage;
