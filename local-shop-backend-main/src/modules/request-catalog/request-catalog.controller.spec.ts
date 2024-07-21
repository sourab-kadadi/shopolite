import { Test, TestingModule } from '@nestjs/testing';
import { RequestCatalogController } from './request-catalog.controller';

describe('RequestCatalog Controller', () => {
  let controller: RequestCatalogController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RequestCatalogController],
    }).compile();

    controller = module.get<RequestCatalogController>(RequestCatalogController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
