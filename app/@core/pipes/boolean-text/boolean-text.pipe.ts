import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'booleanText' })
export class BooleanText implements PipeTransform {

    transform(value: boolean): string {

        let newValue: string;

        switch (value) {
            case true:
                newValue = 'Sim';
                break;
            case false:
                newValue = 'Não';
                break;
        }

        return newValue;

    }
}

@Pipe({ name: 'booleanTextNecessary' })
export class BooleanTextNecessary implements PipeTransform {

    transform(value: boolean): string {

        let newValue: string;

        switch (value) {
            case true:
                newValue = 'Necessário';
                break;
            case false:
                newValue = 'Não necessário';
                break;
        }

        return newValue;

    }
}