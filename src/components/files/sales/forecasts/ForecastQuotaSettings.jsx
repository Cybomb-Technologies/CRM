// src/components/forecasts/ForecastQuotaSettings.jsx
import React, { useState } from 'react';
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

const ForecastQuotaSettings = ({ open, onOpenChange }) => {
  const { toast } = useToast();
  const [quotas, setQuotas] = useState({
    monthly: 14000000,    // ₹1.4 crore monthly
    quarterly: 42000000,  // ₹4.2 crore quarterly
    yearly: 168000000     // ₹16.8 crore yearly
  });

  const handleSave = () => {
    // In a real app, save to localStorage or backend
    localStorage.setItem('forecast_quotas', JSON.stringify(quotas));
    toast({
      title: "Settings Saved",
      description: "Forecast quotas updated successfully.",
    });
    onOpenChange(false);
  };

  const handleReset = () => {
    setQuotas({
      monthly: 14000000,
      quarterly: 42000000,
      yearly: 168000000
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
                      defaultValue={70}
                      min="0"
                      max="100"
                    />
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Label>Include Closed Lost Deals</Label>
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300"
                    defaultChecked={false}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Auto-refresh Forecast</Label>
                  <input 
                    type="checkbox" 
                    className="rounded border-gray-300"
                    defaultChecked={true}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleReset}>
            Reset to Defaults
          </Button>
          <Button onClick={handleSave}>
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ForecastQuotaSettings;