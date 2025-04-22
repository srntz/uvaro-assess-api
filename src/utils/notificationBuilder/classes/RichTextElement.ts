type RichTextElementAllowedTypes = "rich_text_section" | "rich_text_list";

/**
 * Generic rich text element. Must be initialized through a child class
 */
export class RichTextElement<T> {
  // The JSON structure follows the official Slack API docs.
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

  /*
   * This is an override of the default toJSON(). This method is called when the NotificationBuilder is serialized.
   * The options field gets spread to follow the required structure. The contents inside options vary from child to child.
   * */
  toJSON() {
    return {
      type: this.element.type,
      ...this.element.options,
      elements: this.element.elements,
    };
  }
}
