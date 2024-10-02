import { Type } from '@sinclair/typebox';

const UboGraphSchema = Type.Object({
  id: Type.String(),
  name: Type.String(),
  node: Type.String(),
  type: Type.String(),
  level: Type.String(),
  enName: Type.String(),
  reason: Type.String(),
  bizStatus: Type.String(),
  regNumber: Type.String(),
  enBizStatus: Type.String(),
  jurisdiction: Type.String(),
  establishedDate: Type.String(),
  shareHolders: Type.Array(
    Type.Object({
      nodeId: Type.String(),
      sharePercentage: Type.String(),
    }),
  ),
});

const UboSchema = Type.Object({
  name: Type.String(),
  type: Type.String(),
  enName: Type.String(),
  companyId: Type.String(),
  personalId: Type.String(),
  jurisdiction: Type.String(),
  reasonForType: Type.String(),
  sharePercentage: Type.String(),
  uboPaths: Type.Array(
    Type.Object({
      no: Type.Number(),
      uboShare: Type.String(),
      uboPath: Type.Array(
        Type.Object({
          name: Type.String(),
          level: Type.String(),
          share: Type.String(),
          nodeId: Type.String(),
        }),
      ),
    }),
  ),
});

export const UboPluginSchema = Type.Optional(
  Type.Object({
    name: Type.Optional(Type.String()),
    code: Type.Optional(Type.Number()),
    reason: Type.Optional(Type.String()),
    status: Type.Optional(Type.String()),
    message: Type.Optional(Type.String()),
    orderId: Type.Optional(Type.String()),
    invokedAt: Type.Optional(Type.Number()),
    data: Type.Optional(
      Type.Object({
        nodes: Type.Array(
          Type.Object({
            id: Type.String(),
            data: Type.Object({
              name: Type.String(),
              type: Type.String(),
              sharePercentage: Type.Optional(Type.Number()),
            }),
          }),
        ),
        edges: Type.Array(
          Type.Object({
            id: Type.String(),
            source: Type.String(),
            target: Type.String(),
            data: Type.Object({
              sharePercentage: Type.Optional(Type.Number()),
            }),
          }),
        ),
      }),
    ),
  }),
);
