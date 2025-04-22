import { INotificationBuilder } from "../../interfaces/INotificationBuilder";

export interface INotificationService {
  /**
   * Builds an assessment completion notification
   * @param assessmentId
   * @param userId
   * @returns ```Promise<INotificationBuilder>```
   */
  build(assessmentId: number, userId: string): Promise<INotificationBuilder>;

  /**
   * Sends the notification to Slack
   * @param builder
   * @returns ```Promise<void>```
   */
  send(builder: INotificationBuilder): Promise<void>;
}
