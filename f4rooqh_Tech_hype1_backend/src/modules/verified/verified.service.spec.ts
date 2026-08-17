import { Test, TestingModule } from '@nestjs/testing';
import { VerifiedService } from './verified.service';

describe('VerifiedService', () => {
  let service: VerifiedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VerifiedService],
    }).compile();

    service = module.get<VerifiedService>(VerifiedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
