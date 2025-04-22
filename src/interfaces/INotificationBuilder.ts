import { RichTextElement } from "../utils/notificationBuilder/classes/RichTextElement";

/**
 * Builds JSON objects for messages according to the specifications of the Slack API
 */
export interface INotificationBuilder {
  /**
   * Inserts a plain text header with the provided text content.
   * @param text Header text
   * @returns ```this```
   */
  header(text: string): INotificationBuilder;

  /**
   * Inserts a divider (horizontal line).
   * @returns ```this```
   */
  divider(): INotificationBuilder;

  /**
   * Inserts an empty section. This can be used for separating content.
   * @returns ```this```
   */
  blankSpace(): INotificationBuilder;

  /**
   * Inserts a rich text section containing the provided children.
   * @param elements Rich text elements that would be inserted into the section.
   * @returns ```this```
   */
  richText(...elements: RichTextElement<unknown>[]): INotificationBuilder;
}
