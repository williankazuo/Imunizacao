import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[monthValidator]'
})
export class MonthValidatorDirectiveDirective {

  constructor(private _el: ElementRef) { }

  /**
   * Responsável por validar caso o usuário digitar um número maior que 12 no campo de mês.
   */
  @HostListener('input', ['$event'])
  onInputChange(event) {
    const inputValue = this._el.nativeElement.value;
    if (inputValue > 12) {
      this._el.nativeElement.value = '';
    }
  }
}
