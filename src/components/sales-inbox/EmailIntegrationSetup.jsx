import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Mail,
  Github,
  Chrome,
  Server,
  CheckCircle,
  X,
  Shield,
} from "lucide-react";

export function EmailIntegrationSetup({
  onClose,
  onConnect,
  connectedAccounts,
}) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    provider: "",
    email: "",
    password: "",
    server: "",
    port: "",
    security: "ssl",
  });

  const emailProviders = [
    {
      id: "gmail",
      name: "Gmail",
      icon: Chrome,
      description: "Connect with Google OAuth",
    },
    {
      id: "outlook",
      name: "Outlook",
      icon: Mail,
      description: "Connect with Microsoft OAuth",
    },
    {
      id: "yahoo",
      name: "Yahoo Mail",
      icon: Mail,
      description: "Connect with Yahoo OAuth",
    },
    {
      id: "imap",
      name: "Other IMAP",
      icon: Server,
      description: "Custom IMAP configuration",
    },
  ];

  const handleProviderSelect = (provider) => {
    setFormData((prev) => ({ ...prev, provider }));
    setStep(2);
  };

  const handleConnect = () => {
    if (formData.provider && formData.email) {
      onConnect(formData);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <DialogDescription>
              Choose your email provider to connect with SalesInbox
            </DialogDescription>
            <div className="grid grid-cols-2 gap-4">
              {emailProviders.map((provider) => (
                <Button
                  key={provider.id}
                  variant="outline"
                  className="h-24 flex flex-col items-center justify-center space-y-2"
                  onClick={() => handleProviderSelect(provider.id)}
                >
                  <provider.icon className="w-6 h-6" />
                  <div className="text-sm font-medium">{provider.name}</div>
                  <div className="text-xs text-gray-500 text-center">
                    {provider.description}
                  </div>
                </Button>
              ))}
            </div>
          </div>
        );

      case 2:
        if (["gmail", "outlook", "yahoo"].includes(formData.provider)) {
          return (
            <div className="space-y-6">
              <DialogDescription>
                Connect your {formData.provider} account using OAuth
              </DialogDescription>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Shield className="w-8 h-8 text-blue-600" />
                  <div>
                    <h4 className="font-semibold text-blue-900">
                      Secure Connection
                    </h4>
                    <p className="text-sm text-blue-700">
                      We'll redirect you to {formData.provider} for secure
                      authentication. Your credentials are never stored.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder={`your@${formData.provider}.com`}
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Permissions Required</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Read and send emails
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Manage contacts and labels
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                    Sync email metadata
                  </li>
                </ul>
              </div>
            </div>
          );
        }

        // Custom IMAP configuration
        return (
          <div className="space-y-4">
            <DialogDescription>
              Configure your IMAP email server settings
            </DialogDescription>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="server">IMAP Server</Label>
                <Input
                  id="server"
                  placeholder="imap.example.com"
                  value={formData.server}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, server: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label htmlFor="port">Port</Label>
                <Input
                  id="port"
                  type="number"
                  placeholder="993"
                  value={formData.port}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, port: e.target.value }))
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="security">Security</Label>
              <Select
                value={formData.security}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, security: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ssl">SSL/TLS</SelectItem>
                  <SelectItem value="starttls">STARTTLS</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Mail className="w-5 h-5 mr-2" />
            Connect Email Account
          </DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-center space-x-4 mb-6">
          {[1, 2, 3].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {stepNumber}
              </div>
              {stepNumber < 3 && (
                <div
                  className={`w-12 h-1 ${
                    step > stepNumber ? "bg-blue-600" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {renderStep()}

        <div className="flex justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={step === 1 ? onClose : () => setStep(1)}
          >
            {step === 1 ? "Cancel" : "Back"}
          </Button>
          <Button onClick={handleConnect} disabled={!formData.email}>
            {formData.provider === "imap"
              ? "Test Connection"
              : "Connect Account"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
