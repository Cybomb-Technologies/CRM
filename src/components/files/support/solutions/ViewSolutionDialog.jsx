import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, User, Calendar, Eye, ThumbsUp, Package } from "lucide-react";

export function ViewSolutionDialog({ open, onOpenChange, solution }) {
  if (!solution) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            {solution.solutionTitle}
          </DialogTitle>
          <DialogDescription>
             Solution #{solution.solutionNumber} • {solution.status}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-500 border-b pb-4">
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

          {/* Question */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">Question</h3>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-gray-700 leading-relaxed">
              {solution.question}
            </div>
          </div>

          {/* Answer */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">Answer</h3>
             <div className="bg-green-50 p-4 rounded-lg border border-green-100 text-gray-800 leading-relaxed whitespace-pre-wrap">
              {solution.answer}
            </div>
          </div>

          {/* Related Cases */}
           {solution.relatedCases && solution.relatedCases.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-700">Related Cases</h3>
              <div className="flex flex-wrap gap-2">
                {solution.relatedCases.map((caseId, idx) => (
                  <Badge key={idx} variant="secondary">
                    {caseId}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
