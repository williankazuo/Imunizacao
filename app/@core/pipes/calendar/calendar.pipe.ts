import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'yearFormater' })
export class CalendarYearFormater implements PipeTransform {

    transform(value: number): string {
        let newValue: string;

        if (value > 1) {
            newValue = value + ' anos';
        } else if (value === 0) {
            newValue = '';
        } else {
            newValue = value + ' ano';
        }

        return newValue;

    }
}

@Pipe({ name: 'monthFormater' })
export class CalendarMonthsFormater implements PipeTransform {

    transform(value: number): string {
        let newValue: string;

        if (value > 1 || value === 0) {
            newValue = value + ' meses';
        } else {
            newValue = value + ' mês';
        }

        return newValue;

    }
}

@Pipe({ name: 'dayFormater' })
export class CalendarDayFormater implements PipeTransform {

    transform(value: number): string {
        let newValue: string;

        if (value > 1) {
            newValue = value + ' dias';
        } else {
            newValue = value + ' dia';
        }

        return newValue;

    }
}

@Pipe({ name: 'monthsYearsFormater' })
export class CalendarMonthsYearsFormater implements PipeTransform {

    transform(months: number): string {
        let newValue: string;

        if (months > 12) {
            const yearsFormater = Math.round(months / 12);
            const monthsFormater = months % 12;

            newValue = this.formaterYears(yearsFormater) + (monthsFormater > 0 ? ' e ' : '') + this.formaterMonths(monthsFormater);
        } else {
            newValue = this.formaterMonths(months);
        }

        return newValue;
    }

    /**
     * Metodo responsavel por formatar o texto de exibição de meses.
     * @param {number} months quantidade de meses
     */
    private formaterMonths(months: number): string {
        let newValue: string;

        if (months > 1) {
            newValue = months + ' meses';
        } else if (months === 0) {
            newValue = '';
        } else {
            newValue = months + ' mês';
        }

        return newValue;
    }

    /**
     * @param {number} years quantidade de anos
     */
    private formaterYears(years: number): string {
        let newValue: string;

        if (years > 1) {
            newValue = years + ' anos';
        } else if (years === 0) {
            newValue = '';
        } else {
            newValue = years + ' ano';
        }

        return newValue;
    }
}