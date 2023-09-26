import { TestBed } from '@angular/core/testing';

import { UtilitariosService } from './utilitarios.service';

describe('UtilitariosService', () => {
  let service: UtilitariosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilitariosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
