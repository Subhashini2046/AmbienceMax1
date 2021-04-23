import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ViewStatusPage } from './view-status.page';

describe('ViewStatusPage', () => {
  let component: ViewStatusPage;
  let fixture: ComponentFixture<ViewStatusPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewStatusPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ViewStatusPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
