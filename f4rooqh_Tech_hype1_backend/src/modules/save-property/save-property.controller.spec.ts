import { Test, TestingModule } from '@nestjs/testing';
import { SavedListingController } from './save-property.controller';

describe('SavePropertyController', () => {
  let controller: SavedListingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SavedListingController],
      providers: [SavedListingController],
    }).compile();

    controller = module.get<SavedListingController>(SavedListingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
