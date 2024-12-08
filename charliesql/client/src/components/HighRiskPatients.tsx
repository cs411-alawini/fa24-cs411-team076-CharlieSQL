import React from 'react';

interface HighRiskPatientsProps {
    patients: any[];
}

const HighRiskPatients: React.FC<HighRiskPatientsProps> = ({ patients }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">High Risk Patients</h2>
            <div className="space-y-4">
                {patients.map((patient, index) => (
                    <div key={index} className="border-b pb-2">
                        <div className="flex justify-between items-center">
                            <span className="font-medium">Patient ID: {patient.User_Id}</span>
                            <span className="text-gray-600">Age: {patient.Age}</span>
                        </div>
                        <div className="mt-1 text-sm text-gray-600 grid grid-cols-2 gap-2">
                            <div>BMI: {patient.BMI?.toFixed(2)}</div>
                            <div>HbA1c: {patient.HbA1c?.toFixed(2)}%</div>
                            <div>Blood Glucose: {patient.BloodGlucose}</div>
                            <div>Diagnosis: {patient.Diagnosis}</div>
                        </div>
                        <div className="mt-2 text-sm">
                            <span className="text-red-600 font-medium">
                                Risk Factors: {' '}
                                {[
                                    patient.BMI > 30 && 'High BMI',
                                    patient.HbA1c > 6.4 && 'High HbA1c',
                                    patient.BloodGlucose > 125 && 'High Blood Glucose',
                                    patient.HeartDisease && 'Heart Disease',
                                    patient.HighBP && 'High Blood Pressure'
                                ].filter(Boolean).join(', ')}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HighRiskPatients; 