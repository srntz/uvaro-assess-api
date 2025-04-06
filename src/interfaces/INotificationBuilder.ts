import { RichTextElement } from "../utils/notificationBuilder/classes/RichTextElement";

export interface INotificationBuilder {
  header(text: string): INotificationBuilder;
  divider(): INotificationBuilder;
  blankSpace(): INotificationBuilder;
  richText(...elements: RichTextElement<unknown>[]): INotificationBuilder;
}
