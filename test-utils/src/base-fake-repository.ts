import { validate, ValidationError } from 'class-validator';

interface BaseModel {
  [key: string]: any;
}

export class BaseFakeRepository<T extends BaseModel> {
  private rows: T[] = [];
  private ModelClass: new () => T;

  constructor(ModelClass: new () => T) {
    this.ModelClass = ModelClass;
  }

  async create(args: { data: Partial<T>; select?: Record<string, boolean> }): Promise<T> {
    const model = await this.initModel(args.data);
    this.rows.push(model);
    return this.deepCopy(model, args.select);
  }

  async findMany(args: { where: Partial<T>; select?: Record<string, boolean> }): Promise<T[]> {
    const rows = this.rows.filter(row => this.matchWhereCondition(row, args.where));
    return rows.map(row => this.deepCopy(row, args.select));
  }

  async findById(id: string): Promise<T> {
    const row = this.findByIdInternal(id);
    return this.deepCopy(row);
  }

  async updateById(id: string, args: { data: Partial<T> }): Promise<T> {
    const row = this.findByIdInternal(id);
    Object.assign(row, args.data);
    return this.deepCopy(row);
  }

  private async initModel(data: Partial<T>): Promise<T> {
    const model = new this.ModelClass();
    Object.assign(model, data);
    await this.validateModel(model);
    return model;
  }

  private async validateModel(model: T): Promise<void> {
    const errors: ValidationError[] = await validate(model);
    if (errors.length > 0) {
      const errorMessage = errors.map(error => Object.values(error.constraints ?? {})).join('\n');
      throw new Error(`Validation error: \n${errorMessage}`);
    }
  }

  private findByIdInternal(id: string): T {
    const row = this.rows.find(row => row.id === id);
    if (!row) {
      throw new Error(`Could not find model with id: ${id}`);
    }
    return row;
  }

  private deepCopy(row: T, select?: Record<string, boolean>): T {
    const modelCopy = { ...row };
    if (select) {
      for (const key of Object.keys(modelCopy)) {
        if (!select[key]) {
          delete modelCopy[key];
        }
      }
    }
    return modelCopy;
  }

  private matchWhereCondition(row: T, where: Partial<T>): boolean {
    for (const key in where) {
      if (row[key] !== where[key]) {
        return false;
      }
    }
    return true;
  }
}
