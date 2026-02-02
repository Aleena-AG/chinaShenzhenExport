/**
 * Public folder: /accesories/ with sub-folders per sub-category.
 * Use these paths as image src: /accesories/{folder}/{filename}
 */

export type SubCategoryImages = {
  slug: string;
  folderName: string;
  images: string[];
};

import imageMapping from './accessories-image-mapping.json';

const base = '/accesories';
const GPS_TRACKER_FOLDER = 'gps tracker';
const CABLE_LUGS_FOLDER = 'cable lugs';
const FUSE_FOLDER = 'Fuse';
const FUSE_ADAPTER_FOLDER = 'Fuse Adapter';
const TAPE_FOLDER = 'Tape';
const TEMP_DATA_LOGGER_FOLDER = 'Temperature Data Logger';
const RFID_SENSOR_FOLDER = 'RFID Sensor';
const RELAY_HARNESS_FOLDER = 'Relay& harness';

/** Image names come from accessories-image-mapping.json – change filenames there without touching code. */
const CABLE_LUGS_NAME_TO_DEFAULT = (imageMapping as { cableLugs?: { default: Record<string, string> } }).cableLugs?.default as Record<string, string> | undefined;
const CABLE_LUGS_NAME_TO_HOVER = (imageMapping as { cableLugs?: { hover: Record<string, string> } }).cableLugs?.hover as Record<string, string> | undefined;
const FUSE_NAME_TO_DEFAULT = (imageMapping as { fuse?: { default: Record<string, string> } }).fuse?.default as Record<string, string> | undefined;
const FUSE_NAME_TO_HOVER = (imageMapping as { fuse?: { hover: Record<string, string> } }).fuse?.hover as Record<string, string> | undefined;
const FUSE_NAME_TO_GALLERY = (imageMapping as { fuse?: { gallery?: Record<string, string[]> } }).fuse?.gallery as Record<string, string[]> | undefined;
const RELAY_HARNESS_NAME_TO_DEFAULT = (imageMapping as { relayHarness?: { default: Record<string, string> } }).relayHarness?.default as Record<string, string> | undefined;
const RELAY_HARNESS_NAME_TO_HOVER = (imageMapping as { relayHarness?: { hover: Record<string, string> } }).relayHarness?.hover as Record<string, string> | undefined;
const RFID_SENSOR_NAME_TO_DEFAULT = (imageMapping as { rfidSensor?: { default: Record<string, string> } }).rfidSensor?.default as Record<string, string> | undefined;
const RFID_SENSOR_NAME_TO_HOVER = (imageMapping as { rfidSensor?: { hover: Record<string, string> } }).rfidSensor?.hover as Record<string, string> | undefined;
const TEMP_DATA_LOGGER_NAME_TO_DEFAULT = (imageMapping as { temperatureDataLogger?: { default: Record<string, string> } }).temperatureDataLogger?.default as Record<string, string> | undefined;
const TEMP_DATA_LOGGER_NAME_TO_HOVER = (imageMapping as { temperatureDataLogger?: { hover: Record<string, string> } }).temperatureDataLogger?.hover as Record<string, string> | undefined;
const TAPE_NAME_TO_DEFAULT_IMAGE = (imageMapping as { tape?: { default: Record<string, string> } }).tape?.default as Record<string, string> | undefined;
const TAPE_NAME_TO_HOVER_IMAGE = (imageMapping as { tape?: { hover: Record<string, string> } }).tape?.hover as Record<string, string> | undefined;
const FUSE_ADAPTER_NAME_TO_DEFAULT_IMAGE = imageMapping.fuseAdapter.default as Record<string, string>;
const FUSE_ADAPTER_NAME_TO_HOVER_IMAGE = imageMapping.fuseAdapter.hover as Record<string, string>;
const FUSE_ADAPTER_NAME_TO_GALLERY = (imageMapping.fuseAdapter as { gallery?: Record<string, string[]> }).gallery as Record<string, string[]> | undefined;
const GPS_TRACKER_NAME_TO_DEFAULT_IMAGE = imageMapping.gpsTracker.default as Record<string, string>;
const GPS_TRACKER_NAME_TO_HOVER_IMAGE = imageMapping.gpsTracker.hover as Record<string, string>;

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
      'Micro Low Profile Fuse/MLPF.avif',
      'Low Profile Fuse/lpf.jpg',
      'Micro2 Fuse/m2.jpg',
      'Mini Pin Fuse/mpf.png',
      'Mini 3 Pin Fuse/m3.jpg',
    ],
  },
  {
    slug: 'fuses',
    folderName: 'Fuse',
    images: [
      'Micro Low Profile Fuse/MLPF.avif',
      'Low Profile Fuse/lpf.jpg',
      'Micro2 Fuse/m2.jpg',
      'Mini Pin Fuse/mpf.png',
      'Mini 3 Pin Fuse/m3.jpg',
    ],
  },
  {
    slug: 'fuse-adapter',
    folderName: 'Fuse Adapter',
    images: [
      'Mini Pin Fuse Adapter/mpfa.png',
      'Mini 3 Pin Fuse Adapter/M3PFA.avif',
      'Low Profile Fuse Adapter/LPFA.jpg',
      'Micro Pin Fuse Adapter/MPFA.webp',
      'Inline Waterproof RATC Fuse Holder.png',
      'Inline Waterproof ATM Fuse Holder.png',
      'Inline Waterproof MAXI Fuse Holder.png',
      'Inline Waterproof ATC Fuse Holder.png',
    ],
  },
  {
    slug: 'fuse-adapters',
    folderName: 'Fuse Adapter',
    images: [
      'Mini Pin Fuse Adapter/mpfa.png',
      'Mini 3 Pin Fuse Adapter/M3PFA.avif',
      'Low Profile Fuse Adapter/LPFA.jpg',
      'Micro Pin Fuse Adapter/MPFA.webp',
      'Inline Waterproof RATC Fuse Holder.png',
      'Inline Waterproof ATM Fuse Holder.png',
      'Inline Waterproof MAXI Fuse Holder.png',
      'Inline Waterproof ATC Fuse Holder.png',
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

function buildGpsTrackerImageUrl(filename: string): string {
  return `${base}/${encodeURIComponent(GPS_TRACKER_FOLDER)}/${encodeURIComponent(filename)}`;
}

/** Default image (regular, no hover). Use on card default view. */
export function getGpsTrackerDefaultImageUrl(productName: string): string | null {
  const filename = GPS_TRACKER_NAME_TO_DEFAULT_IMAGE[productName];
  if (!filename) return null;
  return buildGpsTrackerImageUrl(filename);
}

/** Hover image (remove-bg). Use on card hover overlay. */
export function getGpsTrackerHoverImageUrl(productName: string): string | null {
  const filename = GPS_TRACKER_NAME_TO_HOVER_IMAGE[productName];
  if (!filename) return null;
  return buildGpsTrackerImageUrl(filename);
}

/** Get image URL for a GPS tracker product by name (default image). Returns null if no match. */
export function getGpsTrackerImageUrl(productName: string): string | null {
  return getGpsTrackerDefaultImageUrl(productName);
}

function buildCableLugsImageUrl(filename: string): string {
  return `${base}/${encodeURIComponent(CABLE_LUGS_FOLDER)}/${encodeURIComponent(filename)}`;
}

/** Default image for Cable Lugs products. Use on card default view. */
export function getCableLugsDefaultImageUrl(productName: string): string | null {
  const filename = CABLE_LUGS_NAME_TO_DEFAULT?.[productName];
  if (!filename) return null;
  return buildCableLugsImageUrl(filename);
}

/** Hover image (removebg) for Cable Lugs products. Use on card hover overlay. */
export function getCableLugsHoverImageUrl(productName: string): string | null {
  const filename = CABLE_LUGS_NAME_TO_HOVER?.[productName];
  if (!filename) return null;
  return buildCableLugsImageUrl(filename);
}

function buildFuseImageUrl(path: string): string {
  const segs = path.includes('/') ? path.split('/') : [path];
  const fullPath = [FUSE_FOLDER, ...segs].map((s) => encodeURIComponent(s)).join('/');
  return `${base}/${fullPath}`;
}

/** Default image for Fuse products. Use on card default view. */
export function getFuseDefaultImageUrl(productName: string): string | null {
  const path = FUSE_NAME_TO_DEFAULT?.[productName];
  if (!path) return null;
  return buildFuseImageUrl(path);
}

/** Hover image (removebg) for Fuse products. Use on card hover overlay. */
export function getFuseHoverImageUrl(productName: string): string | null {
  const path = FUSE_NAME_TO_HOVER?.[productName];
  if (!path) return null;
  return buildFuseImageUrl(path);
}

/** Get image URL for a Fuse product by name (default image). Returns null if no match. */
export function getFuseImageUrl(productName: string): string | null {
  return getFuseDefaultImageUrl(productName);
}

/** Get all gallery image URLs for a Fuse product (single product page). Returns [] if no gallery. */
export function getFuseGalleryUrls(productName: string): string[] {
  const paths = FUSE_NAME_TO_GALLERY?.[productName];
  if (!paths?.length) return [];
  return paths.map((path) => buildFuseImageUrl(path));
}

function buildFuseAdapterImageUrl(path: string): string {
  const segs = path.includes('/') ? path.split('/') : [path];
  const fullPath = [FUSE_ADAPTER_FOLDER, ...segs].map((s) => encodeURIComponent(s)).join('/');
  return `${base}/${fullPath}`;
}

/** Default image (no hover). Use on card default view. */
export function getFuseAdapterDefaultImageUrl(productName: string): string | null {
  const path = FUSE_ADAPTER_NAME_TO_DEFAULT_IMAGE[productName];
  if (!path) return null;
  return buildFuseAdapterImageUrl(path);
}

/** Hover image (another image from sub-folder). Use on card hover overlay. */
export function getFuseAdapterHoverImageUrl(productName: string): string | null {
  const path = FUSE_ADAPTER_NAME_TO_HOVER_IMAGE[productName];
  if (!path) return null;
  return buildFuseAdapterImageUrl(path);
}

/** Get image URL for a Fuse Adapter product by name (default image). Returns null if no match. */
export function getFuseAdapterImageUrl(productName: string): string | null {
  return getFuseAdapterDefaultImageUrl(productName);
}

/** Get all gallery image URLs for a Fuse Adapter product (single product page). Returns [] if no gallery. */
export function getFuseAdapterGalleryUrls(productName: string): string[] {
  const paths = FUSE_ADAPTER_NAME_TO_GALLERY?.[productName];
  if (!paths?.length) return [];
  return paths.map((path) => buildFuseAdapterImageUrl(path));
}

function buildTapeImageUrl(filename: string): string {
  return `${base}/${encodeURIComponent(TAPE_FOLDER)}/${encodeURIComponent(filename)}`;
}

/** Default image for Tape products. Use on card default view. */
export function getTapeDefaultImageUrl(productName: string): string | null {
  const filename = TAPE_NAME_TO_DEFAULT_IMAGE?.[productName];
  if (!filename) return null;
  return buildTapeImageUrl(filename);
}

/** Hover image (removebg) for Tape products. Use on card hover overlay. */
export function getTapeHoverImageUrl(productName: string): string | null {
  const filename = TAPE_NAME_TO_HOVER_IMAGE?.[productName];
  if (!filename) return null;
  return buildTapeImageUrl(filename);
}

function buildTempDataLoggerImageUrl(filename: string): string {
  return `${base}/${encodeURIComponent(TEMP_DATA_LOGGER_FOLDER)}/${encodeURIComponent(filename)}`;
}

/** Default image for Temperature Data Logger products. Use on card default view. */
export function getTempDataLoggerDefaultImageUrl(productName: string): string | null {
  const filename = TEMP_DATA_LOGGER_NAME_TO_DEFAULT?.[productName];
  if (!filename) return null;
  return buildTempDataLoggerImageUrl(filename);
}

/** Hover image (removebg) for Temperature Data Logger products. Use on card hover overlay. */
export function getTempDataLoggerHoverImageUrl(productName: string): string | null {
  const filename = TEMP_DATA_LOGGER_NAME_TO_HOVER?.[productName];
  if (!filename) return null;
  return buildTempDataLoggerImageUrl(filename);
}

function buildRfidSensorImageUrl(filename: string): string {
  return `${base}/${encodeURIComponent(RFID_SENSOR_FOLDER)}/${encodeURIComponent(filename)}`;
}

/** Default image for RFID Sensor / RFID Reader products. Use on card default view. */
export function getRfidSensorDefaultImageUrl(productName: string): string | null {
  const filename = RFID_SENSOR_NAME_TO_DEFAULT?.[productName];
  if (!filename) return null;
  return buildRfidSensorImageUrl(filename);
}

/** Hover image (removebg) for RFID Sensor products. Use on card hover overlay. */
export function getRfidSensorHoverImageUrl(productName: string): string | null {
  const filename = RFID_SENSOR_NAME_TO_HOVER?.[productName];
  if (!filename) return null;
  return buildRfidSensorImageUrl(filename);
}

function buildRelayHarnessImageUrl(filename: string): string {
  return `${base}/${encodeURIComponent(RELAY_HARNESS_FOLDER)}/${encodeURIComponent(filename)}`;
}

/** Default image for Relay & Harness products. Use on card default view. */
export function getRelayHarnessDefaultImageUrl(productName: string): string | null {
  const filename = RELAY_HARNESS_NAME_TO_DEFAULT?.[productName];
  if (!filename) return null;
  return buildRelayHarnessImageUrl(filename);
}

/** Hover image (removebg) for Relay & Harness products. Use on card hover overlay. */
export function getRelayHarnessHoverImageUrl(productName: string): string | null {
  const filename = RELAY_HARNESS_NAME_TO_HOVER?.[productName];
  if (!filename) return null;
  return buildRelayHarnessImageUrl(filename);
}
