export interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  linkedIn: string;
  github: string;
  website: string;
  portfolio: string;
  location: string;
  headline: string;
}

export const EMPTY_PROFILE: UserProfile = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  linkedIn: '',
  github: '',
  website: '',
  portfolio: '',
  location: '',
  headline: ''
};

export interface ProfileField {
  key: keyof UserProfile;
  label: string;
  icon: string;
  type: 'text' | 'email' | 'tel' | 'url';
  placeholder: string;
}

export const PROFILE_FIELDS: ProfileField[] = [
  { key: 'firstName', label: 'First Name', icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z', type: 'text', placeholder: 'John' },
  { key: 'lastName', label: 'Last Name', icon: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z', type: 'text', placeholder: 'Doe' },
  { key: 'email', label: 'Email', icon: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6', type: 'email', placeholder: 'john@example.com' },
  { key: 'phone', label: 'Phone', icon: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z', type: 'tel', placeholder: '+1 (555) 123-4567' },
  { key: 'location', label: 'Location', icon: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z', type: 'text', placeholder: 'New York, NY' },
  { key: 'headline', label: 'Headline', icon: 'M4 7V4h16v3M9 20h6M12 4v16', type: 'text', placeholder: 'Senior Software Engineer' },
  { key: 'linkedIn', label: 'LinkedIn', icon: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z', type: 'url', placeholder: 'https://linkedin.com/in/johndoe' },
  { key: 'github', label: 'GitHub', icon: 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22', type: 'url', placeholder: 'https://github.com/johndoe' },
  { key: 'website', label: 'Website', icon: 'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z', type: 'url', placeholder: 'https://johndoe.dev' },
  { key: 'portfolio', label: 'Portfolio', icon: 'M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z', type: 'url', placeholder: 'https://portfolio.johndoe.dev' },
];
