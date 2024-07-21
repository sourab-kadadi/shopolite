import { Test, TestingModule } from '@nestjs/testing';
import { CouponListController } from './coupon-list.controller';

describe('CouponList Controller', () => {
  let controller: CouponListController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CouponListController],
    }).compile();

    controller = module.get<CouponListController>(CouponListController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
