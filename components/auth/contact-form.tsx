'use client';

import React from "react"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Loader2, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/language-context';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface ContactFormData {
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  country: string;
  employees: string;
  message: string;
}

interface ContactFormProps {
  onSubmit?: (data: ContactFormData) => Promise<void>;
}

const GCC_COUNTRIES = [
  { code: 'SA', name: 'Saudi Arabia', label: 'المملكة العربية السعودية' },
  { code: 'AE', name: 'United Arab Emirates', label: 'الإمارات العربية المتحدة' },
  { code: 'KW', name: 'Kuwait', label: 'الكويت' },
  { code: 'QA', name: 'Qatar', label: 'قطر' },
  { code: 'BH', name: 'Bahrain', label: 'البحرين' },
  { code: 'OM', name: 'Oman', label: 'عمان' },
];

const EMPLOYEE_RANGES = [
  { value: '1-50', label: '1-50 Employees', labelAr: '1-50 موظف' },
  { value: '51-200', label: '51-200 Employees', labelAr: '51-200 موظف' },
  { value: '201-500', label: '201-500 Employees', labelAr: '201-500 موظف' },
  { value: '501-1000', label: '501-1,000 Employees', labelAr: '501-1000 موظف' },
  { value: '1000+', label: '1,000+ Employees', labelAr: '1000+ موظف' },
];

export function ContactForm({ onSubmit }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    country: '',
    employees: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { t, language } = useLanguage();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      if (onSubmit) {
        await onSubmit(formData);
      }
      setSuccess(true);
      setFormData({
        fullName: '',
        companyName: '',
        email: '',
        phone: '',
        country: '',
        employees: '',
        message: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : t('contact.errorMessage'));
    } finally {
      setLoading(false);
    }
  };

  const getCountryLabel = (code: string) => {
    const country = GCC_COUNTRIES.find((c) => c.code === code);
    return language === 'ar' ? country?.label : country?.name;
  };

  const getEmployeeLabel = (value: string) => {
    const range = EMPLOYEE_RANGES.find((r) => r.value === value);
    return language === 'ar' ? range?.labelAr : range?.label;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="flex items-start gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/30">
          <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-green-400">{t('contact.successMessage')}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-sm text-foreground font-medium">
            {t('contact.fullName')}
          </Label>
          <Input
            id="fullName"
            name="fullName"
            placeholder={t('contact.fullNamePlaceholder')}
            value={formData.fullName}
            onChange={handleChange}
            required
            disabled={loading}
            className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyName" className="text-sm text-foreground font-medium">
            {t('contact.companyName')}
          </Label>
          <Input
            id="companyName"
            name="companyName"
            placeholder={t('contact.companyNamePlaceholder')}
            value={formData.companyName}
            onChange={handleChange}
            required
            disabled={loading}
            className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm text-foreground font-medium">
            {t('contact.companyEmail')}
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder={t('contact.companyEmailPlaceholder')}
            value={formData.email}
            onChange={handleChange}
            required
            disabled={loading}
            className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm text-foreground font-medium">
            {t('contact.phone')}
          </Label>
          <Input
            id="phone"
            name="phone"
            placeholder={t('contact.phonePlaceholder')}
            value={formData.phone}
            onChange={handleChange}
            disabled={loading}
            className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="country" className="text-sm text-foreground font-medium">
            {t('contact.country')}
          </Label>
          <Select value={formData.country} onValueChange={(value) => handleSelectChange('country', value)} disabled={loading}>
            <SelectTrigger className="bg-secondary border-border text-foreground">
              <SelectValue placeholder={t('contact.selectCountry')} />
            </SelectTrigger>
            <SelectContent>
              {GCC_COUNTRIES.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  {language === 'ar' ? country.label : country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="employees" className="text-sm text-foreground font-medium">
            {t('contact.employees')}
          </Label>
          <Select value={formData.employees} onValueChange={(value) => handleSelectChange('employees', value)} disabled={loading}>
            <SelectTrigger className="bg-secondary border-border text-foreground">
              <SelectValue placeholder={t('contact.selectEmployees')} />
            </SelectTrigger>
            <SelectContent>
              {EMPLOYEE_RANGES.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {getEmployeeLabel(range.value)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="text-sm text-foreground font-medium">
          {t('contact.message')}
        </Label>
        <textarea
          id="message"
          name="message"
          placeholder={t('contact.messagePlaceholder')}
          value={formData.message}
          onChange={handleChange}
          disabled={loading}
          rows={5}
          className="w-full px-3 py-2 bg-secondary border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>

      <Button
        type="submit"
        disabled={loading || !formData.fullName || !formData.email || !formData.companyName}
        className="w-full bg-accent hover:bg-accent/90 text-white font-medium"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {t('contact.submitting')}
          </>
        ) : (
          t('contact.submit')
        )}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        {language === 'ar'
          ? 'سيتواصل فريقنا معك خلال 24 ساعة'
          : 'Our team will contact you within 24 hours'}
      </p>
    </form>
  );
}
