import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { switchMap, tap } from 'rxjs/operators';
import { TokenService } from './token.service';
import { ResponseLogin } from '@models/auth.model';
import { User } from '@models/user.model';
import { BehaviorSubject } from 'rxjs';
import { checkToken } from '@interceptors/token.interceptor';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

apiUrl = environment.API_URL;
user$ = new BehaviorSubject<User | null>(null); //este es un observable que puede venir null y guardara el estado de la informacion de perfil

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
  ) { }

  getDataUser(){
    return this.user$.getValue();
  }

  login(email: string, password: string){
    return this.http.post<ResponseLogin>(`${this.apiUrl}/api/v1/auth/login`,{
      email,
      password
    })
    // con este pipe recibimos la respuesta del token
    .pipe( 
      tap(response => {
        this.tokenService.saveToken(response.access_token);
        this.tokenService.saveRefreshToken(response.refresh_token);
      })
    );
  }
  refreshToken(refreshToken: string){
    return this.http.post<ResponseLogin>(`${this.apiUrl}/api/v1/auth/refresh-token`,{ refreshToken })
    .pipe( 
      tap(response => {
        this.tokenService.saveToken(response.access_token);
        this.tokenService.saveRefreshToken(response.refresh_token);
      })
    );
  }

  register(name: string, email: string, password: string){
    return this.http.post(`${this.apiUrl}/api/v1/auth/register`,{
      name,
      email,
      password
    } );
  }

  registerAndLogin( name: string, email: string, password: string){
    return this.register(name, email, password)
    .pipe(
      switchMap(() => this.login(email, password)) //este pipe sirve para que una vez que se registra el usuario lo mande directo a los board y no tengo que estar logeando
    )
  }

  // <{isAvailable: boolean}> le decimos que va a recibir una respuesta de este tipo
  isAvailable(email: string){
    return this.http.post<{isAvailable: boolean}>(`${this.apiUrl}/api/v1/auth/is-available`,{
      email,
    });
  }

  recovery(email: string){
    return this.http.post(`${this.apiUrl}/api/v1/auth/recovery`,{
      email,
    });
  }

  changePassword(token: string, newPassword: string){
    return this.http.post(`${this.apiUrl}/api/v1/auth/change-password`,{
      token,
      newPassword
    });
  }

  //aplicamos el interceptor para que este endpoint sepa que necesita el token
  getProfile(){
    const token = this.tokenService.getToken();
    return this.http.get<User>(`${this.apiUrl}/api/v1/auth/profile`, { context: checkToken()} )
    .pipe(
      tap(user => {
        this.user$.next(user);
      })
    );
  }

  logout(){
    this.tokenService.removeToken();
  }


}
