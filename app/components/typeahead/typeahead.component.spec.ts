import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeaheadComponent } from './typeahead.component';
import { EmiterService } from 'src/app/@core/services/general/emiter.service';
import { FormsModule } from '@angular/forms';
import { CoreModule } from 'src/app/@core/core.module';
import { VaccineMilleniumModel } from 'src/app/@core/models/vaccines/vaccines.model';
import { KeyKode } from 'src/app/@core/enums/typeahead/keyCode.enum';

describe('Componente Typeahead - input de seleção e busca', () => {
  let component: TypeaheadComponent;
  let fixture: ComponentFixture<TypeaheadComponent>;

  let listVaccine: Array<VaccineMilleniumModel> = new Array<VaccineMilleniumModel>();
  listVaccine = [
    { id: 21676465, name: 'vacina hepatite B adulto' },
    { id: 21676520, name: 'vacina hepatite A pediátrica' }
  ]

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, CoreModule],
      declarations: [TypeaheadComponent],
      providers: [EmiterService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeaheadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /**
   * Teste de inicialização do componente
   */
  it('Inicialização do componente', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Teste para validar o campo preenchido incorretamente, gerando uma vacina
   * invalida e abrindo um box indicando que nenhum item foi encontrado
   */
  it('Validar Vacina invalida e nenhuma vacina encontrada', () => {
    component.searchValue = 'teste';
    component.listElements = listVaccine;
    component.requiredField = true;
    component.searchElement(component.searchValue, KeyKode.KeyEnter);

    expect(component.notfound).toBe(true);
    expect(component.invalidData).toBe(true);
    expect(component.elementSelected).toBeNull();
  });

  /**
   * Teste para validar quando o campo for modificado e em seguida for zerado
   * quando ocorrer isso, uma mensagem de campo obrigatório deverá ser exibida
   */
  it('Validar campo obrigatório', () => {
    component.searchValue = '';
    component.listElements = listVaccine;
    component.requiredField = true;
    component.searchElement(component.searchValue, KeyKode.KeyEnter);

    expect(component.required).toBe(true);
    expect(component.openTypeaHead).toBeFalsy();
  });

  /**
   * Teste para validar uma busca bem realizada. Um elemento é encontrado e
   * selecionado com um click
   */
  it('Validar elemento pesquisado, encontrado e selecionado', () => {
    component.searchValue = 'vacina hepatite B adulto';
    component.listElements = listVaccine;
    component.requiredField = true;
    component.searchElement(component.searchValue, KeyKode.KeyEnter);

    expect(component.filteredList.length).toBe(1);
    expect(component.selectItem(component.filteredList[0]));
    expect(component.invalidData).toBeFalsy();
    expect(component.notfound).toBeFalsy();
    expect(component.openTypeaHead).toBeFalsy();
  });

  /**
   * Teste para validar uma busca bem realizada. Um elemento é encontrado e
   * selecionado com a tecla enter
   */
  it('Validar elemento pesquisado, encontrado e selecionado com a tecla enter', () => {
    component.searchValue = 'vacina hepatite B adulto';
    component.listElements = listVaccine;
    component.requiredField = true;
    component.searchElement(component.searchValue, KeyKode.KeyEnter);

    expect(component.filteredList.length).toBe(1);
    expect(component.selectElementByEnter(0)); // indece 0
    expect(component.invalidData).toBeFalsy();
    expect(component.notfound).toBeFalsy();
    expect(component.openTypeaHead).toBeFalsy();
  });

});
