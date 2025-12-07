import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ReportForm } from '@/components/ReportForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export const CreateReportPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmitSuccess = () => {
    navigate('/reports');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Report a Disaster
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Help your community by reporting disasters and emergencies. 
              Your report will be stored securely on the blockchain.
            </p>
          </div>
        </div>

        {/* Form */}
        <ReportForm onSubmitSuccess={handleSubmitSuccess} />
      </div>
    </div>
  );
};
