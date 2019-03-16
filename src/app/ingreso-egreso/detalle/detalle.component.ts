import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';

import { Subscription } from 'rxjs';
import { IngresoEgreso } from '../ingreso-egreso.model';
import { IngresoEgresoService } from '../ingreso-egreso.service';
import { SweetAlertService } from 'src/app/services/sweet-alert.service';
import * as fromIngresoEgreso from '../ingreso-egreso.reducer';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: []
})
export class DetalleComponent implements OnInit, OnDestroy {

  subscription: Subscription = new Subscription();
  items: IngresoEgreso[];

  constructor(private store: Store<fromIngresoEgreso.AppState>,
              private ingresoEgresoService: IngresoEgresoService,
              private sweetAlert: SweetAlertService) { }

  ngOnInit() {
    this.subscription = this.store.select('ingresoEgreso')
      .subscribe(ingresoEgreso => {
        this.items = ingresoEgreso.items;
      })
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  borrarItem(uid: string) {
    this.ingresoEgresoService
      .eliminarIngresoEgreso(uid)
      .then(() => {
        this.sweetAlert.success('Eliminado correctamente.');
      });
  }

}
