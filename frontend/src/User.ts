export default class User {
    private _isLogged: boolean = false;

    constructor() {
        this._isLogged = false;
    }

    public get isLogged(): boolean {
        return this._isLogged;
    }

    public set isLogged(value: boolean) {
        this._isLogged = value;
    }

    public logIn(login: string, pass: string): string {
        // fetch here and check if ok
        console.log(login, " ", pass);
        this._isLogged = true;
        console.log("Login function is called");
        return "Logged in successfully";
    }

    public register_user(login: string, pass: string, email: string) : string {
        console.log(login, " ", pass, " ", email);
        //here try to register_user;
        console.log("register function is called");
        //if ok
        {
            this.logIn(login, pass);
            return "User has been created";
        }
        return "Error!";

    }
}