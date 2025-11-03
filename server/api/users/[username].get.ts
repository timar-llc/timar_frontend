export default defineEventHandler(async (event) => {
  const username = getRouterParam(event, "username");

  if (!username) {
    throw createError({
      statusCode: 400,
      statusMessage: "Username is required",
    });
  }

  try {
    // TODO: Заменить на реальный API бекенда
    // Пока возвращаем моковые данные
    const mockUserData = {
      id: username,
      username: username,
      firstName: "Иван",
      lastName: "Петров",
      email: "ivan.petrov@example.com",
      avatarUrl: "https://i.pravatar.cc/150?u=" + username,
      specialization: "Frontend Developer",
      bio: "Опытный разработчик с 5+ летним стажем. Специализируюсь на Vue.js, React и Node.js. Готов помочь с вашими проектами!",
      balance: 15000,
      rating: 4.8,
      completedProjects: 45,
      totalIncome: 125000,
      skills: ["Vue.js", "React", "Node.js", "TypeScript", "CSS"],
      isOnline: Math.random() > 0.5, // Случайный онлайн статус для демонстрации
      createdAt: "2023-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:00:00Z",
    };

    // Имитируем задержку API
    await new Promise((resolve) => setTimeout(resolve, 500));

    return {
      success: true,
      data: mockUserData,
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);

    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch user profile",
    });
  }
});
