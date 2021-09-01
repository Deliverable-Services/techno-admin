export interface AdType {
  id: string;
  name: string;
}
export const types: Array<AdType> = [
  { id: "trending", name: "Trending" },
  { id: "latest", name: "Latest" },
  { id: "offer", name: "Offer" },
];
