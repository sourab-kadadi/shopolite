import { TestBed } from '@angular/core/testing';

import { ItemSubscribeService } from './item-subscribe.service';

describe('ItemSubscribeService', () => {
  let service: ItemSubscribeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemSubscribeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
