import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CampeonatoPublicoComponent } from './campeonato-publico.component';

describe('CampeonatoPublicoComponent', () => {
  let component: CampeonatoPublicoComponent;
  let fixture: ComponentFixture<CampeonatoPublicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CampeonatoPublicoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CampeonatoPublicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
