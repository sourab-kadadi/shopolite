import { TestBed } from '@angular/core/testing';

import { FCMnotificationService } from './fcmnotification.service';

describe('FCMnotificationService', () => {
  let service: FCMnotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FCMnotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
