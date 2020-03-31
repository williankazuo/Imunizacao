import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API } from '../../enums/environment/api.enum';
import { PathologiesModel } from '../../models/pathologies/pathologies.model';
import { PathologiesListModel } from '../../models/pathologies/pathologiesList.model';

@Injectable()
export class PathologiesService {

    private headers: HttpHeaders = new HttpHeaders();

    constructor(
        private _http: HttpClient
    ) { }

    /**
     * getPathologiesCalendar() Método responsavel por chamar o serviço e trazer a lista de patologias
     */
    public getPathologiesCalendar(filter: string): Observable<PathologiesListModel> {
        return this._http.get<PathologiesListModel>(API.immunizationSystem + `/api/Pathologies/calendar?filter=${filter}`);
    }

    /**
     * getPathologiesCalendarById() Método responsavel por chamar o serviço e trazer uma patologia 
     * especifica com suas vacinas e esquemas vinculados
     * @param {number} _id id da patologia que deseja buscar
     */
    public getPathologiesCalendarById(_id: number): Observable<PathologiesModel> {
        return this._http.get<PathologiesModel>(API.immunizationSystem + '/api/Pathologies/calendar/' + _id);
    }

    /**
     * Método responsável por deletar uma patologia.
     * @param _id id da patologia a ser deletada.
     */
    public deletePathology(_id: number): Observable<any> {
        return this._http.delete<any>(API.immunizationSystem + `/api/Pathologies/${_id}`);
    }

    /**
     * Método responsável por atualizar o nome da patologia.
     * @param id 
     * @param nameValue 
     */
    public updatePathology(id: number, nameValue: string) : Observable<any>{
        const obj = { name: nameValue };
        return this._http.put<any>(API.immunizationSystem + `/api/Pathologies/${id}`, obj);
    }

}


