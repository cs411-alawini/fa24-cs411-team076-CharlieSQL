import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { dailyService } from '../services/services';

const DailyForm = () => {
  const [formType, setFormType] = useState('biometricsAndConditions');
  const userId = localStorage.getItem('userId');
  const [biometricsData, setBiometricsData] = useState({
    BMI: '',
    HbA1c: '',
    BloodGlucose: ''
  });
  const [conditionsData, setConditionsData] = useState({
    Stroke: false,
    HighChol: false,
    HighBP: false,
    HeartDisease: false,
    Hypertension: false
  });
  const [lifestyleData, setLifestyleData] = useState({
    Smoker: false,
    CheckChol: false,
    Fruits: false,
    Veggies: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const date = new Date().toISOString().slice(0, 10); // Format as YYYY-MM-DD
    
    if (!userId) {
      alert('No user ID found. Please log in again.');
      return;
    }

    try {
      if (formType === 'biometricsAndConditions') {
        await dailyService.submitBiometricsAndConditions({
          userId: parseInt(userId),
          date,
          bmi: Number(biometricsData.BMI),
          hba1c: Number(biometricsData.HbA1c),
          bloodGlucose: Number(biometricsData.BloodGlucose),
          stroke: Number(conditionsData.Stroke),
          highChol: Number(conditionsData.HighChol),
          highBP: Number(conditionsData.HighBP),
          heartDisease: Number(conditionsData.HeartDisease),
          hypertension: Number(conditionsData.Hypertension)
        });
      } else {
        await dailyService.submitLifestyle({
          userId: parseInt(userId),
          date,
          smoker: Number(lifestyleData.Smoker),
          checkChol: Number(lifestyleData.CheckChol),
          fruits: Number(lifestyleData.Fruits),
          veggies: Number(lifestyleData.Veggies)
        });
      }
      alert('Data updated successfully!');
    } catch (error) {
      console.error('Error updating data:', error);
      alert('Failed to update data. Please try again.');
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          value={formType}
          onChange={(e) => setFormType(e.target.value)}
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="biometricsAndConditions">Biometrics & Conditions</option>
          <option value="lifestyle">Lifestyle</option>
        </select>

        {formType === 'biometricsAndConditions' && (
          <>
            {/* Biometrics Section */}
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="BMI"
                min="0"
                step="0.1"
                required
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={biometricsData.BMI}
                onChange={(e) => setBiometricsData({...biometricsData, BMI: e.target.value})}
              />
              <input
                type="number"
                placeholder="HbA1c"
                min="0"
                step="0.1"
                required
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={biometricsData.HbA1c}
                onChange={(e) => setBiometricsData({...biometricsData, HbA1c: e.target.value})}
              />
              <input
                type="number"
                placeholder="Blood Glucose"
                min="0"
                required
                className="col-span-2 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                value={biometricsData.BloodGlucose}
                onChange={(e) => setBiometricsData({...biometricsData, BloodGlucose: e.target.value})}
              />
            </div>

            {/* Conditions Section */}
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              {Object.keys(conditionsData).map((condition) => (
                <label key={condition} className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    checked={conditionsData[condition as keyof typeof conditionsData]}
                    onChange={(e) => setConditionsData({
                      ...conditionsData,
                      [condition]: e.target.checked
                    })}
                  />
                  <span>{condition}</span>
                </label>
              ))}
            </div>
          </>
        )}

        {/* Lifestyle Form remains the same */}
        {formType === 'lifestyle' && (
          <div className="grid grid-cols-2 gap-x-8 gap-y-2">
            {Object.keys(lifestyleData).map((item) => (
              <label key={item} className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  checked={lifestyleData[item as keyof typeof lifestyleData]}
                  onChange={(e) => setLifestyleData({
                    ...lifestyleData,
                    [item]: e.target.checked
                  })}
                />
                <span>{item}</span>
              </label>
            ))}
          </div>
        )}

        <div className="flex justify-start mt-4">
          <Link to="/" className="text-indigo-600 hover:text-indigo-900">
            Back to Home
          </Link>
        </div>

        <button
          type="submit"
          className="w-full mt-6 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit Update
        </button>
      </form>
    </div>
  );
};

export default DailyForm; 