import { RichTextElement } from "./RichTextElement";
import { TextBlock } from "./TextBlock";

/**
 * This class represents the rich text section element defined in the Slack API docs
 */
export class RichTextSection extends RichTextElement<TextBlock> {
  constructor() {
    super("rich_text_section");
  }
}
