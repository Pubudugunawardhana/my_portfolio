import Image from 'next/image';

// Medium's CDN is too slow for the image optimizer (timeouts), so only Cloudinary is optimized.
const OPTIMIZABLE = ['https://res.cloudinary.com/'];

// next/image for known hosts; legacy Base64 or unknown URLs are rendered unoptimized.
export function SmartImage({ src, alt = '', ...props }) {
  if (!src) return null;
  const optimizable = OPTIMIZABLE.some((host) => src.startsWith(host));
  return <Image src={src} alt={alt} unoptimized={!optimizable} {...props} />;
}
