const defaultConfig = {
  siteName: "社区广场",
  brandMark: "社",
  description: "分享实践、提出问题、沉淀值得被检索的讨论。",
  repository: "",
  repositoryId: "",
  discussionCategory: "General",
  discussionCategoryId: "",
  giscusTerm: "community-home",
  categories: [],
};

const config = { ...defaultConfig, ...(window.FORUM_CONFIG || {}) };

const elements = {
  brandMark: document.querySelector("#brandMark"),
  brandName: document.querySelector("#brandName"),
  siteName: document.querySelector("#siteName"),
  siteDescription: document.querySelector("#siteDescription"),
  footerName: document.querySelector("#footerName"),
  currentYear: document.querySelector("#currentYear"),
  connectionStatus: document.querySelector("#connectionStatus"),
  repositoryLink: document.querySelector("#repositoryLink"),
  browseDiscussions: document.querySelector("#browseDiscussions"),
  newDiscussion: document.querySelector("#newDiscussion"),
  allDiscussions: document.querySelector("#allDiscussions"),
  categoryGrid: document.querySelector("#categoryGrid"),
  configState: document.querySelector("#setup"),
  giscusMount: document.querySelector("#giscusMount"),
};

const repository = normalizeRepository(config.repository);
const repositoryReady = Boolean(repository);
const giscusReady = repositoryReady
  && hasValue(config.repositoryId)
  && hasValue(config.discussionCategory)
  && hasValue(config.discussionCategoryId);

renderIdentity();
renderRepositoryLinks();
renderCategories();
renderDiscussion();

function renderIdentity() {
  document.title = `${config.siteName} | 社区`;
  elements.brandMark.textContent = config.brandMark || config.siteName.slice(0, 1);
  elements.brandName.textContent = config.siteName;
  elements.siteName.textContent = config.siteName;
  elements.siteDescription.textContent = config.description;
  elements.footerName.textContent = config.siteName;
  elements.currentYear.textContent = new Date().getFullYear();
}

function renderRepositoryLinks() {
  if (!repositoryReady) {
    elements.configState.hidden = false;
    elements.connectionStatus.textContent = "等待仓库配置";
    return;
  }

  const repositoryUrl = `https://github.com/${repository}`;
  const discussionsUrl = `${repositoryUrl}/discussions`;
  const newDiscussionUrl = `${discussionsUrl}/new/choose`;

  setExternalLink(elements.repositoryLink, repositoryUrl);
  setExternalLink(elements.browseDiscussions, discussionsUrl);
  setExternalLink(elements.newDiscussion, newDiscussionUrl);
  setExternalLink(elements.allDiscussions, discussionsUrl);
  elements.connectionStatus.textContent = repository;
  elements.configState.hidden = giscusReady;
}

function renderCategories() {
  const categories = Array.isArray(config.categories) ? config.categories : [];
  const items = categories.length ? categories : defaultCategories();

  elements.categoryGrid.replaceChildren(...items.map((category, index) => {
    const article = document.createElement("article");
    article.className = `category-card tone-${normalizeTone(category.tone)}`;

    const link = document.createElement("a");
    const slug = String(category.slug || "").trim();
    link.href = repositoryReady && slug
      ? `https://github.com/${repository}/discussions/categories/${encodeURIComponent(slug)}`
      : "#setup";

    if (repositoryReady && slug) {
      link.target = "_blank";
      link.rel = "noreferrer";
    }

    const number = document.createElement("span");
    number.className = "category-index";
    number.textContent = String(index + 1).padStart(2, "0");

    const content = document.createElement("span");
    content.className = "category-copy";

    const title = document.createElement("strong");
    title.textContent = category.name || "未命名分区";

    const description = document.createElement("span");
    description.textContent = category.description || "";

    const arrow = document.createElement("span");
    arrow.className = "category-arrow";
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "→";

    content.append(title, description);
    link.append(number, content, arrow);
    article.append(link);
    return article;
  }));
}

function renderDiscussion() {
  if (!giscusReady) return;

  elements.giscusMount.replaceChildren();

  const script = document.createElement("script");
  script.src = "https://giscus.app/client.js";
  script.async = true;
  script.crossOrigin = "anonymous";
  script.dataset.repo = repository;
  script.dataset.repoId = config.repositoryId;
  script.dataset.category = config.discussionCategory;
  script.dataset.categoryId = config.discussionCategoryId;
  script.dataset.mapping = "specific";
  script.dataset.term = config.giscusTerm || "community-home";
  script.dataset.strict = "1";
  script.dataset.reactionsEnabled = "1";
  script.dataset.emitMetadata = "0";
  script.dataset.inputPosition = "top";
  script.dataset.theme = "preferred_color_scheme";
  script.dataset.lang = "zh-CN";
  script.dataset.loading = "lazy";
  elements.giscusMount.append(script);
}

function setExternalLink(element, url) {
  element.href = url;
  element.target = "_blank";
  element.rel = "noreferrer";
}

function normalizeRepository(value) {
  const repositoryName = String(value || "").trim();
  return /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repositoryName) ? repositoryName : "";
}

function normalizeTone(value) {
  return ["green", "coral", "gold", "blue"].includes(value) ? value : "green";
}

function hasValue(value) {
  return Boolean(String(value || "").trim());
}

function defaultCategories() {
  return [
    { name: "交流讨论", description: "开放话题与社区交流。", slug: "general", tone: "green" },
  ];
}
