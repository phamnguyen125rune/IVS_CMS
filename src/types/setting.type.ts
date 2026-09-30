export interface GeneralInfo {
  generalInfoId?: number;

  logo: string;
  companyName: string;

  websiteName?: string;
  websiteDescription?: string;

  email?: string;

  facebookLink?: string;
  twitterLink?: string;
  instagramLink?: string;
  linkedinLink?: string;
  youtubeLink?: string;
  zaloLink?: string;

  companyPhoneNumber?: string;
  address?: string;
  workingHours?: string;
  mapEmbedUrl?: string;

  footerLinks?: string;

  // Header customization
  showTopbar?: boolean;
  topbarAnnouncementText?: string;
  topbarAnnouncementUrl?: string;
  headerCtaText?: string;
  headerCtaUrl?: string;
  showHeaderSearch?: boolean;
  showThemeToggle?: boolean;
  showLanguageSwitch?: boolean;

  // Footer customization
  footerCopyright?: string;
  showNewsletter?: boolean;
  newsletterTitle?: string;
  newsletterDesc?: string;
  footerColumnsJson?: string;

  createdAt?: string;
  createdBy?: number;

  updatedAt?: string;
  updatedBy?: number;
}

export type UpdateGeneralInfoRequest = Omit<
  GeneralInfo,
  'generalInfoId' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'
>;
