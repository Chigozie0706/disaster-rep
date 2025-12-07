import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ReportCard } from '@/components/ReportCard';
import { disasterContractService, DisasterReport } from '@/lib/disasterContract';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Plus, Loader2, AlertCircle } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const [reports, setReports] = useState<(DisasterReport & { index: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchReports = async () => {
    setLoading(true);
    setError('');
    
    try {
      const count = await disasterContractService.getReportCount();
      
      if (count === 0) {
        setReports([]);
        setLoading(false);
        return;
      }

      const reportsData: (DisasterReport & { index: number })[] = [];
      
      for (let i = 0; i < count; i++) {
        const report = await disasterContractService.getReport(i);
        if (report) {
          reportsData.push({ ...report, index: i });
        }
      }

      setReports(reportsData.reverse()); // Show newest first
      
      if (reportsData.length > 0) {
        toast({
          title: "Reports loaded",
          description: `Found ${reportsData.length} disaster reports on Celo mainnet`
        });
      }
    } catch (err: any) {
      console.error('Error fetching reports:', err);
      setError('Failed to load disaster reports. Please try again.');
      toast({
        title: "Error loading reports",
        description: "Failed to fetch disaster reports from Celo mainnet",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleViewDetails = (index: number) => {
    navigate(`/reports/${index}`);
  };

  const handleRefresh = () => {
    fetchReports();
    toast({
      title: "Refreshing reports",
      description: "Loading latest disaster reports from Celo mainnet..."
    });
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
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Disaster Reports
              </h1>
              <p className="text-lg text-gray-600">
                View and monitor disaster reports from the community
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  'Refresh'
                )}
              </Button>
              
              <Button
                className="gradient-emergency text-white"
                onClick={() => navigate('/create-report')}
              >
                <Plus className="w-4 h-4 mr-2" />
                New Report
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-emergency mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Loading Reports</h3>
              <p className="text-gray-600">Fetching disaster reports from the blockchain...</p>
            </div>
          </div>
        ) : error ? (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Error Loading Reports</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={handleRefresh} variant="outline">
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : reports.length === 0 ? (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8 text-center">
              <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Reports Found</h3>
              <p className="text-gray-600 mb-4">
                There are no disaster reports yet. Be the first to report a disaster.
              </p>
              <Button 
                className="gradient-emergency text-white"
                onClick={() => navigate('/create-report')}
              >
                <Plus className="w-4 h-4 mr-2" />
                Create First Report
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-sm text-gray-600">
                Showing {reports.length} disaster report{reports.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.map((report) => (
                <ReportCard
                  key={report.index}
                  report={report}
                  reportIndex={report.index}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
