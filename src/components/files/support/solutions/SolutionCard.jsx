import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileText,
  User,
  Calendar,
  Eye,
  ThumbsUp,
  Link,
  Edit,
  Trash2,
  MoreVertical,
  Package,
} from "lucide-react";

export function SolutionCard({ solution, onEdit, onDelete, onPublish }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Published":
        return "bg-green-100 text-green-800";
      case "Draft":
        return "bg-yellow-100 text-yellow-800";
      case "Review":
        return "bg-blue-100 text-blue-800";
      case "Archived":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className="flex flex-col items-center mt-1">
              <FileText className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-semibold text-lg">
                  {solution.solutionTitle}
                </h3>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    solution.status
                  )}`}
                >
                  {solution.status}
                </span>
                <Badge variant="outline">{solution.solutionNumber}</Badge>
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                <div className="flex items-center">
                  <Package className="w-4 h-4 mr-1" />
                  {solution.productName}
                </div>
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  {solution.owner}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {formatDate(solution.updatedDate)}
                </div>
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  {solution.views} views
                </div>
                <div className="flex items-center">
                  <ThumbsUp className="w-4 h-4 mr-1" />
                  {solution.helpful} helpful
                </div>
              </div>

              {/* Question & Answer */}
              <div className="space-y-3 mb-3">
                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-1">
                    Question:
                  </h4>
                  <p className="text-gray-600 bg-blue-50 p-2 rounded text-sm">
                    {solution.question}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-1">
                    Answer:
                  </h4>
                  <p className="text-gray-600 bg-green-50 p-2 rounded text-sm">
                    {solution.answer}
                  </p>
                </div>
              </div>

              {/* Related Cases */}
              {solution.relatedCases && solution.relatedCases.length > 0 && (
                <div className="mt-2">
                  <h4 className="font-medium text-sm text-gray-700 mb-1">
                    Related Cases:
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {solution.relatedCases.map((caseNumber, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        <Link className="w-3 h-3 mr-1" />
                        {caseNumber}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit && onEdit(solution)}
            >
              <Edit className="w-4 h-4" />
            </Button>
            {solution.status === "Draft" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onPublish && onPublish(solution)}
              >
                Publish
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete && onDelete(solution)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
