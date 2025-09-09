import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  Check,
  Plus,
  X,
  Globe,
  Shield,
  Key,
  Users,
  Palette,
  Upload
} from 'lucide-react';

interface TenantFormData {
  name: string;
  legalEntity: string;
  region: string;
  branding: {
    primaryColor: string;
    logo: File | null;
  };
  venues: Array<{
    name: string;
    apiKey: string;
    apiSecret: string;
  }>;
  riskTemplate: string;
  users: Array<{
    email: string;
    role: string;
  }>;
}

export default function CreateTenant() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<TenantFormData>({
    name: '',
    legalEntity: '',
    region: 'CH',
    branding: {
      primaryColor: '#E10600',
      logo: null
    },
    venues: [],
    riskTemplate: 'conservative',
    users: []
  });

  const steps = [
    { id: 1, name: 'Basic Info', icon: Building2 },
    { id: 2, name: 'Region', icon: Globe },
    { id: 3, name: 'Branding', icon: Palette },
    { id: 4, name: 'Venues', icon: Key },
    { id: 5, name: 'Risk Policy', icon: Shield },
    { id: 6, name: 'Users', icon: Users },
    { id: 7, name: 'Review', icon: Check }
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    toast({
      title: "Tenant Created",
      description: `${formData.name} has been successfully created`,
    });
    setLocation('/tenants');
  };

  const addVenue = () => {
    setFormData({
      ...formData,
      venues: [...formData.venues, { name: '', apiKey: '', apiSecret: '' }]
    });
  };

  const removeVenue = (index: number) => {
    setFormData({
      ...formData,
      venues: formData.venues.filter((_, i) => i !== index)
    });
  };

  const updateVenue = (index: number, field: string, value: string) => {
    const updatedVenues = [...formData.venues];
    updatedVenues[index] = { ...updatedVenues[index], [field]: value };
    setFormData({ ...formData, venues: updatedVenues });
  };

  const addUser = () => {
    setFormData({
      ...formData,
      users: [...formData.users, { email: '', role: 'Viewer' }]
    });
  };

  const removeUser = (index: number) => {
    setFormData({
      ...formData,
      users: formData.users.filter((_, i) => i !== index)
    });
  };

  const updateUser = (index: number, field: string, value: string) => {
    const updatedUsers = [...formData.users];
    updatedUsers[index] = { ...updatedUsers[index], [field]: value };
    setFormData({ ...formData, users: updatedUsers });
  };

  const progressPercentage = (currentStep / steps.length) * 100;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation('/tenants')}
          className="mb-4"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Tenants
        </Button>
        <h1 className="text-2xl font-bold text-gray-900">Create New Tenant</h1>
        <p className="text-gray-600 mt-1">Set up a new tenant with custom configuration</p>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">
            Step {currentStep} of {steps.length}
          </span>
          <span className="text-sm font-medium">
            {steps[currentStep - 1].name}
          </span>
        </div>
        <Progress value={progressPercentage} className="h-2" />
        <div className="flex justify-between mt-4">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.id}
                className={`flex flex-col items-center ${
                  step.id === currentStep
                    ? 'text-[#E10600]'
                    : step.id < currentStep
                    ? 'text-green-600'
                    : 'text-gray-400'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step.id === currentStep
                      ? 'bg-[#E10600] text-white'
                      : step.id < currentStep
                      ? 'bg-green-100'
                      : 'bg-gray-100'
                  }`}
                >
                  {step.id < currentStep ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                <span className="text-xs mt-1 hidden sm:block">{step.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Content */}
      <Card>
        <CardContent className="p-6">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <div>
                <Label htmlFor="name">Tenant Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Production Environment"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="legalEntity">Legal Entity (Optional)</Label>
                <Input
                  id="legalEntity"
                  value={formData.legalEntity}
                  onChange={(e) => setFormData({ ...formData, legalEntity: e.target.value })}
                  placeholder="e.g., Trading Company AG"
                  className="mt-1"
                />
              </div>
            </div>
          )}

          {/* Step 2: Region */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Select Region</h3>
              <p className="text-sm text-gray-600">
                Choose the primary region for data residency and compliance
              </p>
              <div className="grid grid-cols-2 gap-4">
                {['CH', 'EU', 'US', 'APAC'].map((region) => (
                  <Card
                    key={region}
                    className={`cursor-pointer transition-all ${
                      formData.region === region
                        ? 'border-[#E10600] bg-red-50'
                        : 'hover:border-gray-400'
                    }`}
                    onClick={() => setFormData({ ...formData, region })}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">
                            {region === 'CH' ? 'Switzerland' :
                             region === 'EU' ? 'European Union' :
                             region === 'US' ? 'United States' : 'Asia Pacific'}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {region === 'CH' ? 'Swiss data protection' :
                             region === 'EU' ? 'GDPR compliant' :
                             region === 'US' ? 'SOC 2 certified' : 'Regional compliance'}
                          </p>
                        </div>
                        {formData.region === region && (
                          <Check className="h-5 w-5 text-[#E10600]" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Branding */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Branding (Optional)</h3>
              <div>
                <Label htmlFor="primaryColor">Primary Color</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    id="primaryColor"
                    type="color"
                    value={formData.branding.primaryColor}
                    onChange={(e) => setFormData({
                      ...formData,
                      branding: { ...formData.branding, primaryColor: e.target.value }
                    })}
                    className="w-20 h-10"
                  />
                  <Input
                    value={formData.branding.primaryColor}
                    onChange={(e) => setFormData({
                      ...formData,
                      branding: { ...formData.branding, primaryColor: e.target.value }
                    })}
                    className="flex-1"
                  />
                </div>
              </div>
              <div>
                <Label>Logo</Label>
                <div className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    SVG, PNG or JPG (max. 2MB)
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Venues */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Initial Venues & API Keys</h3>
                <Button variant="outline" size="sm" onClick={addVenue}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Venue
                </Button>
              </div>
              {formData.venues.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No venues added yet. Click "Add Venue" to get started.
                </div>
              ) : (
                <div className="space-y-4">
                  {formData.venues.map((venue, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-medium">Venue {index + 1}</h4>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeVenue(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-1 gap-3">
                          <div>
                            <Label>Venue Name</Label>
                            <Select
                              value={venue.name}
                              onValueChange={(value) => updateVenue(index, 'name', value)}
                            >
                              <SelectTrigger className="mt-1">
                                <SelectValue placeholder="Select venue" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="binance">Binance</SelectItem>
                                <SelectItem value="coinbase">Coinbase</SelectItem>
                                <SelectItem value="kraken">Kraken</SelectItem>
                                <SelectItem value="bx-digital">BX Digital</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>API Key</Label>
                            <Input
                              value={venue.apiKey}
                              onChange={(e) => updateVenue(index, 'apiKey', e.target.value)}
                              placeholder="Enter API key"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label>API Secret</Label>
                            <Input
                              type="password"
                              value={venue.apiSecret}
                              onChange={(e) => updateVenue(index, 'apiSecret', e.target.value)}
                              placeholder="Enter API secret"
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 5: Risk Policy */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Risk Baseline Template</h3>
              <p className="text-sm text-gray-600">
                Select a risk policy template to apply as the baseline
              </p>
              <div className="space-y-3">
                {[
                  { id: 'conservative', name: 'Conservative', description: 'Low risk, strict limits' },
                  { id: 'moderate', name: 'Moderate', description: 'Balanced risk approach' },
                  { id: 'aggressive', name: 'Aggressive', description: 'Higher risk tolerance' },
                  { id: 'custom', name: 'Custom', description: 'Define your own policies' }
                ].map((template) => (
                  <Card
                    key={template.id}
                    className={`cursor-pointer transition-all ${
                      formData.riskTemplate === template.id
                        ? 'border-[#E10600] bg-red-50'
                        : 'hover:border-gray-400'
                    }`}
                    onClick={() => setFormData({ ...formData, riskTemplate: template.id })}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold">{template.name}</h4>
                          <p className="text-sm text-gray-600">{template.description}</p>
                        </div>
                        {formData.riskTemplate === template.id && (
                          <Check className="h-5 w-5 text-[#E10600]" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Step 6: Users */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Initial Users</h3>
                <Button variant="outline" size="sm" onClick={addUser}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add User
                </Button>
              </div>
              {formData.users.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No users added yet. You can add users later.
                </div>
              ) : (
                <div className="space-y-3">
                  {formData.users.map((user, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Input
                        type="email"
                        value={user.email}
                        onChange={(e) => updateUser(index, 'email', e.target.value)}
                        placeholder="Email address"
                        className="flex-1"
                      />
                      <Select
                        value={user.role}
                        onValueChange={(value) => updateUser(index, 'role', value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Admin">Admin</SelectItem>
                          <SelectItem value="Trader">Trader</SelectItem>
                          <SelectItem value="Approver">Approver</SelectItem>
                          <SelectItem value="Viewer">Viewer</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeUser(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 7: Review */}
          {currentStep === 7 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Review Configuration</h3>
              <div className="space-y-4">
                <div>
                  <Label className="text-gray-600">Tenant Name</Label>
                  <p className="font-medium">{formData.name || 'Not specified'}</p>
                </div>
                {formData.legalEntity && (
                  <div>
                    <Label className="text-gray-600">Legal Entity</Label>
                    <p className="font-medium">{formData.legalEntity}</p>
                  </div>
                )}
                <div>
                  <Label className="text-gray-600">Region</Label>
                  <p className="font-medium">
                    {formData.region === 'CH' ? 'Switzerland' :
                     formData.region === 'EU' ? 'European Union' :
                     formData.region === 'US' ? 'United States' : 'Asia Pacific'}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-600">Risk Template</Label>
                  <p className="font-medium capitalize">{formData.riskTemplate}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Venues</Label>
                  <p className="font-medium">
                    {formData.venues.length > 0
                      ? `${formData.venues.length} venue(s) configured`
                      : 'No venues configured'}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-600">Users</Label>
                  <p className="font-medium">
                    {formData.users.length > 0
                      ? `${formData.users.length} user(s) will be invited`
                      : 'No users added'}
                  </p>
                </div>
              </div>
              <Separator />
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> After creating the tenant, you can further customize settings,
                  add more users, and configure additional venues from the tenant detail page.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        {currentStep < steps.length ? (
          <Button onClick={handleNext}>
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button 
            onClick={handleSubmit}
            className="bg-[#E10600] hover:bg-[#C00500]"
          >
            Create Tenant
          </Button>
        )}
      </div>
    </div>
  );
}