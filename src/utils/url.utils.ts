export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const sanitizeUrl = (url: string): string => {
  const trimmed = url.trim();
  if (!trimmed) return '';

  // Add https if no protocol is specified
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return `https://${trimmed}`;
  }
  return trimmed;
};

export const validateSocialMediaUrl = (
  url: string,
  platform: 'instagram' | 'facebook' | 'youtube' | 'website'
): boolean => {
  if (!url) return true; // Empty URLs are allowed, we just need at least one valid URL

  const sanitized = sanitizeUrl(url);
  if (!isValidUrl(sanitized)) return false;

  const urlObj = new URL(sanitized);

  // Platform-specific validation
  switch (platform) {
    case 'instagram':
      return (
        urlObj.hostname === 'www.instagram.com' ||
        urlObj.hostname === 'instagram.com' ||
        urlObj.hostname === 'ig.me'
      );
    case 'facebook':
      return (
        urlObj.hostname === 'www.facebook.com' ||
        urlObj.hostname === 'facebook.com' ||
        urlObj.hostname === 'fb.me'
      );
    case 'youtube':
      return (
        urlObj.hostname === 'www.youtube.com' ||
        urlObj.hostname === 'youtube.com' ||
        urlObj.hostname === 'youtu.be'
      );
    case 'website':
      return true; // Allow any valid URL for website
    default:
      return false;
  }
};
