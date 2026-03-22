export const MAX_IMAGE_BYTES = Math.floor(4.5 * 1024 * 1024);

export type ParsedDataUrl = { mime: string; buffer: Buffer };

export function parseImageBase64(imageBase64: string): ParsedDataUrl {
  const trimmed = imageBase64.trim();
  const dataUrlMatch = trimmed.match(/^data:([^;]+);base64,([\s\S]+)$/);
  if (dataUrlMatch) {
    const mime = dataUrlMatch[1] || "image/png";
    const buffer = Buffer.from(dataUrlMatch[2], "base64");
    return { mime, buffer };
  }
  const buffer = Buffer.from(trimmed, "base64");
  return { mime: "image/png", buffer };
}

export function assertImageSize(buffer: Buffer): void {
  if (buffer.length > MAX_IMAGE_BYTES) {
    throw new Error(`Image too large (max ~${Math.floor(MAX_IMAGE_BYTES / (1024 * 1024))}MB)`);
  }
}
