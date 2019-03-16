import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { SweetAlertService } from '../services/sweet-alert.service';
import { map } from 'rxjs/operators'
import { User } from './user.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';

import * as fromUIActions from '../shared/ui.actions';
import { SetUserAction } from './auth.actions';
import { Subscription } from 'rxjs';
import { UnsetItemsAction } from '../ingreso-egreso/ingreso-egreso.actions';
import { IngresoEgresoService } from '../ingreso-egreso/ingreso-egreso.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubscription: Subscription = new Subscription();

  constructor(private afAuth: AngularFireAuth,
              private afdb: AngularFirestore,
              private router: Router,              
              private sweetAlertService: SweetAlertService,
              private store: Store<AppState>
              ) { }

  
  initAuthListener() {
    this.afAuth.authState.subscribe( fbUser => {   
         if (fbUser) {
           this.userSubscription = this.afdb.doc(`${fbUser.uid}/usuario`).valueChanges()
            .subscribe((userObj: any) => {
              const newUser = new User(userObj);
              const accion = new SetUserAction(newUser);
              this.store.dispatch(accion);
            })
         } else {
            this.store.dispatch(new SetUserAction(null));                                
            this.userSubscription.unsubscribe();
         }
    });
  }


  crearUsuario(nombre: string, email:string, password:string) {


    const accion = new fromUIActions.ActivarLoadingAction();
    this.store.dispatch(accion);

    this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then(resp => {      
        
        const user: User = {
          uid: resp.user.uid,
          nombre: nombre,
          email: resp.user.email
        }

        this.afdb.doc(`${ user.uid }/usuario`)
        .set( user )
        .then(() => {
         
          const accion = new fromUIActions.DesactivarLoadingAction();
          this.store.dispatch(accion);

          this.sweetAlertService.success('Usuario registrado correctamente');
          this.router.navigate(['/'])
        });
      })
      .catch( error => {  
        
        const accion = new fromUIActions.DesactivarLoadingAction();
        this.store.dispatch(accion);      

        this.sweetAlertService.error(error.message);        
      });

  }

  login(email: string, password: string) {
    
    const accion = new fromUIActions.ActivarLoadingAction();
    this.store.dispatch(accion);  
    
    this.afAuth.auth.signInWithEmailAndPassword(email,password)
      .then(resp => {     
        const accion = new fromUIActions.DesactivarLoadingAction(); 
        this.store.dispatch(accion);    
        
        this.sweetAlertService.success('Logeado correctamente');
        this.router.navigate(['/'])
      })
      .catch( error => {  
        const accion = new fromUIActions.DesactivarLoadingAction(); 
        this.store.dispatch(accion);  

        this.sweetAlertService.error(error.message);
      });
  }

  logout() {

    return new Promise((resolve,reject) => {

    this.sweetAlertService
      .question("¿Estas seguro que desea salir?",
         (result) => {
           if (result) {
            this.router.navigate(['/login']);
            this.afAuth.auth.signOut();
            resolve();
           } else {
             reject();
           }
         
      }
    );   

    });
  }

  isAuth() {
    return this.afAuth.authState
      .pipe(
        map( fbUser => {
          if(fbUser == null) {
            this.router.navigate(['/login']);
          }
          return fbUser != null
        })
      )
  }
  
}
