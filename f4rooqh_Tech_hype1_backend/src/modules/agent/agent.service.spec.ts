import { Test, TestingModule } from '@nestjs/testing';
import { AgentMilestonePaymentService } from './agent.service';

describe('AgentService', () => {
  let service: AgentMilestonePaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AgentMilestonePaymentService],
    }).compile();

    service = module.get<AgentMilestonePaymentService>(AgentMilestonePaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
