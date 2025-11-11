import React from 'react';
import { Helmet } from 'react-helmet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useToast, useTheme, useData } from '@/hooks';
import { Moon, Sun, Plus, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

const SettingsPage = () => {
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const { data, updateData } = useData();
  
  const handleSave = (section) => {
    toast({
      title: `${section} Settings Saved`,
      description: "Your settings have been updated successfully."
    });
  };

  const handleAddMember = () => {
      toast({title: "Not Implemented", description: "Adding new team members is not available in this demo."});
  };

  const handleDeleteMember = (memberId) => {
      const updatedTeam = (data.team || []).filter(m => m.id !== memberId);
      updateData('team', updatedTeam);
      toast({title: "Member Removed", description: "Team member has been removed."});
  };

  return (
    <>
      <Helmet>
        <title>Settings - CloudCRM</title>
        <meta name="description" content="Configure your CRM settings" />
      </Helmet>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account and CRM preferences</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="team">Team Management</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card><CardHeader><CardTitle>Profile Settings</CardTitle><CardDescription>Update your personal information</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2"><Label htmlFor="name">Full Name</Label><Input id="name" defaultValue="John Doe" /></div>
                <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" defaultValue="john@company.com" readOnly/></div>
                <Button onClick={() => handleSave("Profile")} className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <Card><CardHeader><CardTitle>Appearance</CardTitle><CardDescription>Customize the look and feel of the application.</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div><p className="font-medium">Theme</p><p className="text-sm text-muted-foreground">Select between light and dark mode.</p></div>
                  <Button onClick={toggleTheme} variant="outline" size="icon">{theme === 'dark' ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="team">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div><CardTitle>Team Management</CardTitle><CardDescription>Manage team members and their roles.</CardDescription></div>
                    <Button onClick={handleAddMember}><Plus className="w-4 h-4 mr-2"/>Add Member</Button>
                </CardHeader>
                <CardContent className="space-y-4">
                    {(data.team || []).map(member => (
                        <motion.div key={member.id} initial={{opacity:0}} animate={{opacity:1}} className="flex items-center justify-between p-3 rounded-lg border">
                            <div><p className="font-medium">{member.name}</p><p className="text-sm text-muted-foreground">{member.email}</p></div>
                            <div className="flex items-center space-x-4">
                                <Select defaultValue={member.role}><SelectTrigger className="w-40"><SelectValue/></SelectTrigger>
                                    <SelectContent><SelectItem value="Admin">Admin</SelectItem><SelectItem value="Sales Manager">Sales Manager</SelectItem><SelectItem value="Sales Rep">Sales Rep</SelectItem></SelectContent>
                                </Select>
                                <Badge variant={member.status === 'Active' ? 'default' : 'secondary'}>{member.status}</Badge>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteMember(member.id)}><Trash2 className="w-4 h-4 text-red-500"/></Button>
                            </div>
                        </motion.div>
                    ))}
                </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card><CardHeader><CardTitle>Security Settings</CardTitle><CardDescription>Manage your account security</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2"><Label htmlFor="current-password">Current Password</Label><Input id="current-password" type="password" /></div>
                <div className="space-y-2"><Label htmlFor="new-password">New Password</Label><Input id="new-password" type="password" /></div>
                <Button onClick={() => handleSave("Security")} className="bg-blue-600 hover:bg-blue-700">Update Password</Button>
                 <div className="flex items-center justify-between rounded-lg border p-3 mt-4">
                  <div><p className="font-medium">Two-Factor Authentication (2FA)</p><p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p></div>
                  <Switch/>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

           <TabsContent value="integrations">
            <Card>
              <CardHeader><CardTitle>Integrations</CardTitle><CardDescription>Connect with third-party services.</CardDescription></CardHeader>
              <CardContent><p className="text-muted-foreground">Integration management coming soon...</p></CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </>
  );
};

export default SettingsPage;