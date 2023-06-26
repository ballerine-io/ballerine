// import { run } from 'node-jq';
// import { BaseContextTransformer, TTransformationLogic } from './types';
// import { TContext } from '../types';
//
// export class JQTransformer extends BaseContextTransformer {
//   name = 'jq-transformer';
//   mapping: TTransformationLogic;
//
//   constructor(mapping: TTransformationLogic) {
//     super();
//     this.mapping = mapping;
//   }
//
//   async transform(context: TContext, options: {}) {
//     const response = await run(this.mapping, context, options);
//
//     return response;
//   }
// }
