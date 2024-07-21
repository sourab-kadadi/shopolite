import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time24to12'
})
export class Time24to12Pipe implements PipeTransform {

  transform(time: any): any {
    
    var time24To12 = function(a) {
       //below date doesn't matter.
       let timing: any = (new Date("1994-05-10T" + a + "Z")).toLocaleTimeString("bestfit", {
           timeZone: "UTC",
           hour12: !0,
           hour: "numeric",
           minute: "numeric"
       });
       const seperateColon = timing.split(":");
       if (seperateColon[0] == '0') {
        seperateColon[0] = '12';
       }
       timing = `${seperateColon[0]}:${seperateColon[1]}`
       return timing;
   };
       return time24To12(time); 
     }

}
