export interface FountainAsset {
  line?: number;
  type: "image" | "audio" | "video" | "text";
  value: string;
}