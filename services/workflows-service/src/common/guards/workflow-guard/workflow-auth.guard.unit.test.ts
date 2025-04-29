import { ClsService } from 'nestjs-cls';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { WorkflowRuntimeData, WorkflowRuntimeDataToken } from '@prisma/client';

import { WorkflowAuthGuard } from './workflow-auth.guard';
import { WorkflowService } from '@/workflow/workflow.service';
import { WorkflowTokenService } from '@/auth/workflow-token/workflow-token.service';

type PartialMock<T> = {
  [P in keyof T]?: jest.Mock;
};

describe('WorkflowAuthGuard', () => {
  let guard: WorkflowAuthGuard;
  let workflowTokenService: PartialMock<WorkflowTokenService>;
  let workflowService: PartialMock<WorkflowService>;

  beforeEach(async () => {
    const mockWorkflowTokenService = {
      findByTokenWithExpiredUnscoped: jest.fn().mockImplementation(() => Promise.resolve(null)),
      findFirstByWorkflowRuntimeDataIdUnscoped: jest
        .fn()
        .mockImplementation(() => Promise.resolve(null)),
    } as PartialMock<WorkflowTokenService>;

    const mockWorkflowService = {
      getWorkflowRuntimeDataById: jest.fn().mockImplementation(() => Promise.resolve(null)),
    } as PartialMock<WorkflowService>;

    const mockClsService = {
      get: jest.fn(),
      set: jest.fn(),
      getId: jest.fn(),
      isActive: jest.fn(),
      run: jest.fn(),
      als: {},
      setIfUndefined: jest.fn(),
      has: jest.fn(),
    } as unknown as ClsService;

    // Create a new instance of WorkflowAuthGuard directly
    guard = new WorkflowAuthGuard(
      mockClsService,
      mockWorkflowService as unknown as WorkflowService,
      mockWorkflowTokenService as unknown as WorkflowTokenService,
    );

    workflowTokenService = mockWorkflowTokenService;
    workflowService = mockWorkflowService;
  });

  const mockExecutionContext = (overrides = {}) => {
    const mockRequest = {
      user: undefined,
      isAuthenticated: jest.fn(),
      headers: {},
      query: {},
      tokenScope: undefined,
      ...overrides,
    };

    return {
      switchToHttp: () => ({
        getRequest: () => mockRequest,
      }),
    } as ExecutionContext;
  };

  describe('Session Authentication', () => {
    it('should allow authenticated user with valid workflow ID', async () => {
      const mockWorkflow: WorkflowRuntimeData = {
        id: 'workflow-1',
        projectId: 'project-1',
        workflowDefinitionId: 'def-1',
        context: {},
        status: 'active',
        state: '{}',
        createdAt: new Date(),
        updatedAt: new Date(),
        businessId: null,
        assigneeId: null,
        resolvedAt: null,
        config: {},
        workflowDefinitionVersion: 1,
        deletedAt: null,
        endUserId: null,
        uiDefinitionId: null,
        tags: [],
        assignedAt: null,
        createdBy: 'SYSTEM',
        salesforceObjectName: null,
        salesforceRecordId: null,
        parentRuntimeDataId: null,
        deletedBy: null,
        actorEndUserId: null,
        actorUserId: null,
      };

      const context = mockExecutionContext({
        isAuthenticated: jest.fn().mockReturnValue(true),
        user: {
          type: 'customer',
          projectIds: ['project-1'],
        },
        query: { workflowId: 'workflow-1' },
      });

      workflowService.getWorkflowRuntimeDataById?.mockImplementation(() =>
        Promise.resolve(mockWorkflow),
      );

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
    });

    it('should reject authenticated user with invalid workflow ID', async () => {
      const context = mockExecutionContext({
        isAuthenticated: jest.fn().mockReturnValue(true),
        user: {
          type: 'customer',
          projectIds: ['project-1'],
        },
        query: { workflowId: 'invalid-workflow' },
      });

      workflowService.getWorkflowRuntimeDataById?.mockImplementation(() => Promise.resolve(null));

      await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
    });

    it('should reject authenticated user without workflow ID', async () => {
      const context = mockExecutionContext({
        isAuthenticated: jest.fn().mockReturnValue(true),
        user: {
          type: 'customer',
          projectIds: ['project-1'],
        },
        query: {},
      });

      await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('Token Authentication', () => {
    it('should allow valid token without workflow ID', async () => {
      const mockToken: WorkflowRuntimeDataToken = {
        id: 'token-1',
        token: 'valid-token',
        workflowRuntimeDataId: 'workflow-1',
        projectId: 'project-1',
        endUserId: 'user-1',
        expiresAt: new Date(Date.now() + 3600000),
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      const context = mockExecutionContext({
        isAuthenticated: jest.fn().mockReturnValue(false),
        headers: { authorization: 'Bearer valid-token' },
      });

      workflowTokenService.findByTokenWithExpiredUnscoped?.mockImplementation(() =>
        Promise.resolve(mockToken),
      );

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
      expect(context.switchToHttp().getRequest().tokenScope).toEqual(mockToken);
    });

    it('should allow valid token with matching workflow ID', async () => {
      const mockToken: WorkflowRuntimeDataToken = {
        id: 'token-1',
        token: 'valid-token',
        workflowRuntimeDataId: 'workflow-1',
        projectId: 'project-1',
        endUserId: 'user-1',
        expiresAt: new Date(Date.now() + 3600000),
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      const context = mockExecutionContext({
        isAuthenticated: jest.fn().mockReturnValue(false),
        headers: { authorization: 'Bearer valid-token' },
        query: { workflowId: 'workflow-1' },
      });

      workflowTokenService.findByTokenWithExpiredUnscoped?.mockImplementation(() =>
        Promise.resolve(mockToken),
      );

      const result = await guard.canActivate(context);

      expect(result).toBe(true);
      expect(context.switchToHttp().getRequest().tokenScope).toEqual(mockToken);
    });

    it('should reject token with mismatched workflow ID', async () => {
      const context = mockExecutionContext({
        isAuthenticated: jest.fn().mockReturnValue(false),
        headers: { authorization: 'Bearer valid-token' },
        query: { workflowId: 'different-workflow' },
      });

      workflowTokenService.findByTokenWithExpiredUnscoped?.mockImplementation(() =>
        Promise.resolve(undefined),
      );

      await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
    });

    it('should reject expired token', async () => {
      const mockToken: WorkflowRuntimeDataToken = {
        id: 'token-1',
        token: 'expired-token',
        workflowRuntimeDataId: 'workflow-1',
        projectId: 'project-1',
        endUserId: 'user-1',
        expiresAt: new Date(Date.now() - 3600000),
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      const context = mockExecutionContext({
        isAuthenticated: jest.fn().mockReturnValue(false),
        headers: { authorization: 'Bearer expired-token' },
      });

      workflowTokenService.findByTokenWithExpiredUnscoped?.mockImplementation(() =>
        Promise.resolve(mockToken),
      );

      await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
    });

    it('should reject token without endUserId', async () => {
      const mockToken: WorkflowRuntimeDataToken = {
        id: 'token-1',
        token: 'valid-token',
        workflowRuntimeDataId: 'workflow-1',
        projectId: 'project-1',
        endUserId: null,
        expiresAt: new Date(Date.now() + 3600000),
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      const context = mockExecutionContext({
        isAuthenticated: jest.fn().mockReturnValue(false),
        headers: { authorization: 'Bearer valid-token' },
      });

      workflowTokenService.findByTokenWithExpiredUnscoped?.mockImplementation(() =>
        Promise.resolve(mockToken),
      );

      await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('Error Cases', () => {
    it('should reject request without token or session', async () => {
      const context = mockExecutionContext({
        isAuthenticated: jest.fn().mockReturnValue(false),
      });

      await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
    });

    it('should reject invalid token', async () => {
      const context = mockExecutionContext({
        isAuthenticated: jest.fn().mockReturnValue(false),
        headers: { authorization: 'Bearer invalid-token' },
      });

      workflowTokenService.findByTokenWithExpiredUnscoped?.mockImplementation(() =>
        Promise.resolve(null),
      );

      await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
    });

    it('should handle malformed authorization header', async () => {
      const context = mockExecutionContext({
        isAuthenticated: jest.fn().mockReturnValue(false),
        headers: { authorization: 'malformed-header' },
      });

      await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException);
    });
  });
});
