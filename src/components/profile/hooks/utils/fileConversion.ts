
/**
 * File conversion utility functions
 */

// Helper function to convert blob URLs to base64
export async function convertBlobToBase64(blobUrl: string): Promise<string> {
  try {
    // Check if it's already a base64 string
    if (blobUrl.startsWith('data:')) {
      return blobUrl;
    }
    
    // Check if it's a valid URL
    if (!blobUrl.startsWith('blob:') && !blobUrl.startsWith('http')) {
      console.error("Invalid blob URL format:", blobUrl.substring(0, 50) + "...");
      throw new Error("Invalid image URL format");
    }
    
    console.log("Converting URL to base64:", blobUrl.substring(0, 30) + "...");
    const response = await fetch(blobUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }
    
    const blob = await response.blob();
    
    if (!blob.type.startsWith('image/')) {
      throw new Error(`Invalid file type: ${blob.type}`);
    }
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onloadend = () => {
        const result = reader.result as string;
        if (!result || typeof result !== 'string') {
          reject(new Error("Failed to convert image to base64"));
          return;
        }
        console.log("Successfully converted to base64:", result.substring(0, 30) + "...");
        resolve(result);
      };
      
      reader.onerror = () => {
        reject(new Error("Error reading file"));
      };
      
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Error converting blob to base64:", error);
    // Return original URL if it's a normal http/https URL
    if (blobUrl.startsWith('http')) {
      return blobUrl;
    }
    throw new Error("Failed to process image");
  }
}
