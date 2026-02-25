import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { features, testimonials } from '../data/mockData';
import {
    ArrowRight, Dumbbell, Users, MapPin, Star, ChevronRight,
    Target, Zap, TrendingUp, CheckCircle2
} from 'lucide-react';

const LandingPage = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="hero-gradient pt-24 pb-20 px-4 relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse-slow" />
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse-slow" />

                <div className="max-w-7xl mx-auto relative">
                    <div className="max-w-3xl mx-auto text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary-light text-sm font-medium mb-6 animate-fadeIn">
                            <Zap className="w-4 h-4" />
                            Find Your Perfect Workout Partner
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight animate-slideUp">
                            <span className="text-white">Train Better</span>
                            <br />
                            <span className="bg-gradient-to-r from-primary-light via-secondary to-accent bg-clip-text text-transparent">
                                Together
                            </span>
                        </h1>

                        <p className="mt-6 text-lg text-dark-200 max-w-2xl mx-auto leading-relaxed animate-slideUp">
                            GymBuddy matches you with compatible workout partners based on your fitness goals,
                            schedule, and experience level. Find your buddy, pick a gym, and start achieving.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 animate-slideUp">
                            {user ? (
                                <Link to="/dashboard" className="btn-primary text-base py-3 px-8">
                                    Go to Dashboard <ArrowRight className="w-5 h-5" />
                                </Link>
                            ) : (
                                <>
                                    <Link to="/register" className="btn-primary text-base py-3 px-8">
                                        Get Started Free <ArrowRight className="w-5 h-5" />
                                    </Link>
                                    <Link to="/login" className="btn-secondary text-base py-3 px-8">
                                        Login
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* Stats bar */}
                        <div className="flex items-center justify-center gap-8 mt-12 animate-fadeIn">
                            {[
                                { value: '10K+', label: 'Active Users' },
                                { value: '500+', label: 'Gyms Listed' },
                                { value: '95%', label: 'Match Rate' },
                            ].map(stat => (
                                <div key={stat.label} className="text-center">
                                    <div className="text-2xl font-black text-white">{stat.value}</div>
                                    <div className="text-xs text-dark-400 mt-1">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 px-4 bg-dark-800/50">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-14">
                        <h2 className="section-title">How It Works</h2>
                        <p className="text-dark-300 mt-3 max-w-xl mx-auto">
                            Get matched with your ideal gym partner in three simple steps
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                step: '01',
                                title: 'Create Your Profile',
                                desc: 'Tell us about your fitness goals, schedule, experience, and preferred workout style.',
                                icon: Target,
                                color: 'from-primary to-primary-dark'
                            },
                            {
                                step: '02',
                                title: 'Get Matched',
                                desc: 'Our smart algorithm finds compatible partners based on multiple compatibility factors.',
                                icon: Users,
                                color: 'from-secondary to-emerald-600'
                            },
                            {
                                step: '03',
                                title: 'Start Training',
                                desc: 'Connect with your match, pick a nearby gym, and begin your fitness journey together.',
                                icon: Dumbbell,
                                color: 'from-accent to-amber-600'
                            }
                        ].map((item, i) => (
                            <div key={i} className="glass-card p-7 relative group hover:border-primary/20 transition-all">
                                <div className="absolute -top-3 -left-2 text-5xl font-black text-dark-700/60">{item.step}</div>
                                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                                    <item.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                                <p className="text-sm text-dark-300 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="features" className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-14">
                        <h2 className="section-title">Powerful Features</h2>
                        <p className="text-dark-300 mt-3 max-w-xl mx-auto">
                            Everything you need to find the perfect gym partner and stay consistent
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, i) => (
                            <div key={i} className="glass-card p-6 hover:border-primary/20 transition-all group cursor-default">
                                <div className="text-3xl mb-4">{feature.icon}</div>
                                <h3 className="text-base font-bold text-white mb-2 group-hover:text-primary-light transition-colors">
                                    {feature.title}
                                </h3>
                                <p className="text-sm text-dark-300 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Matching Preview */}
            <section className="py-20 px-4 bg-dark-800/50">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="section-title mb-4">Smart Compatibility Matching</h2>
                            <p className="text-dark-300 mb-6 leading-relaxed">
                                Our algorithm analyzes multiple factors to find you the most compatible workout partner.
                                See exactly how well you match across four key dimensions.
                            </p>
                            <div className="space-y-4">
                                {[
                                    { label: 'Location Match', value: 30, max: 30, icon: MapPin, desc: 'Same city and area' },
                                    { label: 'Workout Time', value: 25, max: 25, icon: TrendingUp, desc: 'Compatible schedules' },
                                    { label: 'Fitness Goals', value: 25, max: 25, icon: Target, desc: 'Aligned objectives' },
                                    { label: 'Experience Level', value: 20, max: 20, icon: Zap, desc: 'Similar skill level' },
                                ].map(item => (
                                    <div key={item.label} className="glass-card p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <item.icon className="w-4 h-4 text-primary" />
                                                <span className="text-sm font-semibold text-white">{item.label}</span>
                                            </div>
                                            <span className="text-sm font-bold text-secondary">+{item.value} pts</span>
                                        </div>
                                        <div className="w-full bg-dark-600 rounded-full h-2">
                                            <div
                                                className="h-2 rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-1000"
                                                style={{ width: `${(item.value / item.max) * 100}%` }}
                                            />
                                        </div>
                                        <p className="text-xs text-dark-400 mt-1">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="glass-card p-6">
                            <div className="text-center mb-6">
                                <div className="relative inline-flex items-center justify-center w-28 h-28 mb-3">
                                    <svg className="w-28 h-28 -rotate-90" viewBox="0 0 120 120">
                                        <circle cx="60" cy="60" r="50" stroke="currentColor" strokeWidth="8"
                                            fill="none" className="text-dark-600" />
                                        <circle cx="60" cy="60" r="50" stroke="url(#gradient)" strokeWidth="8"
                                            fill="none" strokeDasharray="314" strokeDashoffset="63"
                                            strokeLinecap="round" />
                                        <defs>
                                            <linearGradient id="gradient">
                                                <stop offset="0%" stopColor="#6366f1" />
                                                <stop offset="100%" stopColor="#10b981" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    <span className="absolute text-3xl font-black text-white">80%</span>
                                </div>
                                <p className="text-sm font-semibold text-primary-light">Excellent Match!</p>
                            </div>

                            <div className="space-y-3">
                                {[
                                    { label: 'Same City', value: true },
                                    { label: 'Same Workout Time', value: true },
                                    { label: 'Similar Goals', value: true },
                                    { label: 'Compatible Experience', value: false },
                                ].map(item => (
                                    <div key={item.label} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-dark-700/50">
                                        <CheckCircle2 className={`w-4 h-4 ${item.value ? 'text-secondary' : 'text-dark-500'}`} />
                                        <span className={`text-sm ${item.value ? 'text-white' : 'text-dark-400'}`}>{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-14">
                        <h2 className="section-title">What Our Users Say</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {testimonials.map((t, i) => (
                            <div key={i} className="glass-card p-6 hover:border-primary/20 transition-all">
                                <div className="flex items-center gap-1 mb-4">
                                    {Array(5).fill(0).map((_, j) => (
                                        <Star key={j} className="w-4 h-4 text-accent fill-accent" />
                                    ))}
                                </div>
                                <p className="text-sm text-dark-200 leading-relaxed mb-5 italic">"{t.text}"</p>
                                <div className="flex items-center gap-3 pt-4 border-t border-dark-600/50">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-bold">
                                        {t.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-white">{t.name}</p>
                                        <p className="text-xs text-dark-400">{t.role}</p>
                                    </div>
                                    <span className="ml-auto text-lg font-black text-secondary">{t.score}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-4 hero-gradient">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                        Ready to Find Your Gym Buddy?
                    </h2>
                    <p className="text-dark-300 mb-8 max-w-xl mx-auto">
                        Join thousands of fitness enthusiasts who found their perfect workout partner through GymBuddy.
                    </p>
                    <Link to="/register" className="btn-primary text-lg py-4 px-10">
                        Start Matching Now <ChevronRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
