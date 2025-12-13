/**
 * Helper function to get full image URL from backend response
 * Handles both relative paths and full URLs
 */
export function getImageUrl(imagePath: string | null | undefined): string {
  if (!imagePath) {
    return 'https://via.placeholder.com/400x300?text=No+Image';
  }

  // If it's already a full URL, return as is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // If it starts with /storage, prepend API base URL
  const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
  
  // Ensure single slash between base URL and path
  const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  return `${API_BASE_URL}${cleanPath}`;
}



