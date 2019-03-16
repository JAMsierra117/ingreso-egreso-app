import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IngresoEgreso } from './ingreso-egreso.model';
import { IngresoEgresoService } from './ingreso-egreso.service';
import { SweetAlertService } from '../services/sweet-alert.service';
import { Store } from '@ngrx/store';
import { ActivarLoadingAction, DesactivarLoadingAction } from '../shared/ui.actions';
import { Subscription } from 'rxjs';

import * as fromIngresoEgreso from './ingreso-egreso.reducer';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: []
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {

  forma: FormGroup;
  tipo = 'ingreso';
  cargando: boolean;
  subscription: Subscription = new Subscription();

  constructor(private ingresoEgresoService: IngresoEgresoService,
              private sweetAlertService: SweetAlertService,
              private store: Store<fromIngresoEgreso.AppState>) { }

  ngOnInit() {

    this.subscription = this.store.select('ui')
      .subscribe( ui => {
      this.cargando = ui.isLoading;
    });

    this.forma = new FormGroup({
      'descripcion': new FormControl('',Validators.required),
      'monto': new FormControl(0, Validators.min(0))      
    })

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  crearIngresoEgreso() {

    this.store.dispatch(new ActivarLoadingAction());
    
    const ingresoEgreso = new IngresoEgreso({...this.forma.value, tipo: this.tipo});
    this.ingresoEgresoService.crearIngresoEgreso(ingresoEgreso)
      .then(() => {
        this.store.dispatch(new DesactivarLoadingAction());
        this.forma.reset({ monto:0 });
        this.sweetAlertService.success('Ingreso-Egreso creado correctamente');
      });
   

  }

  cambiartipo() {
    if (this.tipo === 'ingreso') 
      this.tipo = 'egreso';
    else 
      this.tipo = 'ingreso'    
  }

}
