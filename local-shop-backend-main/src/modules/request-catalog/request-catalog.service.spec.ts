import { Test, TestingModule } from '@nestjs/testing';
import { RequestCatalogService } from './request-catalog.service';

describe('RequestCatalogService', () => {
  let service: RequestCatalogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RequestCatalogService],
    }).compile();

    service = module.get<RequestCatalogService>(RequestCatalogService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
