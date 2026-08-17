import { Test, TestingModule } from '@nestjs/testing';
import { PropertyInvisitorController } from './property-invisitor.controller';
import { PropertyInvisitorService } from './property-invisitor.service';

describe('PropertyInvisitorController', () => {
  let controller: PropertyInvisitorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PropertyInvisitorController],
      providers: [PropertyInvisitorService],
    }).compile();

    controller = module.get<PropertyInvisitorController>(PropertyInvisitorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
