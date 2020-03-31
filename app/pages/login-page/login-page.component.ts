import { Component, OnInit } from '@angular/core';
import { LoginModel } from 'src/app/@core/models/authentication/login.model';
import { AuthenticationService } from 'src/app/@core/services/authentication/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {

  public login = new LoginModel();
  public showPassword = false;
  public errorLogin = false;
  public errorMessage: string;

  constructor(
    private _router: Router,
    private _authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this._authenticationService.removeCurrentUser();
  }

  /**
   * Método responsável por logar o usuário no sistema.
   * Em caso de sucesso, definir usuário logado, e navegar para a página principal.
   */
  authenticate() {
    this._authenticationService.authenticate(this.login).subscribe(response => {
      this.errorLogin = false;
      this._authenticationService.setCurrentUser(response);
      this._router.navigateByUrl('lista-patologias');
    }, error => {
      if (error.status === 500) {
        this.errorMessage = 'Tivemos um problema. Tente novamente mais tarde.';
      } else {
        this.errorMessage = 'Usuário ou senha inválidos.';
      }
      this.errorLogin = true;
    });
  }
}
