import { Test, TestingModule } from '@nestjs/testing';
import { PropertyInvisitorService } from './property-invisitor.service';

describe('PropertyInvisitorService', () => {
  let service: PropertyInvisitorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PropertyInvisitorService],
    }).compile();

    service = module.get<PropertyInvisitorService>(PropertyInvisitorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
