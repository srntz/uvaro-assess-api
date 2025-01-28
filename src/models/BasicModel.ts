export abstract class BasicModel {
  public static instantiateFromSourceData(data: any) {}
  public abstract createInsertableJsonObject(): object
  public abstract createFullJsonObject(): object
}
