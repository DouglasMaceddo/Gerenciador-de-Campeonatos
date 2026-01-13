import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CriarCampComponent } from './criar-camp.component';

describe('CriarCampComponent', () => {
  let component: CriarCampComponent;
  let fixture: ComponentFixture<CriarCampComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CriarCampComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CriarCampComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
