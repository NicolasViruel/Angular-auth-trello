import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import { CustomValidators } from '@utils/validators';
import { RequestStatus } from '@models/request-status.model';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
})
export class RegisterFormComponent {

  //creamos otro fomulario para la validacion
  formUser = this.formBuilder.nonNullable.group({
    email: ['', [Validators.email, Validators.required]],
  }
  );


  form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.email, Validators.required]],
    password: ['', [Validators.minLength(8), Validators.required]],
    confirmPassword: ['', [Validators.required]],
  }, {
    validators: [ CustomValidators.MatchValidator('password', 'confirmPassword') ]
  });
  status: RequestStatus = 'init';
  statusUser: RequestStatus = 'init';
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  showPassword = false;
  showRegister = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {}

  register() {
    if (this.form.valid) {
      this.status = 'loading';
      const { name, email, password } = this.form.getRawValue();
      this.authService.registerAndLogin(name, email, password)
      .subscribe({
        next: () =>{
          this.status = 'success';
          this.router.navigate(['/app/boards']);
        },
        error: () =>{
          this.status = 'failed';
        }
      })
    } else {
      this.form.markAllAsTouched();
    }
  }

  validateUSer(){
    if (this.formUser.valid) {
      this.statusUser = 'loading';
      const { email }= this.formUser.getRawValue(); //para obtener el email
      this.authService.isAvailable(email)
      .subscribe({
        next: (rta) =>{
          this.statusUser = 'success';
          if (rta.isAvailable) {
            this.showRegister = true;
            this.form.controls.email.setValue(email); //le pre rellenamos el campo seteandole con el email que el usuario puso
          }else {
            this.router.navigate(['/login'], {
              queryParams: {email}
            }); //le mandamos por parametro typo query para mandarle el email y tambien prellenarlo en el login
          }
        },
        error: () =>{
          this.statusUser = 'failed';
        }
      })
    }else{
      this.formUser.markAllAsTouched();
    }
  }




}
