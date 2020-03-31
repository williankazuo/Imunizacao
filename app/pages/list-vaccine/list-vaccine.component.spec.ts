import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListVaccineComponent } from './list-vaccine.component';

import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentsModule } from 'src/app/components/components.module';
import { HttpClientModule } from '@angular/common/http';
import { VaccineService } from 'src/app/@core/services/vaccines/vaccine.service';
import { ModalAlertService } from 'src/app/@core/services/modal/modal-alert.service';
import { VaccineModel } from 'src/app/@core/models/vaccines/vaccines.model';
import { CoreModule } from 'src/app/@core/core.module';
import { TooltipService } from 'src/app/@core/services/tooltip/tooltip.service';
import { ToastService } from 'src/app/@core/services/toast/toast.service';

describe('Pagina Listagem de vacinas', () => {
   let component: ListVaccineComponent;
   let fixture: ComponentFixture<ListVaccineComponent>;

   /**
    * Criação de um @ngModule de teste, contendo as declarções e importações necessárias para
    * rodar o teste do componente
    */
   beforeEach(async(() => {
      TestBed.configureTestingModule({
         imports: [FormsModule, RouterTestingModule, ComponentsModule, HttpClientModule, CoreModule],
         declarations: [ListVaccineComponent],
         providers: [VaccineService, ModalAlertService, TooltipService, ToastService]
      }).compileComponents();
   }));

   /**
    * Criação da instancia do componente
    */
   beforeEach(() => {
      fixture = TestBed.createComponent(ListVaccineComponent);
      component = fixture.componentInstance;

      let listVaccine: Array<VaccineModel> = new Array<VaccineModel>();

      // Mock para testes
      listVaccine = [
         {
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
            notConcomitanceVaccinesId: [],
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
         },
         {
            name: 'Neisv0,5SGA',
            millenniumId: 1234566,
            contraIndications: [
               'Teste Gu',
               'Teste Gu 2'
            ],
            notConcomitanceVaccines: [
               { id: 2, name: 'Asterix' },
               { id: 22, name: 'ADACEL QUADRA suspensão IM' }
            ],
            notConcomitanceVaccinesId: [],
            medicalOrderIsRequired: true,
            isLiveVirus: true,
            observations: 'Teste Gu',
            recommendations: 'Teste Guuuol',
            id: 14,
            dateCreated: new Date(),
            userWhoCreated: '',
            dateUpdated: new Date(),
            userWhoUpdated: '',
            status: 0,
         }
      ]

      component.vaccineList = listVaccine;
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
   it('Realizar pesquisa por Vacinas', () => {
      expect(component.vaccineList.length).toBeGreaterThan(0);
      expect(component.vaccineList.length).not.toBe(0);
   });

   /**
    * Teste para a tela de 'Sem resultados de busca
    */
   it('Exibição da tela Sem resultados de busca', () => {
      component.vaccineList = new Array<VaccineModel>();
      expect(component.vaccineList.length).toBe(0);
      expect(component.vaccineList.length).toBe(0);
   })
});
