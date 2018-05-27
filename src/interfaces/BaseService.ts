export interface BaseService<T> {
  getAll: () => Promise<T[]>;
  findById: (id: string | number) => Promise<T | undefined>;
  create: (model: T) => Promise<T>;
  update: (id: string | number, model: T) => Promise<T>;
  delete: (id: string | number) => Promise<T | undefined>;
}
