export interface IService<T, K = {}> {
  getAll(): Promise<T[]>;
  get(id: number): Promise<T>;
  create?(item: K): Promise<T>;
  getRelated?(parentId: number): Promise<T[]>;
}
