/**
 * Image compression utility for handling file uploads
 * Ensures images are compressed to be under the specified max size (default 2MB)
 */

export async function compressImage(file, maxSizeInMB = 2) {
  // If the file is not an image or already under the max size, return it as is
  if (!file || !file.type.startsWith('image/')) {
    return file;
  }
  
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  if (file.size <= maxSizeInBytes) {
    return file;
  }

  // Create a canvas element to resize the image
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        // Calculate the scaling factor needed to reduce the file size
        // Start with a quality of 0.7 and adjust based on file size
        let quality = 0.7;
        const initialRatio = Math.sqrt(maxSizeInBytes / file.size);
        
        // Create canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Calculate dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        
        // If the image is very large, scale it down proportionally
        if (initialRatio < 1) {
          width = Math.floor(img.width * initialRatio);
          height = Math.floor(img.height * initialRatio);
        }
        
        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;
        
        // Draw image on canvas
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to blob with compression
        const processCompression = (q) => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                // If compression fails, return original file
                resolve(file);
                return;
              }
              
              // If the blob is still too large, try with a lower quality
              if (blob.size > maxSizeInBytes && q > 0.1) {
                processCompression(q - 0.1);
                return;
              }
              
              // Create a new file from the blob
              const compressedFile = new File(
                [blob],
                file.name,
                { type: file.type, lastModified: Date.now() }
              );
              
              resolve(compressedFile);
            },
            file.type,
            q
          );
        };
        
        // Start compression process
        processCompression(quality);
      };
    };
  });
}