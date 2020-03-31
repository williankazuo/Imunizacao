import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVaccineComponent } from './edit-vaccine.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentsModule } from 'src/app/components/components.module';
import { HttpClientModule } from '@angular/common/http';
import { EmiterService } from 'src/app/@core/services/general/emiter.service';
import { VaccineService } from 'src/app/@core/services/vaccines/vaccine.service';
import { FinalizationConst } from 'src/app/@core/consts/finalization/finalization.const';
import { ModificationService } from 'src/app/@core/services/general/modification.service';

describe('Pagina de edição de vacinas', () => {
  let component: EditVaccineComponent;
  let fixture: ComponentFixture<EditVaccineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, ComponentsModule, HttpClientModule],
      declarations: [EditVaccineComponent],
      providers: [VaccineService, EmiterService, ModificationService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditVaccineComponent);
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

});
