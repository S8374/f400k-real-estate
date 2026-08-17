import { Test, TestingModule } from '@nestjs/testing';
import { UploadeController } from './uplode.controller';
import { UploadeService } from './uplode.service';

describe('UplodeController', () => {
  let controller: UploadeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadeController],
      providers: [UploadeService],
    }).compile();

    controller = module.get<UploadeController>(UploadeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
