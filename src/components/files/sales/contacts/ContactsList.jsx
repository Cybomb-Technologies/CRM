import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MoreVertical, Mail, Phone, Building2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { useData } from "@/contexts/DataContext";

const ContactsList = () => {
  const { data, updateData } = useData();
  const [contacts, setContacts] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    setContacts(data.contacts);
  }, [data.contacts]);

  const handleAction = (action, contact) => {
    if (action === "Delete") {
      const contactId = contact._id || contact.id;
      const updatedContacts = contacts.filter(
        (c) => (c._id || c.id) !== contactId
      );
      updateData("contacts", updatedContacts);
      toast({
        title: "Contact Deleted",
        description: `${
          contact.name || `${contact.firstName} ${contact.lastName}`
        } has been removed.`,
      });
    } else {
      toast({
        title: action,
        description: `🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀`,
      });
    }
  };

  if (!contacts || contacts.length === 0) {
    return (
      <p className="text-center text-muted-foreground">
        No contacts found. Create one to get started!
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {contacts.map((contact, index) => {
        const contactId = contact._id || contact.id;
        const contactName =
          contact.name || `${contact.firstName} ${contact.lastName}`;

        return (
          <motion.div
            key={contactId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground">
                    {contactName}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {contact.title || contact.role || ""}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Building2 className="w-4 h-4 mr-2" />
                      {contact.accountName || contact.company || "No Account"}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Mail className="w-4 h-4 mr-2" />
                      {contact.email || "No email"}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Phone className="w-4 h-4 mr-2" />
                      {contact.phone || "No phone"}
                    </div>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleAction("View", contact)}
                    >
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleAction("Edit", contact)}
                    >
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleAction("Delete", contact)}
                      className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/40"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ContactsList;
