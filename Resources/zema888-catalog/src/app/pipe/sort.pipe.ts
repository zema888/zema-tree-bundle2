import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {

  transform(val: any[], field: string): any[] {
    return _.orderBy(val, field);
  }

}
