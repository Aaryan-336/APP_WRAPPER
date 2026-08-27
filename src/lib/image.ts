// Client-side logo processing. Uploaded files are downscaled to a small,
// consistent size and re-encoded before being stored — keeps the shared
// config blob (stored server-side in Redis) light regardless of what the
// admin uploads.

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024; // 8MB raw file cap, before resize
const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];

export class ImageProcessingError extends Error {}

export function isAcceptedImageType(file: File): boolean {
  return ACCEPTED_TYPES.includes(file.type);
}

/** Reads an image file, downscales it to fit within `maxDimension` on its
 * longest side (never upscales), and returns a compact data: URL. */
export async function fileToLogoDataUrl(file: File, maxDimension = 320): Promise<string> {
  if (!isAcceptedImageType(file)) {
    throw new ImageProcessingError("Please choose a PNG, JPEG, or WEBP image.");
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new ImageProcessingError("That image is too large — please choose a file under 8MB.");
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await loadImage(objectUrl);
    const scale = Math.min(1, maxDimension / Math.max(img.naturalWidth, img.naturalHeight));
    const width = Math.max(1, Math.round(img.naturalWidth * scale));
    const height = Math.max(1, Math.round(img.naturalHeight * scale));

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new ImageProcessingError("This browser can't process images right now.");
    ctx.drawImage(img, 0, 0, width, height);

    return canvas.toDataURL("image/webp", 0.9);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new ImageProcessingError("That file couldn't be read as an image."));
    img.src = src;
  });
}
