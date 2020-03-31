export class UserModel {
    access_token: string;
    refresh_token: string;
    name: string;

    constructor() {
        this.access_token = '';
        this.refresh_token = '';
        this.name = '';
    }
}
