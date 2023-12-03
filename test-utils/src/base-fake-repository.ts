const { validate } = require('class-validator');

export class BaseFakeRepository {
  #__rows: Array<any> = [];
  #__ModelClass: any;

  constructor(ModelClass: any) {
    this.#__ModelClass = ModelClass;
  }

  async create(args: any) {
    const model = await this.__initModel(args.data);
    this.#__rows.push(model);

    return __deepCopy(model, args.select);
  }

  async createUnscoped(args: any) {
    const model = await this.__initModel(args.data);
    this.#__rows.push(model);

    return __deepCopy(model, args.select);
  }

  async __initModel(data: any) {
    const model = new this.#__ModelClass();
    Object.assign(model, data);

    const errors = await validate(model);
    if (errors.length) throw new Error('\n' + errors);

    return model;
  }

  async findMany(args: any) {
    return this.__findMany(args).map(row => __deepCopy(row, args.select));
  }

  __findMany(args: any) {
    return this.#__rows.filter(row => {
      for (const key in args.where) {
        if (row[key] !== args.where[key]) return false;
      }
      return true;
    });
  }

  __findById(id: string) {
    const rows = this.__findMany({ where: { id: id } });
    if (rows.length === 0) throw new Error(`could not find id ${id}`);
    return rows[0];
  }

  async findById(id: string) {
    const row = this.__findById(id);
    return __deepCopy(row);
  }

  async updateById(id: string, args: any) {
    const row = this.__findById(id);
    Object.assign(row, args.data);
    return __deepCopy(row);
  }
}

function __deepCopy(row: Object, select?: Object) {
  let modelCopy = JSON.parse(JSON.stringify(row));

  if (select) {
    for (let key of Object.keys(modelCopy)) {
      if (select?.[key] !== true) {
        delete modelCopy[key];
      }
    }
  }

  return modelCopy;
}
