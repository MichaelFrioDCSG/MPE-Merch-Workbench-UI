import { tokenReceivedCallback } from 'msal/lib-commonjs/UserAgentApplication';

export class MsalConfig {
    public clientID: string;
    public graphScopes: string[];
    public popup?= true;
    public navigateToLoginRequestUrl?= false;
    public redirectUrl?= window.location.href;
    public authority: '';
    public callback?: tokenReceivedCallback;
}