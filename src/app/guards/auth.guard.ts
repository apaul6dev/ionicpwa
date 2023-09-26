import { Storage } from '@ionic/storage';
import { AuthService } from './../services/auth.service';
import { AuthHttpService } from './../services/auth-http.service';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthService,
    private storage: Storage
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    await this.authService.recargarUsuario();

    if (this.authService.verificarLogin()) {
      console.log('Si hay');

      return true;
    }

    console.log('NO hay ' + this.authService.verificarLogin());

    this.router.navigateByUrl('/login');
    return false;
  }
}
