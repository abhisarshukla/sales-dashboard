import {
  AfterViewInit,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit, OnDestroy {
  @ViewChild('drawer') drawer: MatSidenav;
  menuItems = [
    {
      name: 'dashboard',
      allowed: { admin: true, sales: true, curator: true },
    },
    {
      name: 'sales',
      allowed: { admin: true, sales: true, curator: false },
    },
    {
      name: 'customers',
      allowed: { admin: true, sales: true, curator: false },
    },
    {
      name: 'products',
      allowed: { admin: true, sales: false, curator: true },
    },
  ];
  isAuthenticated = false;
  avatar: string = null;
  user: User;
  private userSub: Subscription;
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe((user) => {
      if (user) {
        this.isAuthenticated = true;
        this.user = user;
        this.avatar = `url('https://avatars.dicebear.com/api/open-peeps/${this.user.id}.svg')`;
      } else {
        this.isAuthenticated = false;
        this.user = null;
      }
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  onLogout() {
    this.authService.logout();
  }

  routeToHomePage() {
    if (!this.isAuthenticated) {
      this.router.navigate(['']);
    }
  }
}
