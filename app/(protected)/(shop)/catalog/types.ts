export interface Product {
  articul: string | number;
  price: number;
  pricex: number;
  readonly id: string | number;
  image_url: string;
  adv_desc: string;
  image_urls: string[];
  name: string;
  count: number
}
