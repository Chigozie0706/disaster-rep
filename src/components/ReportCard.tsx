import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, AlertTriangle, Eye } from 'lucide-react';
import { DisasterReport } from '@/lib/disasterContract';

interface ReportCardProps {
  report: DisasterReport;
  reportIndex: number;
  onViewDetails: (index: number) => void;
}

export const ReportCard: React.FC<ReportCardProps> = ({
  report,
  reportIndex,
  onViewDetails
}) => {
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
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-0 gradient-card animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="text-lg leading-tight">
            {report.disasterType}
          </CardTitle>
          <Badge className={`${getSeverityColor(report.severity)} shrink-0`}>
            <AlertTriangle className="w-3 h-3 mr-1" />
            {report.severity}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {report.imgUrl && (
          <div className="rounded-lg overflow-hidden">
            <img
              src={report.imgUrl}
              alt="Disaster"
              className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{report.city}, {report.state}</span>
          </div>
          
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(report.date)}</span>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Reporter:</span> {report.reporterName}
          </p>
          
          {report.impact && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              <span className="font-medium text-foreground">Impact:</span> {report.impact}
            </p>
          )}
        </div>

        <Button
          className="w-full mt-4"
          variant="outline"
          onClick={() => onViewDetails(reportIndex)}
        >
          <Eye className="w-4 h-4 mr-2" />
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};
