
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Play, Plus, Trash2, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks';

const WorkflowBuilderPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [workflowName, setWorkflowName] = useState(id ? `Workflow ${id}` : 'New Workflow');
    const [trigger, setTrigger] = useState('');
    const [actions, setActions] = useState([]);

    const handleAddAction = () => {
        setActions([...actions, { type: '', value: '' }]);
    };
    
    const handleRemoveAction = (index) => {
        setActions(actions.filter((_, i) => i !== index));
    };

    const handleActionChange = (index, field, value) => {
        const newActions = [...actions];
        newActions[index][field] = value;
        setActions(newActions);
    };
    
    const handleSave = () => {
        toast({ title: 'Workflow Saved', description: 'Your workflow has been saved successfully.' });
        navigate('/workflows');
    };

    return (
        <>
            <Helmet>
                <title>{workflowName} - Workflow Builder</title>
                <meta name="description" content="Build and automate your workflows" />
            </Helmet>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <Button variant="outline" onClick={() => navigate('/workflows')}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Workflows
                    </Button>
                    <div className="flex items-center space-x-3">
                        <Button variant="secondary">
                            <Play className="w-4 h-4 mr-2" /> Test
                        </Button>
                        <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                            Save Workflow
                        </Button>
                    </div>
                </div>

                <Input
                    value={workflowName}
                    onChange={(e) => setWorkflowName(e.target.value)}
                    className="text-2xl font-bold h-12 p-2 border-0 shadow-none focus-visible:ring-0"
                    placeholder="Enter Workflow Name"
                />

                <div className="flex flex-col items-center space-y-4">
                    {/* Trigger */}
                    <Card className="w-full max-w-2xl">
                        <CardHeader>
                            <CardTitle>1. When this happens... (Trigger)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Select value={trigger} onValueChange={setTrigger}>
                                <SelectTrigger><SelectValue placeholder="Select a trigger" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="lead.created">New Lead is Created</SelectItem>
                                    <SelectItem value="deal.stage.changed">Deal Stage Changes</SelectItem>
                                    <SelectItem value="ticket.created">New Ticket is Created</SelectItem>
                                </SelectContent>
                            </Select>
                        </CardContent>
                    </Card>

                    <ArrowRight className="text-muted-foreground" />

                    {/* Actions */}
                    <Card className="w-full max-w-2xl">
                        <CardHeader>
                            <CardTitle>2. Do this... (Actions)</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {actions.map((action, index) => (
                                <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg">
                                    <Select value={action.type} onValueChange={(val) => handleActionChange(index, 'type', val)}>
                                        <SelectTrigger><SelectValue placeholder="Select an action" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="send.email">Send Email</SelectItem>
                                            <SelectItem value="create.task">Create Task</SelectItem>
                                            <SelectItem value="update.field">Update Field</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Input
                                        placeholder="Value / Details"
                                        value={action.value}
                                        onChange={(e) => handleActionChange(index, 'value', e.target.value)}
                                    />
                                    <Button variant="ghost" size="icon" onClick={() => handleRemoveAction(index)}>
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </Button>
                                </div>
                            ))}
                            <Button variant="outline" onClick={handleAddAction}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add Action
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default WorkflowBuilderPage;
