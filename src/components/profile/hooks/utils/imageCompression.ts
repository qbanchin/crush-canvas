
/**
 * Image compression utility functions
 */

// Image compression function
export async function compressImage(
  file: File, 
  maxWidth = 1200, 
  maxHeight = 1200, 
  quality = 0.8
): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      console.log(`Compressing image: ${file.name} (${Math.round(file.size / 1024)}KB)`);
      
      // Create file reader
      const reader = new FileReader();
      
      reader.onload = (readerEvent) => {
        const img = new Image();
        
        img.onload = () => {
          try {
            // Calculate new dimensions while maintaining aspect ratio
            let width = img.width;
            let height = img.height;
            
            if (width > height) {
              if (width > maxWidth) {
                height *= maxWidth / width;
                width = maxWidth;
              }
            } else {
              if (height > maxHeight) {
                width *= maxHeight / height;
                height = maxHeight;
              }
            }
            
            // Create canvas for resizing
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            
            // Draw resized image on canvas
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              reject(new Error("Failed to get canvas context"));
              return;
            }
            
            ctx.drawImage(img, 0, 0, width, height);
            
            // Convert to blob with quality setting
            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  reject(new Error("Failed to create blob from canvas"));
                  return;
                }
                
                // Create and return URL
                const url = URL.createObjectURL(blob);
                console.log(`Compressed image: ${Math.round(blob.size / 1024)}KB (original: ${Math.round(file.size / 1024)}KB)`);
                resolve(url);
              },
              file.type,
              quality
            );
          } catch (err) {
            console.error("Error during image compression:", err);
            // Fallback to original file if compression fails
            const fallbackUrl = URL.createObjectURL(file);
            resolve(fallbackUrl);
          }
        };
        
        img.onerror = () => {
          console.error("Failed to load image for compression");
          // Fallback to original file
          const fallbackUrl = URL.createObjectURL(file);
          resolve(fallbackUrl);
        };
        
        // Set image source from file reader
        if (typeof readerEvent.target?.result === 'string') {
          img.src = readerEvent.target.result;
        } else {
          reject(new Error("Failed to read file"));
        }
      };
      
      reader.onerror = () => {
        reject(new Error("Failed to read file"));
      };
      
      // Read file as data URL
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error in compression function:", error);
      // Fallback to creating a simple object URL without compression
      const fallbackUrl = URL.createObjectURL(file);
      resolve(fallbackUrl);
    }
  });
}
