'use client';

import Image from 'next/image';

import { FileArchive, File, Presentation } from 'lucide-react';

import { Media } from '@/types/media/media';
import { getFileExtension } from '@/utils/media/media-file';

import pdfIcon from '@/app/icon/pdf.png';
import docxIcon from '@/app/icon/docx.png';
import xlsxIcon from '@/app/icon/xlsx.png';

interface MediaFileIconProps {
  file: Media;
  size?: number;
  className?: string;
}

export default function MediaFileIcon({ file, size = 64, className = '' }: MediaFileIconProps) {
  const extension = getFileExtension(file);

  if (extension === 'pdf') {
    return (
      <Image
        src={pdfIcon}
        alt="PDF"
        width={size}
        height={size}
        className={`object-contain ${className}`}
      />
    );
  }

  if (extension === 'doc' || extension === 'docx') {
    return (
      <Image
        src={docxIcon}
        alt="Word"
        width={size}
        height={size}
        className={`object-contain ${className}`}
      />
    );
  }

  if (extension === 'xls' || extension === 'xlsx' || extension === 'xlsm' || extension === 'csv') {
    return (
      <Image
        src={xlsxIcon}
        alt="Excel"
        width={size}
        height={size}
        className={`object-contain ${className}`}
      />
    );
  }

  if (extension === 'ppt' || extension === 'pptx') {
    return <Presentation size={size} className={className} />;
  }

  if (extension === 'zip' || extension === 'rar' || extension === '7z') {
    return <FileArchive size={size} className={className} />;
  }

  return <File size={size} className={className} />;
}
