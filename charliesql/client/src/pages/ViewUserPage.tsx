import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { viewUserService, userService } from '../services/services';

const ViewUserPage = () => {
    const [searchId, setSearchId] = useState('');
    const [entryType, setEntryType] = useState('biometrics');
    const [searchDate, setSearchDate] = useState(new Date().toISOString().slice(0, 10)); // Today's date in YYYY-MM-DD
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const entryTypes = [
        { value: 'biometrics', label: 'Biometrics Entries' },
        { value: 'conditions', label: 'Conditions Entries' },
        { value: 'lifestyle', label: 'Lifestyle Entries' }
    ];

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const data = await viewUserService.getUserViewData(searchId, entryType, searchDate);
            setUserData(data);
        } catch (err: any) {
            setError(err.message || 'Failed to load user information');
            console.error('Error fetching user info:', err);
        } finally {
            setLoading(false);
        }
    };

    const renderEntryValues = (entry: any) => {
        // Remove internal fields and dates for cleaner display
        const ignore = ['User_Id', 'EntryDate', 'BioEntryDate', 'CondEntryDate', 'LifeEntryDate'];
        
        return Object.entries(entry).map(([key, value]) => {
            if (ignore.includes(key)) return null;
            return (
                <div key={key} className="grid grid-cols-2 gap-2">
                    <div className="text-sm font-medium text-gray-500">
                        {key}
                    </div>
                    <div className="text-sm text-gray-900">{value as any}</div>
                </div>
            );
        });
    };

    return (
        <div className="flex flex-col items-start space-y-6">
            <div>
                <Link to="/" className="text-indigo-600 hover:text-indigo-900">
                    Back to Home
                </Link>
            </div>

            <form onSubmit={handleSearch} className="space-y-4 w-full">
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="userId" className="block text-sm font-medium text-gray-700">
                            Enter User ID
                        </label>
                        <input
                            type="number"
                            id="userId"
                            value={searchId}
                            onChange={(e) => setSearchId(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="entryType" className="block text-sm font-medium text-gray-700">
                            Search for entry type:
                        </label>
                        <select
                            id="entryType"
                            value={entryType}
                            onChange={(e) => setEntryType(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        >
                            {entryTypes.map(type => (
                                <option key={type.value} value={type.value}>
                                    {type.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="searchDate" className="block text-sm font-medium text-gray-700">
                            Search up to date:
                        </label>
                        <input
                            type="date"
                            id="searchDate"
                            value={searchDate}
                            max={new Date().toISOString().slice(0, 10)}
                            onChange={
                                (e) => {setSearchDate(e.target.value)
                                console.log(102, "Set search date value to:", e.target.value)}
                            }
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                    Search
                </button>
            </form>

            {loading && <div>Loading...</div>}
            {error && <div className="text-red-500">{error}</div>}

            {userData && (
                <div className="space-y-6 w-full">
                    {/* User Diagnosis */}
                    {userData.diagnosis && (
                        <div className="bg-white shadow rounded-lg p-6">
                            <h2 className="text-xl font-semibold mb-4">Current Diagnosis</h2>
                            {(userData.diagnosis==='At Risk' || userData.diagnosis==='Positive') && <div className="text-lg font-medium text-red-500">
                                {userData.diagnosis}
                            </div>}
                            {userData.diagnosis==='Negative' && <div className="text-lg font-medium text-green-500">
                                {userData.diagnosis}
                            </div>}
                        </div>
                    )}

                    {/* Recent Entries */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Recent Entries</h2>
                        <div className="space-y-6">
                            {userData.entries?.map((entry: any, index: number) => (
                                <div key={index} className="border-b pb-4">
                                    <div className="text-sm font-medium text-gray-900 mb-2">
                                        Date: {new Date(entry.BioEntryDate || entry.CondEntryDate || entry.LifeEntryDate).toDateString()}
                                    </div>
                                    <div className="space-y-2">
                                        {renderEntryValues(entry)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Risk Alerts */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Risk Alerts</h2>
                        <div className="space-y-4">
                            {userData.alerts?.map((alert: any, index: number) => (
                                <div key={index} className="border-b pb-2">
                                    <div className="text-red-600">{alert.Alert_Message}</div>
                                    <div className="text-sm text-gray-600">
                                        {new Date(alert.Created_On).toDateString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Incentives */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Incentives</h2>
                        <div className="space-y-4">
                            {userData.incentives?.map((incentive: any, index: number) => (
                                <div key={index} className="border-b pb-2">
                                    <div>{incentive.Incentive_Description}</div>
                                    <div className="text-sm text-gray-600">
                                        {new Date(incentive.Granted_On).toDateString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Update Logs */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-xl font-semibold mb-4">Recent Updates</h2>
                        <div className="space-y-4">
                            {userData.logs?.map((log: any, index: number) => (
                                <div key={index} className="border-b pb-2">
                                    <div>{log.Update_Reason}</div>
                                    <div className="text-sm text-gray-600">
                                        {new Date(log.Updated_On).toDateString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ViewUserPage; 