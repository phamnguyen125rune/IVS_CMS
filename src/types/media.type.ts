export interface Media {
  mediaId: number;
  fileName: string;
  filePath: string;
  fileType?: string;
  mimeType?: string;
  fileSize?: number;
  uploadedAt?: string;
  uploadedBy?: string;
  mediaWidth: number | null;
  mediaHeight: number | null;
}

export type MediaResponse =
  | Media[]
  | {
      result?: Media[];
      data?: Media[];
    };

export type ViewMode = 'grid' | 'list';
