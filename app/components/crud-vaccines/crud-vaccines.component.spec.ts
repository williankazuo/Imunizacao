import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudVaccinesComponent } from './crud-vaccines.component';
import { VaccineService } from 'src/app/@core/services/vaccines/vaccine.service';
import { ComponentsModule } from '../components.module';
import { HttpClientModule } from '@angular/common/http';
import { EmiterService } from 'src/app/@core/services/general/emiter.service';
import { VaccineModel } from 'src/app/@core/models/vaccines/vaccines.model';
import { VaccinationScheduleDeactivate } from 'src/app/@core/guards/vac-schedule-deactivate-guard';
import { RouterTestingModule } from '@angular/router/testing';
import { ModificationService } from 'src/app/@core/services/general/modification.service';
import { ModalAlertService } from 'src/app/@core/services/modal/modal-alert.service';

describe('Cadastro de Vacinas', () => {
  let component: CrudVaccinesComponent;
  let fixture: ComponentFixture<CrudVaccinesComponent>;

  let vaccineComplete: VaccineModel = new VaccineModel();
  vaccineComplete = {
    name: 'Neisv0,5SGA',
    millenniumId: 1223456,
    contraIndications: [
      'Teste Gu',
      'Teste Gu 2'
    ],
    notConcomitanceVaccines: [
      { id: 2, name: 'Asterix' },
      { id: 22, name: 'ADACEL QUADRA suspensão IM' }
    ],
    notConcomitanceVaccinesId: [1, 2],
    medicalOrderIsRequired: true,
    isLiveVirus: true,
    observations: 'Teste Gu',
    recommendations: 'Teste Guuuol',
    id: 28,
    dateCreated: new Date(),
    userWhoCreated: '',
    dateUpdated: new Date(),
    userWhoUpdated: '',
    status: 0,
  };

  let vaccineNoList: VaccineModel = new VaccineModel();
  vaccineNoList = {
    name: 'Neisv0,5SGA',
    millenniumId: 1223456,
    contraIndications: [''],
    notConcomitanceVaccines: [{ id: 0, name: '' }],
    notConcomitanceVaccinesId: [0],
    medicalOrderIsRequired: true,
    isLiveVirus: true,
    observations: 'Teste Gu',
    recommendations: 'Teste Guuu',
    id: 28,
    dateCreated: new Date(),
    userWhoCreated: '',
    dateUpdated: new Date(),
    userWhoUpdated: '',
    status: 0,
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ComponentsModule, HttpClientModule, RouterTestingModule],
      declarations: [],
      providers: [
        EmiterService,
        VaccineService,
        ModalAlertService,
        ModificationService,
        VaccinationScheduleDeactivate,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudVaccinesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /**
   * Teste para a criação do componente
   */
  it('Inicialização do componente', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Teste para validar o cadastro de vacinas.
   */
  it('Formulário carreado sem dados - Cadastro de Vacinas', () => {
    component.initialValidateForm();

    expect(component.vaccine.name).toBe('');
    expect(component.blockVaccine).toBeFalsy();
    expect(component.vaccine.contraIndications.length).toBe(1);
    expect(component.vaccine.contraIndications[0]).toBe('');
    expect(component.addNewContraindication).toBeFalsy();
    expect(component.addNewConcomitantly).toBeFalsy();
    expect(component.vaccine.notConcomitanceVaccines.length).toBe(1);
    expect(component.vaccine.notConcomitanceVaccines[0].id).toBe(0);
    expect(component.vaccine.notConcomitanceVaccinesId[0]).toBe(0);
  });

  /**
   * Teste para validar a edição de vacinas
   */
  it('formulario carregado com dados - edição de vacinas', () => {

    component.vaccine = vaccineComplete;

    component.initialValidateForm();

    expect(component.vaccine.name).not.toBe('');
    expect(component.vaccine.name).not.toBeNull();
    expect(component.blockVaccine).not.toBeFalsy();
    expect(component.vaccine.contraIndications.length).toBeGreaterThanOrEqual(1);
    expect(component.vaccine.contraIndications[0]).not.toBe('');
    expect(component.vaccine.contraIndications[0]).not.toBeNull();
    expect(component.addNewContraindication).not.toBeFalsy();
    expect(component.addNewConcomitantly).not.toBeFalsy();
    expect(component.vaccine.notConcomitanceVaccines.length).toBeGreaterThanOrEqual(1);
    expect(component.vaccine.notConcomitanceVaccines[0].id).toBeGreaterThan(0);
    expect(component.vaccine.notConcomitanceVaccines[0].name).not.toBe('');
    expect(component.vaccine.notConcomitanceVaccines[0].name).not.toBeNull();
    expect(component.vaccine.notConcomitanceVaccinesId[0]).toBeGreaterThan(0);
  });

  /**
   * Teste para validar a obrigatoriedade do campo nome da vacina
   */
  it('Validação de campo obrigatório', () => {
    const result = component.validform();

    expect(component.vaccine.name).toBe('');
    expect(component.activeError).toBe(true);
    expect(result).toBeFalsy();
  });

  /**
   * Teste para validar o preenchimento de todos os campos que sejam obrigatório
   * e se a partir a ação de salvar no serviço estará valida ou não
   */
  it('Validação para formulário preenchido corretamente', () => {
    component.vaccine = vaccineComplete;
    const result = component.validform();

    expect(result).toBe(true);
  });

  /**
   * Teste para verificar se algum campo da lista de contra indicação esta vazia, e neste caso
   * não enviar nenhum dado em branco ou default para o serviço. neste caso a lista 
   * tem de estar zerada
   */
  it('Validação para lista de inputs de contraindicação não enviar dado em branco', () => {
    component.vaccine = vaccineNoList;

    const result = component.validform();

    expect(result).toBe(true);
    expect(component.vaccine.contraIndications.length).toBe(0);
  });

  /**
   * Teste para verificar se algum campo da lista de vacinas concomitantes esta vazia, e neste caso
   * não enviar nenhum dado em branco ou default para o serviço. neste caso a lista
   * tem de estar zerada
   */
  it('Validação para lista de inputs de Vacinas Concomitantes não enviar dado em branco', () => {
    component.vaccine = vaccineNoList;

    const result = component.validform();

    expect(result).toBe(true);
    expect(component.vaccine.notConcomitanceVaccines.length).toBe(0);
    expect(component.vaccine.notConcomitanceVaccinesId.length).toBe(0);
  });

});
