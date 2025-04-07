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
