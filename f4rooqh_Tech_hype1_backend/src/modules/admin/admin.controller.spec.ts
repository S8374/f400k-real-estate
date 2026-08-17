import { Test, TestingModule } from '@nestjs/testing';
import { AdminMilestonePaymentController } from './admin.controller';

describe('AdminController', () => {
  let controller: AdminMilestonePaymentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminMilestonePaymentController],
      providers: [AdminMilestonePaymentController],
    }).compile();

    controller = module.get<AdminMilestonePaymentController>(AdminMilestonePaymentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
