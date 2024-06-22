import { Module } from '@nestjs/common';
import { RuleEngineService } from './rule-engine.service';
import { RuleStoreService } from './rule-store.service';

@Module({
  providers: [RuleEngineService, RuleStoreService],
  exports: [RuleEngineService],
})
export class RuleEngineModule {}
