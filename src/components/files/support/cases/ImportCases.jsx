import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { casesService } from "./casesService";
import { Loader2, Download, Upload, FileSpreadsheet, X } from "lucide-react";

const ImportCases = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [fileName, setFileName] = useState("");
    const [previewData, setPreviewData] = useState([]);
    const [error, setError] = useState("");
    const fileInputRef = React.useRef(null);

    // Sample Excel file data structure for Cases
    const sampleData = [
        {
            "Subject": "Login Issue",
            "Status": "New",
            "Priority": "High",
            "Type": "Problem",
            "Case Origin": "Email",
            "Case Reason": "New Problem",
            "Description": "User cannot login to the dashboard.",
            "Product Name": "CRM Cloud",
            "Internal Comments": "Escalated to L2 support",
            "Solution": "",
            "Account Name": "Acme Corp",
            "Email": "john@acme.com",
            "Phone": "555-0123",
            "Case Owner": "System",
        },
        {
            "Subject": "Feature Request: Dark Mode",
            "Status": "In Progress",
            "Priority": "Medium",
            "Type": "Feature Request",
            "Case Origin": "Web",
            "Case Reason": "-None-",
            "Description": "Customer wants dark mode support.",
            "Product Name": "Mobile App",
            "Internal Comments": "Added to backlog",
            "Solution": "",
            "Account Name": "Globex Inc",
            "Email": "jane@globex.com",
            "Phone": "555-0199",
            "Case Owner": "System",
        },
    ];

    // Download sample Excel file
    const downloadSampleFile = () => {
        const headers = Object.keys(sampleData[0]);
        const csvContent = [
            headers.join(","),
            ...sampleData.map((row) =>
                headers
                    .map((header) => {
                        const value = row[header];
                        if (typeof value === "string" && value.includes(",")) {
                            return `"${value}"`;
                        }
                        return value;
                    })
                    .join(",")
            ),
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "cases_import_template.csv");
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        toast({
            title: "Sample file downloaded",
            description: "Check the CSV file for the required format.",
        });
    };

    const handleBrowseClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (!file) return;

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

                const data = lines
                    .slice(1, Math.min(6, lines.length))
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
            const cases = await parseFileData(selectedFile);

            if (cases.length === 0) {
                throw new Error("No valid cases found in the file.");
            }

            console.log("Parsed cases:", cases);

            let successCount = 0;
            let errorCount = 0;
            const errorMessages = [];

            for (const caseItem of cases) {
                try {
                    console.log("Creating case:", caseItem.subject);
                    const result = await casesService.createCase(caseItem);
                    if (result.success) {
                        successCount++;
                    } else {
                        errorCount++;
                        errorMessages.push(`${caseItem.subject}: ${result.message}`);
                    }
                } catch (error) {
                    errorCount++;
                    errorMessages.push(`${caseItem.subject}: ${error.message}`);
                }
            }

            if (successCount > 0) {
                toast({
                    title: "Import Completed",
                    description: `Successfully imported ${successCount} case(s). ${errorCount > 0 ? `Failed to import ${errorCount} case(s).` : ""
                        }`,
                    variant: "default",
                });

                setTimeout(() => {
                    navigate("/cases");
                }, 1500);
            } else {
                toast({
                    title: "Import Failed",
                    description: `Failed to import all cases. ${errorMessages
                        .slice(0, 3)
                        .join("; ")}${errorMessages.length > 3 ? "..." : ""}`,
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Upload error:", error);
            setError(error.message || "Failed to upload file. Please try again.");
        } finally {
            setUploading(false);
        }
    };

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

                    const cases = lines
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

                            if (!row["Subject"]) {
                                return null;
                            }

                            // Validate/Default Enums
                            const validStatuses = ["New", "In Progress", "Waiting on Customer", "Resolved", "Closed"];
                            const status = validStatuses.includes(row["Status"]) ? row["Status"] : "New";

                            const validPriorities = ["-None-", "High", "Medium", "Low"];
                            const priority = validPriorities.includes(row["Priority"]) ? row["Priority"] : "Medium";

                            const validTypes = ["-None-", "Problem", "Feature Request", "Question"];
                            const type = validTypes.includes(row["Type"]) ? row["Type"] : "-None-";

                            const validOrigins = ["-None-", "Email", "Phone", "Web", "Social Media"];
                            const origin = validOrigins.includes(row["Case Origin"]) ? row["Case Origin"] : "-None-";

                            return {
                                subject: row["Subject"],
                                status: status,
                                priority: priority,
                                type: type,
                                caseOrigin: origin,
                                description: row["Description"] || "",
                                productName: row["Product Name"] || "",
                                internalComments: row["Internal Comments"] || "",
                                solution: row["Solution"] || "",
                                accountName: row["Account Name"] || "",
                                email: row["Email"] || "",
                                phone: row["Phone"] || "",
                                caseOwner: row["Case Owner"] || "System",
                                caseReason: row["Case Reason"] || "-None-",
                                // Defaults
                                relatedToType: "account",
                            };
                        })
                        .filter((c) => c !== null);

                    resolve(cases);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => reject(new Error("Error reading file."));
            reader.readAsText(file);
        });
    };

    const clearFile = () => {
        setSelectedFile(null);
        setFileName("");
        setPreviewData([]);
        setError("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="w-full bg-white p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-semibold">Import Cases</h1>
                        <p className="text-gray-600 mt-2">
                            Upload a CSV or Excel file to import multiple cases at once.
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => navigate("/cases")}
                        disabled={uploading}
                    >
                        Cancel
                    </Button>
                </div>

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
                                cases. Make sure your file follows the same structure.
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

                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-8">
                    <div className="text-center">
                        <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <FileSpreadsheet className="w-8 h-8 text-gray-600" />
                        </div>

                        <h3 className="text-lg font-semibold mb-2">
                            {selectedFile ? "File Selected" : "Upload Your Cases File"}
                        </h3>

                        <p className="text-gray-600 mb-6">
                            {selectedFile
                                ? `Ready to import cases from "${fileName}"`
                                : "Select a CSV or Excel file containing your cases data"}
                        </p>

                        {!selectedFile ? (
                            <div className="space-y-4">
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
                                                Import Cases
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}
                </div>

                {/* Instructions */}
                <div className="bg-gray-50 border rounded-lg p-6">
                    <h3 className="font-semibold text-lg mb-4">Import Instructions</h3>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-gray-600">
                        <li><strong>Subject</strong> is required.</li>
                        <li>Status should be one of: New, In Progress, Waiting on Customer, Resolved, Closed.</li>
                        <li>Priority should be: High, Medium, Low.</li>
                        <li>Type should be: Problem, Feature Request, Question.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ImportCases;
