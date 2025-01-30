export abstract class BasicModel<T extends object> {
  public static instantiateFromSourceData(data: any) {}
  public abstract createInsertableJsonObject(): T
  public abstract createFullJsonObject(): T
}
