import { NgxUiLoaderConfig, SPINNER } from "ngx-ui-loader";
import { title } from "process";

export enum IActionType {
    ADD="ADD",
    EDIT="EDIT"
}

export const ngXLoaderType = "loader-03";
export const ngXFgsType = SPINNER.rectangleBouncePulseOutRapid;

export const ngxUiLoaderConfig: NgxUiLoaderConfig  = {
    "bgsColor": "red",
    "bgsOpacity": 0.5,
    "bgsPosition": "bottom-left",
    "bgsSize": 60,
    "bgsType": "square-loader",
    "blur": 9,
    "delay": 0,
    "fastFadeOut": true,
    "fgsColor": "#ff5273",
    "fgsPosition": "center-center",
    "fgsSize": 50,
    "fgsType": "square-loader",
    "gap": 24,
    "logoPosition": "bottom-right",
    "logoSize": 90,
    "logoUrl": "",
    "masterLoaderId": "master",
    "overlayBorderRadius": "0",
    "overlayColor": "rgba(255,252,252,0.43)",
    "pbColor": "#ffffff",
    "pbDirection": "ltr",
    "pbThickness": 6,
    "hasProgressBar": true,
    "text": "",
    "textColor": "#FFFFFF",
    "textPosition": "center-center",
    "maxTime": -1,
    "minTime": 300
  };

  export enum Role {
    ADMIN = "ADMIN",
    SALES_OFFICER = "SALES_OFFICER",
    DISTRIBUTER = "DISTRIBUTER",
    MANAGER = "MANAGER",
    ACCOUNTANT = "ACCOUNTANT"
  }

  export class MessageLib {
    public static USER_CREATED_SUCCESS =  "User Created Successfully";
    public static INTERNAL_SERVER_ERROR =  "Internal Server Error! Please contact Shopolite";
    public static FORM_VALIDATION_MESSAGE = "Please provide all the required values!";
    public static OTP_SENT_SUCCESS = "OTP Sent Successfully";
    public static LOGIN_SUCCESS = "Logged in Successfully";
    public static STORE_CREATE_SUCCESS = "Store Created Successfully";
    public static STORE_UPDATE_SUCCESS = "Store Updated Successfully";
    public static updatedSuccessFully = "Store Updated Successfully";
    public static READY_TO_DELIVERED = "Order ready for dispatch";
    public static DELIVERED = "You have successfully delivered, Thank you :)";
    public static ACCEPT = "You have accepted the order :)";
    public static REJECT = "Opps! You have rejected the order :(";
    public static ORDER_NOT_FOUND = "Order Not Found!";
    public static SUPPORT_REQUEST_SUCCESS = "Support request created successfully";
    public static UNABLE_TO_CHANGE_STATUS = "Sorry Not able to change the status";

  }

  export enum DiscountType {
    AMOUNT="AMOUNT",
    PERCENTAGE="PERCENTAGE"
}

  export const discountType = [
  {key: "Amount", value: DiscountType.AMOUNT},
  {key: "Percentage", value: DiscountType.PERCENTAGE}
  ]


  export enum LOCAL_STORAGE_TOKEN_NAME {
    FCM_TOKEN = "FCM_TOKEN",
    DEVICE_INFO = "DEVICE_INFO",
    DEVICE_UUID = "DEVICE_UUID"
  }