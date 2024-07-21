import { TestBed } from '@angular/core/testing';

import { MyOrderService } from './my-order.service';

describe('MyOrderService', () => {
  let service: MyOrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyOrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
