import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { API } from '../../enums/environment/api.enum';
import { VaccineModel, VaccineMilleniumModel, NotConcomitanceIdModel } from '../../models/vaccines/vaccines.model';

@Injectable()
export class VaccineService {

    constructor(private _http: HttpClient) { }

    /**
     * Metodo responsavel por buscar todas as vacinas do millenium
     */
    public getAllVaccinesMillenium(): Observable<Array<VaccineMilleniumModel>> {
        return this._http.get<Array<VaccineMilleniumModel>>(API.immunizationSystem + `/api/Vaccines/millenium`);
    }

    /**
     * Metodo responsavel por buscar todas as vacinas cadastradas no sistema
     */
    public getAllVaccines(): Observable<Array<VaccineModel>> {
        return this._http.get<Array<VaccineModel>>(API.immunizationSystem + `/api/Vaccines`);
    }

    /**
     * Metodo responsavel por buscar uma vacina especifica por id
     * @param _id id da vacina
     */
    public getVaccinesById(_id: number): Observable<VaccineModel> {
        return this._http.get<VaccineModel>(API.immunizationSystem + `/api/Vaccines/${_id}`);
    }

    /**
     * Metodo responsavel por buscar uma vacina especifica por nome
     * @param filter nome da vacina que esta buscando
     */
    public getVaccines(filter?: string): Observable<Array<VaccineModel>> {
        return this._http.get<Array<VaccineModel>>(API.immunizationSystem + `/api/Vaccines?name=${filter}`);
    }

    /**
     * Metodo responsavel por buscar uma vacina especifica por id
     * @param _id id da vacina
     */
    public getListNotConcomitanceById(_id: number): Observable<Array<NotConcomitanceIdModel>> {
        return this._http.get<Array<NotConcomitanceIdModel>>(API.immunizationSystem + `/api/Vaccines/notConcomitances/${_id}`);
    }

    /**
     * Metodo responsavel por inserir uma nova vacina
     * @param _vaccine objeto da vacina que sera inserido
     */
    public registerVaccine(_vaccine: VaccineModel): Observable<any> {
        return this._http.post<VaccineModel>(API.immunizationSystem + `/api/Vaccines`, _vaccine);
    }

    /**
     * Metodo responsavel por atualizar uma vacina
     * @param _vaccine objeto da vacina que sera atualizado
     */
    public updateVaccine(_vaccine: VaccineModel): Observable<any> {
        return this._http.put<VaccineModel>(API.immunizationSystem + `/api/Vaccines/${_vaccine.id}`, _vaccine);
    }

    /**
     *  Método responsável por deletar uma vacina.
     * @param _id id da vacina a ser deletada.
     */
    public deleteVaccine(_id: number): Observable<any> {
        return this._http.delete<Array<VaccineModel>>(API.immunizationSystem + `/api/Vaccines/${_id}`);
    }

    /**
     * Método responsável por buscar o ID da vacina de acordo com o Millenium ID.
     * @param _millId millenium id da vacina.
     */
    public getVaccineByMillId(_millId: string): Observable<number> {
        return this._http.get<number>(API.immunizationSystem + `/api/Vaccines/millenium/${_millId}`);
    }
}
