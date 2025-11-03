export const useProjectApi = () => {
  const { apiFetch } = useApi();
  const locale = useI18n().locale.value;

  // Получить список проектов
  const getProjects = async (params?: {
    page?: number;
    limit?: number;
    categoryUuid?: string;
    userUuid?: string;
  }) => {
    return await apiFetch(`/projects?lang=${locale}`, {
      method: "GET",
      params,
    });
  };

  // Получить проект по ID
  const getProjectById = async (uuid: string) => {
    return await apiFetch(`/projects/${uuid}`, {
      method: "GET",
    });
  };

  // Создать проект
  const createProject = async (data: {
    project_name: string;
    project_category: string;
    project_subcategory: string;
    project_description: string;
    project_price: number;
    project_duration: number;
    technologies?: string[];
    media?: File[];
  }) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key === "media" && Array.isArray(value)) {
        value.forEach((file) => formData.append("media", file));
      } else if (key === "technologies" && Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, String(value));
      }
    });

    return await apiFetch("/projects", {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  // Обновить проект
  const updateProject = async (uuid: string, data: Partial<any>) => {
    return await apiFetch(`/projects/${uuid}`, {
      method: "PUT",
      body: data,
    });
  };

  // Удалить проект
  const deleteProject = async (uuid: string) => {
    return await apiFetch(`/projects/${uuid}`, {
      method: "DELETE",
    });
  };

  // Получить проекты пользователя
  const getUserProjects = async (userId: string) => {
    return await apiFetch(`/users/${userId}/projects`, {
      method: "GET",
    });
  };

  return {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    getUserProjects,
  };
};
