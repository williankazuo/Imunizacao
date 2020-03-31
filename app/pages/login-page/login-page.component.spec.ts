import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginPageComponent } from './login-page.component';

import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

describe('Pagina de login', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;

  /**
   * Criação de um @ngModule de teste, contendo as declarções e importações necessárias para
   * rodar o teste do componente
   */
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule, HttpClientModule],
      declarations: [LoginPageComponent]
    }).compileComponents();
  }));

  /**
   * Criação da instancia do componente
   */
  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPageComponent);
    fixture.debugElement.nativeElement.style.visibility = 'hidden';
    component = fixture.componentInstance;
    component.ngOnInit();
  });

  afterEach(() => { })


  // teste para validar a criação do componente
  it('Inicialização do componente', () => {
    expect(component).toBeDefined();
  });

  // teste para verificar se os campos para o login foram criados
  it('Os campos de Usuário e senha estão criados', () => {

    fixture.detectChanges();
    const login = fixture.debugElement.nativeElement;
    const count = login.getElementsByTagName('input');

    expect(login.getElementsByTagName('input')).toBeTruthy();
    expect(count.length).toEqual(2);
  });

});