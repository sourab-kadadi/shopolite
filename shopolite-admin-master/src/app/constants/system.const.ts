/* eslint-disable @typescript-eslint/naming-convention */
import {
  NgxUiLoaderModule,
  NgxUiLoaderConfig,
  SPINNER,
  POSITION,
  PB_DIRECTION,
} from 'ngx-ui-loader';
import { title } from 'process';

export enum IActionType {
    ADD='ADD',
    EDIT='EDIT'
}

export const ngXLoaderType = 'loader-03';
export const ngXFgsType = SPINNER.threeStrings;
export const ngxUiLoaderConfig: NgxUiLoaderConfig  = {
    "bgsColor": "#e13657",
    "bgsOpacity": 0.5,
    "bgsPosition": "bottom-right",
    "bgsSize": 60,
    "bgsType": "ball-spin-clockwise",
    "blur": 5,
    "delay": 0,
    "fastFadeOut": true,
    "fgsColor": "#e13657",
    "fgsPosition": "center-center",
    "fgsSize": 60,
    "fgsType": "three-strings",
    "gap": 24,
    // "logoPosition": "center-center",
    // "logoSize": 120,
    // "logoUrl": "",
    "masterLoaderId": "master",
    "overlayBorderRadius": "0",
    "overlayColor": "rgba(255,255,255,0.8)",
    "pbColor": "#e13657",
    "pbDirection": "ltr",
    "pbThickness": 3,
    "hasProgressBar": true,
    "text": "",
    "textColor": "#FFFFFF",
    "textPosition": "center-center",
    "maxTime": -1,
    "minTime": 300
  };


export enum Role {
  ADMIN = 'ADMIN',
  DIRECTOR = 'DIRECTOR',
  OPERATIONAL_MANAGER = 'OPERATIONAL_MANAGER',
  SALES_OFFICER = 'SALES_OFFICER',
  DISTRIBUTER = 'DISTRIBUTER',
  MANAGER = 'MANAGER',
  ACCOUNTANT = 'ACCOUNTANT',
  PLANT_MANAGER = 'PLANT_MANAGER',


}

//   export enum Strings {
//     // UID = 'uid',
//     SALES_OFFICER = '/sales-officer',
//     DISTRIBUTER = '/distributor',
//     ADMIN = '/admin',
//     MANAGER = '/manager',
//     ACCOUNTANT = '/accountant'
// }


  export class MessageLib {

    public static CREATED_SUCCESS =  'Created Successfully';
    public static UPDATED_SUCCESS =  'Updated Successfully';




    public static USER_CREATED_SUCCESS =  'User Created Successfully';
    public static INTERNAL_SERVER_ERROR =  'Internal Server Error! Please contact Naomi Seeds';
    public static INTERNAL_SERVER_ERROR_ALERT =  'Internal Server Error !!!</br> Please contact Naomi Seeds.';
    public static FORM_VALIDATION_MESSAGE = 'Please provide all the required values!';
    public static PRODUCT_ADD_SUCCESS = 'Product Added Successfully';
    public static DATA_ADD = 'Data Added Successfully';
    public static DATA_UPDATE_SUCCESS = 'Data Updated Successfully';
    public static DATA_UPDATE_FAILED = 'Data Updated failed';
    public static FIELD_RESET = 'Fields Reset Successfully';

    public static UNAUTHORISED_ACCESS = 'Unauthorised access';

    public static WORKFLOW_UPDATE_SUCCESSFUL = 'Workflow Update Successful!!';


    public static LOGIN_SUCCESS = 'Logged in Successfully';






    public static FORM_APPROVED = 'Form Approved Successfully';

    public static SALES_ORDER_GENERATE_SUCCESS = 'Sales Order Generated Successfully';



// Sales Order page
public static FROM_TO_DISTRIBUTOR_ERROR = 'From and To sistributor cannot be same';





public static DATA_FETCHED = 'Data Fetched Successfully';





// dashboard
public static DASHBOARD_SUMMARY_SUCCESS = 'Summary Details updated successfully';

public static DASHBOARD_INVOICE_SUCCESS = 'Invoice Details updated successfully';

public static DASHBOARD_CREDIT_NOTE_SUCCESS = 'Credit Note Details updated successfully';

  }
