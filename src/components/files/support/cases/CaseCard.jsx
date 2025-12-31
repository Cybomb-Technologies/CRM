import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  User,
  Building,
  Target,
  FileText,
  Phone,
  Mail,
  Edit,
  Trash2,
  CheckCircle,
  MoreVertical,
  Calendar,
  Clock,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function CaseCard({ caseItem, onEdit, onResolve, onDelete }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "New":
        return "bg-blue-100 text-blue-800";
      case "In Progress":
        return "bg-yellow-100 text-yellow-800";
      case "Waiting on Customer":
        return "bg-orange-100 text-orange-800";
      case "Resolved":
        return "bg-green-100 text-green-800";
      case "Closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "destructive";
      case "Medium":
        return "default";
      case "Low":
        return "secondary";
      default:
        return "default";
    }
  };

  const getRelatedToIcon = (type) => {
    switch (type) {
      case "deal":
        return <Target className="w-4 h-4" />;
      case "account":
        return <Building className="w-4 h-4" />;
      case "contact":
        return <User className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className="flex flex-col items-center mt-1">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-semibold text-lg">{caseItem.subject}</h3>
                <Badge variant={getPriorityColor(caseItem.priority)}>
                  {caseItem.priority}
                </Badge>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    caseItem.status
                  )}`}
                >
                  {caseItem.status}
                </span>
                {caseItem.type && caseItem.type !== "-None-" && (
                  <Badge variant="outline">{caseItem.type}</Badge>
                )}
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                <div className="flex items-center">
                  <span className="font-medium mr-1">Case #:</span>
                  {caseItem.caseNumber}
                </div>
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  {caseItem.caseOwner || caseItem.owner}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {formatDate(caseItem.createdAt || caseItem.createdDate)}
                </div>
              </div>

              <p className="text-gray-600 mb-3">{caseItem.description}</p>

              {/* Case Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    <strong>Product:</strong>
                    <span>{caseItem.productName || "Not specified"}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <strong>Origin:</strong>
                    <span>{caseItem.caseOrigin || "Not specified"}</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-2">
                    {getRelatedToIcon(caseItem.relatedToType)}
                    <strong>Related To:</strong>
                    <span>{caseItem.relatedTo || "Not specified"}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <strong>Account:</strong>
                    <span>{caseItem.accountName || "Not specified"}</span>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              {(caseItem.reportedBy || caseItem.email || caseItem.phone) && (
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Contact Information</h4>
                  <div className="flex items-center space-x-4 text-sm">
                    {caseItem.reportedBy && (
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {caseItem.reportedBy}
                      </div>
                    )}
                    {caseItem.email && (
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        {caseItem.email}
                      </div>
                    )}
                    {caseItem.phone && (
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-1" />
                        {caseItem.phone}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Internal Comments */}
              {caseItem.internalComments && (
                <div className="mt-3">
                  <h4 className="font-medium mb-1">Internal Comments</h4>
                  <p className="text-sm text-gray-600 bg-yellow-50 p-2 rounded">
                    {caseItem.internalComments}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit && onEdit(caseItem)}
            >
              <Edit className="w-4 h-4" />
            </Button>
            {caseItem.status !== "Resolved" && caseItem.status !== "Closed" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onResolve && onResolve(caseItem)}
              >
                <CheckCircle className="w-4 h-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete && onDelete(caseItem)}
            >
              <Trash2 className="w-4 h-4" />
            </Button> */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => onEdit && onEdit(caseItem)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              {caseItem.status !== "Resolved" && caseItem.status !== "Closed" && (
                <DropdownMenuItem onClick={() => onResolve && onResolve(caseItem)}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Resolve
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete && onDelete(caseItem)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
