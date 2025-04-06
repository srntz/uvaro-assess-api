import { RichTextElement } from "./RichTextElement";
import { TextBlock } from "./TextBlock";

export class RichTextSection extends RichTextElement<TextBlock> {
  constructor() {
    super("rich_text_section");
  }
}
