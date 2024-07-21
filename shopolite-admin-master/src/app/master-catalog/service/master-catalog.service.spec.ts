import { TestBed } from '@angular/core/testing';

import { MasterCatalogService } from './master-catalog.service';

describe('MasterCatalogService', () => {
  let service: MasterCatalogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MasterCatalogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
