import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { put, del } from "@vercel/blob";

export interface UploadedMediaResult {
  url: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
}

/**
 * Uploads a file. If BLOB_READ_WRITE_TOKEN is configured, it uses Vercel Blob.
 * Otherwise, it falls back to local public/uploads directory.
 */
export async function uploadFileToStorage(
  file: File,
  folder: string = "media"
): Promise<UploadedMediaResult> {
  const isVercelBlobConfigured = !!process.env.BLOB_READ_WRITE_TOKEN;

  if (isVercelBlobConfigured) {
    const filename = `${folder}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const blob = await put(filename, file, { access: "public" });
    return {
      url: blob.url,
      filename: file.name,
      mimeType: file.type,
      sizeBytes: file.size,
    };
  }

  if (process.env.VERCEL) {
    throw new Error("BLOB_READ_WRITE_TOKEN is required for file uploads on Vercel.");
  }

  // Local fallback storage
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const filename = `${Date.now()}-${safeName}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
  
  await mkdir(uploadDir, { recursive: true });
  const filePath = path.join(uploadDir, filename);

  await writeFile(filePath, buffer);

  return {
    url: `/uploads/${folder}/${filename}`,
    filename: file.name,
    mimeType: file.type,
    sizeBytes: file.size,
  };
}

/**
 * Legacy string-return helper used by simple form upload endpoints.
 */
export async function saveUploadedFile(file: File): Promise<string> {
  const result = await uploadFileToStorage(file, "uploads");
  return result.url;
}

/**
 * Deletes a file from storage (handles local cleanup or Vercel Blob deletion).
 */
export async function deleteFileFromStorage(url: string) {
  try {
    if (url.startsWith("http://") || url.startsWith("https://")) {
      await del(url);
    }
  } catch (err) {
    console.error("Storage deletion error:", err);
  }
}
