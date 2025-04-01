import { INotificationBuilder } from "../../interfaces/INotificationBuilder";
import { RichTextElement } from "./classes/RichTextElement";
import { RichTextSection } from "./classes/RichTextSection";
import { TextBlock } from "./classes/TextBlock";

export class NotificationBuilder implements INotificationBuilder {
  private message = {
    blocks: [],
  };

  blankSpace(): INotificationBuilder {
    this.message.blocks.push({
      type: "text",
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

function main() {
  const builder = new NotificationBuilder();

  builder
    .header("New Completed Assessment")
    .richText(
      new RichTextSection().add(
        new TextBlock({ text: "by " }),
        new TextBlock({ text: "John Doe", style: { bold: true } }),
      ),
    )
    .divider();

  console.log(JSON.stringify(builder));
}

main();
