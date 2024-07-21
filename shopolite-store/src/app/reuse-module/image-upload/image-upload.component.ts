import { HttpEventType } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UploadService } from '../../service/service/upload.service';
import { environment } from "../../../environments/environment";
import { Camera, CameraOptions } from '@awesome-cordova-plugins/camera/ngx';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent implements OnInit {
  @Input() text:any = "Upload Profile Picture";
  @Input() icon: any = "image"
  @Input() imageData: any;
  @Input() idFor: any;
  @Input() title: any;
  @Input() width: any = "150px";
  @Input() height: any = "150px";
  boxShadow: "0px 0px 6px 0px grey";
  value = 0;
  bufferValue = 100;
  progressBarVisible = false
  @Output() onSave = new EventEmitter();
  @Output() onCancel = new EventEmitter();
  @Output() onDelete = new EventEmitter();
  s3path: any = environment.s3Url;

  constructor(public uploadFile: UploadService, private camera: Camera) { }

  ngOnInit(): void {
  }
  

  deleteFile() {
    this.imageData = null;
    this.onSave.emit({data: this.imageData});
  }


  uploadCamara() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64 (DATA_URL):
      console.log(imageData);
      let base64Image = 'data:image/jpeg;base64,' + imageData;
     }, (err) => {
      // Handle error
     });
  }

  async uploadFileToS3(event: any) {
    this.value = 0;
    this.progressBarVisible = true;
   let file = event.target.files[0];
   let presignedUrl: any = await this.uploadFile.getS3Url().toPromise();
   console.log(presignedUrl);
   this.uploadFile.uploadS3(file, presignedUrl.data.url, presignedUrl.data.fields).subscribe(data => {
        if (data.type === HttpEventType.Response) {
            console.log('Upload complete', data);
            this.progressBarVisible = false;
            // this.imageData = ;
            this.onSave.emit({data: {filePath: presignedUrl.data.fields.key, type: file.type, fileName: file.name, name: file.name}});
        }
        if (data.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round(100 * data.loaded / data.total);
            this.value = percentDone;
            console.log('Progress ' + percentDone + '%');
        }
   });
  }

}
