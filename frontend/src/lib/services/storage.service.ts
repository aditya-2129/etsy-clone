import { storage, ID } from "@/lib/appwrite";
import { Permission, Role, type Models } from "appwrite";

// =============================================================================
// Storage Service — File upload/delete/preview for all buckets
// =============================================================================

/**
 * Uploads a file to the specified bucket.
 * @returns The created file document
 */
export async function uploadFile(
  bucketId: string,
  file: File,
  userId?: string
): Promise<Models.File> {
  try {
    const permissions = userId ? [
      Permission.read(Role.any()),
      Permission.update(Role.user(userId)),
      Permission.delete(Role.user(userId)),
    ] : [
      Permission.read(Role.any()),
    ];

    const result = await storage.createFile(bucketId, ID.unique(), file, permissions);
    return result;
  } catch (error) {
    console.error("Failed to upload file:", error);
    throw error;
  }
}

/**
 * Deletes a file from the specified bucket.
 */
export async function deleteFile(
  bucketId: string,
  fileId: string
): Promise<void> {
  try {
    await storage.deleteFile(bucketId, fileId);
  } catch (error) {
    console.error("Failed to delete file:", error);
    throw error;
  }
}

/**
 * Gets a file preview URL with optional transforms (resize, quality).
 * Use this for displaying images in the UI.
 */
export function getFilePreview(
  bucketId: string,
  fileId: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    gravity?: "center" | "top-left" | "top" | "top-right" | "left" | "right" | "bottom-left" | "bottom" | "bottom-right";
  } = {}
): string {
  const { width, height, quality, gravity } = options;

  const url = storage.getFilePreview(
    bucketId,
    fileId,
    width,
    height,
    gravity as never,
    quality
  );

  return url.toString();
}

/**
 * Gets the direct download URL for a file.
 */
export function getFileUrl(bucketId: string, fileId: string): string {
  const url = storage.getFileView(bucketId, fileId);
  return url.toString();
}

/**
 * Gets file metadata (name, size, mime type, etc.)
 */
export async function getFileMetadata(
  bucketId: string,
  fileId: string
): Promise<Models.File> {
  try {
    const file = await storage.getFile(bucketId, fileId);
    return file;
  } catch (error) {
    console.error("Failed to get file metadata:", error);
    throw error;
  }
}

/**
 * Uploads multiple files to a bucket.
 * @returns Array of file IDs
 */
export async function uploadMultipleFiles(
  bucketId: string,
  files: File[],
  userId?: string
): Promise<string[]> {
  try {
    const uploadPromises = files.map((file) => uploadFile(bucketId, file, userId));
    const results = await Promise.all(uploadPromises);
    return results.map((file) => file.$id);
  } catch (error) {
    console.error("Failed to upload multiple files:", error);
    throw error;
  }
}

/**
 * Deletes multiple files from a bucket.
 */
export async function deleteMultipleFiles(
  bucketId: string,
  fileIds: string[]
): Promise<void> {
  try {
    const deletePromises = fileIds.map((id) => deleteFile(bucketId, id));
    await Promise.all(deletePromises);
  } catch (error) {
    console.error("Failed to delete multiple files:", error);
    throw error;
  }
}
