import { HttpService, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { HoganCompileType } from './utils.dto';
const Hogan = require('hogan.js');
@Injectable()
export class UtilsService {

    constructor(private httpService: HttpService) { }

    async getDataFromUrl(url: string): Promise<Observable<any>> {
        let file = await this.httpService.get(url, { responseType: "arraybuffer" });
        return file;
    }


    decodeEntities(encodedString) {
        var translate_re = /&(nbsp|amp|quot|lt|gt);/g;
        var translate = {
            nbsp: ' ',
            amp: '&',
            quot: '"',
            lt: '<',
            gt: '>',
        };
        return encodedString
            .replace(translate_re, function (match, entity) {
                return translate[entity];
            })
            .replace(/&#(\d+);/gi, function (match, numStr) {
                var num = parseInt(numStr, 10);
                return String.fromCharCode(num);
            });
    }


    async hoganTemplate(templateString: string, data: any, type: HoganCompileType): Promise<string> {
        let template = Hogan.compile(templateString);
        let output = template.render(data);
        if (type == HoganCompileType.TEXT) {
            output = this.decodeEntities(output);
        }
        return output;
    }


    getInMin(time) {
        let timeSplit = time.split(':');
        let minutes = +timeSplit[0] * 60 + +timeSplit[1];
        return minutes;
      }




}
