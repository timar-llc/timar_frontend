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
    media: File[];
    title: string;
    description: string;
    price: number;
    duration: number;
    subcategoryUuid: string;
    technologies?: string[];
    isDraft: boolean;
  }) => {
    const formData = new FormData();

    // Add media files
    if (data.media && data.media.length > 0) {
      data.media.forEach((file) => {
        formData.append("media", file);
      });
    }

    // Add text fields
    formData.append("title", data.title);
    formData.append("description", data.description);
    formData.append("price", String(data.price));
    formData.append("duration", String(data.duration));
    formData.append("categoryUuid", data.subcategoryUuid);
    formData.append("isDraft", String(data.isDraft));

    // Add technologies as array fields (server expects array)
    if (data.technologies && data.technologies.length > 0) {
      data.technologies.forEach((tech) => {
        formData.append("technologies", tech);
      });
    }

    return await apiFetch("/projects", {
      method: "POST",
      body: formData,
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
