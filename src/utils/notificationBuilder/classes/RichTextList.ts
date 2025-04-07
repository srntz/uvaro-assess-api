import { RichTextElement } from "./RichTextElement";
import { RichTextSection } from "./RichTextSection";

interface IRichTextListOptions {
  style: "bullet" | "ordered";
  border: 0 | 1;
}

export class RichTextList extends RichTextElement<RichTextSection> {
  constructor(options?: IRichTextListOptions) {
    super("rich_text_list", options);
  }
}
