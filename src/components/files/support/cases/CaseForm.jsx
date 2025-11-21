import React from "react";
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

export function CaseForm({ formData, onInputChange }) {
  return (
    <div className="space-y-6">
      {/* Case Information Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Case Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="owner">Case Owner</Label>
            <Input id="owner" value="You" disabled className="bg-gray-50" />
          </div>
          <div>
            <Label htmlFor="caseNumber">Case Number</Label>
            <Input
              id="caseNumber"
              value="Auto-generated"
              disabled
              className="bg-gray-50"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <Label htmlFor="productName">Product Name</Label>
            <Input
              id="productName"
              value={formData.productName}
              onChange={(e) => onInputChange("productName", e.target.value)}
              placeholder="Enter product name"
            />
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => onInputChange("status", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Waiting on Customer">
                  Waiting on Customer
                </SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
                <SelectItem value="Closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <Label htmlFor="type">Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => onInputChange("type", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="-None-">-None-</SelectItem>
                <SelectItem value="Problem">Problem</SelectItem>
                <SelectItem value="Feature Request">Feature Request</SelectItem>
                <SelectItem value="Question">Question</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={formData.priority}
              onValueChange={(value) => onInputChange("priority", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="-None-">-None-</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <Label htmlFor="caseOrigin">Case Origin</Label>
            <Select
              value={formData.caseOrigin}
              onValueChange={(value) => onInputChange("caseOrigin", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select origin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="-None-">-None-</SelectItem>
                <SelectItem value="Email">Email</SelectItem>
                <SelectItem value="Phone">Phone</SelectItem>
                <SelectItem value="Web">Web</SelectItem>
                <SelectItem value="Social Media">Social Media</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="caseReason">Case Reason</Label>
            <Select
              value={formData.caseReason}
              onValueChange={(value) => onInputChange("caseReason", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="-None-">-None-</SelectItem>
                <SelectItem value="Complex Functionality">
                  Complex Functionality
                </SelectItem>
                <SelectItem value="New Problem">New Problem</SelectItem>
                <SelectItem value="Instructions Not Clear">
                  Instructions Not Clear
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Related To Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Related To</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="relatedToType">Related To</Label>
            <Select
              value={formData.relatedToType}
              onValueChange={(value) => onInputChange("relatedToType", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="account">Account</SelectItem>
                <SelectItem value="contact">Contact</SelectItem>
                <SelectItem value="deal">Deal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="relatedTo">Record Name</Label>
            <Input
              id="relatedTo"
              value={formData.relatedTo}
              onChange={(e) => onInputChange("relatedTo", e.target.value)}
              placeholder="Search records..."
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <Label htmlFor="subject">Subject *</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => onInputChange("subject", e.target.value)}
              placeholder="Enter case subject"
              required
            />
          </div>
          <div>
            <Label htmlFor="accountName">Account Name</Label>
            <Input
              id="accountName"
              value={formData.accountName}
              onChange={(e) => onInputChange("accountName", e.target.value)}
              placeholder="Enter account name"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <Label htmlFor="reportedBy">Reported By</Label>
            <Input
              id="reportedBy"
              value={formData.reportedBy}
              onChange={(e) => onInputChange("reportedBy", e.target.value)}
              placeholder="Enter reporter name"
            />
          </div>
          <div>
            <Label htmlFor="dealName">Deal Name</Label>
            <Input
              id="dealName"
              value={formData.dealName}
              onChange={(e) => onInputChange("dealName", e.target.value)}
              placeholder="Enter deal name"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => onInputChange("email", e.target.value)}
              placeholder="Enter email address"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => onInputChange("phone", e.target.value)}
              placeholder="Enter phone number"
            />
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Description Information</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => onInputChange("description", e.target.value)}
              placeholder="Describe the case in detail..."
              rows={4}
            />
          </div>
          <div>
            <Label htmlFor="internalComments">Internal Comments</Label>
            <Textarea
              id="internalComments"
              value={formData.internalComments}
              onChange={(e) =>
                onInputChange("internalComments", e.target.value)
              }
              placeholder="Add internal comments..."
              rows={3}
            />
          </div>
        </div>
      </div>

      {/* Solution Information Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Solution Information</h3>
        <div>
          <Label htmlFor="solution">Solution</Label>
          <Textarea
            id="solution"
            value={formData.solution}
            onChange={(e) => onInputChange("solution", e.target.value)}
            placeholder="Add solution details..."
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}
