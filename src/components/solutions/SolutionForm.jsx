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

export function SolutionForm({ formData, onInputChange }) {
  return (
    <div className="space-y-6">
      {/* Solution Information Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Solution Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="solutionNumber">Solution Number</Label>
            <Input
              id="solutionNumber"
              value="Auto-generated"
              disabled
              className="bg-gray-50"
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
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Review">Under Review</SelectItem>
                <SelectItem value="Published">Published</SelectItem>
                <SelectItem value="Archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-4">
          <Label htmlFor="solutionTitle">Solution Title *</Label>
          <Input
            id="solutionTitle"
            value={formData.solutionTitle}
            onChange={(e) => onInputChange("solutionTitle", e.target.value)}
            placeholder="Enter solution title"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <Label htmlFor="owner">Solution Owner</Label>
            <Input id="owner" value="You" disabled className="bg-gray-50" />
          </div>
          <div>
            <Label htmlFor="productName">Product Name</Label>
            <Select
              value={formData.productName}
              onValueChange={(value) => onInputChange("productName", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select product" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mobile App v2.0">Mobile App v2.0</SelectItem>
                <SelectItem value="Web Dashboard">Web Dashboard</SelectItem>
                <SelectItem value="Payment System">Payment System</SelectItem>
                <SelectItem value="CRM Platform">CRM Platform</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Description Information Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Description Information</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="question">Question</Label>
            <Textarea
              id="question"
              value={formData.question}
              onChange={(e) => onInputChange("question", e.target.value)}
              placeholder="Enter the customer question or problem..."
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="answer">Answer</Label>
            <Textarea
              id="answer"
              value={formData.answer}
              onChange={(e) => onInputChange("answer", e.target.value)}
              placeholder="Provide the solution or answer..."
              rows={4}
            />
          </div>
        </div>
      </div>

      {/* Related Cases Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Related Cases</h3>
        <div>
          <Label htmlFor="relatedCases">Case Numbers</Label>
          <Input
            id="relatedCases"
            value={formData.relatedCases}
            onChange={(e) => onInputChange("relatedCases", e.target.value)}
            placeholder="Enter case numbers separated by commas (e.g., CASE-001, CASE-002)"
          />
          <p className="text-sm text-gray-500 mt-1">
            Link this solution to relevant support cases
          </p>
        </div>
      </div>
    </div>
  );
}
