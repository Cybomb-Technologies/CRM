import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { campaignsService } from "./campaignsService";
import { Loader2, Download, Upload, FileSpreadsheet, X } from "lucide-react";

const ImportCampaigns = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [previewData, setPreviewData] = useState([]);
  const [error, setError] = useState("");
  const fileInputRef = React.useRef(null);

  // Sample Excel file data structure
  const sampleData = [
    {
      "Campaign Name": "Summer Email Campaign",
      Type: "Email",
      Status: "Planning",
      "Start Date": "2024-06-01",
      "End Date": "2024-08-31",
      "Campaign Owner": "John Doe (john@example.com)",
      "Expected Revenue": "50000",
      "Budgeted Cost": "10000",
      "Actual Cost": "8500",
      "Expected Response (%)": "15",
      Goal: "Increase summer sales by 20%",
      "Target Audience": "Existing customers",
      Description: "Email campaign promoting summer products",
      "Numbers Sent": "1000",
    },
    {
      "Campaign Name": "Webinar Series",
      Type: "Webinar",
      Status: "Active",
      "Start Date": "2024-05-15",
      "End Date": "2024-07-15",
      "Campaign Owner": "Jane Smith (jane@example.com)",
      "Expected Revenue": "75000",
      "Budgeted Cost": "5000",
      "Actual Cost": "4500",
      "Expected Response (%)": "25",
      Goal: "Generate 50 qualified leads",
      "Target Audience": "Small business owners",
      Description: "3-part webinar series on digital marketing",
      "Numbers Sent": "500",
    },
  ];

  // Download sample Excel file
  const downloadSampleFile = () => {
    // Convert sample data to CSV format
    const headers = Object.keys(sampleData[0]);
    const csvContent = [
      headers.join(","),
      ...sampleData.map((row) =>
        headers
          .map((header) => {
            const value = row[header];
            // Escape quotes and wrap in quotes if contains comma
            if (typeof value === "string" && value.includes(",")) {
              return `"${value}"`;
            }
            return value;
          })
          .join(",")
      ),
    ].join("\n");

    // Create blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "campaign_import_template.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    toast({
      title: "Sample file downloaded",
      description: "Check the CSV file for the required format.",
    });
  };

  // Handle Browse Files button click
  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file type
    const validTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    const validExtensions = [".csv", ".xlsx", ".xls"];
    const fileExtension = file.name
      .slice(file.name.lastIndexOf("."))
      .toLowerCase();

    if (
      !validTypes.includes(file.type) &&
      !validExtensions.includes(fileExtension)
    ) {
      setError("Please upload a CSV or Excel file (.csv, .xlsx, .xls)");
      setSelectedFile(null);
      setFileName("");
      setPreviewData([]);
      return;
    }

    setSelectedFile(file);
    setFileName(file.name);
    setError("");
    previewFile(file);
  };

  // Preview file content
  const previewFile = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        const lines = content.split("\n").filter((line) => line.trim());

        if (lines.length < 2) {
          setError("File is empty or has no data rows.");
          setPreviewData([]);
          return;
        }

        const headers = lines[0]
          .split(",")
          .map((h) => h.trim().replace(/"/g, ""));

        // Parse CSV rows for preview
        const data = lines
          .slice(1, Math.min(6, lines.length)) // Preview first 5 rows
          .filter((line) => line.trim())
          .map((line) => {
            const values = line
              .split(",")
              .map((v) => v.trim().replace(/"/g, ""));
            const row = {};
            headers.forEach((header, index) => {
              row[header] = values[index] || "";
            });
            return row;
          });

        setPreviewData(data);
      } catch (error) {
        console.error("Error previewing file:", error);
        setError("Error reading file. Please check the format.");
        setPreviewData([]);
      }
    };
    reader.readAsText(file);
  };

  // Helper function to safely parse dates
  const parseDate = (dateString) => {
    if (!dateString || dateString.trim() === "") {
      return null;
    }

    // Try different date formats
    const dateFormats = [
      "YYYY-MM-DD", // 2024-06-01
      "MM/DD/YYYY", // 06/01/2024
      "DD/MM/YYYY", // 01/06/2024
      "YYYY/MM/DD", // 2024/06/01
    ];

    let parsedDate = null;

    // First try the standard Date.parse
    const timestamp = Date.parse(dateString);
    if (!isNaN(timestamp)) {
      parsedDate = new Date(timestamp);
    } else {
      // Try manual parsing for YYYY-MM-DD format
      const yyyyMmDdMatch = dateString.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
      if (yyyyMmDdMatch) {
        const year = parseInt(yyyyMmDdMatch[1], 10);
        const month = parseInt(yyyyMmDdMatch[2], 10) - 1; // Months are 0-indexed
        const day = parseInt(yyyyMmDdMatch[3], 10);
        parsedDate = new Date(year, month, day);
      }
    }

    // Check if date is valid
    if (parsedDate && !isNaN(parsedDate.getTime())) {
      return parsedDate.toISOString();
    }

    return null;
  };

  // Handle file upload
  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setError("");

    try {
      // Parse the file to get campaign data
      const campaigns = await parseFileData(selectedFile);

      if (campaigns.length === 0) {
        throw new Error("No valid campaigns found in the file.");
      }

      console.log("Parsed campaigns:", campaigns);

      // Import campaigns one by one
      let successCount = 0;
      let errorCount = 0;
      const errorMessages = [];

      for (const campaign of campaigns) {
        try {
          console.log("Creating campaign:", campaign.campaignName);
          const result = await campaignsService.createCampaign(campaign);
          if (result.success) {
            successCount++;
            console.log(
              "Campaign created successfully:",
              campaign.campaignName
            );
          } else {
            errorCount++;
            errorMessages.push(`${campaign.campaignName}: ${result.message}`);
            console.error("Failed to create campaign:", result.message);
          }
        } catch (error) {
          errorCount++;
          errorMessages.push(`${campaign.campaignName}: ${error.message}`);
          console.error("Error creating campaign:", error);
        }
      }

      if (errorMessages.length > 0) {
        console.error("Import errors:", errorMessages);
      }

      if (successCount > 0) {
        toast({
          title: "Import Completed",
          description: `Successfully imported ${successCount} campaign(s). ${
            errorCount > 0 ? `Failed to import ${errorCount} campaign(s).` : ""
          }`,
          variant: "default",
        });

        // Navigate back to campaigns list after successful import
        setTimeout(() => {
          navigate("/campaigns/list");
        }, 1500);
      } else {
        toast({
          title: "Import Failed",
          description: `Failed to import all campaigns. ${errorMessages
            .slice(0, 3)
            .join("; ")}${errorMessages.length > 3 ? "..." : ""}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      setError(error.message || "Failed to upload file. Please try again.");
      toast({
        title: "Import Failed",
        description: error.message || "Failed to import campaigns.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  // Parse file data to extract campaigns
  const parseFileData = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target.result;
          const lines = content.split("\n").filter((line) => line.trim());

          if (lines.length < 2) {
            reject(new Error("File is empty or has no data rows."));
            return;
          }

          const headers = lines[0]
            .split(",")
            .map((h) => h.trim().replace(/"/g, ""));

          const campaigns = lines
            .slice(1)
            .filter((line) => line.trim())
            .map((line) => {
              const values = line
                .split(",")
                .map((v) => v.trim().replace(/"/g, ""));
              const row = {};
              headers.forEach((header, index) => {
                row[header] = values[index] || "";
              });

              // Map CSV columns to campaign object according to backend schema
              // Check if required fields exist
              if (!row["Campaign Name"]) {
                return null; // Skip campaigns without name
              }

              // Validate campaign type
              const validTypes = [
                "Email",
                "Telemarketing",
                "Webinar",
                "Conference",
                "Trade Show",
                "Advertisement",
                "Social Media",
                "Direct Mail",
                "Partnership",
                "Other",
              ];
              const campaignType = row["Type"] || "Email";
              const finalType = validTypes.includes(campaignType)
                ? campaignType
                : "Email";

              // Validate status
              const validStatuses = [
                "Planning",
                "Active",
                "Completed",
                "Inactive",
                "Cancelled",
              ];
              const campaignStatus = row["Status"] || "Planning";
              const finalStatus = validStatuses.includes(campaignStatus)
                ? campaignStatus
                : "Planning";

              // Parse dates using helper function
              const startDate = parseDate(row["Start Date"]);
              const endDate = parseDate(row["End Date"]);

              // Parse numbers with better error handling
              const parseNumber = (value, defaultValue = 0) => {
                if (!value || value.trim() === "") return defaultValue;
                const num = parseFloat(value);
                return isNaN(num) ? defaultValue : num;
              };

              const expectedRevenue = parseNumber(row["Expected Revenue"]);
              const budgetedCost = parseNumber(row["Budgeted Cost"]);
              const actualCost = parseNumber(row["Actual Cost"]);
              const expectedResponse = parseNumber(
                row["Expected Response (%)"]
              );
              const numbersSent = parseInt(row["Numbers Sent"]) || 0;

              // Build campaign object according to backend schema
              return {
                campaignOwner: row["Campaign Owner"] || "Current User",
                campaignName: row["Campaign Name"],
                type: finalType,
                status: finalStatus,
                startDate: startDate,
                endDate: endDate,
                budgetedCost: budgetedCost,
                actualCost: actualCost,
                expectedRevenue: expectedRevenue,
                expectedResponse: expectedResponse,
                numbersSent: numbersSent,
                goal: row["Goal"] || "",
                targetAudience: row["Target Audience"] || "",
                description: row["Description"] || "",
                // Initialize empty arrays as per backend model
                members: [],
                activities: [],
                // Add other default fields if needed
                createdBy: "System",
                isArchived: false,
                tags: [],
              };
            })
            .filter((campaign) => campaign !== null); // Remove null entries

          console.log("Parsed campaigns count:", campaigns.length);
          console.log("First campaign:", campaigns[0]);
          resolve(campaigns);
        } catch (error) {
          console.error("Parse error details:", error);
          reject(
            new Error(
              `Error parsing file: ${error.message}. Please check the format.`
            )
          );
        }
      };

      reader.onerror = () => {
        reject(new Error("Error reading file."));
      };

      reader.readAsText(file);
    });
  };

  // Clear selected file
  const clearFile = () => {
    setSelectedFile(null);
    setFileName("");
    setPreviewData([]);
    setError("");
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full bg-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold">Import Campaigns</h1>
            <p className="text-gray-600 mt-2">
              Upload a CSV or Excel file to import multiple campaigns at once.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate("/campaigns/list")}
            disabled={uploading}
          >
            Cancel
          </Button>
        </div>

        {/* Download Sample Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-full">
              <Download className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                Download Sample File
              </h3>
              <p className="text-blue-700 mb-4">
                Download our template to see the correct format for importing
                campaigns. Make sure your file follows the same structure.
              </p>
              <Button
                onClick={downloadSampleFile}
                variant="outline"
                className="border-blue-300 text-blue-700 hover:bg-blue-100"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Template (CSV)
              </Button>
            </div>
          </div>
        </div>

        {/* File Upload Section */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FileSpreadsheet className="w-8 h-8 text-gray-600" />
            </div>

            <h3 className="text-lg font-semibold mb-2">
              {selectedFile ? "File Selected" : "Upload Your Campaigns File"}
            </h3>

            <p className="text-gray-600 mb-6">
              {selectedFile
                ? `Ready to import campaigns from "${fileName}"`
                : "Select a CSV or Excel file containing your campaigns data"}
            </p>

            {!selectedFile ? (
              <div className="space-y-4">
                {/* File Input - Now properly connected */}
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="file-upload"
                />

                <div>
                  <Button
                    onClick={handleBrowseClick}
                    className="cursor-pointer bg-[#4667d8] hover:bg-[#3c59c0]"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Browse Files
                  </Button>
                </div>

                <p className="text-sm text-gray-500 mt-2">
                  Supported formats: CSV, Excel (.xlsx, .xls)
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <FileSpreadsheet className="w-8 h-8 text-gray-600" />
                  <div className="flex-1 text-left">
                    <p className="font-medium">{fileName}</p>
                    <p className="text-sm text-gray-500">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFile}
                    className="text-gray-500 hover:text-red-600"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* File Preview */}
                {previewData.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-medium mb-3">
                      File Preview (First 5 rows)
                    </h4>
                    <div className="overflow-x-auto border rounded-lg">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr>
                            {Object.keys(previewData[0] || {}).map((header) => (
                              <th
                                key={header}
                                className="text-left p-3 font-medium text-gray-700 border-b"
                              >
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {previewData.map((row, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              {Object.values(row).map((value, cellIndex) => (
                                <td
                                  key={cellIndex}
                                  className="p-3 border-b text-gray-600"
                                >
                                  {value || "-"}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Showing first {previewData.length} rows
                    </p>
                  </div>
                )}

                <div className="flex gap-3 justify-center">
                  <Button
                    variant="outline"
                    onClick={clearFile}
                    disabled={uploading}
                  >
                    Choose Different File
                  </Button>
                  <Button
                    onClick={handleUpload}
                    disabled={uploading}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Importing...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Import Campaigns
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-gray-50 border rounded-lg p-6">
          <h3 className="font-semibold text-lg mb-4">Import Instructions</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mt-0.5">
                1
              </div>
              <div>
                <p className="font-medium">Download the template</p>
                <p className="text-gray-600 text-sm">
                  Use our template to ensure your data is in the correct format.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mt-0.5">
                2
              </div>
              <div>
                <p className="font-medium">Fill in your campaign data</p>
                <p className="text-gray-600 text-sm">
                  Add your campaign information following the template format.
                  Required fields: Campaign Name, Type, Status.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mt-0.5">
                3
              </div>
              <div>
                <p className="font-medium">Upload your file</p>
                <p className="text-gray-600 text-sm">
                  Select your CSV or Excel file and click "Import Campaigns".
                  The system will validate and import your data.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mt-0.5">
                4
              </div>
              <div>
                <p className="font-medium">Review imported campaigns</p>
                <p className="text-gray-600 text-sm">
                  After import, check your campaigns list to verify all data was
                  imported correctly.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Required Fields Info */}
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-medium text-yellow-800 mb-2">Important Notes:</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>
              • <strong>Campaign Name</strong> is required for all campaigns
            </li>
            <li>• Dates should be in YYYY-MM-DD format (e.g., 2024-12-31)</li>
            <li>• Campaign Owner format: "Name (email@example.com)"</li>
            <li>• Financial fields (Revenue, Cost) should be numbers only</li>
            <li>• Expected Response should be a percentage (0-100)</li>
            <li>
              • Status must be one of: Planning, Active, Completed, Inactive,
              Cancelled
            </li>
            <li>
              • Type must be one of: Email, Telemarketing, Webinar, Conference,
              Trade Show, Advertisement, Social Media, Direct Mail, Partnership,
              Other
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ImportCampaigns;
