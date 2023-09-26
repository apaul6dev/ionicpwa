import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'relativeTime',
})
export class RelativeTimePipe implements PipeTransform {
  transform(value: number | string) {
    if (!value) return 'NO_TIME';
    return this.timeDifference(new Date(), new Date(value));
  }

  /**
   * @param  {date} current
   * @param  {date} previous
   * @return {string}
   */
  timeDifference(current, previous): string {


    let msPerMinute = 60 * 1000;
    let msPerHour = msPerMinute * 60;
    let msPerDay = msPerHour * 24;
    let msPerMonth = msPerDay * 30;
    let msPerYear = msPerDay * 365;

    let elapsed = current - previous;
    //console.log(current);
    //console.log(previous);

    if (elapsed < msPerMinute) {
      if (Math.round(elapsed / 1000) < 3) return 'Justo ahora';
      return 'Hace ' + Math.round(elapsed / 1000) + ' segundos';
    } else if (elapsed < msPerHour) {
      let tiempo = Math.round(elapsed / msPerMinute);
      if (tiempo == 1) {
        return 'Hace ' + tiempo + ' minuto';
      } else {
        return 'Hace ' + tiempo + ' minutos';
      }
    } else if (elapsed < msPerDay) {
      let tiempo = Math.round(elapsed / msPerHour);
      if (tiempo == 1) {
        return 'Hace ' + tiempo + ' hora';
      } else {
        return 'Hace ' + tiempo + ' horas';
      }
    } else if (elapsed < msPerMonth) {
      if (Math.round(elapsed / msPerDay) == 1)
        return (
          'Ayer a las ' + previous.getHours() + ':' + previous.getMinutes()
        );

      return 'Hace ' + Math.round(elapsed / msPerDay) + ' días';
    } else {
      /*  else if (elapsed < msPerYear) {
        return 'about ' + Math.round(elapsed/msPerMonth) + ' month ago';
      }*/
      return this.dateFormat(previous);
    }
  }

  dateFormat(value): string {
    var datePipe = new DatePipe('en-US');
    value = datePipe.transform(value, 'dd-MM-yyyy HH:mm');
    return value;
  }
}
