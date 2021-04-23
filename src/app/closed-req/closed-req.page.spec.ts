import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ClosedReqPage } from './closed-req.page';

describe('ClosedReqPage', () => {
  let component: ClosedReqPage;
  let fixture: ComponentFixture<ClosedReqPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClosedReqPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ClosedReqPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
