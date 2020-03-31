import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AuthenticationService } from '../services/authentication/authentication.service';

import { LoginModel } from '../models/authentication/login.model';
import { UserModel } from '../models/authentication/user.model';
import { LoadingService } from '../services/loading/loading.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private _router: Router,
        private _authenticationService: AuthenticationService,
        private _loadingService: LoadingService
    ) {
    }

    /**
     * Método responsável por interceptar todas requisições HTTP.
     * @param request Request que está sendo interceptado
     * @param next HttpHandler, o que fazer depois que a requisição for interceptada.
     */
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        this._loadingService.changeLoading(true);
        // Caso for um request que não for necessário o token, passa direto
        if (request.headers.get('No-Auth') === 'True') {
            request = request.clone();
            return next.handle(request).pipe(
                tap(event => {
                    if (event instanceof HttpResponse) {
                        this._loadingService.changeLoading(false);
                    }
                }, (err: any) => {
                    this._loadingService.changeLoading(false);
                })
            );
        }

        // Buscar usuário, o token está dentro do objeto de usuário.
        const user = this._authenticationService.getCurrentUser();

        // Caso exista um usuário logado, clonar a request passando o Token no header.
        if (user) {
            request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + user.access_token) });

            // Faz o request com o authorization, caso o token esteja expirado (401), o access token deve ser renovado.
            return next.handle(request).pipe(
                tap(event => {
                    if (event instanceof HttpResponse) {
                        this._loadingService.changeLoading(false);
                    }
                    return event;
                }, (error) => {
                    if (error instanceof HttpErrorResponse) {
                        if (error.status == 401) {
                            this.refreshAuthentication(user);
                        }
                        else {
                            this._loadingService.changeLoading(false);
                        }
                    }
                })
            );
        }

        // Caso não tenha um usuário logado, enviar para a tela de login
        else {
            this._loadingService.changeLoading(false);
            this._router.navigateByUrl('login');
        }
    }


    /**
     * Método responsável por renovar o token expirado, utilizando refresh token.
     * Após fazer a chamada para renovar a autenticação, renova-se o usuário.
     * @param user Usuário atual logado, utilizado para pegar o refresh token.
     */
    refreshAuthentication(user: UserModel) {
        var login = new LoginModel();
        login.refreshToken = user.refresh_token;

        this._authenticationService.refreshAuthentication(login).subscribe(response => {
            this._loadingService.changeLoading(false);
            this._authenticationService.setCurrentUser(response);
        }, error => {
            this._authenticationService.removeCurrentUser();
            this._loadingService.changeLoading(false);
            this._router.navigateByUrl('login');
        });
    }
}
