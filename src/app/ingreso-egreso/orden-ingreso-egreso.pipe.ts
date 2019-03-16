import { Pipe, PipeTransform } from '@angular/core';
import { IngresoEgreso } from './ingreso-egreso.model';

@Pipe({
  name: 'ordenIngresoEgreso'
})
export class OrdenIngresoEgresoPipe implements PipeTransform {

  transform(items: IngresoEgreso[]): IngresoEgreso[] {
    return items.sort( (a,b) => {

      if(a.monto > b.monto && a.tipo ==='ingreso') {
        return -1
      } else {
        return 1
      }
    });
  }

}
