import type { ICategory } from "@/types/category.interface";
import { v4 as uuidv4 } from "uuid";
import { useI18n } from "vue-i18n";

export const getCategories = (): ICategory[] => {
  const { t } = useI18n();

  return [
    {
      id: uuidv4(),
      name: t("categories.development_and_it.title"),
      slug: "development-it",
      subcategories: [
        {
          id: uuidv4(),
          name: t(
            "categories.development_and_it.subcategories.web_development"
          ),
          slug: "web-development",
        },
        {
          id: uuidv4(),
          name: t(
            "categories.development_and_it.subcategories.mobile_development"
          ),
          slug: "mobile-development",
        },
        {
          id: uuidv4(),
          name: t(
            "categories.development_and_it.subcategories.game_development"
          ),
          slug: "game-development",
        },
        {
          id: uuidv4(),
          name: t(
            "categories.development_and_it.subcategories.devops_infrastructure"
          ),
          slug: "devops-infrastructure",
        },
        {
          id: uuidv4(),
          name: t("categories.development_and_it.subcategories.testing_qa"),
          slug: "testing-qa",
        },
        {
          id: uuidv4(),
          name: t(
            "categories.development_and_it.subcategories.website_builders"
          ),
          slug: "website-builders",
        },
        {
          id: uuidv4(),
          name: t("categories.development_and_it.subcategories.cms"),
          slug: "cms",
        },
        {
          id: uuidv4(),
          name: t(
            "categories.development_and_it.subcategories.scripts_automation"
          ),
          slug: "scripts-automation",
        },
        {
          id: uuidv4(),
          name: t("categories.development_and_it.subcategories.bots_parsers"),
          slug: "bots-parsers",
        },
        {
          id: uuidv4(),
          name: t("categories.development_and_it.subcategories.social_bots"),
          slug: "social-bots",
        },
        {
          id: uuidv4(),
          name: t("categories.development_and_it.subcategories.ai_ml_projects"),
          slug: "ai-ml-projects",
        },
        {
          id: uuidv4(),
          name: t("categories.development_and_it.subcategories.api_work"),
          slug: "api-work",
        },
      ],
    },
    {
      id: uuidv4(),
      name: t("categories.design_and_creative.title"),
      slug: "design-creative",
      subcategories: [
        {
          id: uuidv4(),
          name: t("categories.design_and_creative.subcategories.web_design"),
          slug: "web-design",
        },
        {
          id: uuidv4(),
          name: t("categories.design_and_creative.subcategories.ui_ux_design"),
          slug: "ui-ux-design",
        },
        {
          id: uuidv4(),
          name: t(
            "categories.design_and_creative.subcategories.mobile_app_design"
          ),
          slug: "mobile-app-design",
        },
        {
          id: uuidv4(),
          name: t(
            "categories.design_and_creative.subcategories.graphic_design"
          ),
          slug: "graphic-design",
        },
        {
          id: uuidv4(),
          name: t(
            "categories.design_and_creative.subcategories.logos_branding"
          ),
          slug: "logos-branding",
        },
        {
          id: uuidv4(),
          name: t("categories.design_and_creative.subcategories.illustrations"),
          slug: "illustrations",
        },
        {
          id: uuidv4(),
          name: t("categories.design_and_creative.subcategories.3d_design"),
          slug: "3d-design",
        },
        {
          id: uuidv4(),
          name: t("categories.design_and_creative.subcategories.presentations"),
          slug: "presentations",
        },
        {
          id: uuidv4(),
          name: t("categories.design_and_creative.subcategories.motion_design"),
          slug: "motion-design",
        },
        {
          id: uuidv4(),
          name: t("categories.design_and_creative.subcategories.figma_design"),
          slug: "figma-design",
        },
      ],
    },
    {
      id: uuidv4(),
      name: t("categories.texts_and_content.title"),
      slug: "texts-content",
      subcategories: [
        {
          id: uuidv4(),
          name: t("categories.texts_and_content.subcategories.copywriting"),
          slug: "copywriting",
        },
        {
          id: uuidv4(),
          name: t("categories.texts_and_content.subcategories.rewriting"),
          slug: "rewriting",
        },
        {
          id: uuidv4(),
          name: t("categories.texts_and_content.subcategories.seo_texts"),
          slug: "seo-texts",
        },
        {
          id: uuidv4(),
          name: t(
            "categories.texts_and_content.subcategories.technical_documentation"
          ),
          slug: "technical-documentation",
        },
        {
          id: uuidv4(),
          name: t("categories.texts_and_content.subcategories.translations"),
          slug: "translations",
        },
        {
          id: uuidv4(),
          name: t("categories.texts_and_content.subcategories.article_writing"),
          slug: "article-writing",
        },
        {
          id: uuidv4(),
          name: t(
            "categories.texts_and_content.subcategories.editing_proofreading"
          ),
          slug: "editing-proofreading",
        },
      ],
    },
    {
      id: uuidv4(),
      name: t("categories.marketing_and_advertising.title"),
      slug: "marketing-advertising",
      subcategories: [
        {
          id: uuidv4(),
          name: t("categories.marketing_and_advertising.subcategories.seo_aso"),
          slug: "seo-aso",
        },
        {
          id: uuidv4(),
          name: t(
            "categories.marketing_and_advertising.subcategories.context_advertising"
          ),
          slug: "context-advertising",
        },
        {
          id: uuidv4(),
          name: t("categories.marketing_and_advertising.subcategories.smm"),
          slug: "smm",
        },
        {
          id: uuidv4(),
          name: t(
            "categories.marketing_and_advertising.subcategories.email_marketing"
          ),
          slug: "email-marketing",
        },
        {
          id: uuidv4(),
          name: t(
            "categories.marketing_and_advertising.subcategories.influencer_marketing"
          ),
          slug: "influencer-marketing",
        },
        {
          id: uuidv4(),
          name: t(
            "categories.marketing_and_advertising.subcategories.analytics_optimization"
          ),
          slug: "analytics-optimization",
        },
        {
          id: uuidv4(),
          name: t(
            "categories.marketing_and_advertising.subcategories.landing_creatives"
          ),
          slug: "landing-creatives",
        },
        {
          id: uuidv4(),
          name: t(
            "categories.marketing_and_advertising.subcategories.pr_branding"
          ),
          slug: "pr-branding",
        },
      ],
    },
    {
      id: uuidv4(),
      name: t("categories.audio_video_photo.title"),
      slug: "audio-video-photo",
      subcategories: [
        {
          id: uuidv4(),
          name: t("categories.audio_video_photo.subcategories.video_editing"),
          slug: "video-editing",
        },
        {
          id: uuidv4(),
          name: t(
            "categories.audio_video_photo.subcategories.color_correction"
          ),
          slug: "color-correction",
        },
        {
          id: uuidv4(),
          name: t("categories.audio_video_photo.subcategories.voice_over"),
          slug: "voice-over",
        },
        {
          id: uuidv4(),
          name: t(
            "categories.audio_video_photo.subcategories.music_sound_design"
          ),
          slug: "music-sound-design",
        },
        {
          id: uuidv4(),
          name: t("categories.audio_video_photo.subcategories.podcasts"),
          slug: "podcasts",
        },
        {
          id: uuidv4(),
          name: t("categories.audio_video_photo.subcategories.photo_editing"),
          slug: "photo-editing",
        },
      ],
    },
    {
      id: uuidv4(),
      name: t("categories.ecommerce.title"),
      slug: "ecommerce",
      subcategories: [
        {
          id: uuidv4(),
          name: t("categories.ecommerce.subcategories.online_stores"),
          slug: "online-stores",
        },
        {
          id: uuidv4(),
          name: t("categories.ecommerce.subcategories.payment_integration"),
          slug: "payment-integration",
        },
        {
          id: uuidv4(),
          name: t("categories.ecommerce.subcategories.ecommerce_platforms"),
          slug: "ecommerce-platforms",
        },
        {
          id: uuidv4(),
          name: t("categories.ecommerce.subcategories.marketplace_management"),
          slug: "marketplace-management",
        },
        {
          id: uuidv4(),
          name: t("categories.ecommerce.subcategories.ecommerce_advertising"),
          slug: "ecommerce-advertising",
        },
      ],
    },
    {
      id: uuidv4(),
      name: t("categories.business_and_management.title"),
      slug: "business-management",
      subcategories: [
        {
          id: uuidv4(),
          name: t(
            "categories.business_and_management.subcategories.financial_consulting"
          ),
          slug: "financial-consulting",
        },
        {
          id: uuidv4(),
          name: t(
            "categories.business_and_management.subcategories.business_analysis"
          ),
          slug: "business-analysis",
        },
        {
          id: uuidv4(),
          name: t(
            "categories.business_and_management.subcategories.crm_systems"
          ),
          slug: "crm-systems",
        },
        {
          id: uuidv4(),
          name: t(
            "categories.business_and_management.subcategories.process_automation"
          ),
          slug: "process-automation",
        },
        {
          id: uuidv4(),
          name: t(
            "categories.business_and_management.subcategories.market_research"
          ),
          slug: "market-research",
        },
        {
          id: uuidv4(),
          name: t(
            "categories.business_and_management.subcategories.virtual_assistant"
          ),
          slug: "virtual-assistant",
        },
        {
          id: uuidv4(),
          name: t(
            "categories.business_and_management.subcategories.project_management"
          ),
          slug: "project-management",
        },
        {
          id: uuidv4(),
          name: t(
            "categories.business_and_management.subcategories.reports_dashboards"
          ),
          slug: "reports-dashboards",
        },
      ],
    },
    {
      id: uuidv4(),
      name: t("categories.technical_support_and_administration.title"),
      slug: "technical-support-administration",
      subcategories: [
        {
          id: uuidv4(),
          name: t(
            "categories.technical_support_and_administration.subcategories.server_administration"
          ),
          slug: "server-administration",
        },
        {
          id: uuidv4(),
          name: t(
            "categories.technical_support_and_administration.subcategories.hosting_domains"
          ),
          slug: "hosting-domains",
        },
        {
          id: uuidv4(),
          name: t(
            "categories.technical_support_and_administration.subcategories.site_migration"
          ),
          slug: "site-migration",
        },
        {
          id: uuidv4(),
          name: t(
            "categories.technical_support_and_administration.subcategories.user_support"
          ),
          slug: "user-support",
        },
        {
          id: uuidv4(),
          name: t(
            "categories.technical_support_and_administration.subcategories.crm_implementation"
          ),
          slug: "crm-implementation",
        },
      ],
    },
    {
      id: uuidv4(),
      name: t("categories.education_and_consulting.title"),
      slug: "education-consulting",
      subcategories: [
        {
          id: uuidv4(),
          name: t("categories.education_and_consulting.subcategories.tutoring"),
          slug: "tutoring",
        },
        {
          id: uuidv4(),
          name: t(
            "categories.education_and_consulting.subcategories.training_courses"
          ),
          slug: "training-courses",
        },
        {
          id: uuidv4(),
          name: t(
            "categories.education_and_consulting.subcategories.coaching_mentoring"
          ),
          slug: "coaching-mentoring",
        },
        {
          id: uuidv4(),
          name: t(
            "categories.education_and_consulting.subcategories.technical_consulting"
          ),
          slug: "technical-consulting",
        },
      ],
    },
    {
      id: uuidv4(),
      name: t("categories.legal_and_financial.title"),
      slug: "legal-financial",
      subcategories: [
        {
          id: uuidv4(),
          name: t(
            "categories.legal_and_financial.subcategories.contract_preparation"
          ),
          slug: "contract-preparation",
        },
        {
          id: uuidv4(),
          name: t("categories.legal_and_financial.subcategories.legal_support"),
          slug: "legal-support",
        },
        {
          id: uuidv4(),
          name: t("categories.legal_and_financial.subcategories.accounting"),
          slug: "accounting",
        },
        {
          id: uuidv4(),
          name: t(
            "categories.legal_and_financial.subcategories.business_registration"
          ),
          slug: "business-registration",
        },
        {
          id: uuidv4(),
          name: t(
            "categories.legal_and_financial.subcategories.financial_models"
          ),
          slug: "financial-models",
        },
      ],
    },
    {
      id: uuidv4(),
      name: t("categories.health_and_fitness.title"),
      slug: "health-fitness",
      subcategories: [
        {
          id: uuidv4(),
          name: t(
            "categories.health_and_fitness.subcategories.personal_training"
          ),
          slug: "personal-training",
        },
        {
          id: uuidv4(),
          name: t(
            "categories.health_and_fitness.subcategories.nutrition_consulting"
          ),
          slug: "nutrition-consulting",
        },
        {
          id: uuidv4(),
          name: t(
            "categories.health_and_fitness.subcategories.wellness_coaching"
          ),
          slug: "wellness-coaching",
        },
      ],
    },
    {
      id: uuidv4(),
      name: t("categories.data_analysis.title"),
      slug: "data-analysis",
      subcategories: [
        {
          id: uuidv4(),
          name: t("categories.data_analysis.subcategories.data_processing"),
          slug: "data-processing",
        },
        {
          id: uuidv4(),
          name: t(
            "categories.data_analysis.subcategories.business_intelligence"
          ),
          slug: "business-intelligence",
        },
        {
          id: uuidv4(),
          name: t("categories.data_analysis.subcategories.data_visualization"),
          slug: "data-visualization",
        },
        {
          id: uuidv4(),
          name: t(
            "categories.data_analysis.subcategories.predictive_analytics"
          ),
          slug: "predictive-analytics",
        },
      ],
    },
    {
      id: uuidv4(),
      name: t("categories.other.title"),
      slug: "other",
    },
  ];
};
