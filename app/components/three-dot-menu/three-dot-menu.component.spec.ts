import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreeDotMenuComponent } from './three-dot-menu.component';
import { EmiterService } from 'src/app/@core/services/general/emiter.service';

describe('Componente Three dot Menu', () => {
  let component: ThreeDotMenuComponent;
  let fixture: ComponentFixture<ThreeDotMenuComponent>;

  /**
   * Criação do @NgModule simulado para teste
   */
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [ThreeDotMenuComponent],
      providers: [EmiterService]
    })
      .compileComponents();
  }));

  /**
   * Criação da instancia do componente
   */
  beforeEach(() => {
    fixture = TestBed.createComponent(ThreeDotMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    // abrir o modal
    component.opened = true;
  });

  /**
   * Teste para a criação do componente
   */
  it('Inicialização do componente', () => {
    expect(component).toBeDefined();
  });

  /**
   * Teste para validar se o box de select esta aberto
   */
  it('Menu aberto', () => {
    const boxSelect = fixture.nativeElement;
    const boxSelectOpen = boxSelect.querySelector('.option-elements');

    expect(boxSelectOpen).toBeDefined();
  });

  /**
   * Teste para validar se o box de select esta fechado
   */
  it('Menu fechado', () => {
    component.opened = false;
    const boxSelect = fixture.nativeElement;
    const boxSelectOpen = boxSelect.querySelector('.option-elements');

    expect(boxSelectOpen).toBeNull();
  });
});
