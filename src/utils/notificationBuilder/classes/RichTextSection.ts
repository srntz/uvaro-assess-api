import { RichTextElement } from "./RichTextElement.js";
import { TextBlock } from "./TextBlock.js";

export class RichTextSection extends RichTextElement<TextBlock> {
  constructor() {
    super("rich_text_section");
  }
}
