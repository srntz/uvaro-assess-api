export abstract class BaseModel<T extends object> {
  public abstract createInsertableJsonObject(): T;
  public abstract createFullJsonObject(): T;
}
