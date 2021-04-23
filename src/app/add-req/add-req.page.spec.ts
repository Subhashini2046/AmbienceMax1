import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddReqPage } from './add-req.page';

describe('AddReqPage', () => {
  let component: AddReqPage;
  let fixture: ComponentFixture<AddReqPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddReqPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddReqPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
