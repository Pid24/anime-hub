// src/types/html-to-text.d.ts
declare module "html-to-text" {
  export interface HtmlToTextOptions {
    wordwrap?: number | false;
    [key: string]: unknown; // opsi lain biar fleksibel
  }
  export function htmlToText(html: string, options?: HtmlToTextOptions): string;
}
