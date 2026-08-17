import { Test, TestingModule } from '@nestjs/testing';
import { PaymentPlanAcceptanceService } from './payment-plan-acceptance.service';

describe('PaymentPlanAcceptanceService', () => {
  let service: PaymentPlanAcceptanceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PaymentPlanAcceptanceService],
    }).compile();

    service = module.get<PaymentPlanAcceptanceService>(PaymentPlanAcceptanceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
