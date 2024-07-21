import { Test, TestingModule } from '@nestjs/testing';
import { FirbaseFcmService } from './firbase-fcm.service';

describe('FirbaseFcmService', () => {
  let service: FirbaseFcmService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FirbaseFcmService],
    }).compile();

    service = module.get<FirbaseFcmService>(FirbaseFcmService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
