type RichTextElementAllowedTypes = "rich_text_section" | "rich_text_list";

export class RichTextElement<T> {
  protected element: {
    type: RichTextElementAllowedTypes;
    options?: object;
    elements: T[];
  };

  protected constructor(type: RichTextElementAllowedTypes, options?: object) {
    this.element = {
      type: type,
      options: options,
      elements: [],
    };
  }

  add(...elements: T[]) {
    elements.forEach((element: T) => {
      this.element.elements.push(element);
    });

    return this;
  }

  toJSON() {
    return {
      type: this.element.type,
      ...this.element.options,
      elements: this.element.elements,
    };
  }
}
