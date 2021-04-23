import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ResendRequestPage } from './resend-request.page';

describe('ResendRequestPage', () => {
  let component: ResendRequestPage;
  let fixture: ComponentFixture<ResendRequestPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResendRequestPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ResendRequestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
