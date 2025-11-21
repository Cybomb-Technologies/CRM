import React, { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Mail, UserCheck, UserX } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const CampaignMembers = ({ campaign }) => {
  const { leads, contacts, updateDataItem } = useData();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);

  const members = campaign.members || [];

  const handleAddMember = (leadOrContact) => {
    const updatedMembers = [...members, {
      id: leadOrContact.id,
      name: `${leadOrContact.firstName} ${leadOrContact.lastName}`,
      email: leadOrContact.email,
      type: leadOrContact.company ? 'lead' : 'contact',
      company: leadOrContact.company,
      addedDate: new Date().toISOString(),
      responded: false,
      converted: false
    }];

    const updatedCampaign = {
      ...campaign,
      members: updatedMembers,
      updatedAt: new Date().toISOString()
    };

    updateDataItem('campaigns', campaign.id, updatedCampaign);
    
    toast({
      title: "Member Added",
      description: `${leadOrContact.firstName} ${leadOrContact.lastName} has been added to the campaign.`,
    });

    setShowAddDialog(false);
  };

  const handleMarkResponded = (memberId) => {
    const updatedMembers = members.map(member =>
      member.id === memberId ? { ...member, responded: true, respondedDate: new Date().toISOString() } : member
    );

    const updatedCampaign = {
      ...campaign,
      members: updatedMembers,
      updatedAt: new Date().toISOString()
    };

    updateDataItem('campaigns', campaign.id, updatedCampaign);
  };

  const handleMarkConverted = (memberId) => {
    const updatedMembers = members.map(member =>
      member.id === memberId ? { ...member, converted: true, convertedDate: new Date().toISOString() } : member
    );

    const updatedCampaign = {
      ...campaign,
      members: updatedMembers,
      updatedAt: new Date().toISOString()
    };

    updateDataItem('campaigns', campaign.id, updatedCampaign);
  };

  const availableLeads = leads.filter(lead => 
    !members.find(member => member.id === lead.id) && 
    (lead.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     lead.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     lead.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const availableContacts = contacts.filter(contact =>
    !members.find(member => member.id === contact.id) &&
    (contact.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     contact.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
     contact.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Campaign Members</h3>
        <Button onClick={() => setShowAddDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Members
        </Button>
      </div>

      {/* Members List */}
      <div className="border rounded-lg">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-4 font-medium">Name</th>
              <th className="text-left p-4 font-medium">Email</th>
              <th className="text-left p-4 font-medium">Type</th>
              <th className="text-left p-4 font-medium">Company</th>
              <th className="text-left p-4 font-medium">Status</th>
              <th className="text-left p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id} className="border-t hover:bg-gray-50">
                <td className="p-4">{member.name}</td>
                <td className="p-4">{member.email}</td>
                <td className="p-4">
                  <Badge variant={member.type === 'lead' ? 'outline' : 'default'}>
                    {member.type}
                  </Badge>
                </td>
                <td className="p-4">{member.company || '-'}</td>
                <td className="p-4">
                  <div className="flex gap-1">
                    {member.responded && (
                      <Badge className="bg-green-100 text-green-800">
                        Responded
                      </Badge>
                    )}
                    {member.converted && (
                      <Badge className="bg-blue-100 text-blue-800">
                        Converted
                      </Badge>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex gap-2">
                    {!member.responded && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMarkResponded(member.id)}
                      >
                        <Mail className="w-4 h-4 mr-1" />
                        Mark Responded
                      </Button>
                    )}
                    {member.responded && !member.converted && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMarkConverted(member.id)}
                      >
                        <UserCheck className="w-4 h-4 mr-1" />
                        Mark Converted
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {members.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No members added to this campaign yet.</p>
          </div>
        )}
      </div>

      {/* Add Members Dialog */}
      {showAddDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">Add Members to Campaign</h3>
            
            <Input
              placeholder="Search leads and contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mb-4"
            />

            {/* Available Leads */}
            <div className="mb-6">
              <h4 className="font-medium mb-2">Leads ({availableLeads.length})</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {availableLeads.map(lead => (
                  <div key={lead.id} className="flex justify-between items-center p-2 border rounded">
                    <div>
                      <p className="font-medium">{lead.firstName} {lead.lastName}</p>
                      <p className="text-sm text-gray-600">{lead.email} • {lead.company}</p>
                    </div>
                    <Button size="sm" onClick={() => handleAddMember(lead)}>
                      Add
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Available Contacts */}
            <div className="mb-6">
              <h4 className="font-medium mb-2">Contacts ({availableContacts.length})</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {availableContacts.map(contact => (
                  <div key={contact.id} className="flex justify-between items-center p-2 border rounded">
                    <div>
                      <p className="font-medium">{contact.firstName} {contact.lastName}</p>
                      <p className="text-sm text-gray-600">{contact.email} • {contact.accountName}</p>
                    </div>
                    <Button size="sm" onClick={() => handleAddMember(contact)}>
                      Add
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignMembers;