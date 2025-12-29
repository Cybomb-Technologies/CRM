// src/components/forecasts/ForecastQuotaSettings.jsx
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

import forecastsAPI from './forecastsAPI';

const ForecastQuotaSettings = ({ open, onOpenChange, onSettingsChange }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [quotas, setQuotas] = useState({
    monthly: 14000000,
    quarterly: 42000000,
    yearly: 168000000
  });

  const [settings, setSettings] = useState({
    probabilityThreshold: 70,
    includeClosedLost: false,
    autoRefresh: true
  });

  // Load settings when dialog opens
  useEffect(() => {
    if (open) {
      loadSettings();
    }
  }, [open]);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const data = await forecastsAPI.getSettings();
      if (data) {
        if (data.quotas) setQuotas(prev => ({ ...prev, ...data.quotas }));
        if (data.settings) setSettings(prev => ({ ...prev, ...data.settings }));
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load settings.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await forecastsAPI.updateSettings({
        quotas,
        settings
      });

      toast({
        title: "Settings Saved",
        description: "Forecast quotas and configuration updated.",
      });

      if (onSettingsChange) onSettingsChange();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save settings.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setQuotas({
      monthly: 14000000,
      quarterly: 42000000,
      yearly: 168000000
    });
    setSettings({
      probabilityThreshold: 70,
      includeClosedLost: false,
      autoRefresh: true
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Forecast Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quota Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sales Quotas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="monthly-quota">Monthly Quota</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">₹</span>
                    <Input
                      id="monthly-quota"
                      type="number"
                      value={quotas.monthly}
                      onChange={(e) => setQuotas(prev => ({
                        ...prev,
                        monthly: parseInt(e.target.value) || 0
                      }))}
                      disabled={isLoading || isSaving}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="quarterly-quota">Quarterly Quota</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">₹</span>
                    <Input
                      id="quarterly-quota"
                      type="number"
                      value={quotas.quarterly}
                      onChange={(e) => setQuotas(prev => ({
                        ...prev,
                        quarterly: parseInt(e.target.value) || 0
                      }))}
                      disabled={isLoading || isSaving}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="yearly-quota">Yearly Quota</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">₹</span>
                    <Input
                      id="yearly-quota"
                      type="number"
                      value={quotas.yearly}
                      onChange={(e) => setQuotas(prev => ({
                        ...prev,
                        yearly: parseInt(e.target.value) || 0
                      }))}
                      disabled={isLoading || isSaving}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Forecast Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Forecast Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="probability-threshold">High Probability Threshold</Label>
                  <div className="flex items-center gap-2 w-32">
                    <Input
                      id="probability-threshold"
                      type="number"
                      value={settings.probabilityThreshold}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        probabilityThreshold: parseInt(e.target.value) || 0
                      }))}
                      min="0"
                      max="100"
                      disabled={isLoading || isSaving}
                    />
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Label>Include Closed Lost Deals</Label>
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    checked={settings.includeClosedLost}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      includeClosedLost: e.target.checked
                    }))}
                    disabled={isLoading || isSaving}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Auto-refresh Forecast</Label>
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                    checked={settings.autoRefresh}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      autoRefresh: e.target.checked
                    }))}
                    disabled={isLoading || isSaving}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleReset} disabled={isLoading || isSaving}>
            Reset to Defaults
          </Button>
          <Button onClick={handleSave} disabled={isLoading || isSaving}>
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ForecastQuotaSettings;