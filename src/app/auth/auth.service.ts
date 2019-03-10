import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { SweetAlertService } from '../services/sweet-alert.service';
import { map } from 'rxjs/operators'
import { User } from './user.model';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth,
              private afdb: AngularFirestore,
              private router: Router,              
              private sweetAlertService: SweetAlertService) { }

  
  initAuthListener() {
    this.afAuth.authState.subscribe( fbUser => {
      console.log(fbUser);
    });
  }


  crearUsuario(nombre: string, email:string, password:string) {

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
          this.sweetAlertService.success('Usuario registrado correctamente');
          this.router.navigate(['/'])
        });
      })
      .catch( error => {        
        this.sweetAlertService.error(error.message);        
      });

  }

  login(email: string, password: string) {
    this.afAuth.auth.signInWithEmailAndPassword(email,password)
      .then(resp => {        
        this.sweetAlertService.success('Logeado correctamente');
        this.router.navigate(['/'])
      })
      .catch( error => {        
        this.sweetAlertService.error(error.message);
      });
  }

  logout() {
    this.sweetAlertService
      .question("¿Estas seguro que desea salir?",
         () => {
          this.router.navigate(['/login']);
          this.afAuth.auth.signOut();
      }
    );   
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
