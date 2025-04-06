import { INotificationBuilder } from "../../interfaces/INotificationBuilder.js";
import { RichTextElement } from "./classes/RichTextElement.js";

export class NotificationBuilder implements INotificationBuilder {
  private message = {
    blocks: [],
  };

  blankSpace(): INotificationBuilder {
    this.message.blocks.push({
      type: "section",
      text: {
        type: "plain_text",
        text: " ",
      },
    });

    return this;
  }

  header(title: string): INotificationBuilder {
    this.message.blocks.push({
      type: "header",
      text: {
        type: "plain_text",
        text: title,
      },
    });

    return this;
  }

  divider(): INotificationBuilder {
    this.message.blocks.push({
      type: "divider",
    });

    return undefined;
  }

  richText(...elements: RichTextElement<unknown>[]): INotificationBuilder {
    this.message.blocks.push({
      type: "rich_text",
      elements: elements,
    });

    return this;
  }

  protected toJSON() {
    return { ...this.message };
  }
}
