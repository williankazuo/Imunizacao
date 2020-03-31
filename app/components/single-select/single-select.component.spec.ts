import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleSelectComponent } from './single-select.component';

describe('Componente de seleção de Tipo de calendário - Infantil ou Adulto', () => {
  let component: SingleSelectComponent;
  let fixture: ComponentFixture<SingleSelectComponent>;

  /**
   * Criação do @NgModule simulado para teste
   */
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SingleSelectComponent]
    })
      .compileComponents();
  }));

  /**
   * Criação da instancia do componente
   */
  beforeEach(() => {
    fixture = TestBed.createComponent(SingleSelectComponent);
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
  it('Campo select aberto', () => {
    const boxSelect = fixture.nativeElement;
    const boxSelectOpen = boxSelect.querySelector('.option-elements');

    expect(boxSelectOpen).toBeDefined();
  });

  /**
   * Teste para validar se o box de select esta fechado
   */
  it('Campo select fechado', () => {
    component.opened = false;
    const boxSelect = fixture.nativeElement;
    const boxSelectOpen = boxSelect.querySelector('.option-elements');

    expect(boxSelectOpen).toBeNull();
  });
});
