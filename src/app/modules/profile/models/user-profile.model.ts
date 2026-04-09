export interface UserProfile {
  firstName: string;
  lastName: string;
  location: string;
  headline: string;
  email: string;
  countryCode: string;
  phoneNumber: string;
  linkedIn: string;
  github: string;
  website: string;
}

export const EMPTY_PROFILE: UserProfile = {
  firstName: '',
  lastName: '',
  location: '',
  headline: '',
  email: '',
  countryCode: '',
  phoneNumber: '',
  linkedIn: '',
  github: '',
  website: '',
};

export interface ProfileField {
  key: keyof UserProfile;
  label: string;
  icon: string;
  type: 'text' | 'email' | 'tel' | 'url' | 'select';
  placeholder: string;
  copyable: boolean;
  options?: { value: string; label: string }[];
}

export interface ComputedField {
  id: string;
  label: string;
  icon: string;
  derive: (profile: UserProfile) => string;
}

export interface ProfileFieldGroup {
  name: string;
  icon: string;
  fields: ProfileField[];
  computedFields?: ComputedField[];
}

export const COUNTRY_CODES: { value: string; label: string }[] = [
  { value: '', label: 'None' },
  { value: '+1', label: '+1 (US/CA)' },
  { value: '+44', label: '+44 (UK)' },
  { value: '+33', label: '+33 (FR)' },
  { value: '+49', label: '+49 (DE)' },
  { value: '+34', label: '+34 (ES)' },
  { value: '+39', label: '+39 (IT)' },
  { value: '+55', label: '+55 (BR)' },
  { value: '+52', label: '+52 (MX)' },
  { value: '+54', label: '+54 (AR)' },
  { value: '+56', label: '+56 (CL)' },
  { value: '+57', label: '+57 (CO)' },
  { value: '+58', label: '+58 (VE)' },
  { value: '+81', label: '+81 (JP)' },
  { value: '+86', label: '+86 (CN)' },
  { value: '+91', label: '+91 (IN)' },
  { value: '+61', label: '+61 (AU)' },
  { value: '+64', label: '+64 (NZ)' },
  { value: '+82', label: '+82 (KR)' },
  { value: '+351', label: '+351 (PT)' },
  { value: '+353', label: '+353 (IE)' },
  { value: '+41', label: '+41 (CH)' },
  { value: '+31', label: '+31 (NL)' },
  { value: '+46', label: '+46 (SE)' },
  { value: '+47', label: '+47 (NO)' },
  { value: '+48', label: '+48 (PL)' },
  { value: '+7', label: '+7 (RU)' },
  { value: '+90', label: '+90 (TR)' },
  { value: '+971', label: '+971 (AE)' },
  { value: '+972', label: '+972 (IL)' },
  { value: '+27', label: '+27 (ZA)' },
];

const ICONS = {
  user: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z',
  location: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  headline: 'M4 7V4h16v3M9 20h6M12 4v16',
  users: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  email: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6',
  phone: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z',
  globe: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z',
  linkedIn: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z',
  github: 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22',
  link: 'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
  hash: 'M4 9h16M4 15h16M10 3l-2 18M16 3l-2 18',
};

export const PROFILE_FIELD_GROUPS: ProfileFieldGroup[] = [
  {
    name: 'General Information',
    icon: ICONS.user,
    fields: [
      { key: 'firstName', label: 'First Name', icon: ICONS.user, type: 'text', placeholder: 'John', copyable: true },
      { key: 'lastName', label: 'Last Name', icon: ICONS.user, type: 'text', placeholder: 'Doe', copyable: true },
      { key: 'location', label: 'Location', icon: ICONS.location, type: 'text', placeholder: 'New York, NY', copyable: true },
      { key: 'headline', label: 'Headline', icon: ICONS.headline, type: 'text', placeholder: 'Senior Software Engineer', copyable: true },
    ],
    computedFields: [
      {
        id: 'fullName',
        label: 'Full Name',
        icon: ICONS.users,
        derive: (p: UserProfile) => [p.firstName, p.lastName].filter(Boolean).join(' '),
      },
    ],
  },
  {
    name: 'Contact',
    icon: ICONS.email,
    fields: [
      { key: 'email', label: 'Email', icon: ICONS.email, type: 'email', placeholder: 'john@example.com', copyable: true },
      { key: 'countryCode', label: 'Country Code', icon: ICONS.hash, type: 'select', placeholder: '', copyable: false, options: COUNTRY_CODES },
      { key: 'phoneNumber', label: 'Phone Number', icon: ICONS.phone, type: 'tel', placeholder: '555 123 4567', copyable: false },
    ],
    computedFields: [
      {
        id: 'phoneOnly',
        label: 'Phone Number',
        icon: ICONS.phone,
        derive: (p: UserProfile) => p.phoneNumber,
      },
      {
        id: 'phoneWithCode',
        label: 'Full Phone',
        icon: ICONS.phone,
        derive: (p: UserProfile) => p.countryCode && p.phoneNumber ? `${p.countryCode}${p.phoneNumber}` : p.phoneNumber,
      },
    ],
  },
  {
    name: 'Links',
    icon: ICONS.link,
    fields: [
      { key: 'linkedIn', label: 'LinkedIn', icon: ICONS.linkedIn, type: 'url', placeholder: 'https://linkedin.com/in/johndoe', copyable: true },
      { key: 'github', label: 'GitHub', icon: ICONS.github, type: 'url', placeholder: 'https://github.com/johndoe', copyable: true },
      { key: 'website', label: 'Website', icon: ICONS.globe, type: 'url', placeholder: 'https://johndoe.dev', copyable: true },
    ],
  },
];
