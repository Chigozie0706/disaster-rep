import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Header } from '@/components/Header';
import { LandingPage } from '@/pages/LandingPage';
import { CreateReportPage } from '@/pages/CreateReportPage';
import { ReportsPage } from '@/pages/ReportsPage';
import { ReportDetailPage } from '@/pages/ReportDetailPage';
import { Toaster } from '@/components/ui/toaster';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/create-report" element={<CreateReportPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/reports/:id" element={<ReportDetailPage />} />
        </Routes>
      </main>
      <Toaster />
    </div>
  );
};

export default App;
