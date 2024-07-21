import { TestBed } from '@angular/core/testing';

import { ExcelDumpService } from './excel-dump.service';

describe('ExcelDumpService', () => {
  let service: ExcelDumpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExcelDumpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
