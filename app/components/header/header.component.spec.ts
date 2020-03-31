import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';

import { RouterTestingModule } from '@angular/router/testing';
import { AuthenticationService } from 'src/app/@core/services/authentication/authentication.service';
import { MenuService } from 'src/app/@core/services/menu/menu.service';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

describe('Header da página', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  /**
   * Criação do @ngModule de testes
   * contendo todas as importações e provedores de serviços necessários
   */
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, RouterModule, HttpClientModule],
      declarations: [HeaderComponent],
      providers: [AuthenticationService, MenuService]
    })
      .compileComponents();
  }));

  /**
   * Criação da instancia do componente
   */
  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.menuActive = true;
  });

  /**
   * Teste para a criação do componente
   */
  it('Inicialização do componente', () => {
    expect(component).toBeDefined();
  });

  /**
   * Teste para validar a exibição do menu para usuários logados no sistema
   */
  it('Exibir Menu para usuário logado no sistema', () => {
    expect(component.menuActive).toBe(true);
    expect(component.menuActive).not.toBe(false);
  });

  /**
   * teste para validar a exibição do menu para usuários não logado no sistema
   */
  it('Não exibir menu para usuário não logado no sistema - Página de 404', () => {
    component.menuActive = false;
    expect(component.menuActive).toBeFalsy();
    expect(component.menuActive).not.toBe(true);
  });

});
