import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[onlyNumber]'
})
export class OnlyNumberDirectiveDirective {

  constructor(private _el: ElementRef) { }

  /**
   * Diretiva responsável por validar e aceitar apenas números no campo de digitação.
   */
  @HostListener('input', ['$event']) onInputChange(event) {
    const initalValue = this._el.nativeElement.value;
    this._el.nativeElement.value = initalValue.replace(/[^0-9]*/g, '');
    if (initalValue !== this._el.nativeElement.value) {
      event.stopPropagation();
    }
  }
}
