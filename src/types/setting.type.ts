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

  createdAt?: string;
  createdBy?: number;

  updatedAt?: string;
  updatedBy?: number;
}

export type UpdateGeneralInfoRequest = Omit<
  GeneralInfo,
  'generalInfoId' | 'createdAt' | 'createdBy' | 'updatedAt' | 'updatedBy'
>;
