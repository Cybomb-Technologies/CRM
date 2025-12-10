import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { campaignsService } from "./campaignsService";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const ImportCampaigns = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [importStep, setImportStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [importData, setImportData] = useState([]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    try {
      // In a real implementation, you would parse the CSV/Excel file
      // and send it to the backend for processing

      // For now, simulate processing
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Simulate processed data
      const simulatedData = [
        {
          campaignName: "Email Campaign " + Date.now(),
          type: "Email",
          status: "Planning",
          budgetedCost: 5000,
          expectedRevenue: 15000,
          startDate: new Date().toISOString(),
          endDate: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ).toISOString(),
        },
      ];

      setImportData(simulatedData);

      toast({
        title: "File Uploaded",
        description: "Campaign data has been processed successfully.",
      });
      setImportStep(2);
    } catch (error) {
      console.error("File upload error:", error);
      toast({
        title: "Error",
        description: "Failed to process file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImportComplete = async () => {
    setLoading(true);
    try {
      // Import campaigns to backend
      for (const campaignData of importData) {
        await campaignsService.createCampaign(campaignData);
      }

      toast({
        title: "Import Complete",
        description: "Campaigns have been imported successfully.",
      });
      navigate("/campaigns/list");
    } catch (error) {
      console.error("Import error:", error);
      toast({
        title: "Error",
        description: "Failed to import campaigns. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-10 bg-[#f5f7fb]">
      <h1 className="text-2xl font-semibold mb-8">Import Campaigns</h1>

      {/* Progress Steps */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              importStep >= 1
                ? "bg-[#4667d8] text-white"
                : "bg-gray-300 text-gray-600"
            }`}
          >
            1
          </div>
          <div
            className={`w-24 h-1 ${
              importStep >= 2 ? "bg-[#4667d8]" : "bg-gray-300"
            }`}
          ></div>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              importStep >= 2
                ? "bg-[#4667d8] text-white"
                : "bg-gray-300 text-gray-600"
            }`}
          >
            2
          </div>
          <div
            className={`w-24 h-1 ${
              importStep >= 3 ? "bg-[#4667d8]" : "bg-gray-300"
            }`}
          ></div>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              importStep >= 3
                ? "bg-[#4667d8] text-white"
                : "bg-gray-300 text-gray-600"
            }`}
          >
            3
          </div>
        </div>
      </div>

      <div className="flex gap-10 justify-center mt-10">
        {/* From File */}
        <div className="w-[380px] bg-white shadow-sm rounded-xl p-6 border">
          <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
            <span className="text-green-600 text-xl">⬤</span> From File
          </h2>

          {importStep === 1 && (
            <div className="border-2 border-dashed rounded-lg p-6 text-center">
              {loading ? (
                <div className="py-8">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600 mb-4" />
                  <p className="text-gray-600">Processing file...</p>
                </div>
              ) : (
                <>
                  <p className="text-gray-600 mb-4">
                    Drag and drop your file here.
                  </p>
                  <p className="text-gray-600 mb-3">- OR -</p>

                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept=".csv,.xlsx,.xls"
                    onChange={handleFileUpload}
                    disabled={loading}
                  />
                  <label
                    htmlFor="file-upload"
                    className="px-4 py-2 bg-[#4667d8] text-white rounded-md cursor-pointer hover:bg-[#3c59c0] disabled:opacity-50"
                  >
                    Browse
                  </label>
                </>
              )}
            </div>
          )}

          {importStep === 2 && (
            <div className="text-center p-6">
              <div className="text-green-600 text-4xl mb-4">✓</div>
              <p className="text-gray-600 mb-4">File processed successfully!</p>
              <p className="text-sm text-gray-500">
                Ready to import {importData.length} campaign(s). Review the data
                and proceed.
              </p>
              {importData.length > 0 && (
                <div className="mt-4 text-left">
                  <p className="font-medium mb-2">Sample Data:</p>
                  <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto max-h-32">
                    {JSON.stringify(importData[0], null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          {importStep === 3 && (
            <div className="text-center p-6">
              <div className="text-green-600 text-4xl mb-4">✓</div>
              <p className="text-gray-600">Import completed successfully!</p>
            </div>
          )}

          <p className="text-sm mt-4 text-blue-600 cursor-pointer hover:underline">
            Download sample file CSV or XLSX
          </p>

          <p className="text-xs mt-4 text-gray-600 leading-relaxed">
            You can import up to 5000 records through an .xls, .xlsx, .vcf or
            .csv file. To import more than 5000 records at a time, use a .csv
            file.
          </p>
        </div>

        {/* From other CRMs */}
        <div className="w-[380px] bg-white shadow-sm rounded-xl p-6 border">
          <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
            <span className="text-green-600 text-xl">⬤</span> From other CRMs
          </h2>

          <p className="text-blue-600 cursor-pointer mb-4 hover:underline">
            Which CRM are you coming from?
          </p>

          <div className="space-y-2">
            {[
              "Salesforce",
              "HubSpot",
              "Zoho CRM",
              "Microsoft Dynamics",
              "Other",
            ].map((crm) => (
              <div
                key={crm}
                className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded"
              >
                <input
                  type="radio"
                  id={crm}
                  name="crm"
                  className="w-4 h-4"
                  disabled={loading}
                />
                <label htmlFor={crm} className="cursor-pointer">
                  {crm}
                </label>
              </div>
            ))}
          </div>

          <p className="text-gray-600 text-sm mt-4">
            Choose a CRM from which you would like to import. Importing data
            from other CRMs is made easy. It is just a click away.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-4 mt-10">
        <button
          className="px-5 py-2 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
          onClick={() => navigate("/campaigns")}
          disabled={loading}
        >
          Cancel
        </button>

        {importStep < 3 && (
          <button
            className="px-5 py-2 bg-[#4667d8] rounded-md text-white hover:bg-[#3c59c0] disabled:opacity-50 flex items-center gap-2"
            onClick={() => setImportStep(importStep + 1)}
            disabled={loading}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {importStep === 2 ? "Complete Import" : "Next"}
          </button>
        )}

        {importStep === 3 && (
          <button
            className="px-5 py-2 bg-[#4667d8] rounded-md text-white hover:bg-[#3c59c0] disabled:opacity-50 flex items-center gap-2"
            onClick={handleImportComplete}
            disabled={loading}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            Finish
          </button>
        )}
      </div>
    </div>
  );
};

export default ImportCampaigns;
