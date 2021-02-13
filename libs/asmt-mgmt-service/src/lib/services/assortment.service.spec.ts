import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed, inject } from '@angular/core/testing';
import { environment } from '@mpe/home/src/environments/environment';
import { IAssortment } from '@mpe/shared';
import { AssortmentService } from './assortment.service';
import { fakeAssortments } from './assortment.service.spec.data';

describe('Assortment Management - AssortmentService', () => {
  let assortmentService: AssortmentService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AssortmentService],
    });

    assortmentService = TestBed.inject(AssortmentService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('when getAssortments called, returns observable of IAssortments', inject([AssortmentService], (service: AssortmentService) => {
    // tests will be invoked after fake request/response fires
    service.getAssortmentsByLevel(0).subscribe((assortments: IAssortment[]) => {
      expect(assortments).toBeTruthy();
      expect(assortments.length).toBe(2);
      const assortment = assortments.find(a => a.id === 13);
      expect(assortment.asmtPeriod.asmtPeriodLabel).toBe('2021_Wks 27-39');
    });

    // ensure expected API endpoint called
    const request = httpTestingController.expectOne(`${environment.mpe_api}/api/v1/Assortments/AssortmentLevel/0`);
    expect(request.request.method).toEqual('GET');

    // act
    request.flush(fakeAssortments);
  }));
});
