import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizarCampComponent } from './visualizar-camp.component';

describe('VisualizarCampComponent', () => {
  let component: VisualizarCampComponent;
  let fixture: ComponentFixture<VisualizarCampComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisualizarCampComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisualizarCampComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
