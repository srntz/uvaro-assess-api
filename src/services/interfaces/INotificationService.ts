export interface INotificationService {
  send(assessmentId: number): Promise<void>;
}
