import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'countDownTimeFormat'
})
export class CountDownTimeFormatPipe implements PipeTransform {

  transform(value: any): unknown {
    const minutes: number = Math.floor(value / 60);
    return (
      ('00' + minutes).slice(-2) +
      ':' +
      ('00' + Math.floor(value - minutes * 60)).slice(-2)
    );
  }

}
