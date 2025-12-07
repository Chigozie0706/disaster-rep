import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@/hooks/useWallet';
import { disasterContractService, DisasterReport } from '@/lib/disasterContract';
import { Loader2, AlertTriangle, Send } from 'lucide-react';

interface ReportFormProps {
  onSubmitSuccess?: () => void;
}

export const ReportForm: React.FC<ReportFormProps> = ({ onSubmitSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    reporterName: '',
    email: '',
    disasterType: '',
    imgUrl: '',
    latitude: '',
    longitude: '',
    city: '',
    state: '',
    date: new Date().toISOString().split('T')[0],
    severity: '',
    impact: ''
  });

  const { toast } = useToast();
  const { account, isConnected } = useWallet();

  const disasterTypes = [
    'Earthquake', 'Flood', 'Hurricane', 'Tornado', 'Wildfire',
    'Landslide', 'Tsunami', 'Volcanic Eruption', 'Drought',
    'Cyclone', 'Storm', 'Heat Wave', 'Cold Wave', 'Other'
  ];

  const severityLevels = ['Low', 'Medium', 'High', 'Critical'];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = () => {
    const required = ['reporterName', 'email', 'disasterType', 'city', 'state', 'severity'];
    const missing = required.filter(field => !formData[field as keyof typeof formData]);
    
    if (missing.length > 0) {
      toast({
        title: "Missing required fields",
        description: `Please fill in: ${missing.join(', ')}`,
        variant: "destructive"
      });
      return false;
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected || !account) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to submit a report",
        variant: "destructive"
      });
      return;
    }

    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const reportData: Omit<DisasterReport, 'reporterId'> = {
        reporterName: formData.reporterName,
        email: formData.email,
        disasterType: formData.disasterType,
        imgUrl: formData.imgUrl,
        latitude: formData.latitude,
        longitude: formData.longitude,
        city: formData.city,
        state: formData.state,
        date: formData.date,
        severity: formData.severity,
        impact: formData.impact
      };

      toast({
        title: "Creating report...",
        description: "Please confirm the transaction in your wallet"
      });

      const tx = await disasterContractService.createReport(reportData);
      
      toast({
        title: "Transaction submitted",
        description: "Transaction sent to Celo mainnet, waiting for confirmation..."
      });

      await tx.wait();
      
      // Show success message
      toast({
        title: "Report created successfully!",
        description: "Your disaster report has been recorded on the Celo blockchain"
      });


      // Reset form
      setFormData({
        reporterName: '',
        email: '',
        disasterType: '',
        imgUrl: '',
        latitude: '',
        longitude: '',
        city: '',
        state: '',
        date: new Date().toISOString().split('T')[0],
        severity: '',
        impact: ''
      });

      onSubmitSuccess?.();

    } catch (error: any) {
      console.error('Error creating report:', error);
      const errorMessage = error?.reason || 
                          error?.message || 
                          error?.data?.message ||
                          (typeof error === 'string' ? error : 'Failed to create report');
                          
      toast({
        title: "Failed to create report",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-emergency">
          <AlertTriangle className="w-5 h-5" />
          Report Disaster
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form id="disaster-report-form" onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="reporterName">Full Name *</Label>
                <Input
                  id="reporterName"
                  value={formData.reporterName}
                  onChange={(e) => handleInputChange('reporterName', e.target.value)}
                  placeholder="Enter your full name"
                  disabled={isSubmitting}
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="your@email.com"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          {/* Disaster Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Disaster Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="disasterType">Disaster Type *</Label>
                <Select
                  value={formData.disasterType}
                  onValueChange={(value) => handleInputChange('disasterType', value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select disaster type" />
                  </SelectTrigger>
                  <SelectContent>
                    {disasterTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="severity">Severity Level *</Label>
                <Select
                  value={formData.severity}
                  onValueChange={(value) => handleInputChange('severity', value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    {severityLevels.map(level => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="date">Date of Occurrence</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Location Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Location Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  placeholder="Enter city"
                  disabled={isSubmitting}
                />
              </div>
              
              <div>
                <Label htmlFor="state">State/Province *</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  placeholder="Enter state/province"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="latitude">Latitude (Optional)</Label>
                <Input
                  id="latitude"
                  value={formData.latitude}
                  onChange={(e) => handleInputChange('latitude', e.target.value)}
                  placeholder="e.g., 40.7128"
                  disabled={isSubmitting}
                />
              </div>
              
              <div>
                <Label htmlFor="longitude">Longitude (Optional)</Label>
                <Input
                  id="longitude"
                  value={formData.longitude}
                  onChange={(e) => handleInputChange('longitude', e.target.value)}
                  placeholder="e.g., -74.0060"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          {/* Image URL */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Image Evidence (Optional)</h3>
            <div>
              <Label htmlFor="imgUrl">Image URL</Label>
              <Input
                id="imgUrl"
                value={formData.imgUrl}
                onChange={(e) => handleInputChange('imgUrl', e.target.value)}
                placeholder="Paste image URL from Google Images or other sources"
              disabled={isSubmitting}
              />
              {formData.imgUrl && (
                <div className="mt-4 rounded-lg overflow-hidden">
                  <img
                    src={formData.imgUrl}
                    alt="Preview"
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Impact Description */}
          <div>
            <Label htmlFor="impact">Impact Description (Optional)</Label>
            <Textarea
              id="impact"
              value={formData.impact}
              onChange={(e) => handleInputChange('impact', e.target.value)}
              placeholder="Describe the impact of this disaster..."
              rows={4}
              disabled={isSubmitting}
            />
          </div>

          <Button
            type="submit"
            form="disaster-report-form"
            className="w-full gradient-emergency text-white font-medium"
            disabled={isSubmitting || !isConnected}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating Report...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit Disaster Report
              </>
            )}
          </Button>

          {!isConnected && (
            <p className="text-center text-sm text-muted-foreground">
              Please connect your wallet to submit a report
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
};
