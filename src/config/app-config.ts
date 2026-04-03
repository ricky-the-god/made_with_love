import packageJson from "../../package.json";

export const APP_CONFIG = {
  name: "Made with Love",
  version: packageJson.version,
  get copyright() {
    return `© ${new Date().getFullYear()}, Made with Love.`;
  },
  meta: {
    title: "Made with Love — Preserve family recipes, stories, and traditions",
    description:
      "Made with Love is a private family recipe and memory app. Preserve handwritten recipes, attach family stories, and cook together through a living family tree.",
  },
};
