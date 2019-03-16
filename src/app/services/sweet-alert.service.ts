import { Injectable } from '@angular/core';

import Swal from 'sweetalert2'

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {

  constructor() { }


  success(message: string) {
    Swal.fire({
      title: message,
      type: 'success'
    })
  }

  error(message: string) {
    Swal.fire({
      title: 'Error!',
      text: message,
      type: 'error'
    })
  }

  question(message: string, callback) {
    Swal.fire({
      type: 'question',
      title: message,
      showCancelButton: true,
      
    }).then((result) => {
        callback(result.value);      
    })
  }
}
