import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/hooks/useWallet";
import {
  disasterContractService,
  DisasterReport,
} from "@/lib/disasterContract";
import { Loader2, AlertTriangle, Send, ShieldCheck } from "lucide-react";
import { SelfQRcodeWrapper, SelfApp, SelfAppBuilder } from "@selfxyz/qrcode";
import { utils } from "ethers";

// Replace with your deployed contract address
const DISASTER_CONTRACT_ADDRESS = "0xebd46E23FBF97287A585a02f4989fCc56816672F";

// Logo for Self Protocol (you can replace with your own logo)
const logo =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2VmNDQ0NCIvPjx0ZXh0IHg9IjUwIiB5PSI1NSIgZm9udC1zaXplPSI0MCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkQ8L3RleHQ+PC9zdmc+";

interface ReportFormProps {
  onSubmitSuccess?: () => void;
}

export const ReportForm: React.FC<ReportFormProps> = ({ onSubmitSuccess }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [verificationProof, setVerificationProof] = useState<any>(null);
  const [selfApp, setSelfApp] = useState<SelfApp | null>(null);

  const [formData, setFormData] = useState({
    reporterName: "",
    email: "",
    disasterType: "",
    imgUrl: "",
    latitude: "",
    longitude: "",
    city: "",
    state: "",
    date: new Date().toISOString().split("T")[0],
    severity: "",
    impact: "",
  });

  const { toast } = useToast();
  const { account, isConnected } = useWallet();

  const disasterTypes = [
    "Earthquake",
    "Flood",
    "Hurricane",
    "Tornado",
    "Wildfire",
    "Landslide",
    "Tsunami",
    "Volcanic Eruption",
    "Drought",
    "Cyclone",
    "Storm",
    "Heat Wave",
    "Cold Wave",
    "Other",
  ];

  const severityLevels = ["Low", "Medium", "High", "Critical"];

  // Initialize Self Protocol when wallet connects
  useEffect(() => {
    if (isConnected && account && utils.isAddress(account)) {
      try {
        const app = new SelfAppBuilder({
          appName: "Disaster Management",
          scope: "Disaster-Management",
          endpoint:
            "0x7b6436b0c98f62380866d9432c2af0ee08ce16a171bda6951aecd95ee1307d61",
          endpointType: "staging_celo", // Change to "prod_celo" for production
          logoBase64: logo,
          userId: account,
          userIdType: "hex",
          disclosures: {
            date_of_birth: true,
          },
          devMode: true, // Set to false for production with real passports
        } as Partial<SelfApp>).build();

        setSelfApp(app);
      } catch (error) {
        console.error("Error initializing Self Protocol:", error);
      }
    }
  }, [isConnected, account]);

  // Handle successful age verification
  const handleVerificationSuccess = async () => {
    setIsVerified(true);

    toast({
      title: "Age verified! ✓",
      description:
        "You are verified as 18+ and can now submit disaster reports",
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    const required = [
      "reporterName",
      "email",
      "disasterType",
      "city",
      "state",
      "severity",
    ];
    const missing = required.filter(
      (field) => !formData[field as keyof typeof formData]
    );

    if (missing.length > 0) {
      toast({
        title: "Missing required fields",
        description: `Please fill in: ${missing.join(", ")}`,
        variant: "destructive",
      });
      return false;
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
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
        variant: "destructive",
      });
      return;
    }

    // Check if user is verified
    if (!isVerified) {
      toast({
        title: "Age verification required",
        description: "Please verify your age (18+) before submitting a report",
        variant: "destructive",
      });
      return;
    }

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Include the proof in the report data
      const reportData: Omit<DisasterReport, "reporterId"> = {
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
        impact: formData.impact,
      };

      toast({
        title: "Creating report...",
        description: "Please confirm the transaction in your wallet",
      });

      const tx = await disasterContractService.createReport(reportData);

      toast({
        title: "Transaction submitted",
        description: "Waiting for blockchain confirmation...",
      });

      await tx.wait();

      // Show success message
      toast({
        title: "Report created successfully!",
        description:
          "Your disaster report has been recorded on the Celo blockchain",
      });

      // Reset form
      setFormData({
        reporterName: "",
        email: "",
        disasterType: "",
        imgUrl: "",
        latitude: "",
        longitude: "",
        city: "",
        state: "",
        date: new Date().toISOString().split("T")[0],
        severity: "",
        impact: "",
      });

      // Reset verification state (user needs to verify again for next report)
      setIsVerified(false);
      setVerificationProof(null);

      onSubmitSuccess?.();
    } catch (error: any) {
      console.error("Error creating report:", error);
      const errorMessage =
        error?.reason ||
        error?.message ||
        error?.data?.message ||
        (typeof error === "string" ? error : "Failed to create report");

      toast({
        title: "Failed to create report",
        description: errorMessage,
        variant: "destructive",
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
        {/* Age Verification Section - Shows when wallet is connected but not verified */}
        {isConnected && !isVerified && (
          <div className="mb-6 p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
            <div className="flex items-start gap-3 mb-4">
              <ShieldCheck className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  Age Verification Required (18+)
                </h3>
                <p className="text-sm text-blue-700 mb-4">
                  To submit disaster reports, you must verify that you are 18
                  years or older using Self Protocol. This verification uses
                  zero-knowledge proofs to protect your privacy.
                </p>
                <div className="bg-blue-100 p-3 rounded-md mb-4">
                  <p className="text-xs text-blue-800">
                    <strong>How it works:</strong>
                  </p>
                  <ol className="text-xs text-blue-800 ml-4 mt-1 space-y-1">
                    <li>1. Scan the QR code with Self Protocol mobile app</li>
                    <li>2. Verify your age using your passport or ID</li>
                    <li>
                      3. Your age is verified without revealing your identity
                    </li>
                  </ol>
                </div>
              </div>
            </div>

            {selfApp && (
              <div className="flex justify-center p-4 bg-white rounded-lg">
                <SelfQRcodeWrapper
                  selfApp={selfApp}
                  type="websocket"
                  onSuccess={handleVerificationSuccess}
                  onError={() => {
                    console.log("Error: Failed to verify identity");
                  }}
                />
              </div>
            )}

            {!selfApp && (
              <p className="text-center text-sm text-gray-600">
                Initializing verification...
              </p>
            )}
          </div>
        )}

        {/* Verification Success Badge */}
        {isVerified && (
          <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-semibold text-green-800">
                  Age Verified ✓
                </p>
                <p className="text-xs text-green-700">
                  You can now submit disaster reports
                </p>
              </div>
            </div>
          </div>
        )}

        <form
          id="disaster-report-form"
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Personal Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="reporterName">Full Name *</Label>
                <Input
                  id="reporterName"
                  value={formData.reporterName}
                  onChange={(e) =>
                    handleInputChange("reporterName", e.target.value)
                  }
                  placeholder="Enter your full name"
                  disabled={isSubmitting || !isVerified}
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="your@email.com"
                  disabled={isSubmitting || !isVerified}
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
                  onValueChange={(value) =>
                    handleInputChange("disasterType", value)
                  }
                  disabled={isSubmitting || !isVerified}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select disaster type" />
                  </SelectTrigger>
                  <SelectContent>
                    {disasterTypes.map((type) => (
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
                  onValueChange={(value) =>
                    handleInputChange("severity", value)
                  }
                  disabled={isSubmitting || !isVerified}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select severity" />
                  </SelectTrigger>
                  <SelectContent>
                    {severityLevels.map((level) => (
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
                onChange={(e) => handleInputChange("date", e.target.value)}
                disabled={isSubmitting || !isVerified}
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
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  placeholder="Enter city"
                  disabled={isSubmitting || !isVerified}
                />
              </div>

              <div>
                <Label htmlFor="state">State/Province *</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  placeholder="Enter state/province"
                  disabled={isSubmitting || !isVerified}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="latitude">Latitude (Optional)</Label>
                <Input
                  id="latitude"
                  value={formData.latitude}
                  onChange={(e) =>
                    handleInputChange("latitude", e.target.value)
                  }
                  placeholder="e.g., 40.7128"
                  disabled={isSubmitting || !isVerified}
                />
              </div>

              <div>
                <Label htmlFor="longitude">Longitude (Optional)</Label>
                <Input
                  id="longitude"
                  value={formData.longitude}
                  onChange={(e) =>
                    handleInputChange("longitude", e.target.value)
                  }
                  placeholder="e.g., -74.0060"
                  disabled={isSubmitting || !isVerified}
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
                onChange={(e) => handleInputChange("imgUrl", e.target.value)}
                placeholder="Paste image URL from Google Images or other sources"
                disabled={isSubmitting || !isVerified}
              />
              {formData.imgUrl && (
                <div className="mt-4 rounded-lg overflow-hidden">
                  <img
                    src={formData.imgUrl}
                    alt="Preview"
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
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
              onChange={(e) => handleInputChange("impact", e.target.value)}
              placeholder="Describe the impact of this disaster..."
              rows={4}
              disabled={isSubmitting || !isVerified}
            />
          </div>

          <Button
            type="submit"
            form="disaster-report-form"
            className="w-full gradient-emergency text-white font-medium"
            disabled={isSubmitting || !isConnected || !isVerified}
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

          {isConnected && !isVerified && (
            <p className="text-center text-sm text-amber-600 font-medium">
              ⚠️ Please verify your age (18+) above to enable the form
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
};
