import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

type Roles = 'sales' | 'admin' | 'curator';

type User = {
  email: string;
  password: string;
  idToken: string;
  expiresIn: string;
  firstname: string;
  lastname: string;
  role: Roles;
};

type SignupRequest = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
};

export type UserResponse = {
  email: string;
  idToken: string;
  expiresIn: string;
  firstname: string;
  lastname: string;
  role: Roles;
};

@Injectable({
  providedIn: 'root',
})
export class MockUserService {
  users: User[];

  constructor() {
    this.users = [
      this.newUser(
        'sales@user.com',
        '12345678',
        'alexsmithsalesusercom',
        '3600',
        'Alex',
        'Smith',
        'sales'
      ),
      this.newUser(
        'admin@user.com',
        '12345678',
        'johncookadminusercom',
        '3600',
        'John',
        'Cook',
        'admin'
      ),
      this.newUser(
        'curator@user.com',
        '12345678',
        'johnnyjohnnycuratorusercom',
        '3600',
        'Johnny',
        'Johnny',
        'curator'
      ),
    ];
  }

  login(email: string, password: string): Observable<UserResponse> {
    let error: string = '';
    const user = this.users.find((user) => user.email === email);
    if (!user) {
      error = 'EMAIL_NOT_FOUND';
    } else if (user.password !== password) {
      error = 'INVALID_PASSWORD';
    } else {
      error = '';
    }
    return new Observable((observer) => {
      if (error.length == 0) {
        const { password, ...userResponse } = user;
        observer.next(userResponse);
      } else {
        console.log(user);
        observer.error(error);
      }
      observer.complete();
    });
  }

  signup(req: SignupRequest): Observable<UserResponse> {
    let error: string = '';
    const user = this.users.find((user) => user.email === req.email);
    let newUser: User;
    if (user) {
      error = 'EMAIL_EXISTS';
    } else {
      newUser = {
        firstname: req.firstname,
        lastname: req.lastname,
        email: req.email,
        password: req.password,
        role: 'sales',
        expiresIn: '36000',
        idToken:
          req.firstname +
          req.lastname +
          req.email.substring(0, req.email.indexOf('@')) +
          req.email.substring(req.email.lastIndexOf('.') + 1),
      };
      this.users.push(newUser);
    }
    return new Observable(observer => {
      if(error.length == 0) {
        const { password, ...userResponse} = newUser;
        observer.next(userResponse);
      } else {
        observer.error(error);
      }
      observer.complete();
    })
  }

  private newUser(
    email: string,
    password: string,
    idToken: string,
    expiresIn: string,
    firstname: string,
    lastname: string,
    role: Roles
  ): User {
    return {
      email,
      password,
      idToken,
      expiresIn,
      firstname,
      lastname,
      role,
    };
  }
}
