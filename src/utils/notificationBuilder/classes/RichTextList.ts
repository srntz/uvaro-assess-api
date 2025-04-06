import { RichTextElement } from "./RichTextElement.js";
import { RichTextSection } from "./RichTextSection.js";

interface IRichTextListOptions {
  style: "bullet" | "ordered";
  border: 0 | 1;
}

export class RichTextList extends RichTextElement<RichTextSection> {
  constructor(options?: IRichTextListOptions) {
    super("rich_text_list", options);
  }
}
