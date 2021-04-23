import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { DailogResendPage } from './dailog-resend.page';

describe('DailogResendPage', () => {
  let component: DailogResendPage;
  let fixture: ComponentFixture<DailogResendPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailogResendPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(DailogResendPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
