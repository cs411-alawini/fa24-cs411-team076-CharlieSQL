import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { doctorService } from '../services/services';
import DoctorStats from '../components/DoctorStats';
import HighRiskPatients from '../components/HighRiskPatients';

const DoctorViewPage = () => {
    const [ageStats, setAgeStats] = useState<any>(null);
    const [riskPatients, setRiskPatients] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [viewType, setViewType] = useState<string>('ageStats');
    const options: {value: string, label: string}[] = [
        {value: 'ageStats', label: 'Age Range Statistics'},
        {value: 'riskPatients', label: 'High Risk Patients'}
    ];
    const handleViewTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setViewType(event.target.value);
    }

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await doctorService.getDoctorStats();
                console.log(28, "Doctor view data:", data);
                setAgeStats(data.stats[0]);
                setRiskPatients(data.stats2[0]);
            } catch (err) {
                setError('Failed to load doctor statistics');
                console.error('Error fetching doctor stats:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div>Loading statistics...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col width-20vw mt-2">
                <Link 
                    to="/"
                    className="text-indigo-600 hover:text-indigo-900"
                >
                    Back to Home
                </Link>
                <select 
                    className="mt-4 rounded-xl w-2/3"
                    value={viewType} 
                    onChange={handleViewTypeChange}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>
            <div className="grid grid-cols-1 gap-2">
                {viewType === 'ageStats' && ageStats && <DoctorStats stats={ageStats} />}
                {viewType === 'riskPatients' && riskPatients && <HighRiskPatients patients={riskPatients} />}
            </div>
        </div>
    );
};

export default DoctorViewPage; 