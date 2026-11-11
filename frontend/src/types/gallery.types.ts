export interface GalleryItem {
  id: number | string;
  image: string;
  title: string;
  description: string;
  category: "Clinic" | "Machines" | "Labs" | string;
  badge?: string;
  location?: string;
  altText?: string;
  displayOrder?: number;
}
