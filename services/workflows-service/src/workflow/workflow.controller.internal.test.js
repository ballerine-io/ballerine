const { WorkflowControllerInternal } = require('./workflow.controller.internal');
const { WorkflowService } = require('./workflow.service');
const { WorkflowDefinitionModel } = require('./workflow-definition.model');
const { WorkflowRuntimeDataRepository } = require('./workflow-runtime-data.repository');

const { validate } = require('class-validator');

function _deepCopy(row) {
  return JSON.parse(JSON.stringify(row));
}

class CommonFakeRepo {
  constructor(ModelClass) {
    this._ModelClass = ModelClass;
    this._rows = [];
  }

  async create(args) {
    const model = await initModel(this._ModelClass, args.data, false);
    this._rows.push(model);
    return model;
  }

  async findMany(args) {
    return this._findMany(args).map(_deepCopy.bind(this));
  }

  _findMany(args) {
    return this._rows.filter(row => {
      for (const key in args.where) {
        if (row[key] !== args.where[key]) return false;
      }
      return true;
    });
  }

  _findById(id) {
    const row = this._findMany({ where: { id: id } });
    return row[0];
  }

  async findById(id) {
    const row = this._findById(id);
    return row && _deepCopy(row);
  }

  async updateById(id, args) {
    const row = this._findById(id);
    row && Object.assign(row, args.data);
    return row && _deepCopy(row);
  }
}

class FakeWorkflowRuntimeDataRepo extends CommonFakeRepo {
  constructor() {
    super(Object);
  }
}

class FakeWorkflowDefinitionRepo extends CommonFakeRepo {
  constructor() {
    super(WorkflowDefinitionModel);
  }
}

async function initModel(ModelClass, args, validate) {
  const model = new ModelClass();
  Object.assign(model, args);

  if (validate) {
    const errors = await validate(model);
    if (errors.length) throw new Error('\n' + errors);
  }

  return model;
}

describe('WorkflowControllerInternal', () => {
  test('listWorkflowDefinitions', async () => {
    const workflowDefinitionRepo = new FakeWorkflowDefinitionRepo();
    const service = new WorkflowService(workflowDefinitionRepo);
    const controller = new WorkflowControllerInternal(service, {});

    await controller.createWorkflowDefinition(undefined, {
      id: '2',
      name: 'name2',
      version: 2,
      definition: {
        initial: 'missing',
      },
      definitionType: 'SomeDefinitionType',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await controller.createWorkflowDefinition(undefined, {
      id: '3',
      name: 'name3',
      version: 2,
      definition: {
        initial: 'missing',
      },
      definitionType: 'SomeDefinitionType',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const definitions = await controller.listWorkflowDefinitions(undefined, {
      query: {
        where: {
          name: 'name3',
        },
      },
    });

    expect(definitions).toHaveLength(1);
    expect(definitions[0].id).toEqual('3');
    expect(definitions[0].name).toEqual('name3');
  });

  test('event', async () => {
    const workflowDefinitionRepo = new FakeWorkflowDefinitionRepo();
    const workflowRuntimeDataRepo = new FakeWorkflowRuntimeDataRepo();
    const service = new WorkflowService(workflowDefinitionRepo, workflowRuntimeDataRepo);
    const controller = new WorkflowControllerInternal(service, {});

    await workflowRuntimeDataRepo.create({
      data: { id: '2', workflowDefinitionId: '2' },
    });

    await controller.createWorkflowDefinition(undefined, {
      id: '2',
      name: 'name2',
      version: 2,
      definition: {
        initial: 'initial',
        states: {
          initial: {
            on: {
              COMPLETE: 'completed',
            },
          },
          completed: {
            type: 'final',
          },
        },
      },
      definitionType: 'SomeDefinitionType',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await controller.event({ id: '2' }, { name: 'COMPLETE' });

    const runtimeData = await workflowRuntimeDataRepo.findById('2');
    expect(runtimeData.state).toEqual('completed');
    expect(runtimeData.status).toEqual('completed');
  });
});
