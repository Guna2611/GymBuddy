import { useState, useEffect, useCallback } from 'react';
import Sidebar from '../components/Sidebar';
import GymCard from '../components/GymCard';
import { gymService } from '../services/gymService';
import { MapPin, Search, Loader2 } from 'lucide-react';

const GymsPage = () => {
    const [gyms, setGyms] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [cityFilter, setCityFilter] = useState('');

    const fetchGyms = useCallback(async () => {
        try {
            setLoading(true);
            setError('');
            const data = await gymService.getGyms(cityFilter ? { city: cityFilter } : undefined);
            setGyms(data.gyms || []);
        } catch (err: any) {
            setError('Failed to load gyms');
        } finally {
            setLoading(false);
        }
    }, [cityFilter]);

    useEffect(() => { fetchGyms(); }, [fetchGyms]);

    const cities = [...new Set(gyms.map((g: any) => g.address?.city).filter(Boolean))];

    const filteredGyms = gyms.filter((g: any) => {
        if (!searchTerm) return true;
        const term = searchTerm.toLowerCase();
        return (
            g.name?.toLowerCase().includes(term) ||
            g.address?.city?.toLowerCase().includes(term) ||
            g.address?.area?.toLowerCase().includes(term)
        );
    });

    return (
        <div className="flex min-h-screen pt-16">
            <Sidebar />
            <main className="flex-1 p-4 lg:p-8 overflow-auto">
                <div className="max-w-5xl mx-auto">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                            <MapPin className="w-6 h-6 text-accent" /> Browse Gyms
                        </h1>
                        <p className="text-sm text-dark-300 mt-1">Discover gyms in your area for your workout sessions</p>
                    </div>

                    {/* Search & Filters */}
                    <div className="flex flex-col sm:flex-row gap-3 mb-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-400" />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                placeholder="Search gyms by name or area..."
                                className="input-field pl-10"
                            />
                        </div>
                        <select
                            value={cityFilter}
                            onChange={e => setCityFilter(e.target.value)}
                            className="input-field w-auto min-w-[150px]"
                        >
                            <option value="">All Cities</option>
                            {cities.map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>

                    {/* Results count */}
                    {!loading && <p className="text-xs text-dark-400 mb-4">{filteredGyms.length} gyms found</p>}

                    {/* Content */}
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : error ? (
                        <div className="glass-card p-6 text-center">
                            <p className="text-danger-light text-sm">{error}</p>
                            <button onClick={fetchGyms} className="btn-secondary text-xs mt-3">Try Again</button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredGyms.length > 0 ? (
                                filteredGyms.map(gym => (
                                    <GymCard key={gym._id} gym={gym} />
                                ))
                            ) : (
                                <div className="col-span-full text-center py-16">
                                    <MapPin className="w-12 h-12 text-dark-500 mx-auto mb-3" />
                                    <p className="text-dark-300">No gyms found</p>
                                    <p className="text-xs text-dark-400 mt-1">
                                        {searchTerm || cityFilter ? 'Try adjusting your search' : 'No gyms have been added yet'}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default GymsPage;
