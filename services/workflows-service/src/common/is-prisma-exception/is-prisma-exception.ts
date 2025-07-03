import { isType } from '@ballerine/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { z } from 'zod';

const ALL_PRISMA_ERROR_CODES = [
  // Authentication failed
  'P1000',
  // Unable to connect to database
  'P1001',
  // Database server connection timed out
  'P1002',
  // Database does not exist
  'P1003',
  // Operations timed out
  'P1008',
  // Database already exists
  'P1009',
  // User access denied
  'P1010',
  // Error starting transaction
  'P1011',
  // Validation error
  'P1012',
  // Preview feature not enabled
  'P1013',
  // Underlying kind mismatch
  'P1014',
  // Prisma extension error
  'P1015',
  // Engine data loading error
  'P1016',
  // Server closed connection
  'P1017',

  // Query Engine (P2xxx) - Query execution and data validation errors
  // Input value too long
  'P2000',
  // Record does not exist
  'P2001',
  // Unique constraint violation
  'P2002',
  // Foreign key constraint violation
  'P2003',
  // Constraint violation
  'P2004',
  // Value invalid for type
  'P2005',
  // Field value null violation
  'P2006',
  // Data validation error
  'P2007',
  // Failed to parse query
  'P2008',
  // Failed to validate query
  'P2009',
  // Raw query error
  'P2010',
  // Null constraint violation
  'P2011',
  // Missing required value
  'P2012',
  // Missing required argument
  'P2013',
  // Change violates relation
  'P2014',
  // Related record not found
  'P2015',
  // Query interpretation error
  'P2016',
  // Records not connected
  'P2017',
  // Required connected records not found
  'P2018',
  // Input error
  'P2019',
  // Value out of range
  'P2020',
  // Table does not exist
  'P2021',
  // Column does not exist
  'P2022',
  // Inconsistent column data
  'P2023',
  // Query execution timed out
  'P2024',
  // Operation failed
  'P2025',
  // Unsupported feature
  'P2026',
  // Multiple errors
  'P2027',
  // Transaction API error
  'P2028',
  // Query batch error
  'P2029',
  // Explicit transaction required
  'P2030',
  // Transaction rolled back
  'P2031',
  // Number out of range
  'P2033',
  // Transaction timeout
  'P2034',
  // Invalid transaction state
  'P2035',
  // Transaction rollback error
  'P2036',
  // Transaction commit error
  'P2037',

  // Schema Engine (P3xxx) - Schema and migration errors
  // Failed to create database
  'P3000',
  // Migration possible data loss
  'P3001',
  // Migration required
  'P3002',
  // Migration format error
  'P3003',
  // Migration create error
  'P3004',
  // Migration apply error
  'P3005',
  // Migration name required
  'P3006',
  // Migration already exists
  'P3007',
  // Migration not found
  'P3008',
  // Migrate command error
  'P3009',
  // Migration squash error
  'P3010',
  // Migration rolled back
  'P3011',
  // Missing migration file
  'P3012',
  // Conflicting migrations
  'P3013',
  // Migrations list error
  'P3014',
  // Could not find migration
  'P3015',
  // Migration verification error
  'P3016',
  // Migration execution error
  'P3017',
  // Migration manifest error
  'P3018',
  // Migration script error
  'P3019',
  // Migration history error
  'P3020',
  // Migration history conflict
  'P3021',
  // Failed to parse schema
  'P3022',

  // DB Pull (P4xxx) - Database introspection errors
  // Introspection error
  'P4000',
  // Detection conflict
  'P4001',
  // Introspection validation error
  'P4002',

  // Accelerate (P5xxx/P6xxx) - Performance and optimization errors
  // Invalid connection string
  'P5011',
  // Engine version mismatch
  'P6000',
  // Migration pending
  'P6001',
  // Engine not started
  'P6002',
  // Engine timeout
  'P6003',
  // Engine crashed
  'P6004',
  // Engine not found
  'P6005',
  // Engine start error
  'P6006',
  // Engine protocol error
  'P6008',
  // Engine file error
  'P6009',
  // Engine binary error
  'P6010'
] as const;

export const isPrismaException = (value: unknown): value is PrismaClientKnownRequestError =>
  isType(z.object({ code: z.enum(ALL_PRISMA_ERROR_CODES) }))(value);
