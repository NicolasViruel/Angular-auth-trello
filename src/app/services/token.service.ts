import { Injectable } from '@angular/core';
import { jwtDecode, JwtPayload } from 'jwt-decode';
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

  //para el cierre de sesion utilizamos el jwtDecode
  isValidToken() {
    const token = this.getToken();
    if (!token) {
      return false; 
    }
    const decodeToken = jwtDecode<JwtPayload>(token); // 
    if (decodeToken && decodeToken?.exp) {
      const tokenDate = new Date(0);
      tokenDate.setUTCSeconds(decodeToken.exp); //esto me daria la fecha de expiracion del token      
      //para compararla con la fecha de hoy
      const today = new Date();
      return tokenDate.getTime() > today.getTime(); //validamos la expiracion del token
    
    }
    return false
  }


}
