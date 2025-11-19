import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  DollarSign, 
  Target, 
  Calendar, 
  User, 
  Building, 
  Mail,
  X 
} from 'lucide-react';
import { useData } from '@/contexts/DataContext';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';

const DealForm = ({ onSuccess, onCancel, initialData }) => {
  const { addDataItem, updateDataItem, data } = useData();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    contactId: '',
    accountId: '',
    value: '',
    probability: 0,
    stage: 'qualification',
    closeDate: '',
    owner: '',
    description: '',
    leadSource: '',
    industry: '',
    tags: [],
    sourceLeadId: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        closeDate: initialData.closeDate ? initialData.closeDate.split('T')[0] : '',
        value: initialData.value || '',
        probability: initialData.probability || 0
      }));
    } else {
      // Set default values for new deal
      const defaultCloseDate = new Date();
      defaultCloseDate.setDate(defaultCloseDate.getDate() + 30);
      
      setFormData(prev => ({
        ...prev,
        owner: user?.name || 'Current User',
        closeDate: defaultCloseDate.toISOString().split('T')[0],
        probability: 20
      }));
    }
  }, [initialData, user]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.title || !formData.company) {
        toast({
          title: "Validation Error",
          description: "Title and Company are required fields.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      const dealData = {
        ...formData,
        value: parseFloat(formData.value) || 0,
        probability: parseInt(formData.probability) || 0,
        closeDate: new Date(formData.closeDate).toISOString(),
        contactName: data.contacts.find(c => c.id === formData.contactId)?.name || '',
        accountName: data.accounts.find(a => a.id === formData.accountId)?.name || '',
        updatedAt: new Date().toISOString()
      };

      if (initialData) {
        // Update existing deal
        updateDataItem('deals', initialData.id, dealData, initialData.stage);
        onSuccess(dealData);
      } else {
        // Create new deal
        const newDeal = {
          id: `deal_${Date.now()}`,
          ...dealData,
          createdAt: new Date().toISOString(),
        };
        addDataItem('deals', newDeal, formData.stage);
        onSuccess(newDeal);
      }

      toast({
        title: initialData ? "Success" : "Success",
        description: initialData ? "Deal updated successfully" : "Deal created successfully",
      });

    } catch (error) {
      toast({
        title: "Error",
        description: initialData ? "Failed to update deal" : "Failed to create deal",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStageColor = (stage) => {
    const colors = {
      'qualification': 'bg-blue-100 text-blue-800',
      'needs-analysis': 'bg-purple-100 text-purple-800',
      'value-proposition': 'bg-indigo-100 text-indigo-800',
      'identify-decision-makers': 'bg-yellow-100 text-yellow-800',
      'proposal-price-quote': 'bg-orange-100 text-orange-800',
      'negotiation-review': 'bg-red-100 text-red-800',
      'closed-won': 'bg-green-100 text-green-800',
      'closed-lost': 'bg-gray-100 text-gray-800',
      'closed-lost-to-competition': 'bg-gray-100 text-gray-800'
    };
    return colors[stage] || 'bg-gray-100 text-gray-800';
  };

  const stageOptions = [
    { value: 'qualification', label: 'Qualification' },
    { value: 'needs-analysis', label: 'Needs Analysis' },
    { value: 'value-proposition', label: 'Value Proposition' },
    { value: 'identify-decision-makers', label: 'Identify Decision Makers' },
    { value: 'proposal-price-quote', label: 'Proposal/Price Quote' },
    { value: 'negotiation-review', label: 'Negotiation/Review' },
    { value: 'closed-won', label: 'Closed Won' },
    { value: 'closed-lost', label: 'Closed Lost' },
    { value: 'closed-lost-to-competition', label: 'Closed Lost to Competition' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Deal Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Deal Title *</label>
            <Input
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="e.g., Enterprise Software License"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Company *</label>
            <Select value={formData.company} onValueChange={(value) => handleChange('company', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Company" />
              </SelectTrigger>
              <SelectContent>
                {data.accounts?.map(account => (
                  <SelectItem key={account.id} value={account.name}>
                    {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Contact</label>
            <Select value={formData.contactId} onValueChange={(value) => handleChange('contactId', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Contact" />
              </SelectTrigger>
              <SelectContent>
                {data.contacts?.map(contact => (
                  <SelectItem key={contact.id} value={contact.id}>
                    {contact.name} ({contact.company || contact.accountName})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Deal Owner</label>
            <Input
              value={formData.owner}
              onChange={(e) => handleChange('owner', e.target.value)}
              placeholder="Deal owner"
            />
          </div>
        </div>
      </div>

      {/* Deal Details */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <DollarSign className="w-5 h-5 mr-2" />
          Deal Details
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium">Deal Value ($)</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="number"
                value={formData.value}
                onChange={(e) => handleChange('value', e.target.value)}
                placeholder="0.00"
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Probability (%)</label>
            <div className="relative">
              <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="number"
                min="0"
                max="100"
                value={formData.probability}
                onChange={(e) => handleChange('probability', e.target.value)}
                placeholder="0"
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Expected Close Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="date"
                value={formData.closeDate}
                onChange={(e) => handleChange('closeDate', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="text-sm font-medium">Stage</label>
            <Select value={formData.stage} onValueChange={(value) => handleChange('stage', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {stageOptions.map(stage => (
                  <SelectItem key={stage.value} value={stage.value}>
                    <div className="flex items-center">
                      <Badge className={`mr-2 ${getStageColor(stage.value)}`}>
                        {stage.label}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Lead Source</label>
            <Select value={formData.leadSource} onValueChange={(value) => handleChange('leadSource', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Website">Website</SelectItem>
                <SelectItem value="Referral">Referral</SelectItem>
                <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                <SelectItem value="Advertisement">Advertisement</SelectItem>
                <SelectItem value="Cold Call">Cold Call</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Tags</h3>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              placeholder="Add a tag..."
              className="flex-1"
            />
            <Button type="button" onClick={handleAddTag} variant="outline">
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {tag}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => handleRemoveTag(tag)}
                />
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Description</h3>
        <Textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Describe the deal, requirements, and next steps..."
          rows={4}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loading ? 'Saving...' : (initialData ? 'Update Deal' : 'Create Deal')}
        </Button>
      </div>
    </form>
  );
};

export default DealForm;