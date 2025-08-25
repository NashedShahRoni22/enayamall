// utils/share.js (optional for reuse across files)
export const handleShare = async (shareUrl, title = 'Check this out!') => {
  if (navigator.share) {
    try {
      await navigator.share({
        title,
        url: shareUrl,
      });
    } catch (error) {
      console.error('Sharing failed:', error);
    }
  } else {
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Could not copy to clipboard:', err);
    }
  }
};
