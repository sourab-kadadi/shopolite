export interface NoticaitonFCM {
    to?: string;
    registration_ids?: string[];
    notification: NotificationMessege;
    data: any;
    android: Android;
}

export interface AndroidNotification {
    imageUrl: string;
}

export interface Android {
    notification: AndroidNotification;
}

export enum NotifiactionDefault {
    TITLE = "SHOPOLITE",
    IMAGE_URL = "https://shopolite.s3.ap-south-1.amazonaws.com/shopolite_static/shopolite-logo.png"
}

export interface NotificationMessege {
    title: string;
    body: string;
    icon?: string;
    sound?: string;
    image?: string;
    click_action?: string;
}

export interface NotificationReq {
    registration_ids?: string[],
    title?: string;
    bodyTemplate: string;
    tempateData: any;
    data?: any;
    icon?: string;
    sound?: string;
    image?: string;
}
 