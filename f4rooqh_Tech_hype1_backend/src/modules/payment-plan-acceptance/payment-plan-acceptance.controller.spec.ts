// @ts-nocheck
import { Test, TestingModule } from '@nestjs/testing';
import { PaymentPlanAcceptanceController } from './payment-plan-acceptance.controller';
import { PaymentPlanAcceptanceService } from './payment-plan-acceptance.service';

describe('PaymentPlanAcceptanceController', () => {
  let controller: PaymentPlanAcceptanceController;
  const serviceMock = {
    create: jest.fn(),
    toggle: jest.fn(),
    checkAcceptance: jest.fn(),
    findOne: jest.fn(),
    findByAgent: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentPlanAcceptanceController],
      providers: [
        {
          provide: PaymentPlanAcceptanceService,
          useValue: serviceMock,
        },
      ],
    }).compile();

    controller = module.get<PaymentPlanAcceptanceController>(PaymentPlanAcceptanceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
