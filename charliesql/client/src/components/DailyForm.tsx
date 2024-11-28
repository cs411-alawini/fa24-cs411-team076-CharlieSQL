import React, { useState } from 'react';

const DailyForm = () => {
  const [formType, setFormType] = useState('biometrics');
  const [userId, setUserId] = useState('');
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
    const date = new Date().toISOString();
    
    let submitData;
    switch(formType) {
      case 'biometrics':
        submitData = biometricsData;
        break;
      case 'conditions':
        submitData = conditionsData;
        break;
      case 'lifestyle':
        submitData = lifestyleData;
        break;
      default:
        return;
    }

    try {
      const response = await fetch(`/api/daily/${formType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: parseInt(userId),
          date,
          ...submitData
        }),
      });
      if (response.ok) {
        alert('Data updated successfully!');
      }
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Daily Update</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="number"
            placeholder="User ID"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </div>

        <div>
          <select
            value={formType}
            onChange={(e) => setFormType(e.target.value)}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="biometrics">Biometrics</option>
            <option value="conditions">Conditions</option>
            <option value="lifestyle">Lifestyle</option>
          </select>
        </div>
        
        {formType === 'biometrics' && (
          <div className="space-y-4">
            <input
              type="number"
              placeholder="BMI"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={biometricsData.BMI}
              onChange={(e) => setBiometricsData({...biometricsData, BMI: e.target.value})}
            />
            <input
              type="number"
              placeholder="HbA1c"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={biometricsData.HbA1c}
              onChange={(e) => setBiometricsData({...biometricsData, HbA1c: e.target.value})}
            />
            <input
              type="number"
              placeholder="Blood Glucose"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={biometricsData.BloodGlucose}
              onChange={(e) => setBiometricsData({...biometricsData, BloodGlucose: e.target.value})}
            />
          </div>
        )}

        {formType === 'conditions' && (
          <div className="space-y-4">
            {Object.keys(conditionsData).map((condition) => (
              <div key={condition} className="flex items-center">
                <input
                  type="checkbox"
                  id={condition}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  checked={conditionsData[condition as keyof typeof conditionsData]}
                  onChange={(e) => setConditionsData({
                    ...conditionsData,
                    [condition]: e.target.checked
                  })}
                />
                <label htmlFor={condition} className="ml-2 block text-sm text-gray-900">
                  {condition}
                </label>
              </div>
            ))}
          </div>
        )}

        {formType === 'lifestyle' && (
          <div className="space-y-4">
            {Object.keys(lifestyleData).map((item) => (
              <div key={item} className="flex items-center">
                <input
                  type="checkbox"
                  id={item}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  checked={lifestyleData[item as keyof typeof lifestyleData]}
                  onChange={(e) => setLifestyleData({
                    ...lifestyleData,
                    [item]: e.target.checked
                  })}
                />
                <label htmlFor={item} className="ml-2 block text-sm text-gray-900">
                  {item}
                </label>
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit Update
        </button>
      </form>
    </div>
  );
};

export default DailyForm; 