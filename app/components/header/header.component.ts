import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthenticationService } from 'src/app/@core/services/authentication/authentication.service';
import { Router, NavigationEnd } from '@angular/router';
import { MenuService } from 'src/app/@core/services/menu/menu.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  public userName = '';
  public menuSelected = '';
  public menuActive = false;
  private routeEventSubscription: any;

  constructor(
    private _route: Router,
    private _authenticationService: AuthenticationService,
    private _menuService: MenuService
  ) {
    // Responsável por pintar o menu, apenas quando navegar.
    this.routeEventSubscription = this._route.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.menuSelected = this._menuService.getItemMenu();
      }
    });
  }

  ngOnInit() {
    this.getUserName();
    this.getMenuSelected();
    this.getActiveMenu();
  }

  ngOnDestroy(): void {
    this.routeEventSubscription.unsubscribe();
  }

  /**
   * Método responsável por buscar o nome do usuário logado que irá mostrar no header.
   */
  private getUserName(): void {
    const user = this._authenticationService.getCurrentUser();
    if (user) {
      this.userName = user.name.split(' ')[0];
    }
  }

  /**
   * Método responsável por buscar o item de menu selecionado.
   * Que foi setado anteriormente pelo guarda de rotas.
   */
  private getMenuSelected(): void {
    this.menuSelected = this._menuService.getItemMenu();
  }

  /**
   * Método responsável exibir ou esconder o menu
   * que foi setado anteriormente pelo guarda de rotas.
   */
  private getActiveMenu(): void {
    this.menuActive = this._menuService.getActiveMenuFor404();
  }

  /**
   * Método responsável por redirecionar para a tela principal.
   * Método acionado quando clicado no Logo do header.
   * @param rota rota home.
   */
  public redirectHome(rota: string): void {
    this._route.navigateByUrl(rota);
  }

  /**
   * Método responsável por fazer o logout.
   */
  public logout(): void {
    this._authenticationService.removeCurrentUser();
    this._route.navigateByUrl('login');
  }

  /**
   * Método responsável por redirecionar para as rotas do menu.
   * @param rota rota principal dos menus.
   */
  public selectMenu(rota: string): void {
    this._route.navigateByUrl(rota);
  }

}
