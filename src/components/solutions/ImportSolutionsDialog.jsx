import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import { Download, Upload, FileText } from "lucide-react";

export function ImportSolutionsDialog({ open, onOpenChange }) {
  const [importStep, setImportStep] = useState("file"); // 'file' or 'crm'
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import Solutions</DialogTitle>
          <DialogDescription>
            Import solutions from a file or from another CRM system.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Step Selection */}
          <div className="flex space-x-2">
            <Button
              variant={importStep === "file" ? "default" : "outline"}
              onClick={() => setImportStep("file")}
              className="flex-1"
            >
              From File
            </Button>
            <Button
              variant={importStep === "crm" ? "default" : "outline"}
              onClick={() => setImportStep("crm")}
              className="flex-1"
            >
              From other CRMs
            </Button>
          </div>

          {importStep === "file" ? (
            <div className="space-y-4">
              {/* File Upload Area */}
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => document.getElementById("file-upload").click()}
              >
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                {selectedFile ? (
                  <div>
                    <p className="font-medium text-green-600 mb-2">
                      {selectedFile.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      Click or drag to change file
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="font-medium mb-2">
                      Drag and drop your file here
                    </p>
                    <p className="text-sm text-gray-500 mb-4">- or -</p>
                    <Button variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Browse
                    </Button>
                  </div>
                )}
                <Input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".xls,.xlsx,.csv,.vcf"
                  onChange={handleFileSelect}
                />
              </div>

              {/* File Information */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-sm mb-2">
                  Download sample file
                </h4>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    CSV
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    XLSX
                  </Button>
                </div>
                <p className="text-xs text-gray-600 mt-2">
                  You can import up to 5000 records through an .xls, .xlsx, .vcf
                  or .csv file. To import more than 5000 records at a time, use
                  a .csv file.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center p-8 border rounded-lg">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="font-medium mb-2">
                  Which CRM are you coming from?
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Choose a CRM from which you would like to import. Importing
                  data from other CRMs is made easy. It is just a click away.
                </p>

                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select CRM" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="salesforce">Salesforce</SelectItem>
                    <SelectItem value="hubspot">HubSpot</SelectItem>
                    <SelectItem value="pipedrive">Pipedrive</SelectItem>
                    <SelectItem value="zoho">Zoho CRM</SelectItem>
                    <SelectItem value="microsoft">
                      Microsoft Dynamics
                    </SelectItem>
                    <SelectItem value="freshworks">Freshworks</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="button" variant="outline">
              Next
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
