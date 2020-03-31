import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { GenderPipe } from './pipes/gender/gender.pipe';
import { BooleanText, BooleanTextNecessary } from './pipes/boolean-text/boolean-text.pipe';
import {
    CalendarYearFormater,
    CalendarDayFormater,
    CalendarMonthsFormater,
    CalendarMonthsYearsFormater
} from './pipes/calendar/calendar.pipe';
import { DosePipe, FilterDoseType } from './pipes/dose/dose.pipe';
import { MonthValidatorDirectiveDirective } from './directives/month-directive/month-validator-directive.directive';
import { OnlyNumberDirectiveDirective } from './directives/number-directive/only-number-directive.directive';
import { TypeaHeadListDiretive } from './directives/typeahead-diretive/typeahead-list-control-diretive';
import { TypeaHeadCloseDiretive } from './directives/typeahead-diretive/typeahead-close-control';

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    declarations: [
        GenderPipe,
        BooleanText,
        CalendarYearFormater,
        CalendarMonthsFormater,
        CalendarDayFormater,
        BooleanTextNecessary,
        DosePipe,
        FilterDoseType,
        MonthValidatorDirectiveDirective,
        OnlyNumberDirectiveDirective,
        TypeaHeadListDiretive,
        TypeaHeadCloseDiretive,
        CalendarMonthsYearsFormater
    ],
    exports: [
        GenderPipe,
        BooleanText,
        CalendarYearFormater,
        CalendarMonthsFormater,
        CalendarDayFormater,
        BooleanTextNecessary,
        DosePipe,
        FilterDoseType,
        MonthValidatorDirectiveDirective,
        OnlyNumberDirectiveDirective,
        TypeaHeadListDiretive,
        TypeaHeadCloseDiretive,
        CalendarMonthsYearsFormater
    ]
})
export class CoreModule { }