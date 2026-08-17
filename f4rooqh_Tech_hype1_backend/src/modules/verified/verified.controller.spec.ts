import { Test, TestingModule } from '@nestjs/testing';
import { VerifiedController } from './verified.controller';
import { VerifiedService } from './verified.service';

describe('VerifiedController', () => {
  let controller: VerifiedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VerifiedController],
      providers: [VerifiedService],
    }).compile();

    controller = module.get<VerifiedController>(VerifiedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
