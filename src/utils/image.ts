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
