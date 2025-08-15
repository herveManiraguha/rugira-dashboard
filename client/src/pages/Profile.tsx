import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Key,
  Upload,
  Save,
  RotateCcw,
  Globe,
  Clock,
  Camera
} from 'lucide-react';

export default function Profile() {
  const { toast } = useToast();
  
  // User profile data
  const [profileData, setProfileData] = useState({
    firstName: 'Hans',
    lastName: 'Mueller',
    email: 'hans.mueller@rugira.ch',
    phone: '+41 79 123 4567',
    country: 'Switzerland',
    city: 'Zurich',
    timezone: 'Europe/Zurich',
    language: 'English',
    dateJoined: '2023-06-15',
    role: 'Premium Trader',
    accountType: 'Professional',
    twoFactorEnabled: true,
    emailNotifications: true,
    smsAlerts: false,
    marketingEmails: false
  });

  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleInputChange = (field: string, value: string | boolean) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // In a real app, this would make an API call
    toast({
      title: "Profile Updated",
      description: "Your profile information has been successfully updated.",
    });
    setIsEditing(false);
    setHasChanges(false);
  };

  const handleCancel = () => {
    // Reset changes - in real app, would refetch from server
    setIsEditing(false);
    setHasChanges(false);
    toast({
      title: "Changes Discarded",
      description: "Your changes have been discarded.",
    });
  };

  const handleAvatarUpload = () => {
    toast({
      title: "Avatar Upload",
      description: "Avatar upload functionality will be implemented.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </div>
        <div className="flex items-center space-x-3">
          {hasChanges && !isEditing && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
              Unsaved changes
            </Badge>
          )}
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} data-testid="button-edit-profile">
              <User className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button variant="outline" onClick={handleCancel} data-testid="button-cancel-edit">
                <RotateCcw className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} data-testid="button-save-profile">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Photo & Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Profile Photo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-24 h-24 bg-gradient-to-br from-brand-red to-red-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {profileData.firstName[0]}{profileData.lastName[0]}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleAvatarUpload}
                data-testid="button-upload-avatar"
              >
                <Camera className="h-4 w-4 mr-2" />
                Upload Photo
              </Button>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Account Type</span>
                <Badge className="bg-brand-green text-white">{profileData.accountType}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Role</span>
                <Badge variant="secondary">{profileData.role}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Member Since</span>
                <span className="text-sm font-medium">
                  {new Date(profileData.dateJoined).toLocaleDateString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Mail className="h-5 w-5 mr-2" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={profileData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  disabled={!isEditing}
                  data-testid="input-first-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={profileData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  disabled={!isEditing}
                  data-testid="input-last-name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={!isEditing}
                  className="pl-10"
                  data-testid="input-email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={!isEditing}
                  className="pl-10"
                  data-testid="input-phone"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="country"
                    value={profileData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    disabled={!isEditing}
                    className="pl-10"
                    data-testid="input-country"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={profileData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  disabled={!isEditing}
                  data-testid="input-city"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              Preferences & Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Localization */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Localization</h3>
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select 
                      value={profileData.timezone} 
                      onValueChange={(value) => handleInputChange('timezone', value)}
                      disabled={!isEditing}
                    >
                      <SelectTrigger data-testid="select-timezone">
                        <Clock className="h-4 w-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Europe/Zurich">Europe/Zurich</SelectItem>
                        <SelectItem value="America/New_York">America/New_York</SelectItem>
                        <SelectItem value="Asia/Tokyo">Asia/Tokyo</SelectItem>
                        <SelectItem value="Europe/London">Europe/London</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select 
                      value={profileData.language} 
                      onValueChange={(value) => handleInputChange('language', value)}
                      disabled={!isEditing}
                    >
                      <SelectTrigger data-testid="select-language">
                        <Globe className="h-4 w-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="German">Deutsch</SelectItem>
                        <SelectItem value="French">Français</SelectItem>
                        <SelectItem value="Italian">Italiano</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Security */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Security</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">Two-Factor Authentication</Label>
                      <p className="text-xs text-gray-500">Add extra security to your account</p>
                    </div>
                    <Switch
                      checked={profileData.twoFactorEnabled}
                      onCheckedChange={(checked) => handleInputChange('twoFactorEnabled', checked)}
                      disabled={!isEditing}
                      data-testid="switch-2fa"
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    disabled={!isEditing}
                    data-testid="button-change-password"
                  >
                    <Key className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                </div>
              </div>

              {/* Notifications */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Notifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">Email Notifications</Label>
                      <p className="text-xs text-gray-500">Trading alerts and updates</p>
                    </div>
                    <Switch
                      checked={profileData.emailNotifications}
                      onCheckedChange={(checked) => handleInputChange('emailNotifications', checked)}
                      disabled={!isEditing}
                      data-testid="switch-email-notifications"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">SMS Alerts</Label>
                      <p className="text-xs text-gray-500">Critical system alerts</p>
                    </div>
                    <Switch
                      checked={profileData.smsAlerts}
                      onCheckedChange={(checked) => handleInputChange('smsAlerts', checked)}
                      disabled={!isEditing}
                      data-testid="switch-sms-alerts"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-medium">Marketing Emails</Label>
                      <p className="text-xs text-gray-500">Product updates and news</p>
                    </div>
                    <Switch
                      checked={profileData.marketingEmails}
                      onCheckedChange={(checked) => handleInputChange('marketingEmails', checked)}
                      disabled={!isEditing}
                      data-testid="switch-marketing-emails"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}