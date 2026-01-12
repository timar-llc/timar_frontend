/**
 * Маппинг полных слагов категорий на короткие сокращения для URL
 */
export const categoryShortcuts: Record<string, string> = {
  // Development and IT
  "development-and-it": "dev",
  "web-development": "web",
  "mobile-development": "mobile",
  "game-development": "game",
  "testing-and-qa": "qa",
  "website-builders": "builders",
  cms: "cms",
  "scripting-and-automation": "script",
  "bots-and-parsers": "bots",
  "messenger-bots": "msg-bots",
  "ai-ml-projects": "ai",
  "api-integration": "api",

  // Design and Creativity
  "design-and-creativity": "design",
  "web-design": "web-d",
  "ui-ux-design": "ui",
  "mobile-app-design": "app-d",
  "graphic-design": "graphic",
  "logos-and-branding": "logo",
  illustrations: "illus",
  "3d-design-and-modeling": "3d",
  presentations: "present",
  "motion-design-and-animation": "motion",
  "figma-design": "figma",

  // Writing and Translation
  "writing-and-translation": "write",
  "text-writing": "text",
  copywriting: "copy",
  translation: "trans",
  proofreading: "proof",
  "creative-writing": "creative",
  "technical-writing": "tech-write",
  "content-writing": "content",

  // Marketing and Advertising
  "marketing-and-advertising": "marketing",
  "social-media-marketing": "smm",
  "seo-optimization": "seo",
  "contextual-advertising": "context",
  "email-marketing": "email",
  "content-marketing": "content-m",
  "influencer-marketing": "influencer",
  "analytics-and-research": "analytics",

  // Business and Consulting
  "business-and-consulting": "business",
  "business-plans": "plans",
  "financial-consulting": "finance",
  "legal-consulting": "legal",
  "hr-consulting": "hr",
  "management-consulting": "mgmt",
  "strategy-consulting": "strategy",

  // Tutoring, Languages, Programming, etc.
  "tutoring-languages-programming-etc": "tutor",
  "language-tutoring": "lang",
  "programming-tutoring": "prog-tutor",
  "coaching-and-mentorship": "coach",
  "technical-consulting": "tech-consult",
  "training-courses": "courses",

  // Other categories (добавьте по мере необходимости)
  "photo-and-video": "photo",
  "audio-and-music": "audio",
  "architecture-and-interior": "arch",
  "engineering-and-drawing": "eng",
  "data-entry": "data",
  "virtual-assistant": "va",
};

/**
 * Обратный маппинг: сокращения -> полные слаги
 */
export const categoryShortcutsReverse: Record<string, string> =
  Object.fromEntries(
    Object.entries(categoryShortcuts).map(([key, value]) => [value, key])
  );

/**
 * Сокращает слаги категорий для URL
 * @param slugs - строка со слагами через запятую
 * @returns строка с сокращенными слагами
 */
export const shortenCategorySlugs = (slugs: string): string => {
  if (!slugs || !slugs.trim()) return "";

  return slugs
    .split(",")
    .map((slug) => slug.trim())
    .map((slug) => categoryShortcuts[slug] || slug)
    .join(",");
};

/**
 * Расшифровывает сокращенные слаги обратно в полные
 * @param shortSlugs - строка с сокращенными слагами через запятую
 * @returns строка с полными слагами
 */
export const expandCategorySlugs = (shortSlugs: string): string => {
  if (!shortSlugs || !shortSlugs.trim()) return "";

  return shortSlugs
    .split(",")
    .map((slug) => slug.trim())
    .map((slug) => categoryShortcutsReverse[slug] || slug)
    .join(",");
};
