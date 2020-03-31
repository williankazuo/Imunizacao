import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, forkJoin } from 'rxjs';

import { API } from '../../enums/environment/api.enum';
import { PathologiesModel } from '../../models/pathologies/pathologies.model';
import { SchemeModel } from '../../models/schemes/schemes.model';
import { Age } from '../../enums/pathologies/Age.enum';

@Injectable()
export class VaccinationScheduleService {

    private buttonRegisterSource = new Subject<boolean>();
    public buttonRegister$ = this.buttonRegisterSource.asObservable();

    constructor(
        private http: HttpClient
    ) { }

    /**
     * Método responsável por adicionar patologia esquema.
     * @param pathScheme Modelo de patologia esquema.
     */
    public addPathologyScheme(pathScheme: PathologiesModel): Observable<any> {
        return this.http.post<any>(API.immunizationSystem + '/api/vaccination-schedules', pathScheme);
    }

    /**
     * Método responsável por buscar a patologia e os esquemas pelo id da patologia.
     * @param id id da patologia.
     */
    public getPathologySchemeById(id: number): Observable<PathologiesModel> {
        return this.http.get<PathologiesModel>(API.immunizationSystem + `/api/Pathologies/calendar/${id}`);
    }

    /**
     * Método responsável por atualizar o esquema.
     * @param scheme esquema que vai ser atualizado.
     */
    public updateSchemes(schemes: Array<SchemeModel>, idPathology: number): Observable<any> {
        return this.http.put<any>(API.immunizationSystem + `/api/vaccination-schedules/schemes/${idPathology}`, schemes);
    }

    /**
     * Método responsável por deletar um esquema.
     * @param id do esquema a ser deletado.
     */
    public deleteScheme(id: number): Observable<any> {
        return this.http.delete<any>(API.immunizationSystem + `/api/vaccination-schedules/schemes/${id}`);
    }

    /**
     * Método responsável por fazer uma chamada múltipla para atualizar a patologia e atualizar os esquemas.
     * @param idPat Id da patologia.
     * @param patScheme Objeto que contém patologia e os esquemas.
     */
    public updatePathologyScheme(idPat: number, patScheme: PathologiesModel): Observable<any> {
        const obj = { name: patScheme.pathologyName };
        const response1 = this.http.put<any>(API.immunizationSystem + `/api/Pathologies/${idPat}`, obj);
        const response2 = this.http.put<any>(API.immunizationSystem + `/api/vaccination-schedules/schemes/${idPat}`, patScheme.schemes);

        return forkJoin([response1, response2]);
    }

    /**
     * Método responsável por triggar o botão de cadastrar.
     * @param trigger acionar o botão.
     */
    public triggerButton(trigger: boolean) {
        this.buttonRegisterSource.next(trigger);
    }

    /**
     * Metodo responsavel por retornar o periodo completo (anos e meses) em meses.
     * @param {number} months quantidade de meses
     * @param {number} years quantidade de anos
     */
    public calcTotalPeriodInMonths(months: number, years: number): number {
        let totalPeriod: number;

        totalPeriod = months + (years * Age.TotalAmountOfMonths);

        return totalPeriod;
    }
}
