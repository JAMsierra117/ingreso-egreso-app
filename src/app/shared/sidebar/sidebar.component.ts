import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { IngresoEgresoService } from 'src/app/ingreso-egreso/ingreso-egreso.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit, OnDestroy {

  subscription: Subscription = new Subscription();
  
  nombre: string;

  constructor(private authService: AuthService,
              private store: Store<AppState>,
              private ingresoEgresoService: IngresoEgresoService
              ) { }
              

  ngOnInit() {
    this.subscription = this.store.select('auth')
      .pipe(
        filter( auth =>  auth.user != null)
      )
      .subscribe( auth => {
        this.nombre = auth.user.nombre;
      })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  logout() {
    this.authService.logout().then( result => {
      this.salir();
    }, () => {});  
    
  }

  salir() {
    this.ingresoEgresoService.unsubscribe();
  }

}
