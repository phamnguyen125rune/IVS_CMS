export interface Collaborator {
  collabId: number;
  collabName: string;
  description?: string;
  position: number;
  companyImage: string;
  visible: boolean;
  createdAt?: string;
  createdBy?: number;
  updatedAt?: string;
  updatedBy?: number;
}

export interface CollaboratorForm {
  collabName: string;
  description: string;
  position: number;
  companyImage: string;
}

export interface Media {
  mediaId: number;
  fileName: string;
  filePath: string;
  mimeType?: string;
  fileType?: string;
  fileSize?: number;
  uploadedAt?: string;
}

export const initialForm: CollaboratorForm = {
  collabName: '',
  description: '',
  position: 1,
  companyImage: '',
};
