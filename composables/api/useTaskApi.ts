import type { IPagination } from "@/types/common.interface";
import type { ITask } from "@/types/task.interface";

export const useTaskApi = () => {
  const { apiFetch } = useApi();
  const { locale } = useI18n();
  // Получить список задач
  const getTasks = async (params?: {
    take?: string;
    skip?: string;
    search?: string;
    categoryUuid?: string;
    categorySlugs?: string;
    my?: boolean;
    complexity?: "easy" | "medium" | "hard";
    complexities?: string;
    minPrice?: number;
    maxPrice?: number;
    orderBy?: "priceAsc" | "priceDesc" | "createdAtAsc" | "createdAtDesc";
  }) => {
    const result = await apiFetch<IPagination<ITask>>(
      `/tasks?lang=${locale.value}`,
      {
        method: "GET",
        params,
      }
    );
    return result;
  };

  // Получить задачу по ID
  const getTaskById = async (id: string | number) => {
    return await apiFetch(`/tasks/${id}?lang=${locale.value}`, {
      method: "GET",
    });
  };

  // Создать задачу
  const createTask = async (data: {
    title: string;
    description: string;
    price: number;
    categoryUuid: string;
    duration: number;
    isDraft: boolean;
    files?: File[];
  }) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key === "files" && Array.isArray(value)) {
        value.forEach((file) => formData.append("files", file));
      } else {
        formData.append(key, String(value));
      }
    });

    return await apiFetch("/tasks", {
      method: "POST",
      body: formData,

      // Не устанавливаем Content-Type - браузер сам установит с правильным boundary
    });
  };

  // Обновить задачу
  const updateTask = async (id: string | number, data: Partial<any>) => {
    return await apiFetch(`/tasks/${id}`, {
      method: "PUT",
      body: data,
    });
  };

  // Удалить задачу
  const deleteTask = async (id: string | number) => {
    return await apiFetch(`/tasks/${id}`, {
      method: "DELETE",
    });
  };

  // Откликнуться на задачу
  const applyToTask = async (
    taskId: string | number,
    data: {
      message: string;
      proposed_price?: number;
      proposed_deadline?: number;
    }
  ) => {
    return await apiFetch(`/tasks/${taskId}/apply`, {
      method: "POST",
      body: data,
    });
  };

  // Получить отклики на задачу
  const getTaskApplications = async (taskId: string | number) => {
    return await apiFetch(`/tasks/${taskId}/applications`, {
      method: "GET",
    });
  };

  return {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    applyToTask,
    getTaskApplications,
  };
};
