export interface ITextBlockPartial {
  text: string;
  style?: {
    bold?: boolean;
    italic?: boolean;
  };
}

interface ITextBlock extends ITextBlockPartial {
  type: "text";
}

/**
 * This class represents the regular text block defined in the Slack API docs
 */
export class TextBlock {
  private element: ITextBlock;

  constructor(options: ITextBlockPartial) {
    this.element = {
      type: "text",
      text: options.text,
      style: options.style,
    };
  }

  toJSON() {
    return { ...this.element };
  }
}
