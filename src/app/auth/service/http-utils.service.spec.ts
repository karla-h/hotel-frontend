import { TestBed } from '@angular/core/testing';

import { HttpUtilsService } from './http-utils.service';

describe('HttpHeadersService', () => {
  let service: HttpUtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpUtilsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
