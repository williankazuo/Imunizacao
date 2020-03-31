import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private itemMenu = '';
  private activeMenu = false;

  constructor() { }

  /**
   * Método responsável por retornar o menu selecionado.
   */
  public getItemMenu(): string {
    return this.itemMenu;
  }

  /**
   * Método responsável por setar o menu selecionado.
   */
  public setItemMenu(itemMenu: string): void {
    this.itemMenu = itemMenu;
  }

  /**
   * Metodo responsavel por esconder o menu, caso o usuário esteja deslogado do sistema
   */
  public getActiveMenuFor404(): boolean {
    return this.activeMenu;
  }

  /**
   * metodo responsavel por setar a condição de exibição do menu
   * @param _activeMenu flag para definir se o menu deve ou não ser exibido
   */
  public setActiveMenuFor404(_activeMenu: boolean) {
    this.activeMenu = _activeMenu;
  }
}
