import { PipeTransform, Pipe } from '@angular/core';
import { DoseModel } from '../../models/schemes/schemes.model';
import { DoseEnum } from '../../enums/scheme/Dose.enum';

@Pipe({ name: 'dose' })
export class DosePipe implements PipeTransform {

    transform(value: number): string {
        let newValue: string;

        if (value <= 1) {
            newValue = value + ' dose';
        } else {
            newValue = value + ' doses';
        }

        return newValue;
    }
}

@Pipe({ name: 'filterDose' })
export class FilterDoseType implements PipeTransform {

    transform(items: Array<DoseModel>, filter: DoseEnum): Array<DoseModel> {
        if (!items || !filter) {
            return items;
        }

        return items.filter(item => item.doseType === (filter));
    }
}