export interface ICreateProjectState {
  // Basic Info
  title: string;
  categoryUuid: string;
  subcategoryUuid?: string;
  price: number;
  duration: number;
  description: string;

  // Media
  media: File[];

  // Technologies
  technologies: string[];

  // Additional
  isDraft: boolean;
}

const defaultState: ICreateProjectState = {
  title: "",
  categoryUuid: "",
  subcategoryUuid: undefined,
  price: 0,
  duration: 1,
  description: "",
  media: [],
  technologies: [],
  isDraft: false,
};

export const useCreateProjectState = () => {
  const state = useState<ICreateProjectState>("createProject", () => ({
    ...defaultState,
  }));

  const resetState = () => {
    state.value = { ...defaultState };
  };

  return {
    state,
    resetState,
  };
};
