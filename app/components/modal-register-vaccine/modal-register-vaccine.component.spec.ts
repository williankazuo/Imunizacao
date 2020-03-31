import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRegisterVaccineComponent } from './modal-register-vaccine.component';

import {
  FinalizationConst,
} from 'src/app/@core/consts/finalization/finalization.const';

import { ComponentsModule } from '../components.module';

describe('Modal para cadastro de vacinas', () => {
  let component: ModalRegisterVaccineComponent;
  let fixture: ComponentFixture<ModalRegisterVaccineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ComponentsModule],
      declarations: [] // não declarado, pois faz parte do ComponentsModule
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalRegisterVaccineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.closeModal(true);
  });

  /**
   * Teste para a criação do componente
   */
  it('Inicialização do componente', () => {
    expect(component).toBeDefined();
  });

  /**
   * Teste para verificar se o modal esta aberto e se esta na tela de cadastro
   */
  it('Modal aberto, cadastro de vacinas', () => {
    expect(component.showModal).toBe(true);
    expect(component.response).toBeFalsy();
  });

  /**
   * Teste para verificar o modal fechado
   */
  it('Modal fechado', () => {
    component.closeModal(false);

    expect(component.showModal).toBe(false);
  });

  /**
   * Teste para verificar o modal aberto, na tela de confirmação de sucesso
   */
  it('Modal aberto, Tela de finalização - SUCESSO', () => {
    expect(component.showModal).toBe(true);

    component.responseChild(FinalizationConst.success);
    expect(component.response).toBe(true);
  });

  /**
   * Teste para verificar o modal aberto, na tela de confirmação de erro
   */
  it('Modal aberto, Tela de finalização - ERRO', () => {
    expect(component.showModal).toBe(true);

    component.responseChild(FinalizationConst.error);
    expect(component.response).toBe(true);
  });

  /**
   * Teste para verificar o modal aberto, na tela de confirmação vacina duplicada
   */
  it('Modal aberto, Tela de finalização - VACINA DUPLICADA', () => {
    expect(component.showModal).toBe(true);

    component.responseChild(FinalizationConst.vaccine_duplicated);
    expect(component.response).toBe(true);
  });
});
