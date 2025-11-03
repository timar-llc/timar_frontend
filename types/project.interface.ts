import type { ICategory } from "./category.interface";

export interface IProject {
  uuid: string;
  title: string | null;
  description: string | null;
  price: number | null;
  duration: number | null;
  isDraft: boolean;
  isActive: boolean;
  currency: string;
  category: ICategory;
  media: IProjectMedia[];
  technologies: string;
  status: "pending" | "approved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

export interface IProjectMedia {
  uuid: string;
  url: string;
  project?: IProject;
  type: "image" | "video" | "audio";
  createdAt: Date;
  updatedAt: Date;
}
