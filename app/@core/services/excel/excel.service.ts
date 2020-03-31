import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API } from '../../enums/environment/api.enum';
import { VaccineModel } from '../../models/vaccines/vaccines.model';
import { PathologyModel } from '../../models/pathologies/pathologiesList.model';

@Injectable()
export class ExcelService {

    constructor(
        private _http: HttpClient,
    ) { }

    /**
     * Metodo responsavel por trazer do serviço um excel contendo as vacinas filtradas em questão
     * @param {Array<VaccineModel>} _listVaccine lista das vacinas filtradas
     */
    public vaccinesExportExcel(_listVaccine: Array<VaccineModel>): Observable<any> {
        const listIdVaccine: string = this.createListIdsForExcel(_listVaccine);

        return this._http.get<any>(`${API.immunizationSystem}/api/Vaccines/export?IdVaccines=${listIdVaccine}`,
            { responseType: 'blob' as 'json' });
    }

    /**
     * Metodo responsavel por trazer do serviço um excel contendo as patologias filtradas em questão
     * @param {Array<PathologyModel>} _listPathologies lista das patologias filtradas
     * @param {string} _typeCalendar contem o tipo de calendário, infantil ou adulto
     */
    public pathologiesExportExcel(_listPathologies: Array<PathologyModel>, _typeCalendar: string): Observable<any> {
        const listIdPathologies: string = this.createListIdsForExcel(_listPathologies);

        return this._http.get<any>(`${API.immunizationSystem}/api/Pathologies/export/${_typeCalendar}?idPathologys=${listIdPathologies}`,
            { responseType: 'blob' as 'json' });
    }

    /**
     * Metodo responsavel por formar a string contendo todos os Id necessários separados por virgula
     * @param {Array<VaccineModel | PathologyModel>} _listData Lista de vacinas ou patologia
     */
    public createListIdsForExcel(_listData: Array<VaccineModel | PathologyModel>): string {
        let listId: string = '';

        _listData.forEach((item: VaccineModel | PathologyModel, index: number) => {
            listId = `${listId}${item.id}${index === (_listData.length - 1) ? '' : ','}`;
        });

        return listId;
    }

    /**
     * Metodo responsavel por converter o excel para o formato blob
     * e gerar o download automaticamente
     * @param {any} excel objeto recebido da API para ser convertido
     * @param {string} fileName nome que o arquivo irá receber
     */
    public downloadExcel(excel: any, fileName: string) {
        const blob = new Blob([excel], {
            type: 'application/octet-stream'
        });

        const a = window.document.createElement('a');

        a.href = window.URL.createObjectURL(blob);

        a.download = `${fileName}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }


}