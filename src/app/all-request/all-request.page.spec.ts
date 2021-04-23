import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AllRequestPage } from './all-request.page';

describe('AllRequestPage', () => {
  let component: AllRequestPage;
  let fixture: ComponentFixture<AllRequestPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllRequestPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AllRequestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
