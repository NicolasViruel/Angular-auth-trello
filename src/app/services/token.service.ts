import { Injectable } from '@angular/core';
import { getCookie, removeCookie, setCookie } from 'typescript-cookie';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  saveToken(token: string){
    // guardamos comun en localStorage
    // localStorage.setItem('token', token);
    
    // guardamos con las Cookies
    setCookie('token-trello', token, {expires: 265, path: '/'} )
  };

  getToken(){
    //traemos el token de la forma comun
    // const token = localStorage.getItem('token');
    const token = getCookie('token-trello');
    return token;
  };

  removeToken(){
    removeCookie('token-trello');
  };


}
