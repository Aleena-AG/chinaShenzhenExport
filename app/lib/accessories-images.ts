/**
 * Public folder: /accesories/ with sub-folders per sub-category.
 * Use these paths as image src: /accesories/{folder}/{filename}
 */

export type SubCategoryImages = {
  slug: string;
  folderName: string;
  images: string[];
};

const base = '/accesories';

/** Main image for the accessories section. Add main.jpg or main.png in public/accesories to use. */
export const ACCESSORIES_MAIN_IMAGE = `${base}/main.jpg`;

export const ACCESSORIES_SUB_IMAGES: SubCategoryImages[] = [
  {
    slug: 'cable-lugs',
    folderName: 'cable lugs',
    images: ['lugs.png', 'Picture 2.png', 'Picture 3.png', 'Picture4.png', 'Picture5.png', 'Picture6.png', 'Picture7.png', 'Picture8.png'],
  },
  {
    slug: 'gps-trackers',
    folderName: 'gps tracker',
    images: [
      '1200px-ALL-CAN300-side-2024-01-08.png',
      '1200px-FMC150-QJIBO-side-2024-01-11.png',
      '1200px-LV-CAN200-side-2024-01-08.png',
      '3016162109_w640_h640_3016162109.webp',
      '9-550x550.jpg',
      'download.jpeg',
      'fmc150.jpg',
      'fmm640-32e582782163c17aa4bac6cc22fbc17ae4c268046d788b90146529cbeb5ad12f8-009.png',
      'FMM640.png',
      'H0e9ea1dabb994a018f2419aaef40c78al.avif',
      'Hd5932bad26f74ce4bb4d82926be4d7aaA.png',
    ],
  },
  {
    slug: 'relay-harness',
    folderName: 'Relay& harness',
    images: ['12v.jpeg', '4pin.jpg', '5pin.jpeg', 'relay.jpeg'],
  },
  {
    slug: 'rfid-sensor',
    folderName: 'RFID Sensor',
    images: [
      '1w-h0-04p-ms-rfid-reader-1356-mhz.jpg',
      '1w-h0-kbrd-rfid-reader-1356-mhz-emulating-keyboard.jpg',
      '1w-h3-03-m12-rfid-reader-125khz-unique-hid-hitag-12s-jablotron.jpg',
      '1w-h3u-kbrd-rfid-reader-125khz-emulating-usb-keyboard (2).jpg',
      'rs-h0-04p-ms-rfid-reader-1356-mhz.jpg',
    ],
  },
  {
    slug: 'tape',
    folderName: 'Tape',
    images: ['Arkangel Circle Logo copy.jpg', 'pet cloth automotive tape.jpg'],
  },
  {
    slug: 'tapes',
    folderName: 'Tape',
    images: ['Arkangel Circle Logo copy.jpg', 'pet cloth automotive tape.jpg'],
  },
  {
    slug: 'temperature-data-logger',
    folderName: 'Temperature Data Logger',
    images: ['Ulogs3.png', 'Ulogs4.jpg', 'Ulogs5.png', 'Ulogs6.jpg'],
  },
  {
    slug: 'temp-data-logger',
    folderName: 'Temperature Data Logger',
    images: ['Ulogs3.png', 'Ulogs4.jpg', 'Ulogs5.png', 'Ulogs6.jpg'],
  },
  {
    slug: 'fuse',
    folderName: 'Fuse',
    images: [
      'Low Profile Fuse/Low Profile Standard Fuse.jpg',
      'Micro Low Profile Fuse/Micro Low Profile Fuse.jpg',
      'Micro2 Fuse/Micro2 Fuse 1.avif',
      'Mini 3 Pin Fuse/645.png',
      'Mini Pin Fuse/s-l1600.webp',
    ],
  },
  {
    slug: 'fuses',
    folderName: 'Fuse',
    images: [
      'Low Profile Fuse/Low Profile Standard Fuse.jpg',
      'Micro Low Profile Fuse/Micro Low Profile Fuse.jpg',
      'Micro2 Fuse/Micro2 Fuse 1.avif',
      'Mini 3 Pin Fuse/645.png',
      'Mini Pin Fuse/s-l1600.webp',
    ],
  },
  {
    slug: 'fuse-adapter',
    folderName: 'Fuse Adapter',
    images: [
      'Low Profile Fuse Adapter/images.jpg',
      'Micro Pin Fuse Adapter/04-fuse-tap-adapter-4-1100x1100_1000x.webp',
      'Mini 3 Pin Fuse Adapter/s-l1600.webp',
      'Mini Pin Fuse Adapter/Fuse-Tap-Small.png',
    ],
  },
  {
    slug: 'fuse-adapters',
    folderName: 'Fuse Adapter',
    images: [
      'Low Profile Fuse Adapter/images.jpg',
      'Micro Pin Fuse Adapter/04-fuse-tap-adapter-4-1100x1100_1000x.webp',
      'Mini 3 Pin Fuse Adapter/s-l1600.webp',
      'Mini Pin Fuse Adapter/Fuse-Tap-Small.png',
    ],
  },
  {
    slug: 'rfid-reader',
    folderName: 'RFID Sensor',
    images: [
      '1w-h0-04p-ms-rfid-reader-1356-mhz.jpg',
      '1w-h0-kbrd-rfid-reader-1356-mhz-emulating-keyboard.jpg',
      '1w-h3-03-m12-rfid-reader-125khz-unique-hid-hitag-12s-jablotron.jpg',
      '1w-h3u-kbrd-rfid-reader-125khz-emulating-usb-keyboard (2).jpg',
      'rs-h0-04p-ms-rfid-reader-1356-mhz.jpg',
    ],
  },
];

function encodePath(segment: string): string {
  return encodeURIComponent(segment);
}

function buildImageUrl(folderName: string, imgPath: string): string {
  const segs = imgPath.includes('/') ? [folderName, ...imgPath.split('/')] : [folderName, imgPath];
  return `${base}/${segs.map(encodePath).join('/')}`;
}

/** Get image URL for a sub-category by slug. index = which image (for product grid). */
export function getAccessoriesImageUrl(subSlug: string, index: number): string | null {
  const sub = ACCESSORIES_SUB_IMAGES.find((s) => s.slug === subSlug);
  if (!sub || !sub.images.length) return null;
  const img = sub.images[index % sub.images.length];
  return buildImageUrl(sub.folderName, img);
}

/** Get all image URLs for a sub-category. */
export function getAccessoriesImagesBySlug(subSlug: string): string[] {
  const sub = ACCESSORIES_SUB_IMAGES.find((s) => s.slug === subSlug);
  if (!sub) return [];
  return sub.images.map((img) => buildImageUrl(sub.folderName, img));
}

/** Main image URL for accessories. Use on category/accessories pages. */
export function getAccessoriesMainImageUrl(): string {
  return ACCESSORIES_MAIN_IMAGE;
}
