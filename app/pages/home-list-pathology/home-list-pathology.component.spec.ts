import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeListPathologyComponent } from './home-list-pathology.component';

import { FormsModule } from '@angular/forms';
import { ComponentsModule } from 'src/app/components/components.module';
import { PathologiesService } from 'src/app/@core/services/pathologies/pathologies.service';
import { HttpClientModule } from '@angular/common/http';
import { ModalAlertService } from 'src/app/@core/services/modal/modal-alert.service';
import { RouterTestingModule } from '@angular/router/testing';
import { PathologiesListModel } from 'src/app/@core/models/pathologies/pathologiesList.model';
import { CalendarTypeEnum } from 'src/app/@core/enums/pathologies/CalendarType.enum';
import { TooltipService } from 'src/app/@core/services/tooltip/tooltip.service';
import { ToastService } from 'src/app/@core/services/toast/toast.service';

describe('Pagina home. Listagem de Patologias', () => {
  let component: HomeListPathologyComponent;
  let fixture: ComponentFixture<HomeListPathologyComponent>;

  /**
   * Criação de um @ngModule de teste, contendo as declarções e importações necessárias para
   * rodar o teste do componente
   */
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule, ComponentsModule, HttpClientModule],
      declarations: [HomeListPathologyComponent],
      providers: [PathologiesService, ModalAlertService, TooltipService, ToastService]
    }).compileComponents();
  }));

  /**
   * Criação da instancia do componente
   */
  beforeEach(() => {
    fixture = TestBed.createComponent(HomeListPathologyComponent);
    component = fixture.componentInstance;

    let calendar = new PathologiesListModel();

    // Mock para testes
    calendar.infantil = [
      {
        id: 16,
        name: 'Meningocócica ACWY1',
        vaccineNames: [
          'vacina meningococica 1',
        ],
        vaccinationScheduleQuantity: 2
      },
      {
        id: 22,
        name: 'testew',
        vaccineNames: [
          'vacina hepatite B adulto',
        ],
        vaccinationScheduleQuantity: 1
      },
      {
        id: 23,
        name: 'testewillz',
        vaccineNames: [
          'vacina hepatite B adulto'
        ],
        vaccinationScheduleQuantity: 1
      },
    ];

    calendar.adulto = [
      {
        id: 2,
        name: 'Astalaquitite',
        vaccineNames: [
          'Asterix',
          'Infanrix'
        ],
        vaccinationScheduleQuantity: 0
      },
      {
        id: 20,
        name: 'teste',
        vaccineNames: [
          'Hendrix'
        ],
        vaccinationScheduleQuantity: 1
      },
      {
        id: 21,
        name: 'teste',
        vaccineNames: [
          'Hendrix'
        ],
        vaccinationScheduleQuantity: 1
      },
    ]

    component.calendar = calendar;
    component.ngOnInit();
  });

  /**
   * Teste para a criação do componente
   */
  it('Inicialização do componente', () => {
    expect(component).toBeDefined();
  });

  /**
   * Teste para o campo de pesquisa de patologia
   * A pesquisa só será efetiva, caso a listagem tenha elementos
   */
  it('Realizar pesquisa por patologia', () => {
    expect(component.calendar.adulto.length).toBeGreaterThan(0);
    expect(component.calendar.adulto.length).not.toBe(0);
    expect(component.calendar.infantil.length).toBeGreaterThan(0);
    expect(component.calendar.infantil.length).not.toBe(0);
  });

  /**
   * Teste para a seleção do botão de Calendário infantil
   */
  it('Botão de filtro para tipo de calendario infantil', () => {
    component.selectCalendar(CalendarTypeEnum.Infantil);
    let infantil = component.calendarTypeSelected;

    expect(component.calendarTypeSelected).toEqual(infantil);
    expect(component.calendarTypeSelected).not.toEqual(CalendarTypeEnum.Adulto);
  });

  /**
   * Teste para o botão de calendário Adulto
   */
  it('Botão de filtro para tipo de calendario Adulto', () => {
    component.selectCalendar(CalendarTypeEnum.Adulto);
    let adulto = component.calendarTypeSelected;

    expect(component.calendarTypeSelected).toEqual(adulto);
    expect(component.calendarTypeSelected).not.toEqual(CalendarTypeEnum.Infantil);
  });

  /**
   * Teste para a tela de 'Sem resultados de busca
   */
  it('Exibição da tela Sem resultados de busca', () => {
    component.calendar = new PathologiesListModel();

    expect(component.calendar.adulto.length).toBe(0);
    expect(component.calendar.infantil.length).toBe(0);
  })

});

