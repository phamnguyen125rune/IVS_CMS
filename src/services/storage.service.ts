// COMMENT_OUT: Chưa sử dụng, tránh báo warning ESLint
// // ============================================================
// // Storage Service — Quản lý tải lên và lưu trữ file
// //
// // Hỗ trợ 2 chiến lược (cấu hình qua biến môi trường):
// //   STORAGE_TYPE=local  → lưu trên disk server Next.js
// //   STORAGE_TYPE=s3     → upload lên AWS S3 / S3-compatible
// //
// // Trạng thái: PLACEHOLDER — chưa implement, chỉ đặt vị trí
// // và phác thảo interface để team thống nhất trước khi code.
// // ============================================================

// import { MediaFile } from '@/types';

// // ----------------------------
// // Interface chung — bất kỳ provider nào cũng phải implement
// // ----------------------------

// export interface IStorageService {
//   /**
//    * Upload file, trả về metadata đã lưu.
//    * @param file   - File object từ form upload
//    * @param folder - Thư mục con (VD: 'posts', 'avatars')
//    */
//   upload(file: File, folder?: string): Promise<MediaFile>;

//   /**
//    * Xóa file theo ID hoặc đường dẫn.
//    */
//   delete(fileId: string): Promise<void>;

//   /**
//    * Lấy URL công khai để hiển thị.
//    */
//   getPublicUrl(filename: string): string;
// }

// // ----------------------------
// // Local Storage — lưu trên disk, phục vụ qua Next.js static
// // ----------------------------

// // TODO: Implement khi có yêu cầu cụ thể
// // - Lưu vào public/uploads/ hoặc thư mục ngoài public/
// // - Convert sang WebP bằng sharp
// // - Resize theo preset (thumbnail, medium, full)
// export class LocalStorageService implements IStorageService {
//   async upload(_file: File, _folder?: string): Promise<MediaFile> {
//     throw new Error('LocalStorageService: chưa implement');
//   }

//   async delete(_fileId: string): Promise<void> {
//     throw new Error('LocalStorageService: chưa implement');
//   }

//   getPublicUrl(filename: string): string {
//     return `/uploads/${filename}`;
//   }
// }

// // ----------------------------
// // S3 Storage — upload lên AWS S3 hoặc S3-compatible (MinIO, R2)
// // ----------------------------

// // TODO: Implement khi có S3 credentials
// // - Dùng @aws-sdk/client-s3 hoặc presigned URL
// // - Xử lý image resize trước khi upload (sharp)
// // - Sinh presigned URL cho private bucket
// export class S3StorageService implements IStorageService {
//   async upload(_file: File, _folder?: string): Promise<MediaFile> {
//     throw new Error('S3StorageService: chưa implement');
//   }

//   async delete(_fileId: string): Promise<void> {
//     throw new Error('S3StorageService: chưa implement');
//   }

//   getPublicUrl(filename: string): string {
//     const bucket = process.env.S3_BUCKET_NAME ?? '';
//     const region = process.env.S3_REGION ?? 'ap-southeast-1';
//     return `https://${bucket}.s3.${region}.amazonaws.com/${filename}`;
//   }
// }

// // ----------------------------
// // Factory — chọn provider theo biến môi trường
// // ----------------------------

// // STORAGE_TYPE=local  → dùng LocalStorageService
// // STORAGE_TYPE=s3     → dùng S3StorageService
// // (thêm 'cloudinary' sau nếu cần)

// function createStorageService(): IStorageService {
//   const type = process.env.STORAGE_TYPE ?? 'local';
//   switch (type) {
//     case 's3':
//       return new S3StorageService();
//     case 'local':
//     default:
//       return new LocalStorageService();
//   }
// }

// export const storageService = createStorageService();
