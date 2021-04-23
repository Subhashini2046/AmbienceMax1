import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OpenReqPage } from './open-req.page';

describe('OpenReqPage', () => {
  let component: OpenReqPage;
  let fixture: ComponentFixture<OpenReqPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenReqPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OpenReqPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
