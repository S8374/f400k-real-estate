import { Test, TestingModule } from '@nestjs/testing';
import { MilestonePaymentService } from './milestone-payment.service';
import { BuyerMilestonePaymentController } from './milestone-payment.controller';

describe('MilestonePaymentController', () => {
  let controller: BuyerMilestonePaymentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BuyerMilestonePaymentController],
      providers: [MilestonePaymentService],
    }).compile();

    controller = module.get<BuyerMilestonePaymentController>(BuyerMilestonePaymentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
