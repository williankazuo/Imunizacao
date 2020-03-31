import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'gender' })
export class GenderPipe implements PipeTransform {

    transform(value: string): string {
        let newValue: string;
        switch (value) {
            case 'Male':
                newValue = 'Masculino';
                break;
            case 'Female':
                newValue = 'Feminino';
                break;
            case 'Both':
                newValue = 'Ambos';
                break;
        }

        return newValue;
    }
}