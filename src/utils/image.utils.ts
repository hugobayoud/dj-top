import { ImageOptimisation } from '@/constant/image';

/**
 * Check if the browser supports WebP images and get output format details
 * @returns Object containing output format and extension
 */
export const checkWebPSupport = async (): Promise<{
  outputFormat: string;
  outputExtension: string;
}> => {
  const supportsWebP = await new Promise<boolean>((resolve) => {
    const webP = document.createElement('img');
    webP.onload = () => resolve(webP.height === 1);
    webP.onerror = () => resolve(false);
    webP.src =
      'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';
  });

  const outputFormat = supportsWebP
    ? ImageOptimisation.targetFormat
    : ImageOptimisation.fallbackFormat;
  const outputExtension = supportsWebP ? 'webp' : 'jpg';

  return { outputFormat, outputExtension };
};

/**
 * Optimize an image file
 * @param file - The image file to optimize
 * @returns The optimized image file
 */
export const optimizeImage = (file: File): Promise<Blob> => {
  return new Promise(async (resolve, reject) => {
    // 1. Check if browser supports WebP and get output format details
    const { outputFormat, outputExtension } = await checkWebPSupport();

    // 2. Create an image element to load the file
    const img = document.createElement('img');
    img.onload = () => {
      // Create a canvas with the target dimensions
      const canvas = document.createElement('canvas');
      canvas.width = ImageOptimisation.targetWidth;
      canvas.height = ImageOptimisation.targetHeight;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // 3. Calculate scaling and cropping to maintain aspect ratio
      const scale = Math.max(
        ImageOptimisation.targetWidth / img.width,
        ImageOptimisation.targetHeight / img.height
      );

      // New dimensions after scaling
      const scaledWidth = img.width * scale;
      const scaledHeight = img.height * scale;

      // 4. Calculate cropping coordinates
      const left = (scaledWidth - ImageOptimisation.targetWidth) / 2;
      const top = (scaledHeight - ImageOptimisation.targetHeight) / 2;

      // Fill the canvas with black background (for transparent PNGs)
      ctx.fillStyle = 'black';
      ctx.fillRect(
        0,
        0,
        ImageOptimisation.targetWidth,
        ImageOptimisation.targetHeight
      );

      // Draw the image with cropping
      ctx.drawImage(img, -left, -top, scaledWidth, scaledHeight);

      // Convert to WebP or JPEG
      canvas.toBlob(
        (blob) => {
          if (blob) {
            console.log(
              `Original size: ${Math.round(
                file.size / 1024
              )}KB, Optimized size: ${Math.round(blob.size / 1024)}KB`
            );
            // Create a File object with the right extension
            const optimizedFile = new File(
              [blob],
              `optimized.${outputExtension}`,
              {
                type: outputFormat,
              }
            );
            // Store the extension for later use
            (optimizedFile as any).extension = outputExtension;
            resolve(optimizedFile);
          } else {
            reject(new Error('Failed to convert image to blob'));
          }
        },
        outputFormat,
        ImageOptimisation.imageQuality
      );
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };

    // 5. Load the image from the file
    img.src = URL.createObjectURL(file);
  });
};

/**
 * Validate the dimensions of an image file
 * @param file - The image file to validate
 * @param height - The height of the image
 * @param width - The width of the image
 * @returns boolean
 */
export const validateImageDimensions = (
  file: File,
  height: number,
  width: number
): Promise<boolean> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        resolve(img.width >= width && img.height >= height);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
};
