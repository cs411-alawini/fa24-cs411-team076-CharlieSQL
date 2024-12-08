import React from 'react';

interface DoctorStatsProps {
    stats: any[];
}

const DoctorStats: React.FC<DoctorStatsProps> = ({ stats }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Age Range Statistics */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Age Range Statistics</h2>
                <div className="space-y-4">
                    {stats.map((stat, index) => (
                        <div key={index} className="border-b pb-2">
                            <div className="flex justify-between items-center">
                                <span className="font-medium">Age Range: {stat.Age_Range_Start}-{stat.Age_Range_Start + 9}</span>
                                <span className="text-gray-600">Count: {stat.User_Count}</span>
                            </div>
                            <div className="mt-1 text-sm text-gray-600">
                                <div>Average BMI: {stat.Avg_BMI?.toFixed(2)}</div>
                                <div>Average HbA1c: {stat.Avg_HbA1c?.toFixed(2)}%</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DoctorStats; 