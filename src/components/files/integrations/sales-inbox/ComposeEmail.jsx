import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Paperclip, Send, User, Building2, Target, X } from "lucide-react";

export function ComposeEmail({ onClose, onSend, connectedAccounts }) {
  const [formData, setFormData] = useState({
    to: "",
    cc: "",
    bcc: "",
    subject: "",
    body: "",
    relatedTo: "",
    relatedToType: "lead",
  });

  const handleSend = () => {
    if (formData.to && formData.subject && formData.body) {
      onSend(formData);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <DialogTitle className="text-lg font-semibold">
            Compose Email
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Email Form - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* From Address */}
          <div>
            <Label htmlFor="from">From</Label>
            <Select defaultValue={connectedAccounts[0]?.email}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {connectedAccounts.map((account) => (
                  <SelectItem key={account.id} value={account.email}>
                    {account.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* To, CC, BCC */}
          <div className="space-y-3">
            <div>
              <Label htmlFor="to">To *</Label>
              <Input
                id="to"
                placeholder="recipient@example.com"
                value={formData.to}
                onChange={(e) => handleInputChange("to", e.target.value)}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cc">CC</Label>
                <Input
                  id="cc"
                  placeholder="cc@example.com"
                  value={formData.cc}
                  onChange={(e) => handleInputChange("cc", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="bcc">BCC</Label>
                <Input
                  id="bcc"
                  placeholder="bcc@example.com"
                  value={formData.bcc}
                  onChange={(e) => handleInputChange("bcc", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Subject */}
          <div>
            <Label htmlFor="subject">Subject *</Label>
            <Input
              id="subject"
              placeholder="Email subject"
              value={formData.subject}
              onChange={(e) => handleInputChange("subject", e.target.value)}
            />
          </div>

          {/* Related To */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Related To</Label>
              <Select
                value={formData.relatedToType}
                onValueChange={(value) =>
                  handleInputChange("relatedToType", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lead">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Lead
                    </div>
                  </SelectItem>
                  <SelectItem value="contact">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Contact
                    </div>
                  </SelectItem>
                  <SelectItem value="account">
                    <div className="flex items-center">
                      <Building2 className="w-4 h-4 mr-2" />
                      Account
                    </div>
                  </SelectItem>
                  <SelectItem value="deal">
                    <div className="flex items-center">
                      <Target className="w-4 h-4 mr-2" />
                      Deal
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Record</Label>
              <Input
                placeholder="Search records..."
                value={formData.relatedTo}
                onChange={(e) => handleInputChange("relatedTo", e.target.value)}
              />
            </div>
          </div>

          {/* Email Body */}
          <div className="flex-1 min-h-[300px]">
            <Label htmlFor="body">Message *</Label>
            <Textarea
              id="body"
              placeholder="Type your message here..."
              className="min-h-[300px] resize-none font-sans text-sm mt-2"
              value={formData.body}
              onChange={(e) => handleInputChange("body", e.target.value)}
            />
          </div>
        </div>

        {/* Footer Actions - Fixed at bottom */}
        <div className="flex items-center justify-between border-t p-4 bg-gray-50">
          <Button variant="outline" size="sm">
            <Paperclip className="w-4 h-4 mr-2" />
            Attach Files
          </Button>

          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose}>
              Discard
            </Button>
            <Button
              onClick={handleSend}
              disabled={!formData.to || !formData.subject || !formData.body}
            >
              <Send className="w-4 h-4 mr-2" />
              Send
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
