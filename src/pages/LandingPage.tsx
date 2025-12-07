import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  AlertTriangle, 
  FileText, 
  Eye, 
  Shield, 
  Globe, 
  Users,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: AlertTriangle,
      title: 'Real-time Reporting',
      description: 'Report disasters instantly with location data and photo evidence'
    },
    {
      icon: Shield,
      title: 'Celo Blockchain Security',
      description: 'All reports are stored securely on the Celo blockchain'
    },
    {
      icon: Globe,
      title: 'Global Coverage',
      description: 'Track and report disasters from anywhere in the world'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Built by the community, for the community disaster response'
    }
  ];

  const stats = [
    { label: 'Active Reports', value: '1,234' },
    { label: 'Communities Served', value: '50+' },
    { label: 'Response Time', value: '<5min' },
    { label: 'Data Accuracy', value: '99.9%' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-emergency/10 text-emergency px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
            <AlertTriangle className="w-4 h-4" />
            Emergency Response System
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight animate-fade-in">
            <span className="gradient-emergency bg-clip-text text-transparent">
              DisasterGuard
            </span>
            <br />
            Community Disaster Reporting
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto animate-slide-in">
            A decentralized platform for real-time disaster reporting and emergency response. 
            Help your community stay safe by reporting disasters instantly on the Celo blockchain.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Button
              size="lg"
              className="gradient-emergency text-white font-semibold px-8 py-4 text-lg hover:opacity-90 transition-all"
              onClick={() => navigate('/create-report')}
            >
              <AlertTriangle className="w-5 h-5 mr-2" />
              Report Emergency
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg font-semibold"
              onClick={() => navigate('/reports')}
            >
              <Eye className="w-5 h-5 mr-2" />
              View Reports
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-fade-in">
                <div className="text-3xl md:text-4xl font-bold text-emergency mb-2">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose DisasterGuard?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built on Celo mainnet for transparency, security, and real-time emergency response
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 gradient-card animate-fade-in">
                <CardContent className="p-6 text-center">
                  <div className="p-4 rounded-full bg-emergency/10 w-fit mx-auto mb-4 group-hover:bg-emergency/20 transition-colors">
                    <feature.icon className="w-8 h-8 text-emergency" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple, fast, and secure disaster reporting in three steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center animate-fade-in">
              <div className="p-6 rounded-full bg-emergency/10 w-fit mx-auto mb-4">
                <FileText className="w-10 h-10 text-emergency" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Report</h3>
              <p className="text-gray-600">
                Fill out the disaster report form with location, type, and severity details
              </p>
            </div>

            <div className="text-center animate-fade-in">
              <div className="p-6 rounded-full bg-emergency/10 w-fit mx-auto mb-4">
                <Shield className="w-10 h-10 text-emergency" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Verify</h3>
              <p className="text-gray-600">
                Your report is verified and stored securely on the Celo blockchain
              </p>
            </div>

            <div className="text-center animate-fade-in">
              <div className="p-6 rounded-full bg-emergency/10 w-fit mx-auto mb-4">
                <Users className="w-10 h-10 text-emergency" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Respond</h3>
              <p className="text-gray-600">
                Emergency responders and community members can view and act on reports
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto gradient-hero text-white border-0">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Help Your Community?
              </h2>
              <p className="text-xl mb-8 text-white/90">
                Join thousands of users making their communities safer through blockchain-powered disaster reporting
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  variant="secondary"
                  className="px-8 py-4 text-lg font-semibold"
                  onClick={() => navigate('/create-report')}
                >
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Create Your First Report
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>

              <div className="flex items-center justify-center gap-6 mt-8 text-sm text-white/80">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Free to use</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Blockchain secured</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Real-time alerts</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};
