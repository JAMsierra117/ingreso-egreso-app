import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { IngresoEgreso } from './ingreso-egreso.model';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { User } from '../auth/user.model';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { UnsetItemsAction, SetItemsAction } from './ingreso-egreso.actions';
import { UnsetUserAction } from '../auth/auth.actions';

import * as fromIngresoEgreso from './ingreso-egreso.reducer';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  subscriptionAuth: Subscription = new Subscription();
  subscriptionItems: Subscription = new Subscription();
  user: User;
  constructor(private afDb: AngularFirestore,
              private store: Store<fromIngresoEgreso.AppState>) { }

  initIngresoEgresoListener() {
    this.subscriptionAuth = this.store.select('auth')
        .pipe(
          filter( auth => auth.user != null)
        )
        .subscribe(auth => {
          this.user = auth.user;          
          this.ingresoEgresoItems(this.user.uid);
        });
  }

  private ingresoEgresoItems( uid: string) {
    this.subscriptionItems = this.afDb.collection(`${ uid }/ingresos-egresos/items`)
      .snapshotChanges()
      .pipe(
        map( docData => {
          return docData.map( doc => {
            return {
              uid: doc.payload.doc.id,
              ...doc.payload.doc.data()
            };
          });
        })
      )
      .subscribe( (coleccion: any[])  => {
        
        this.store.dispatch(new SetItemsAction(coleccion));

      });
  }

  crearIngresoEgreso(ingresoEgreso: IngresoEgreso) {
    
    return this.afDb.doc(`${ this.user.uid }/ingresos-egresos`)
        .collection('items').add({...ingresoEgreso});
       
  }

  eliminarIngresoEgreso(uid: string) {
    return this.afDb.doc(`${this.user.uid}/ingresos-egresos/items/${uid}`)
      .delete();
  }


  unsubscribe() {
    this.subscriptionAuth.unsubscribe();
    this.subscriptionItems.unsubscribe();
    this.store.dispatch(new UnsetItemsAction());    
  }
}
