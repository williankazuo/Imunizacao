import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudPathologyComponent } from './crud-pathology.component';
import { VaccinationScheduleService } from 'src/app/@core/services/vaccination-schedule/vaccination-schedule.service';
import { ComponentsModule } from '../components.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { OptionModel } from 'src/app/@core/models/select/option.model';
import { PathologiesModel } from 'src/app/@core/models/pathologies/pathologies.model';
import { SchemeModel } from 'src/app/@core/models/schemes/schemes.model';

describe('Cadastro de Patologia', () => {
  let component: CrudPathologyComponent;
  let fixture: ComponentFixture<CrudPathologyComponent>;

  let singleselect: Array<OptionModel> = new Array<OptionModel>();
  let pathologyData: PathologiesModel;

  pathologyData = {
    id: 0,
    pathologyName: 'Nome da patologia',
    pathologyCalendarType: 'Infantil',
    schemes: new Array<SchemeModel>()
  };

  singleselect = [
    { value: 'Infantil', name: 'Infantil', action: null },
    { value: 'Adulto', name: 'Adulto', action: null },
  ];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ComponentsModule, HttpClientModule, FormsModule],
      declarations: [],
      providers: [VaccinationScheduleService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudPathologyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /**
   * Teste para a criação do componente
   */
  it('Inicialização do componente', () => {
    expect(component).toBeDefined();
  });

  /**
   * Teste para validar a obrigatóriedade dos campos
   */
  it('Validar a obrigatóriedade dos campos, exibir mensagem de obrigatóriedade', () => {
    component.validatePathology();

    expect(component.errorPathology.countErrors).toBe(2);
    expect(component.errorPathology.pathologyName).not.toBeFalsy();
    expect(component.errorPathology.pathologyCalendarType).not.toBeFalsy();
  });

  /**
   * Teste para validar a exibição da mensagem de erro para o campo, 'nome da patologia'
   */
  it('Validar exibição da mensagem de erro para o campo de nome de patologia', () => {
    pathologyData.pathologyName = '';

    component.pathology = pathologyData;

    component.validatePathology();
    expect(component.errorPathology.countErrors).toBe(1);
    expect(component.errorPathology.pathologyName).not.toBeFalsy();
    expect(component.errorPathology.pathologyCalendarType).toBeFalsy();
  });

  /**
   * Teste para validar a exibição da mensagem de erro para o campo, 'tipo de calendário'
   */
  it('Validar exibição da mensagem de erro para o campo tipo de calendário', () => {
    pathologyData.pathologyName = 'Nome da patologia';
    pathologyData.pathologyCalendarType = '';

    component.pathology = pathologyData;

    component.validatePathology();
    expect(component.errorPathology.countErrors).toBe(1);
    expect(component.errorPathology.pathologyName).toBeFalsy();
    expect(component.errorPathology.pathologyCalendarType).not.toBeFalsy();
  });
});
