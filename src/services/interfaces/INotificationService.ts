export interface INotificationService {
  send(assessmentId: number, userId: string): Promise<void>;
}
