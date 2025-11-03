export interface ICategory {
  uuid: string;
  title: string;
  slug: string;
  subcategories?: ICategory[];
  parent?: ICategory;
}
