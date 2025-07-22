export function getDurationList(t: (key: string) => string) {
  return [
    { label: t("add_project.basic_info.project_duration_1_day"), value: 1 },
    { label: t("add_project.basic_info.project_duration_2_days"), value: 2 },
    { label: t("add_project.basic_info.project_duration_3_days"), value: 3 },
    { label: t("add_project.basic_info.project_duration_4_days"), value: 4 },
    { label: t("add_project.basic_info.project_duration_5_days"), value: 5 },
    { label: t("add_project.basic_info.project_duration_6_days"), value: 6 },
    { label: t("add_project.basic_info.project_duration_1_week"), value: 7 },
    { label: t("add_project.basic_info.project_duration_10_days"), value: 10 },
    { label: t("add_project.basic_info.project_duration_2_weeks"), value: 14 },
    { label: t("add_project.basic_info.project_duration_3_weeks"), value: 21 },
    { label: t("add_project.basic_info.project_duration_1_month"), value: 30 },
    { label: t("add_project.basic_info.project_duration_2_months"), value: 60 },
  ];
}

export function formatDuration(t: (key: string) => string, duration: number) {
  const list = getDurationList(t);
  return list.find((item) => item.value === duration)?.label || "";
}
