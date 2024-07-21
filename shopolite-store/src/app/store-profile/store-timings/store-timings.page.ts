import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AmazingTimePickerService } from 'amazing-time-picker';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { MessageLib } from '../../constants/system.const';
import { ServiceService } from '../service/service.service';

@Component({
  selector: 'app-store-timings',
  templateUrl: './store-timings.page.html',
  styleUrls: ['./store-timings.page.scss'],
})
export class StoreTimingsPage implements OnInit {
  isLoading = false;
  days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  timings = [
    {
      day: 1,
      nameOfDay: 'Sunday',
      timings: [],
      isHoliday: false
    },
    {
      day: 2,
      nameOfDay: 'Monday',
      timings: [],
      isHoliday: false

    },
    {
      day: 3,
      nameOfDay: 'Tuesday',
      timings: [],
      isHoliday: false
    },
    {
      day: 4,
      nameOfDay: 'Wednesday',
      timings: [],
      isHoliday: false

    },
    {
      day: 5,
      nameOfDay: 'Thursday',
      timings: [],
      isHoliday: false
    },
    {
      day: 6,
      nameOfDay: 'Friday',
      timings: [],
      isHoliday: false
    },
    {
      day: 7,
      nameOfDay: 'Saturday',
      timings: [],
      isHoliday: false
    },
  ];
  storeId
  constructor(
    private atp: AmazingTimePickerService,  
    public service: ServiceService,
    private route: ActivatedRoute,
    public toastController: ToastController,
    private ngxUiLoader: NgxUiLoaderService,
    ) {
    this.storeId = this.route.snapshot.paramMap.get("store_id");
  }

  ngOnInit() {
    if (this.storeId) {
      this.getStoreById(this.storeId);
    }
  }

  open(index) {
    const startTime = this.atp.open({
      preference: {
        labels: {
          ok: 'Start Date',
        },
      },
    });
    startTime.afterClose().subscribe((startTimeRes) => {
      const endTime = this.atp.open({
        preference: {
          labels: {
            ok: 'End Date',
          },
        },
      });
      endTime.afterClose().subscribe((endTimeRes) => {
        if (startTimeRes && endTimeRes)
          this.timings[index].timings.push({
            startTime: this.getFormatted12Hr(startTimeRes),
            startTimeMin: this.getInMin(startTimeRes),
            endTime: this.getFormatted12Hr(endTimeRes),
            endTimeMin: this.getInMin(endTimeRes),
          });
      });
    });
  }

  getInMin(time) {
    let timeSplit = time.split(':');
    let minutes = +timeSplit[0] * 60 + +timeSplit[1];
    return minutes;
  }

  getFormatted12Hr(a) {
    let timing: any = new Date('1994-05-10T' + a + 'Z').toLocaleTimeString(
      'bestfit',
      {
        timeZone: 'UTC',
        hour12: !0,
        hour: 'numeric',
        minute: 'numeric',
      }
    );
    const seperateColon = timing.split(':');
    if (seperateColon[0] == '0') {
      seperateColon[0] = '12';
    }
    timing = `${seperateColon[0]}:${seperateColon[1]}`;
    return timing;
  }

  deleteTiming(dayIndex, timingIndex) {
    this.timings[dayIndex].timings.splice(timingIndex, 1);
  }

  updateTimings(data: any) {
    this.storeId = this.route.snapshot.paramMap.get("store_id");
    this.service.updateStore({openTimings: data}).subscribe(data => {
      this.ngxUiLoader.stopLoader("loader-03");
      this.presentToast(MessageLib.STORE_UPDATE_SUCCESS);
    },
    error => {
      this.ngxUiLoader.stopLoader("loader-03");
      this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
    }
    )
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    toast.present();
  }

  getStoreById(storeId) {
    this.isLoading = true;
    this.service.getStoreById(storeId).subscribe(res => {
      this.ngxUiLoader.stopLoader("loader-03");
      if (res?.data?.openTimings)
          this.timings = res?.data?.openTimings;
    }, error => {
      this.isLoading = false;
      this.ngxUiLoader.stopLoader("loader-03");
      this.presentToast(error.message || MessageLib.INTERNAL_SERVER_ERROR);
    })
  }

  onStatusChange($event, i) {
    console.log($event, i);
    
    this.timings[i].isHoliday = $event.detail.checked;
  }
}
