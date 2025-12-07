import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { disasterContractService, DisasterReport, DisasterImage } from '@/lib/disasterContract';
import { useWallet } from '@/hooks/useWallet';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  AlertTriangle, 
  User, 
  Mail, 
  Trash2,
  Loader2,
  Camera,
  ExternalLink
} from 'lucide-react';

export const ReportDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { account, isConnected } = useWallet();
  const { toast } = useToast();

  const [report, setReport] = useState<DisasterReport | null>(null);
  const [images, setImages] = useState<DisasterImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [addingImage, setAddingImage] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');

  const reportId = parseInt(id || '0');

  useEffect(() => {
    fetchReportDetails();
  }, [id, account]);

  const fetchReportDetails = async () => {
    setLoading(true);
    try {
      const reportData = await disasterContractService.getReport(reportId);
      const imageData = await disasterContractService.getReportImages(reportId);
      
      if (reportData) {
        setReport(reportData);
        setImages(imageData);
        setIsOwner(account?.toLowerCase() === reportData.reporterId.toLowerCase());
      } else {
        toast({
          title: "Report not found",
          description: "The requested report does not exist",
          variant: "destructive"
        });
        navigate('/reports');
      }
    } catch (error) {
      console.error('Error fetching report details:', error);
      toast({
        title: "Error loading report",
        description: "Failed to load report details",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddImage = async () => {
    if (!isConnected || !isOwner || !newImageUrl.trim()) return;

    setAddingImage(true);
    try {
      const timestamp = new Date().toISOString();
      const tx = await disasterContractService.addReportImage(reportId, newImageUrl.trim(), timestamp);
      
      toast({
        title: "Adding image...",
        description: "Transaction submitted to blockchain"
      });

      await tx.wait();
      
      toast({
        title: "Image added successfully",
        description: "The image has been added to the report on Celo blockchain"
      });

      // Refresh images
      const updatedImages = await disasterContractService.getReportImages(reportId);
      setImages(updatedImages);
      setNewImageUrl(''); // Clear input after successful upload
      
    } catch (error: any) {
      console.error('Error adding image:', error);
      const errorMessage = error?.reason || 
                          error?.message || 
                          error?.data?.message ||
                          (typeof error === 'string' ? error : 'Failed to add image');
                          
      toast({
        title: "Failed to add image",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setAddingImage(false);
    }
  };

  const handleDeleteImage = async (imageIndex: number) => {
    if (!isConnected || !isOwner) return;

    try {
      const tx = await disasterContractService.deleteReportImage(reportId, imageIndex);
      
      toast({
        title: "Deleting image...",
        description: "Transaction submitted to blockchain"
      });

      await tx.wait();
      
      toast({
        title: "Image deleted",
        description: "The image has been removed from the report on Celo blockchain"
      });

      // Refresh images
      const updatedImages = await disasterContractService.getReportImages(reportId);
      setImages(updatedImages);
      
    } catch (error: any) {
      console.error('Error deleting image:', error);
      const errorMessage = error?.reason || 
                          error?.message || 
                          error?.data?.message ||
                          (typeof error === 'string' ? error : 'Failed to delete image');
                          
      toast({
        title: "Failed to delete image",
        description: errorMessage,
        variant: "destructive"
      });
    }
  };

  const handleDeleteReport = async () => {
    if (!isConnected || !isOwner) return;

    const confirmed = window.confirm(
      'Are you sure you want to delete this report? This action cannot be undone.'
    );
    
    if (!confirmed) return;

    setDeleting(true);
    try {
      const tx = await disasterContractService.deleteReport(reportId);
      
      toast({
        title: "Deleting report...",
        description: "Transaction submitted to blockchain"
      });

      await tx.wait();
      
      toast({
        title: "Report deleted",
        description: "The disaster report has been removed from Celo blockchain"
      });

      navigate('/reports');
      
    } catch (error: any) {
      console.error('Error deleting report:', error);
      const errorMessage = error?.reason || 
                          error?.message || 
                          error?.data?.message ||
                          (typeof error === 'string' ? error : 'Failed to delete report');
                          
      toast({
        title: "Failed to delete report",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setDeleting(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
      case 'critical':
        return 'bg-destructive text-destructive-foreground';
      case 'medium':
      case 'moderate':
        return 'bg-warning text-warning-foreground';
      case 'low':
      case 'minor':
        return 'bg-success text-success-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-emergency mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Loading Report</h3>
          <p className="text-gray-600">Fetching report details from Celo mainnet...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Report Not Found</h3>
            <p className="text-gray-600 mb-4">The requested disaster report does not exist.</p>
            <Button onClick={() => navigate('/reports')}>
              Back to Reports
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/reports')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Reports
          </Button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {report.disasterType} Report
              </h1>
              <p className="text-lg text-gray-600">
                Report #{id} • {formatDate(report.date)}
              </p>
            </div>
            
            <Badge className={`${getSeverityColor(report.severity)}`}>
              <AlertTriangle className="w-3 h-3 mr-1" />
              {report.severity} Severity
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Report Details */}
            <Card>
              <CardHeader>
                <CardTitle>Report Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Main Image */}
                {report.imgUrl && (
                  <div className="rounded-lg overflow-hidden">
                    <img
                      src={report.imgUrl}
                      alt="Disaster"
                      className="w-full h-64 object-cover"
                    />
                  </div>
                )}

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">
                        {report.city}, {report.state}
                      </p>
                      {(report.latitude || report.longitude) && (
                        <p className="text-xs text-muted-foreground">
                          {report.latitude}, {report.longitude}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Date</p>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(report.date)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Impact */}
                {report.impact && (
                  <div>
                    <h4 className="font-medium mb-2">Impact Description</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {report.impact}
                    </p>
                  </div>
                )}

                {/* Coordinates Link */}
                {report.latitude && report.longitude && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-fit"
                    onClick={() => {
                      const url = `https://maps.google.com/?q=${report.latitude},${report.longitude}`;
                      window.open(url, '_blank');
                    }}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on Google Maps
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Additional Images */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Additional Images ({images.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {images.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image.disasterImageUrl}
                          alt={`Additional evidence ${index + 1}`}
                          className="w-full h-40 object-cover rounded-lg"
                        />
                        {isOwner && (
                          <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => handleDeleteImage(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                        <div className="absolute bottom-2 left-2 text-xs bg-black/50 text-white px-2 py-1 rounded">
                          {new Date(image.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground mb-6">No additional images uploaded yet.</p>
                )}

                {/* Add Image (Owner Only) */}
                {isOwner && isConnected && (
                  <div>
                    <h4 className="font-medium mb-4">Add More Image Evidence</h4>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="newImageUrl">Image URL</Label>
                        <Input
                          id="newImageUrl"
                          value={newImageUrl}
                          onChange={(e) => setNewImageUrl(e.target.value)}
                          placeholder="Paste image URL here"
                      disabled={addingImage}
                        />
                      </div>
                      <Button
                        onClick={handleAddImage}
                        disabled={addingImage || !newImageUrl.trim()}
                        className="w-full"
                      >
                        {addingImage ? 'Adding Image...' : 'Add Image'}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Reporter Info */}
            <Card>
              <CardHeader>
                <CardTitle>Reporter Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{report.reporterName}</p>
                    <p className="text-sm text-muted-foreground">Reporter</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium break-all">{report.email}</p>
                    <p className="text-sm text-muted-foreground">Email</p>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">
                    Wallet: {report.reporterId.slice(0, 8)}...{report.reporterId.slice(-6)}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Owner Actions */}
            {isOwner && isConnected && (
              <Card className="border-destructive/20">
                <CardHeader>
                  <CardTitle className="text-destructive">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Once you delete this report, there is no going back. Please be certain.
                  </p>
                  
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={handleDeleteReport}
                    disabled={deleting}
                  >
                    {deleting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Report
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
