import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "@/contexts/DataContext";
import { useToast } from "@/components/ui/use-toast";

const ImportCampaigns = () => {
  const navigate = useNavigate();
  const { addDataItem } = useData();
  const { toast } = useToast();
  const [importStep, setImportStep] = useState(1);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Simulate file processing
      setTimeout(() => {
        toast({
          title: "File Uploaded",
          description: "Campaign data has been processed successfully.",
        });
        setImportStep(2);
      }, 2000);
    }
  };

  const handleImportComplete = () => {
    toast({
      title: "Import Complete",
      description: "Campaigns have been imported successfully.",
    });
    navigate("/campaigns/list");
  };

  return (
    <div className="w-full p-10 bg-[#f5f7fb]">
      <h1 className="text-2xl font-semibold mb-8">Import Campaigns</h1>

      {/* Progress Steps */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            importStep >= 1 ? 'bg-[#4667d8] text-white' : 'bg-gray-300 text-gray-600'
          }`}>
            1
          </div>
          <div className={`w-24 h-1 ${importStep >= 2 ? 'bg-[#4667d8]' : 'bg-gray-300'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            importStep >= 2 ? 'bg-[#4667d8] text-white' : 'bg-gray-300 text-gray-600'
          }`}>
            2
          </div>
          <div className={`w-24 h-1 ${importStep >= 3 ? 'bg-[#4667d8]' : 'bg-gray-300'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            importStep >= 3 ? 'bg-[#4667d8] text-white' : 'bg-gray-300 text-gray-600'
          }`}>
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
              <p className="text-gray-600 mb-4">Drag and drop your file here.</p>
              <p className="text-gray-600 mb-3">- OR -</p>

              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileUpload}
              />
              <label
                htmlFor="file-upload"
                className="px-4 py-2 bg-[#4667d8] text-white rounded-md cursor-pointer"
              >
                Browse
              </label>
            </div>
          )}

          {importStep === 2 && (
            <div className="text-center p-6">
              <div className="text-green-600 text-4xl mb-4">✓</div>
              <p className="text-gray-600 mb-4">File processed successfully!</p>
              <p className="text-sm text-gray-500">
                Ready to import campaign data. Review the mapping and proceed.
              </p>
            </div>
          )}

          {importStep === 3 && (
            <div className="text-center p-6">
              <div className="text-green-600 text-4xl mb-4">✓</div>
              <p className="text-gray-600">Import completed successfully!</p>
            </div>
          )}

          <p className="text-sm mt-4 text-blue-600 cursor-pointer">
            Download sample file CSV or XLSX
          </p>

          <p className="text-xs mt-4 text-gray-600 leading-relaxed">
            You can import up to 5000 records through an .xls, .xlsx, .vcf or
            .csv file. To import more than 5000 records at a time, use a .csv file.
          </p>
        </div>

        {/* From other CRMs */}
        <div className="w-[380px] bg-white shadow-sm rounded-xl p-6 border">
          <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
            <span className="text-green-600 text-xl">⬤</span> From other CRMs
          </h2>

          <p className="text-blue-600 cursor-pointer mb-4">
            Which CRM are you coming from?
          </p>

          <div className="space-y-2">
            {['Salesforce', 'HubSpot', 'Zoho CRM', 'Microsoft Dynamics', 'Other'].map(crm => (
              <div key={crm} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                <input type="radio" id={crm} name="crm" className="w-4 h-4" />
                <label htmlFor={crm} className="cursor-pointer">{crm}</label>
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
          className="px-5 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
          onClick={() => navigate("/campaigns")}
        >
          Cancel
        </button>

        {importStep < 3 && (
          <button 
            className="px-5 py-2 bg-[#4667d8] rounded-md text-white hover:bg-[#3c59c0]"
            onClick={() => setImportStep(importStep + 1)}
          >
            {importStep === 2 ? 'Complete Import' : 'Next'}
          </button>
        )}

        {importStep === 3 && (
          <button 
            className="px-5 py-2 bg-[#4667d8] rounded-md text-white hover:bg-[#3c59c0]"
            onClick={handleImportComplete}
          >
            Finish
          </button>
        )}
      </div>
    </div>
  );
};

export default ImportCampaigns;