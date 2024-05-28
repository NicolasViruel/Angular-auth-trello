import { Component, OnInit } from '@angular/core';

import { DataSourceUser } from './data-source';
import { UsersService } from '@services/users.service';
import { AuthService } from '@services/auth.service';
import { User } from '@models/user.model';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html'
})
export class UsersTableComponent implements OnInit  {

  dataSource = new DataSourceUser();
  columns: string[] = ['id', 'avatar', 'name', 'email'];
  user: User | null = null; //es null mientras se hace el request

  constructor(
    private userServices: UsersService,
    private authServices: AuthService
  ) { }

  ngOnInit(): void {
    this.userServices.getUsers()
    .subscribe(users =>{
      this.dataSource.init(users);
    })
    this.authServices.user$
    .subscribe(user =>{
      this.user = user; //aca deberiamos tener la informacion del usuario
    }) 


  }

}
