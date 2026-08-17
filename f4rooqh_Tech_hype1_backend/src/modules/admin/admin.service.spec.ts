import { Test, TestingModule } from '@nestjs/testing';
import { AdminMilestonePaymentService } from './admin.service';

describe('AdminService', () => {
  let service: AdminMilestonePaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminMilestonePaymentService],
    }).compile();

    service = module.get<AdminMilestonePaymentService>(AdminMilestonePaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
