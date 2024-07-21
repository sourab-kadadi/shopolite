import { Test, TestingModule } from '@nestjs/testing';
import { CouponListService } from './coupon-list.service';

describe('CouponListService', () => {
  let service: CouponListService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CouponListService],
    }).compile();

    service = module.get<CouponListService>(CouponListService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
