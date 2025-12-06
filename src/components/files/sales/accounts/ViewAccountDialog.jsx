// src/components/accounts/ViewAccountDialog.jsx
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Globe,
  Phone,
  Mail,
  MapPin,
  Users,
  Calendar,
  IndianRupee,
} from "lucide-react";

const ViewAccountDialog = ({ open, onOpenChange, account }) => {
  if (!account) return null;

  const getTypeColor = (type) => {
    switch (type) {
      case "Customer":
        return "bg-green-100 text-green-800";
      case "Partner":
        return "bg-blue-100 text-blue-800";
      case "Vendor":
        return "bg-purple-100 text-purple-800";
      case "Prospect":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Account Details</span>
            <Badge className={getTypeColor(account.type)}>
              {account.type || "Other"}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex items-start gap-4 pb-6 border-b">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
              <Building2 className="w-10 h-10 text-gray-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{account.name}</h2>
              <p className="text-gray-600">{account.industry}</p>
              {account.website && (
                <a
                  href={account.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {account.website}
                </a>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Building2 className="w-5 h-5 mr-2" />
                Account Information
              </h3>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{account.email || "Not specified"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span>{account.phone || "Not specified"}</span>
                </div>
                {account.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-400" />
                    <a
                      href={account.website}
                      className="text-blue-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {account.website}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span>{account.contacts || 0} contacts</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <IndianRupee className="w-5 h-5 mr-2" />
                Business Information
              </h3>

              <div className="space-y-3">
                <div>
                  <strong>Industry:</strong>{" "}
                  {account.industry || "Not specified"}
                </div>
                <div>
                  <strong>Employees:</strong>{" "}
                  {account.employees || "Not specified"}
                </div>
                <div>
                  <strong>Annual Revenue:</strong>{" "}
                  {account.annualRevenue
                    ? `₹${(account.annualRevenue / 10000000).toFixed(1)} Cr`
                    : "Not specified"}
                </div>
                <div>
                  <strong>Account Type:</strong>{" "}
                  {account.type || "Not specified"}
                </div>
              </div>
            </div>
          </div>

          {/* Address Information */}
          {(account.billingAddress?.street ||
            account.shippingAddress?.street) && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Address Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {account.billingAddress?.street && (
                  <div>
                    <h4 className="font-semibold mb-2">Billing Address</h4>
                    <div className="space-y-1 text-sm">
                      <div>{account.billingAddress.street}</div>
                      <div>
                        {account.billingAddress.city},{" "}
                        {account.billingAddress.state}{" "}
                        {account.billingAddress.zipCode}
                      </div>
                      <div>{account.billingAddress.country}</div>
                    </div>
                  </div>
                )}

                {account.shippingAddress?.street && (
                  <div>
                    <h4 className="font-semibold mb-2">Shipping Address</h4>
                    <div className="space-y-1 text-sm">
                      <div>{account.shippingAddress.street}</div>
                      <div>
                        {account.shippingAddress.city},{" "}
                        {account.shippingAddress.state}{" "}
                        {account.shippingAddress.zipCode}
                      </div>
                      <div>{account.shippingAddress.country}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Description */}
          {account.description && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Description</h3>
              <p className="text-gray-700 whitespace-pre-wrap">
                {account.description}
              </p>
            </div>
          )}

          {/* System Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
            <div className="space-y-2">
              <h4 className="font-semibold flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                System Information
              </h4>
              <div>
                <strong>Created:</strong>{" "}
                {new Date(account.createdAt).toLocaleString()}
              </div>
              <div>
                <strong>Last Updated:</strong>{" "}
                {new Date(account.updatedAt).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewAccountDialog;
