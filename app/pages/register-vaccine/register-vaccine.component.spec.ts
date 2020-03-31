import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterVaccineComponent } from './register-vaccine.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FinalizationConst } from 'src/app/@core/consts/finalization/finalization.const';
import { ComponentsModule } from 'src/app/components/components.module';
import { VaccineService } from 'src/app/@core/services/vaccines/vaccine.service';
import { HttpClientModule } from '@angular/common/http';
import { EmiterService } from 'src/app/@core/services/general/emiter.service';
import { ModificationService } from 'src/app/@core/services/general/modification.service';
import { VaccinationScheduleDeactivate } from 'src/app/@core/guards/vac-schedule-deactivate-guard';
import { ModalAlertService } from 'src/app/@core/services/modal/modal-alert.service';

describe('Pagina de cadastro de Vacina', () => {
  let component: RegisterVaccineComponent;
  let fixture: ComponentFixture<RegisterVaccineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, ComponentsModule, HttpClientModule],
      declarations: [RegisterVaccineComponent],
      providers: [VaccineService, EmiterService, ModificationService, VaccinationScheduleDeactivate, ModalAlertService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterVaccineComponent);
    fixture.debugElement.nativeElement.style.visibility = 'hidden';
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /**
   * Valida a inicializao e instanciação da pagina
   */
  it('Valida Inicialização do componente', () => {
    expect(component).toBeDefined();
  });

  /**
   * Teste para verificar o modal aberto, na tela de confirmação de sucesso
   */
  it('Cadastro realizado com sucesso - Tela de finalização - SUCESSO', () => {
    component.responseChild(FinalizationConst.success);
    expect(component.response).toBe(true);
  });

  /**
   * Teste para verificar o modal aberto, na tela de confirmação de erro
   */
  it('Cadastro realizado com sucesso - Tela de finalização - ERRO', () => {
    component.responseChild(FinalizationConst.error);
    expect(component.response).toBe(true);
  });

  /**
   * Teste para verificar o modal aberto, na tela de confirmação vacina duplicada
   */
  it('Cadastro realizado com sucesso - Tela de finalização - VACINA DUPLICADA', () => {
    component.responseChild(FinalizationConst.vaccine_duplicated);
    expect(component.response).toBe(true);
  });


});
