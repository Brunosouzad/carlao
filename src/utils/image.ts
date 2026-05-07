/**
 * Generates an optimized image URL for Supabase Storage
 * or returns the original if not a Supabase URL.
 */
export function getOptimizedImageUrl(url: string, width = 600, quality = 75) {
  if (!url) return "";
  
  // NOTE: Supabase Image Transformation requires a Pro plan for the /render/ endpoint.
  // If you are on a Pro plan, you can uncomment the code below to offload optimization to Supabase.
  // For now, we'll let Next.js (next/image) handle the optimization automatically.
  
  /*
  if (url.includes('.supabase.co/storage/v1/object/public/')) {
    return url
      .replace('/storage/v1/object/public/', '/storage/v1/render/image/public/') 
      + `?width=${width}&quality=${quality}`;
  }
  */
  
  return url;
}

export async function compressAndConvertToWebP(file: File, maxWidth = 1200, quality = 0.8): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (maxWidth / width) * height;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob((blob) => {
          if (blob) {
            const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
              type: "image/webp",
              lastModified: Date.now(),
            });
            resolve(newFile);
          } else {
            reject(new Error("Erro ao comprimir imagem"));
          }
        }, "image/webp", quality);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}
