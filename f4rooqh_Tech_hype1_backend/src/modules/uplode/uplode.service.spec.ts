import { Test, TestingModule } from '@nestjs/testing';
import { UploadeService } from './uplode.service';

describe('UplodeService', () => {
  let service: UploadeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UploadeService],
    }).compile();

    service = module.get<UploadeService>(UploadeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
