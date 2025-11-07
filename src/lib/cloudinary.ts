import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
const cloudinaryConfig = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
};

if (
  !cloudinaryConfig.cloud_name ||
  !cloudinaryConfig.api_key ||
  !cloudinaryConfig.api_secret
) {
  throw new Error(
    "Missing Cloudinary environment variables. Please check your .env file."
  );
}

cloudinary.config(cloudinaryConfig);

export interface CloudinaryUploadResult {
  public_id: string;
  url: string;
  secure_url: string;
  format: string;
  resource_type: string;
  bytes: number;
}

/**
 * Detect resource type from file name
 * Only supports images and documents (raw), no videos
 */
function getResourceType(fileName: string): "image" | "raw" {
  const extension = fileName.toLowerCase().split(".").pop() || "";
  
  // Only images get special treatment, everything else is 'raw'
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "bmp"];
  
  if (imageExtensions.includes(extension)) {
    return "image";
  }
  
  // All documents (PDF, DOCX, TXT, CSV, XLSX, etc.) are 'raw'
  return "raw";
}

/**
 * Upload file to Cloudinary
 * @param buffer - File buffer
 * @param fileName - Original file name
 * @param folder - Cloudinary folder path
 * @returns Upload result with URL
 */
export async function uploadFileToCloudinary(
  buffer: Buffer,
  fileName: string,
  folder: string
): Promise<CloudinaryUploadResult> {
  try {
    const resourceType = getResourceType(fileName);
    console.log(`Uploading ${fileName} as resource type: ${resourceType}`);
    
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: resourceType, // Explicitly set based on file type
          public_id: fileName.split(".")[0], // Use filename without extension as public_id
          use_filename: true,
          unique_filename: true,
          access_mode: "public", // Make file publicly accessible
          type: "upload", // Use upload type (not authenticated)
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error);
            reject(new Error("Gagal upload file ke Cloudinary"));
          } else if (result) {
            resolve({
              public_id: result.public_id,
              url: result.url,
              secure_url: result.secure_url,
              format: result.format,
              resource_type: result.resource_type,
              bytes: result.bytes,
            });
          } else {
            reject(new Error("Hasil upload tidak tersedia"));
          }
        }
      );

      uploadStream.end(buffer);
    });
  } catch (error) {
    console.error("Error in uploadFileToCloudinary:", error);
    throw new Error("Gagal upload file ke Cloudinary");
  }
}

/**
 * Delete file from Cloudinary
 * @param publicId - Cloudinary public ID
 * @param resourceType - Resource type (image or raw)
 */
export async function deleteFileFromCloudinary(
  publicId: string,
  resourceType: "image" | "raw" = "raw"
): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw new Error("Gagal hapus file dari Cloudinary");
  }
}

/**
 * Get file URL from public ID
 * @param publicId - Cloudinary public ID
 * @returns Secure URL
 */
export function getCloudinaryUrl(publicId: string): string {
  return cloudinary.url(publicId, {
    secure: true,
  });
}

/**
 * Download file from Cloudinary with authentication fallback
 * @param fileUrl - Cloudinary file URL
 * @returns File buffer
 */
export async function downloadFileFromCloudinary(
  fileUrl: string
): Promise<Buffer> {
  try {
    console.log("Attempting direct download from:", fileUrl);
    
    // Try direct download first
    const response = await fetch(fileUrl);
    
    if (response.ok) {
      const arrayBuffer = await response.arrayBuffer();
      console.log("Direct download successful!");
      return Buffer.from(arrayBuffer);
    }

    // If unauthorized, try with signed URL
    if (response.status === 401 || response.status === 403) {
      console.log("Direct download unauthorized (status:", response.status, "), trying with signed URL...");
      
      // Extract public_id from URL
      const urlParts = fileUrl.split("/");
      const uploadIndex = urlParts.indexOf("upload");
      if (uploadIndex === -1) {
        throw new Error("Invalid Cloudinary URL format - 'upload' not found in URL");
      }
      
      // Get everything after "upload/" (version + path)
      const pathParts = urlParts.slice(uploadIndex + 1);
      
      // Remove version if present (starts with 'v' followed by numbers)
      const versionRegex = /^v\d+$/;
      if (versionRegex.test(pathParts[0])) {
        console.log("Removing version from path:", pathParts[0]);
        pathParts.shift();
      }
      
      // The public_id includes folder path + filename
      const publicIdWithFolder = decodeURIComponent(pathParts.join("/"));
      console.log("Extracted public_id:", publicIdWithFolder);
      
      // Detect resource type from URL or filename
      let resourceType: "image" | "raw";
      if (fileUrl.includes("/image/upload/")) {
        resourceType = "image";
      } else if (fileUrl.includes("/raw/upload/")) {
        resourceType = "raw";
      } else {
        // Fallback: detect from file extension
        const fileName = pathParts.at(-1) || "";
        resourceType = getResourceType(fileName);
      }
      
      console.log("Using resource_type:", resourceType);

      // Generate signed URL using Cloudinary SDK
      const signedUrl = cloudinary.url(publicIdWithFolder, {
        secure: true,
        resource_type: resourceType,
        sign_url: true,
        type: "upload",
      });

      console.log("Generated signed URL, attempting download...");
      const signedResponse = await fetch(signedUrl);
      
      if (!signedResponse.ok) {
        console.error("Signed URL also failed:", signedResponse.status, signedResponse.statusText);
        throw new Error(`Failed to download with signed URL: ${signedResponse.statusText}`);
      }

      const arrayBuffer = await signedResponse.arrayBuffer();
      console.log("Signed URL download successful!");
      return Buffer.from(arrayBuffer);
    }

    throw new Error(`Failed to download file: ${response.status} ${response.statusText}`);
  } catch (error) {
    console.error("Error downloading from Cloudinary:", error);
    throw error;
  }
}

export default cloudinary;

