import { Test, TestingModule } from '@nestjs/testing';
import { BuyerMilestonePaymentService } from './buyer.service';

describe('BuyerService', () => {
  let service: BuyerMilestonePaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BuyerMilestonePaymentService],
    }).compile();

    service = module.get<BuyerMilestonePaymentService>(BuyerMilestonePaymentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
