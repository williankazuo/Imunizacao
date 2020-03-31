import { Injectable } from '@angular/core';
import { PathologyErrorModel } from '../../models/pathologies/pathologesError.model';
import { SchemeErrorModel, DoseErrorModel } from '../../models/schemes/schemeError.model';

@Injectable()
export class AnchorService {

    /**
     * Método responsável por ancorar erro de campos obrigatórios até o campo ao clicar no botão de cadastrar.
     * @param errorPathology modelo de erro de crud de patologia.
     * @param route rota atual da página
     */
    public anchorPathology(errorPathology: PathologyErrorModel, route: string): boolean {
        let anchor = false;
        Object.entries(errorPathology).every(([key, value]) => {
            if (value === true) {
                location.href = route + `#${key}`;
                anchor = true;
                return false;
            } else {
                return true;
            }
        });
        return anchor;
    }

    /**
     * Método responsável por ancorar até o erro de campos obrigatórios no esquema.
     * O método varre todas as propriedades do objeto de erros.
     * As propriedades que são objetos são tratadas de forma diferente, como vaccineIds e doses.
     * Caso encontre uma propriedade de campo obrigatório é feito a navegação até ela e já quebra o looping.
     * @param errorScheme array de modelo de erro do crud de esquemas.
     * @param route rota atual da página.
     */
    public anchorScheme(errorScheme: Array<SchemeErrorModel>, route: string): void {
        let keepGoing = true;
        // Verificar todos objetos de erro do esquema.
        // O método every precisa de um retorno para continuar um loop, caso o retorno seja falso ele não continua mais.
        errorScheme.every((scheme: SchemeErrorModel, schemeIndex: number) => {
            // Varrendo as propriedades de chave e valor do objeto.
            Object.entries(scheme).every(([key, value]) => {
                if (value === true) {
                    location.href = route + `#${key + schemeIndex.toString()}`;
                    keepGoing = false;
                    return keepGoing;
                } else if (key === 'vaccineIds') {
                    if (scheme.vaccineIds.some(x => x === true)) {
                        location.href = route + `#${key + schemeIndex.toString()}`;
                        keepGoing = false;
                    }
                    return keepGoing;
                } else if (key === 'dosesPrimary') {
                    keepGoing = this.anchorDose(route, schemeIndex, scheme, key);
                    return keepGoing;
                } else if (key === 'dosesReinforcement') {
                    keepGoing = this.anchorDose(route, schemeIndex, scheme, key);
                    return keepGoing;
                } else {
                    return keepGoing;
                }
            });
            return keepGoing;
        });
    }

    /**
     * Ancoragem para os arrays de doses.
     * Varre os campos do array de doses e verifica se tem um campo inválido para navegar até ele.
     * @param route rota atual da página.
     * @param schemeIndex index do esquema.
     * @param scheme Modelo de erro do esquema.
     * @param key Chave da propriedade da dose, primária ou reforço.
     */
    public anchorDose(route: string, schemeIndex: number, scheme: SchemeErrorModel, key: string): boolean {
        let keepGoing = true;
        const idSufix = key === 'dosesPrimary' ? 'Primary' : 'Reinforcement';
        scheme[key].every((dose: DoseErrorModel, doseIndex: number) => {
            Object.entries(dose).every(([keyDose, valueDose]) => {
                if (valueDose === true) {
                    location.href = route + `#${keyDose + schemeIndex.toString()}-${idSufix + doseIndex.toString()}`;
                    keepGoing = false;
                    return false;
                } else {
                    return true;
                }
            });
            return keepGoing;
        });
        return keepGoing;
    }
}