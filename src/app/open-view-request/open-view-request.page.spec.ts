import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { OpenViewRequestPage } from './open-view-request.page';

describe('OpenViewRequestPage', () => {
  let component: OpenViewRequestPage;
  let fixture: ComponentFixture<OpenViewRequestPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpenViewRequestPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(OpenViewRequestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
