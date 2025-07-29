export interface ICategory {
  id: string;
  name: string;
  slug: string;
  subcategories?: ICategory[];
}
