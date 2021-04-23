import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PendingReqPage } from './pending-req.page';

describe('PendingReqPage', () => {
  let component: PendingReqPage;
  let fixture: ComponentFixture<PendingReqPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingReqPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PendingReqPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
