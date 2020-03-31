export class LoginModel {
    username: string;
    password: string;
    grantType: string;
    refreshToken: string;

    constructor() {
        this.username = '';
        this.password = '';
        this.grantType = '';
        this.refreshToken = '';
    }
}
