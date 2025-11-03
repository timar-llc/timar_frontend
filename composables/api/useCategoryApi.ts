import type { ICategory } from "@/types/category.interface";
import { useI18n } from "vue-i18n";
export const useCategoriesApi = () => {
  const { apiFetch } = useApi();

  const getCategories = async () => {
    console.log("useCategoriesApi: getCategories called");
    const locale = useI18n().locale.value;
    console.log("useCategoriesApi: locale =", locale);

    // Пробуем разные варианты передачи локали
    const urls = [
      `/categories?lang=${locale}`,
    ];

    for (const url of urls) {
      try {
        console.log("useCategoriesApi: trying", url);
        const result = await apiFetch<ICategory[]>(url, {
          method: "GET",
        });

        // Принудительно выполняем запрос
        console.log("useCategoriesApi: executing fetch...");
        await result.refresh();

        console.log("useCategoriesApi: result for", url, ":", result);
        console.log("useCategoriesApi: data:", result.data.value);
        console.log("useCategoriesApi: error:", result.error.value);
        console.log("useCategoriesApi: status:", result.status.value);

        // Если запрос успешен, возвращаем результат
        if (result.data.value && !result.error.value) {
          console.log("useCategoriesApi: Success with", url);
          return result;
        }

        // Если есть ошибка, пробуем следующий URL
        if (result.error.value) {
          console.log(
            "useCategoriesApi: Error with",
            url,
            ":",
            result.error.value
          );
        }
      } catch (error) {
        console.error("useCategoriesApi: Error with", url, ":", error);
      }
    }

    // Если все варианты не сработали, возвращаем пустой результат
    console.log("useCategoriesApi: All URLs failed, returning empty result");
    return {
      data: ref([]),
      error: ref(null),
      pending: ref(false),
      status: ref("error"),
      refresh: () => Promise.resolve(),
    };
  };

  return {
    getCategories,
  };
};
