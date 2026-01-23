'use client';

import React from "react"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertCircle, Loader2 } from 'lucide-react';

interface TenantSetupFormProps {
  onSubmit: (data: {
    tenantName: string;
    industry: string;
    employeeCount: string;
    country: string;
  }) => Promise<void>;
}

export function TenantSetupForm({ onSubmit }: TenantSetupFormProps) {
  const [formData, setFormData] = useState({
    tenantName: '',
    industry: '',
    employeeCount: '',
    country: 'SA',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const industries = [
    'Technology',
    'Finance',
    'Healthcare',
    'Retail',
    'Manufacturing',
    'Energy',
    'Telecommunications',
    'Government',
    'Education',
    'Other',
  ];

  const gccCountries = [
    { code: 'SA', label: 'Saudi Arabia' },
    { code: 'AE', label: 'United Arab Emirates' },
    { code: 'KW', label: 'Kuwait' },
    { code: 'QA', label: 'Qatar' },
    { code: 'BH', label: 'Bahrain' },
    { code: 'OM', label: 'Oman' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!formData.tenantName.trim()) {
      setError('Organization name is required');
      return false;
    }
    if (!formData.industry) {
      setError('Industry is required');
      return false;
    }
    if (!formData.employeeCount) {
      setError('Employee count is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSubmit(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-start gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="tenantName" className="text-sm text-foreground">
          Organization Name
        </Label>
        <Input
          id="tenantName"
          name="tenantName"
          type="text"
          placeholder="Acme Corporation"
          value={formData.tenantName}
          onChange={handleChange}
          required
          disabled={loading}
          className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="industry" className="text-sm text-foreground">
            Industry
          </Label>
          <Select
            value={formData.industry}
            onValueChange={(value) => handleSelectChange('industry', value)}
            disabled={loading}
          >
            <SelectTrigger className="bg-secondary border-border text-foreground">
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {industries.map((ind) => (
                <SelectItem key={ind} value={ind} className="text-foreground">
                  {ind}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="country" className="text-sm text-foreground">
            Country
          </Label>
          <Select
            value={formData.country}
            onValueChange={(value) => handleSelectChange('country', value)}
            disabled={loading}
          >
            <SelectTrigger className="bg-secondary border-border text-foreground">
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {gccCountries.map((country) => (
                <SelectItem key={country.code} value={country.code} className="text-foreground">
                  {country.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="employeeCount" className="text-sm text-foreground">
          Number of Employees
        </Label>
        <Select
          value={formData.employeeCount}
          onValueChange={(value) => handleSelectChange('employeeCount', value)}
          disabled={loading}
        >
          <SelectTrigger className="bg-secondary border-border text-foreground">
            <SelectValue placeholder="Select employee count" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="1-50" className="text-foreground">
              1-50 employees
            </SelectItem>
            <SelectItem value="51-200" className="text-foreground">
              51-200 employees
            </SelectItem>
            <SelectItem value="201-500" className="text-foreground">
              201-500 employees
            </SelectItem>
            <SelectItem value="501-1000" className="text-foreground">
              501-1,000 employees
            </SelectItem>
            <SelectItem value="1000+" className="text-foreground">
              1,000+ employees
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        type="submit"
        disabled={
          loading || !formData.tenantName || !formData.industry || !formData.employeeCount
        }
        className="w-full bg-accent hover:bg-accent/90 text-white font-medium"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Setting up...
          </>
        ) : (
          'Complete Setup'
        )}
      </Button>
    </form>
  );
}
