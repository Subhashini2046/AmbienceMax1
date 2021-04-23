import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CompletedReqPage } from './completed-req.page';

describe('CompletedReqPage', () => {
  let component: CompletedReqPage;
  let fixture: ComponentFixture<CompletedReqPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompletedReqPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CompletedReqPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
