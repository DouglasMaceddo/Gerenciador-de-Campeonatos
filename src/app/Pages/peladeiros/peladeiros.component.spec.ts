import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeladeirosComponent } from './peladeiros.component';

describe('PeladeirosComponent', () => {
  let component: PeladeirosComponent;
  let fixture: ComponentFixture<PeladeirosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeladeirosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeladeirosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
