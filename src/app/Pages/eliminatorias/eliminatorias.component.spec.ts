import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EliminatoriasComponent } from './eliminatorias.component';

describe('EliminatoriasComponent', () => {
  let component: EliminatoriasComponent;
  let fixture: ComponentFixture<EliminatoriasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EliminatoriasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EliminatoriasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
