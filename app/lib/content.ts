import raw from "../../data/content.json";

export type SiteContent = typeof raw;

export const content: SiteContent = raw;

export const site = content.site;
