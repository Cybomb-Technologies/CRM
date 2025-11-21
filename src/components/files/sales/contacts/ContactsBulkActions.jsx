// src/components/contacts/ContactsBulkActions.jsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  MoreHorizontal, 
  Trash2, 
  Edit, 
  Send, 
  Download, 
  Tag,
  Users,
  Mail
} from 'lucide-react';

const ContactsBulkActions = ({ 
  selectedContacts, 
  onBulkDelete, 
  onBulkUpdate
}) => {
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [updateData, setUpdateData] = useState({
    department: '',
    leadSource: ''
  });
  const [emailData, setEmailData] = useState({
    subject: '',
    message: ''
  });

  const handleBulkUpdate = () => {
    const updates = {};
    if (updateData.department) updates.department = updateData.department;
    if (updateData.leadSource) updates.leadSource = updateData.leadSource;
    
    onBulkUpdate(selectedContacts, updates);
    setShowUpdateDialog(false);
    setUpdateData({ department: '', leadSource: '' });
  };

  const handleMassEmail = () => {
    // Implement mass email functionality
    console.log('Sending mass email to:', selectedContacts, emailData);
    setShowEmailDialog(false);
    setEmailData({ subject: '', message: '' });
  };

  if (selectedContacts.length === 0) return null;

  return (
    <>
      <div className="flex items-center gap-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <span className="text-sm text-blue-800">
          {selectedContacts.length} contact(s) selected
        </span>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="w-4 h-4 mr-2" />
              Bulk Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 max-h-80 overflow-y-auto">
            {/* Mass Update */}
            <DropdownMenuItem onClick={() => setShowUpdateDialog(true)}>
              <Edit className="w-4 h-4 mr-2" />
              Mass Update
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Manage Tags */}
            <DropdownMenuItem onClick={() => console.log('Manage tags')}>
              <Tag className="w-4 h-4 mr-2" />
              Manage Tags
            </DropdownMenuItem>

            {/* Mass Email */}
            <DropdownMenuItem onClick={() => setShowEmailDialog(true)}>
              <Send className="w-4 h-4 mr-2" />
              Mass Email
            </DropdownMenuItem>

            {/* Add to Campaign */}
            

            <DropdownMenuSeparator />

            {/* Export */}
            <DropdownMenuItem onClick={() => console.log('Export contacts')}>
              <Download className="w-4 h-4 mr-2" />
              Export Contacts
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Destructive Actions */}
            <DropdownMenuItem 
              onClick={() => onBulkDelete(selectedContacts)}
              className="text-red-600"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Mass Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button 
          variant="outline" 
          size="sm"
          onClick={() => onBulkDelete(selectedContacts)}
          className="text-red-600 border-red-200 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete Selected
        </Button>
      </div>

      {/* Mass Update Dialog */}
      <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mass Update Contacts</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Department</Label>
              <Select value={updateData.department} onValueChange={(value) => setUpdateData(prev => ({ ...prev, department: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  <SelectItem value="Administration">Administration</SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Human Resources">Human Resources</SelectItem>
                  <SelectItem value="IT">IT</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Operations">Operations</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="Support">Support</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Lead Source</Label>
              <Select value={updateData.leadSource} onValueChange={(value) => setUpdateData(prev => ({ ...prev, leadSource: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  <SelectItem value="Advertisement">Advertisement</SelectItem>
                  <SelectItem value="Cold Call">Cold Call</SelectItem>
                  <SelectItem value="Employee Referral">Employee Referral</SelectItem>
                  <SelectItem value="External Referral">External Referral</SelectItem>
                  <SelectItem value="Online Store">Online Store</SelectItem>
                  <SelectItem value="Partner">Partner</SelectItem>
                  <SelectItem value="Public Relations">Public Relations</SelectItem>
                  <SelectItem value="Sales Email">Sales Email</SelectItem>
                  <SelectItem value="Seminar">Seminar</SelectItem>
                  <SelectItem value="Trade Show">Trade Show</SelectItem>
                  <SelectItem value="Web Download">Web Download</SelectItem>
                  <SelectItem value="Web Research">Web Research</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUpdateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkUpdate}>
              Update {selectedContacts.length} Contacts
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mass Email Dialog */}
      <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Mass Email</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Subject</Label>
              <Input 
                value={emailData.subject}
                onChange={(e) => setEmailData(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Email subject"
              />
            </div>
            <div>
              <Label>Message</Label>
              <textarea 
                value={emailData.message}
                onChange={(e) => setEmailData(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Email message"
                className="w-full h-32 p-2 border rounded-md resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEmailDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleMassEmail}>
              <Mail className="w-4 h-4 mr-2" />
              Send to {selectedContacts.length} Contacts
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContactsBulkActions;