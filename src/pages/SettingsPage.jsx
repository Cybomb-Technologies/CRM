// =========================
// SETTINGS PAGE (Fixed Upload) - UPDATED WITH BACKEND INTEGRATION
// =========================

import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast, useTheme, useData } from "@/hooks";
import {
  Plus,
  Trash2,
  Upload,
  User,
  Loader2,
  X,
  Check,
  AlertCircle,
  Key,
  Edit,
  Camera,
  Sun,
  Moon,
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const API_URL = "http://localhost:5000/api";
const SERVER_URL = "http://localhost:5000";

const SettingsPage = () => {
  const { toast } = useToast();
  const { theme, toggleTheme } = useTheme();
  const { data, updateData } = useData();

  // ------------------------------
  // STATE
  // ------------------------------
  const [loading, setLoading] = useState(false);
  const [teamLoading, setTeamLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [profile, setProfile] = useState(null);
  const [profileForm, setProfileForm] = useState({
    name: "",
    email: "",
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);

  // Security state
  const [securityForm, setSecurityForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Team state
  const [addMemberForm, setAddMemberForm] = useState({
    name: "",
    email: "",
    role: "Sales Rep",
  });
  const [showAddMember, setShowAddMember] = useState(false);

  // ------------------------------
  // TOKEN HELPER
  // ------------------------------
  const getToken = () => {
    const keys = ["token", "crm_token", "auth_token", "user_token"];
    for (const key of keys) {
      const t = localStorage.getItem(key);
      if (t && t !== "null" && t !== "undefined") return t;
    }
    return null;
  };

  // ------------------------------
  // INITIAL AUTH CHECK & DATA FETCH
  // ------------------------------
  useEffect(() => {
    const token = getToken();
    if (token) {
      setIsAuthenticated(true);
      fetchProfile(token);
      fetchSecuritySettings();
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  // ------------------------------
  // FETCH PROFILE
  // ------------------------------
  const fetchProfile = async (token) => {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        clearTokens();
        return;
      }

      const data = await res.json();
      if (!data.success) return;

      setProfile(data.user);
      setProfileForm({
        name: data.user.name,
        email: data.user.email,
      });

      if (data.user.profilePicture) {
        const url = data.user.profilePicture.startsWith("http")
          ? data.user.profilePicture
          : `${SERVER_URL}${data.user.profilePicture}`;
        setPreviewImage(url);
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Could not load profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------
  // TEAM MANAGEMENT FUNCTIONS
  // ------------------------------
  const fetchTeamMembers = async () => {
    const token = getToken();
    if (!token) return;

    try {
      setTeamLoading(true);
      const res = await fetch(`${API_URL}/team`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        updateData({ team: data.data || [] });
      }
    } catch (error) {
      console.error('Fetch team error:', error);
    } finally {
      setTeamLoading(false);
    }
  };

  const handleAddMember = async () => {
    const token = getToken();
    if (!token) {
      toast({
        title: "Not authenticated",
        description: "Please login first",
        variant: "destructive",
      });
      return;
    }

    if (!addMemberForm.name || !addMemberForm.email) {
      toast({
        title: "Error",
        description: "Please fill in name and email",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/team`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: addMemberForm.name,
          email: addMemberForm.email,
          role: addMemberForm.role,
          status: "Active"
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast({
          title: "Success",
          description: "Team member added successfully",
          variant: "default",
        });
        setShowAddMember(false);
        setAddMemberForm({ name: "", email: "", role: "Sales Rep" });
        fetchTeamMembers(); // Refresh team list
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to add team member",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Add team member error:", error);
      toast({
        title: "Network Error",
        description: "Failed to add team member",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateMemberRole = async (memberId, newRole) => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/team/${memberId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await res.json();
      if (data.success) {
        fetchTeamMembers(); // Refresh team list
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to update team member",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Update team member error:", error);
      toast({
        title: "Network Error",
        description: "Failed to update team member",
        variant: "destructive",
      });
    }
  };

  const handleDeleteMember = async (memberId) => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/team/${memberId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        toast({
          title: "Success",
          description: "Team member deleted successfully",
          variant: "default",
        });
        fetchTeamMembers(); // Refresh team list
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to delete team member",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Delete team member error:", error);
      toast({
        title: "Network Error",
        description: "Failed to delete team member",
        variant: "destructive",
      });
    }
  };

  // ------------------------------
  // SECURITY FUNCTIONS
  // ------------------------------
  const fetchSecuritySettings = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/security`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setTwoFactorEnabled(data.data.twoFactorEnabled || false);
        }
      }
    } catch (error) {
      console.error('Fetch security settings error:', error);
    }
  };

  const handleSecuritySave = async () => {
    const token = getToken();
    if (!token) {
      toast({
        title: "Not authenticated",
        description: "Please login first",
        variant: "destructive",
      });
      return;
    }

    const { currentPassword, newPassword, confirmPassword } = securityForm;

    if (!currentPassword || !newPassword) {
      toast({
        title: "Error",
        description: "Please fill in all password fields",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 6) {
      toast({
        title: "Error",
        description: "New password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/security/change-password`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (data.success) {
        toast({
          title: "Success",
          description: "Password changed successfully!",
          variant: "default",
        });
        // Clear password fields
        setSecurityForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to change password",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Change password error:", error);
      toast({
        title: "Network Error",
        description: "Failed to change password",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggle2FA = async (enabled) => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/security/toggle-2fa`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ enabled }),
      });

      const data = await res.json();
      if (data.success) {
        setTwoFactorEnabled(enabled);
        toast({
          title: "Success",
          description: `2FA ${enabled ? 'enabled' : 'disabled'} successfully!`,
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: data.message || `Failed to ${enabled ? 'enable' : 'disable'} 2FA`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Toggle 2FA error:", error);
      toast({
        title: "Network Error",
        description: "Failed to update 2FA settings",
        variant: "destructive",
      });
    }
  };

  // ------------------------------
  // FILE INPUT
  // ------------------------------
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum size is 5MB",
        variant: "destructive",
      });
      return;
    }

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Only JPEG, PNG, WebP allowed",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);
  };

  // ------------------------------
  // UPLOAD PROFILE PICTURE - FIXED
  // ------------------------------
  const uploadProfilePicture = async () => {
    if (!selectedFile) {
      console.log("ℹ️ No file selected for upload");
      return { success: true };
    }

    const token = getToken();
    if (!token) {
      return { success: false, message: "No authentication token found" };
    }

    const formData = new FormData();
    formData.append("profilePicture", selectedFile);

    console.log("📤 Starting upload...");
    console.log("File:", selectedFile.name, "Size:", selectedFile.size);

    try {
      const res = await fetch(`${API_URL}/profile/picture`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const responseText = await res.text();
      console.log("📥 Raw response:", responseText);

      if (!res.ok) {
        let errorMsg = `Upload failed (${res.status})`;
        try {
          const errorJson = JSON.parse(responseText);
          errorMsg = errorJson.message || errorMsg;
        } catch (e) {}
        return { success: false, message: errorMsg };
      }

      const result = JSON.parse(responseText);
      console.log("✅ Upload successful:", result);
      return result;

    } catch (err) {
      console.error("❌ Network error:", err);
      return {
        success: false,
        message: `Network error: ${err.message}`,
      };
    }
  };

  // ------------------------------
  // REMOVE PICTURE
  // ------------------------------
  const handleRemovePicture = async (e) => {
    e.stopPropagation();

    const token = getToken();
    if (!token) {
      toast({
        title: "Not authenticated",
        description: "Please login first",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/profile/picture`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        setPreviewImage(null);
        setSelectedFile(null);
        toast({
          title: "Success",
          description: "Profile picture removed successfully",
          variant: "default",
        });
        fetchProfile(token);
      } else {
        toast({
          title: "Error",
          description: data.message || "Failed to remove picture",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("Remove error:", err);
      toast({
        title: "Network Error",
        description: "Failed to remove picture",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------
  // UPDATE NAME
  // ------------------------------
  const updateProfileInfo = async () => {
    const token = getToken();
    if (!token) {
      return { success: false, message: "No authentication token" };
    }

    try {
      const res = await fetch(`${API_URL}/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: profileForm.name.trim() }),
      });

      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Update error:", err);
      return { success: false, message: "Network error" };
    }
  };

  // ------------------------------
  // SAVE PROFILE
  // ------------------------------
  const handleProfileSave = async () => {
    const token = getToken();
    if (!token) {
      toast({
        title: "Not authenticated",
        description: "Please login first",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // 1. Upload picture if selected
      if (selectedFile) {
        console.log("🚀 Starting upload process...");
        const uploadResult = await uploadProfilePicture();

        if (!uploadResult.success) {
          toast({
            title: "Upload Failed",
            description: uploadResult.message || "Failed to upload profile picture",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        console.log("✅ Picture uploaded successfully");
      }

      // 2. Update name if changed
      if (profileForm.name !== profile?.name) {
        console.log("🔄 Updating profile info...");
        const updateResult = await updateProfileInfo();

        if (!updateResult.success) {
          toast({
            title: "Update Failed",
            description: updateResult.message || "Failed to update profile",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        console.log("✅ Profile info updated successfully");
      }

      // 3. Success
      toast({
        title: "Success",
        description: "Profile updated successfully!",
        variant: "default",
      });

      // 4. Refresh profile data
      setSelectedFile(null);
      await fetchProfile(token);

    } catch (error) {
      console.error("💥 Save error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------
  // DEBUG UPLOAD
  // ------------------------------
  const debugUpload = async () => {
    const token = getToken();
    if (!token) {
      toast({
        title: "No token",
        description: "Please login first",
        variant: "destructive",
      });
      return;
    }

    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Select a file first",
        variant: "destructive",
      });
      return;
    }

    console.log("🔍 DEBUG UPLOAD:");
    console.log("Token exists:", !!token);
    console.log("Selected file:", {
      name: selectedFile.name,
      size: selectedFile.size,
      type: selectedFile.type,
    });

    // Test if endpoint exists
    try {
      const testRes = await fetch(`${API_URL}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Profile endpoint test:", testRes.status, testRes.statusText);
    } catch (error) {
      console.error("Test error:", error);
    }

    toast({
      title: "Debug info logged",
      description: "Check console for details",
      variant: "default",
    });
  };

  // ------------------------------
  // CLEAR TOKENS
  // ------------------------------
  const clearTokens = () => {
    ["token", "crm_token", "auth_token"].forEach((k) =>
      localStorage.removeItem(k)
    );
    setIsAuthenticated(false);
    setProfile(null);
    setProfileForm({ name: "", email: "" });
    setPreviewImage(null);
    setSelectedFile(null);
    toast({
      title: "Logged out",
      description: "All tokens cleared",
      variant: "default",
    });
  };

  // ------------------------------
  // RENDERING
  // ------------------------------
  if (!isAuthenticated) {
    return (
      <Card className="border-dashed border-2">
        <CardHeader>
          <CardTitle className="text-center">🔐 Login Required</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p>You must login to access Settings.</p>
          <div className="text-xs text-muted-foreground p-3 bg-gray-50 rounded">
            <p>Token in 'token': {localStorage.getItem("token") ? "Exists" : "Missing"}</p>
            <p>Token in 'crm_token': {localStorage.getItem("crm_token") ? "Exists" : "Missing"}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Helmet>
        <title>Settings - CloudCRM</title>
        <meta name="description" content="Manage your CRM settings" />
      </Helmet>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <p className="text-muted-foreground">Manage your account preferences</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={debugUpload}
              className="flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4" />
              Debug Upload
            </Button>
            <Button variant="destructive" onClick={clearTokens}>
              Logout
            </Button>
          </div>
        </div>

        <Tabs defaultValue="profile">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>

          {/* =====================
          PROFILE
          ===================== */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>

              <CardContent className="space-y-8">
                {loading && !selectedFile ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <span className="ml-2 text-muted-foreground">Loading profile...</span>
                  </div>
                ) : (
                  <>
                    {/* Avatar */}
                    <div className="flex flex-col items-center space-y-4">
                      <div
                        className="relative cursor-pointer"
                        onMouseEnter={() => setIsHoveringAvatar(true)}
                        onMouseLeave={() => setIsHoveringAvatar(false)}
                        onClick={() =>
                          document.getElementById("profile-upload").click()
                        }
                      >
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                          {previewImage ? (
                            <img
                              src={previewImage}
                              alt={profileForm.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                              <User className="w-16 h-16 text-gray-400" />
                            </div>
                          )}
                        </div>

                        {/* Hover Overlay */}
                        <div className={`absolute inset-0 bg-black/40 rounded-full flex items-center justify-center transition-opacity duration-300 ${isHoveringAvatar ? 'opacity-100' : 'opacity-0'}`}>
                          <Camera className="text-white w-8 h-8" />
                        </div>

                        {/* Edit Badge */}
                        <div className="absolute -bottom-2 -right-2">
                          <div className="bg-blue-500 text-white rounded-full p-2 shadow-lg">
                            <Edit className="w-4 h-4" />
                          </div>
                        </div>

                        {/* Remove button */}
                        {previewImage && (
                          <Button
                            size="icon"
                            variant="destructive"
                            className="absolute -top-2 -right-2 w-8 h-8 rounded-full shadow-lg"
                            onClick={handleRemovePicture}
                            disabled={loading}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}

                        <input
                          type="file"
                          id="profile-upload"
                          className="hidden"
                          accept="image/*"
                          onChange={handleFileChange}
                          disabled={loading}
                        />
                      </div>

                      <div className="text-center">
                        <h2 className="text-2xl font-bold text-foreground">{profileForm.name || "Your Name"}</h2>
                        <p className="text-muted-foreground">{profileForm.email || "user@example.com"}</p>
                      </div>
                    </div>

                    {/* Form */}
                    <div className="border-t pt-6 space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={profileForm.name}
                          onChange={(e) =>
                            setProfileForm({ ...profileForm, name: e.target.value })
                          }
                          placeholder="Enter your full name"
                          disabled={loading}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          value={profileForm.email}
                          readOnly
                          className="bg-gray-50"
                        />
                        <p className="text-xs text-muted-foreground">
                          Email cannot be changed. Contact support if needed.
                        </p>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button
                          onClick={handleProfileSave}
                          disabled={loading || (!selectedFile && profileForm.name === profile?.name)}
                          className="flex items-center gap-2"
                        >
                          {loading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Check className="w-4 h-4" />
                              Save Changes
                            </>
                          )}
                        </Button>
                        {(selectedFile || profileForm.name !== profile?.name) && (
                          <Button
                            variant="outline"
                            onClick={() => {
                              setSelectedFile(null);
                              if (profile) {
                                setProfileForm({
                                  name: profile.name,
                                  email: profile.email,
                                });
                                if (profile.profilePicture) {
                                  const url = profile.profilePicture.startsWith("http")
                                    ? profile.profilePicture
                                    : `${SERVER_URL}${profile.profilePicture}`;
                                  setPreviewImage(url);
                                }
                              }
                            }}
                            disabled={loading}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* =====================
          APPEARANCE
          ===================== */}
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize the look and feel of the application.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">Theme</p>
                    <p className="text-sm text-muted-foreground">Select between light and dark mode.</p>
                  </div>
                  <Button onClick={toggleTheme} variant="outline" size="icon">
                    {theme === 'dark' ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* =====================
          SECURITY
          ===================== */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input 
                    id="current-password" 
                    type="password" 
                    value={securityForm.currentPassword}
                    onChange={(e) => setSecurityForm({...securityForm, currentPassword: e.target.value})}
                    placeholder="Enter current password"
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input 
                    id="new-password" 
                    type="password" 
                    value={securityForm.newPassword}
                    onChange={(e) => setSecurityForm({...securityForm, newPassword: e.target.value})}
                    placeholder="Enter new password"
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input 
                    id="confirm-password" 
                    type="password" 
                    value={securityForm.confirmPassword}
                    onChange={(e) => setSecurityForm({...securityForm, confirmPassword: e.target.value})}
                    placeholder="Confirm new password"
                    disabled={loading}
                  />
                </div>
                <Button 
                  onClick={handleSecuritySave} 
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </Button>
                <div className="flex items-center justify-between rounded-lg border p-3 mt-4">
                  <div>
                    <p className="font-medium">Two-Factor Authentication (2FA)</p>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
                  </div>
                  <Switch 
                    checked={twoFactorEnabled}
                    onCheckedChange={handleToggle2FA}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* =====================
          INTEGRATIONS
          ===================== */}
          <TabsContent value="integrations">
            <Card>
              <CardHeader>
                <CardTitle>Integrations</CardTitle>
                <CardDescription>Connect with third-party services.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Integration management coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default SettingsPage;