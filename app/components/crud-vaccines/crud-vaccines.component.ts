import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { VaccineModel, NotConcomitanceModel, VaccineMilleniumModel, NotConcomitanceIdModel } from 'src/app/@core/models/vaccines/vaccines.model';
import { VaccineService } from 'src/app/@core/services/vaccines/vaccine.service';
import { FinalizationConst } from 'src/app/@core/consts/finalization/finalization.const';
import { ListTypeEnum } from 'src/app/@core/enums/list-type/list-input-type.enum';
import { HttpResponseEnum } from 'src/app/@core/enums/httpResponse/httpResponse.enum';
import { VaccinationScheduleDeactivate } from 'src/app/@core/guards/vac-schedule-deactivate-guard';

@Component({
  selector: 'app-crud-vaccines',
  templateUrl: './crud-vaccines.component.html',
  styleUrls: ['./crud-vaccines.component.scss']
})
export class CrudVaccinesComponent implements OnInit {

  /** Input para utilizar este componente como um modal */
  @Input() modal: boolean;
  /** Input para adicionar na class do box e lista do typeahead, passar para o input do componente */
  @Input() idBoxTypeaHead: string;
  /** Input para definir se esta ocorrendo uma criação ou edição de vacina */
  @Input() createVaccine: boolean;
  /** Input para receber uma vacina especifica ja cadastrada, ou criar um modelo novo */
  @Input() vaccine: VaccineModel = new VaccineModel();

  /** Output para devolver ao componente pai que o chama, qual foi o resultado da chamada da api para salvar ou inserir uma nova vacina */
  @Output() response = new EventEmitter();
  /** Output para devolver ao componente pai que o chama, a ação de fechar o modal */
  @Output() closeModal = new EventEmitter();

  public listVaccineComplete: Array<VaccineMilleniumModel>;
  public listVaccine: Array<VaccineMilleniumModel>;
  public vaccineNotConcomitances: NotConcomitanceModel;

  public addNewContraindication: boolean;
  public addNewConcomitantly: boolean;
  public type: object;

  public blockVaccine: boolean;
  public activeError: boolean;
  public errorMsg: string;

  private route: string;

  constructor(
    private _vaccinesService: VaccineService,
    private _vaccinationScheduleDeactivate: VaccinationScheduleDeactivate
  ) { }

  ngOnInit() {
    this.route = window.location.href;
    this.listVaccine = new Array<VaccineMilleniumModel>();
    this.listVaccineComplete = new Array<VaccineMilleniumModel>();
    this.addNewContraindication = false;
    this.addNewConcomitantly = false;
    this.type = {
      contraindication: ListTypeEnum.Contraindication,
      concomitance: ListTypeEnum.Concomitance
    };

    this.blockVaccine = false;
    this.activeError = false;
    this.errorMsg = '';

    this.getVaccines();
    this.initialValidateForm();

    // condição para permitir a execução das funções abaixo apenas quando for cadastar uma nova vacina
    if (this.vaccine.id === 0) {
      if (!this.vaccine.contraIndications.length) {
        this.newContraindication();
      }
      if (!this.vaccine.notConcomitanceVaccines && !this.vaccine.notConcomitanceVaccinesId) {
        this.newConcomitantly();
      }
    }

  }

  /**
   * Metodo responsavel por buscar do serviço a lista de vacinas.
   */
  private getVaccines(): void {
    this._vaccinesService.getAllVaccinesMillenium()
      .subscribe((result: Array<VaccineMilleniumModel>) => {
        this.listVaccineComplete = result;
        this.updateListVaccineAndConcomitantly(result);

        // atualizar a lista apenas se o usuário estiver editando uma vacina que ja está cadastrada
        // Atualização consiste em remover da lista que aparece no typeahead as vacinas que ja estão
        // cadastrada para aquela vacina em questão
        if (this.vaccine.id > 0) {
          this.updateInitialListVaccine(this.vaccine);
        }
      }, error => { });
  }

  /**
   * Metodo responsavel por atualizar as listas de vacinas e patologia com os valores originais recebidos
   * do serviço durante o carregamento inicial do componente
   */
  private updateListVaccineAndConcomitantly(listOriginal: Array<VaccineMilleniumModel>) {
    this.listVaccine = listOriginal;
  }

  /**
   * Metodo responsavel por atualizar a lista de vacinas que aparece no typeahead, removendo da lista, os
   * as vacinas que ja foram selecionadas
   * @param _vaccineObj Objeto contendo todos os dados de cadastro da vacina
   */
  private updateInitialListVaccine(_vaccineObj: VaccineModel) {
    let aux: Array<VaccineMilleniumModel> = this.listVaccine;

    _vaccineObj.notConcomitanceVaccinesId.forEach((notConcomitanceId: number) => {
      aux = aux.filter((vaccine: VaccineMilleniumModel) => vaccine.id !== _vaccineObj.millenniumId && vaccine.id !== notConcomitanceId);
    });

    this.listVaccine = aux;
  }

  /**
   * Metodo responsavel por validar o bloqueio dos campos, e criação inicial dos campos de textos caso necessário
   */
  public initialValidateForm(): void {
    // para os casos de edição, verifica se a lista de id de vacinas concomitantes existe. 
    // Se não existir, ela deverá ser criada
    if (!this.vaccine.notConcomitanceVaccinesId) {
      this.vaccine.notConcomitanceVaccinesId = new Array<number>();
    }

    // bloquear o campo nome da vacina, caso exista
    this.vaccine.name !== '' ? this.blockVaccine = true : this.blockVaccine = false;

    // Verificação para a criação do campo de contra indicação ou habilitar o botão de adicionar mais
    if (!this.vaccine.contraIndications.length) {
      this.newContraindication();
    } else {
      this.validAddFieldContraindication();
    }

    // Verificação para a criação do campo de Vacinas concomitantes ou habilitar o botão de adicionar mais
    if (!this.vaccine.notConcomitanceVaccines.length) {
      this.newConcomitantly();
    } else {
      this.validAddFieldConcomitantly();
      // adicionar a lista de id de vacinas concomitantes, os ids ja existentes, para que os mesmos não sejam apagados
      this.vaccine.notConcomitanceVaccines.forEach((item: NotConcomitanceModel) => {
        this.vaccine.notConcomitanceVaccinesId.push(item.id);
      });
    }
  }

  /**
   * Metodo responsavel por criar campos de Contraindicação.
   * Valida de existe um campo criado. Caso não tenha nenhum campo, um campo será criado.
   * Caso ja tenha algum campo criado, ao tentar criar um novo campo, será validado se todos os demais campos de Contraindicação
   * esta preenchido, para assim criar um novo campo.
   */
  public newContraindication(): void {
    if (this.vaccine.contraIndications.length === 0) {
      this.addNewContraindication = false;
      this.vaccine.contraIndications.push('');
    } else {
      this.validAddFieldContraindication();
      if (this.addNewContraindication) {
        this.vaccine.contraIndications.push('');
        this.addNewContraindication = false;
      }
    }
  }

  /**
   * Metodo responsavel por validar os campos de contraindicação.
   * O mesmo permite apenas criar campos, caso todos os demais estejam preenchidos. Caso contrario o botão de adicionar
   * será desabilitado.
   */
  private validAddFieldContraindication(): void {
    this.addNewContraindication = true;
    this.vaccine.contraIndications.forEach((contraindication: string) => {
      if (contraindication === '') {
        this.addNewContraindication = false;
      }
    });
  }

  /**
   * Função para acompanhar a modificação dos campos de textos criados dinamicamente atrvés do ngFor 
   * @param {number} index posição atual do item que está sendo modificado
   */
  indexTracker(index: number) {
    return index;
  }

  /**
   * Metodo responsavel por criar campos de Concomitantes.
   * Valida de existe um campo criado. Caso não tenha nenhum campo, um campo será criado.
   * Caso ja tenha algum campo criado, ao tentar criar um novo campo, será validado se todos os demais campos de Concomitantes
   * esta preenchido, para assim criar um novo campo.
   */
  public newConcomitantly(): void {
    if (this.vaccine.notConcomitanceVaccines.length === 0 && this.vaccine.notConcomitanceVaccinesId.length) {
      this.addNewConcomitantly = false;
      this.vaccine.notConcomitanceVaccines.push(new NotConcomitanceModel());
      this.vaccine.notConcomitanceVaccinesId.push(0);
    } else {
      this.validAddFieldConcomitantly();
      if (this.addNewConcomitantly) {
        this.vaccine.notConcomitanceVaccines.push(new NotConcomitanceModel());
        this.vaccine.notConcomitanceVaccinesId.push(0);
        this.addNewConcomitantly = false;
      }
    }
  }

  /**
   * Metodo responsavel por validar os campos de vacinas Concomitantes.
   * O mesmo permite apenas criar campos, caso todos os demais estejam preenchidos. Caso contrario o botão de adicionar
   * será desabilitado.
   */
  private validAddFieldConcomitantly(): void {
    this.addNewConcomitantly = true;
    this.vaccine.notConcomitanceVaccines.forEach((item: NotConcomitanceModel) => {
      if (item.name === '') {
        this.addNewConcomitantly = false;
      }
    });

    if (!this.addNewConcomitantly) {
      return;
    }

    this.vaccine.notConcomitanceVaccinesId.forEach((item: number) => {
      if (item === 0) {
        this.addNewConcomitantly = false;
      }
    });
  }

  /**
   * Metodo responsavel por selecionar uma vacina e buscar as vacinas concomitantementes
   * @param {VaccineModel} _vaccine item selecionado em uma lista de vacinas
   */
  public selectVaccine(_vaccine: VaccineMilleniumModel, _index: number): void {
    if (_vaccine !== null) {
      this.blockVaccine = true;
      this.activeError = false;
      this.vaccine.name = _vaccine.name;
      this.vaccine.millenniumId = _vaccine.id; // id millenium
      this.getConcomitantly(_vaccine.id); // id millenium
      this.updateListVaccine(_vaccine);
    } else {
      this.errorMsg = 'Vacina invalida';
    }
  }

  /**
   * Metodo responsavel por filtrar a lista de vacinas concomitantes. Removendo da lista a vacina que foi selecionada
   * como vacina Principal.
   * @param _vaccine vacina que foi selecionada e não deverá aparecer na listagem de vacinas concomitantes
   */
  private updateListVaccine(_vaccine: VaccineMilleniumModel): void {
    let aux = this.listVaccine;
    aux = aux.filter((item: VaccineMilleniumModel) => item.id !== _vaccine.id);

    this.listVaccine = aux;
  }

  /**
   * Metodo responsavel por remover a vacina foi seleciona pelo usuário
   * Além de remover a vacina que ja foi selecionada, o campo de vacina mão concomitantes será limpo
   */
  public removeVaccine(): void {
    this.vaccine.name = '';
    this.blockVaccine = false;

    this.clearConcomitantly();

    this.updateListVaccineAndConcomitantly(this.listVaccineComplete);
  }

  /**
   * Metodo responsavel por limpar a lista de vacinas concomitantes selecionadas.
   * Metodo utilizado quando o usuário apaga uma vacina ja selecionada.
   */
  private clearConcomitantly(): void {
    this.vaccine.notConcomitanceVaccines = new Array<NotConcomitanceModel>();
    this.vaccine.notConcomitanceVaccinesId = new Array<number>();
    this.newConcomitantly();
  }

  /**
   * Metodo responsavel por buscar uma lista de vacinas concomitantes baseadas por um id especifico
   * @param {number} _id id de uma vacina especifica
   */
  private getConcomitantly(_id: number): void {
    this._vaccinesService.getListNotConcomitanceById(_id)
      .subscribe((result: Array<NotConcomitanceIdModel>) => {
        if (result.length > 0) {
          const concomitantVaccines: Array<NotConcomitanceModel> = this.filterVaccineComcomitantly(result);

          const listIdConcomitantVaccines = concomitantVaccines.map((vaccine: NotConcomitanceModel) => {
            return vaccine.id;
          });

          // insere a lista de id's ja formatada das vacinas concomitantes para o objeto
          this.vaccine.notConcomitanceVaccinesId.length === 1 && this.vaccine.notConcomitanceVaccinesId[0] === 0
            ? this.vaccine.notConcomitanceVaccinesId = listIdConcomitantVaccines
            : this.vaccine.notConcomitanceVaccinesId.concat(listIdConcomitantVaccines);

          // insere a lista de vacinas concomitantes (com nome e id) no objeto
          this.vaccine.notConcomitanceVaccines.length === 1 && this.vaccine.notConcomitanceVaccines[0].name === ''
            ? this.vaccine.notConcomitanceVaccines = concomitantVaccines
            : this.vaccine.notConcomitanceVaccines.concat(concomitantVaccines);

          this.validAddFieldConcomitantly();
          this.updateInitialListVaccine(this.vaccine);
        }
      }, error => { });
  }

  /**
   * Metodo responsavel por buscar na listagem de Vacinas do millenium as vacinas corresponsentes a uma
   * lista de Id. Essa busca ocorre, para obter o nome da vacina.
   * @param {Array<NotConcomitanceIdModel>} _listIdVaccinesConcomitantly Lista de objetos contendo em cada
   * obj o Id do millenium de uma vacina
   */
  private filterVaccineComcomitantly(_listIdVaccinesConcomitantly: Array<NotConcomitanceIdModel>):
    Array<VaccineMilleniumModel | NotConcomitanceModel> {

    let aux: Array<VaccineMilleniumModel> = new Array<VaccineMilleniumModel>();

    _listIdVaccinesConcomitantly.forEach((id: NotConcomitanceIdModel) => {
      aux.push(this.listVaccine.filter((vaccine: VaccineMilleniumModel) => vaccine.id === id.id)[0]);
    });

    return aux;
  }

  /**
   * Metodo responsavel por selecionar uma vacina e buscar as vacinas concomitantementes
   * @param {VaccineModel} _concomitance item selecionado em uma lista de vacinas
   */
  public selectConcomitace(_concomitance: VaccineMilleniumModel, index: number): void {
    const concomitanceFormater: NotConcomitanceModel = new NotConcomitanceModel();
    concomitanceFormater.id = _concomitance.id; // id Millenium
    concomitanceFormater.name = _concomitance.name;

    if (_concomitance !== null) {
      this.vaccine.notConcomitanceVaccines[index] = concomitanceFormater;
      this.vaccine.notConcomitanceVaccinesId[index] = _concomitance.id; // id Millenium

      this.updateListVaccine(this.vaccine.notConcomitanceVaccines[this.vaccine.notConcomitanceVaccines.length - 1]);

      this.validAddFieldConcomitantly();
    }
  }

  /**
   * Metodo responsavel por remover itens adicionados nos campos de contraindiação e concomitantes
   * Metodo generico para os dois casos
   * @param _list lista tipada com o tipo de item que deverá ser removido
   * @param _index index (posição) na qual o item esta na lista em questão
   */
  public removeItemList(_list: Array<string> | Array<NotConcomitanceModel> | Array<number>, _index: number, _type: any): void {
    const vaccineRemoved: any = _list.splice(_index, 1)[0];
    if (_type === ListTypeEnum.Contraindication) {
      this.validAddFieldContraindication();
      if (!_list.length) {
        this.newContraindication();
      }

      // remoção de vacinas concomitantes
    } else {

      // adicionando a lista de vacinas, a vacina concomitante removida da seleção, porém, será adicionada no final da lista
      if (vaccineRemoved['name']) {
        this.listVaccine.push(vaccineRemoved);
      }

      this.validAddFieldConcomitantly();
      if (!_list.length) {
        this.newConcomitantly();
      }
    }
  }

  /**
   * Metodo responsavel por enviar os dados para ser cadastrado na base de dados
   */
  public registerVaccine(): void {
    if (this.validform()) {
      this._vaccinesService.registerVaccine(this.vaccine)
        .subscribe(result => {
          this.finalizationValidateFields();
          this.finalizationCrudVaccine(FinalizationConst.success);
        }, error => {
          if (error.status === HttpResponseEnum.Vaccine_Duplicated) {
            this.finalizationCrudVaccine(FinalizationConst.vaccine_duplicated);
          } else {
            this.finalizationCrudVaccine(FinalizationConst.error);
          }
        });
    }
  }

  /**
   * Metodo responsavel por após finalizar o cadastro ou a edição de uma vacina, manter na tela visivel os campos
   * de contraindicações e vacinas concomitantes
   */
  private finalizationValidateFields(): void {
    if (this.vaccine.notConcomitanceVaccinesId.length === 0 && this.vaccine.notConcomitanceVaccines.length === 0) {
      this.newConcomitantly();
    }
    if (this.vaccine.contraIndications.length === 0) {
      this.newContraindication();
    }
  }

  /**
   * Metodo responsavel por enviar os dados para ser atualizada na base de dados
   */
  public updateVaccine(): void {
    if (this.validform()) {
      this._vaccinesService.updateVaccine(this.vaccine)
        .subscribe(result => {
          this.finalizationValidateFields();
          this.finalizationCrudVaccine(FinalizationConst.success);
        }, error => {
          if (error.status === HttpResponseEnum.Vaccine_Duplicated) {
            this.finalizationCrudVaccine(FinalizationConst.vaccine_duplicated);
          } else {
            this.finalizationCrudVaccine(FinalizationConst.error);
          }
        });
    }
  }

  /**
   * Metodo responsavel por validar se todos os dados obrigatórios estão de acordo para ser enviados ao serviço.
   */
  public validform(): boolean {
    this.activeError = false;

    if (this.vaccine.name === '') {
      // chamada direta por se tratar apenas de um unico campo obrigatório para este crud.
      // caso cresça a quantidade de campos, utilizar o serviço de AnchorService
      window.location.href = this.route + `#name-vaccine`;
      this.activeError = true;
      return false;
    }

    if (this.vaccine.contraIndications.length > 0) {
      const contraindicationList = this.vaccine.contraIndications.filter((contraindication: string) => {
        return contraindication.length > 0;
      });
      this.vaccine.contraIndications = contraindicationList;
    }

    if (this.vaccine.notConcomitanceVaccines.length > 0) {
      const notConcomitanceVaccinesList = this.vaccine.notConcomitanceVaccines.filter((notConcomitanceVaccines: NotConcomitanceModel) => {
        return notConcomitanceVaccines.name.length > 0;
      });
      const notConcomitanceListId = this.vaccine.notConcomitanceVaccinesId.filter((notConcomitanceVaccinesId: number) => {
        return notConcomitanceVaccinesId > 0;
      });
      this.vaccine.notConcomitanceVaccines = notConcomitanceVaccinesList;
      this.vaccine.notConcomitanceVaccinesId = notConcomitanceListId;
    }

    return true;
  }

  /**
   * Metodo responsavel por enviar ao componente pai, a resposta de sucesso ou erro da api
   * @param {number} _typeSuccess flag de sucesso ou erro
   */
  private finalizationCrudVaccine(_typeSuccess: number): void {
    // Definir que a validação do formulário está ok para não exibir o modal de confirmação de sair sem salvar.
    this._vaccinationScheduleDeactivate.setValidate(true);
    this.response.emit(_typeSuccess);
  }

  /**
   * Metodo responsavel por fechar o modal
   */
  public finalizationModalClose(): void {
    this.closeModal.emit(!this.modal);
  }

}
