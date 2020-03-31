import { Injectable } from '@angular/core';

@Injectable()
export class ModificationService {
    public modification = false;

    /**
     * Método responsável por setar a variável quando houver modificação no formulário.
     * @param modification true, houve modificação. false não houve modificação.
     */
    public setModification(modification: boolean) {
        this.modification = modification;
    }

    /**
     * Método responsável que retorna a variável se houve modificação ou não.
     */
    public getModification() {
        return this.modification;
    }
}