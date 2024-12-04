import React from 'react';
import DailyForm from '../components/DailyForm';
import { Link } from 'react-router-dom';

const DailyUpdatePage = () => {
  return (
    <div className=" bg-white rounded-xl py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-2xl mx-auto">
          <DailyForm />
        </div>
      </div>
    </div>
  );
};

export default DailyUpdatePage; 