import { Pipe, PipeTransform } from '@angular/core';
import { fromNow } from '@/src/app/tools';

@Pipe({
  name: 'fromNow',
  standalone: true,
})
export class FromNowPipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): unknown {
    return fromNow(value);
  }
}
