/**
 * Composable for handling pluralization in different languages
 */

export const usePluralization = () => {
  const { t, locale } = useI18n();

  /**
   * Get plural form for a given count and key
   * @param count - The number to pluralize
   * @param key - The pluralization key (e.g., 'days', 'hours', 'tasks')
   * @returns The correct plural form
   */
  const getPlural = (count: number, key: string): string => {
    const pluralKey = `pluralization.${key}`;

    // For Russian, we need to handle the complex plural rules
    if (locale.value === "ru") {
      const mod10 = count % 10;
      const mod100 = count % 100;

      // Russian plural rules
      if (mod100 >= 11 && mod100 <= 19) {
        return t(`${pluralKey}.many`);
      } else if (mod10 === 1) {
        return t(`${pluralKey}.one`);
      } else if (mod10 >= 2 && mod10 <= 4) {
        return t(`${pluralKey}.few`);
      } else {
        return t(`${pluralKey}.many`);
      }
    } else {
      // For English and other languages, use simple one/other rule
      if (count === 1) {
        return t(`${pluralKey}.one`);
      } else {
        return t(`${pluralKey}.other`);
      }
    }
  };

  /**
   * Format a number with its plural form
   * @param count - The number
   * @param key - The pluralization key
   * @returns Formatted string like "5 дней" or "1 day"
   */
  const formatPlural = (count: number, key: string): string => {
    const plural = getPlural(count, key);
    return `${count} ${plural}`;
  };

  /**
   * Format time ago with proper pluralization
   * @param date - The date to format
   * @returns Formatted time ago string
   */
  const formatTimeAgo = (date: Date | string): string => {
    const now = new Date();
    const targetDate = new Date(date);
    const diffInMinutes = Math.floor(
      (now.getTime() - targetDate.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 1) {
      return locale.value === "ru" ? "только что" : "just now";
    }

    if (diffInMinutes < 60) {
      return (
        formatPlural(diffInMinutes, "minutes") +
        (locale.value === "ru" ? " назад" : " ago")
      );
    }

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return (
        formatPlural(diffInHours, "hours") +
        (locale.value === "ru" ? " назад" : " ago")
      );
    }

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) {
      return locale.value === "ru" ? "вчера" : "yesterday";
    }

    if (diffInDays < 7) {
      return (
        formatPlural(diffInDays, "days") +
        (locale.value === "ru" ? " назад" : " ago")
      );
    }

    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks === 1) {
      return locale.value === "ru" ? "неделю назад" : "a week ago";
    }

    if (diffInWeeks < 4) {
      return (
        formatPlural(diffInWeeks, "weeks") +
        (locale.value === "ru" ? " назад" : " ago")
      );
    }

    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths === 1) {
      return locale.value === "ru" ? "месяц назад" : "a month ago";
    }

    if (diffInMonths < 12) {
      return (
        formatPlural(diffInMonths, "months") +
        (locale.value === "ru" ? " назад" : " ago")
      );
    }

    const diffInYears = Math.floor(diffInDays / 365);
    return (
      formatPlural(diffInYears, "years") +
      (locale.value === "ru" ? " назад" : " ago")
    );
  };

  return {
    getPlural,
    formatPlural,
    formatTimeAgo,
  };
};
