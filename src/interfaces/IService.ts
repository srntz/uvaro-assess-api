export interface IService<T> {
  getAll(): Promise<T[]>;
  get(id: number): Promise<T>;
  getRelated?(parentId: number): Promise<T[]>;
}
