import { Document } from 'mongoose';

export interface Store extends Document{
    // Store Name
    readonly businessName: string;
    // Category Which are Assossiated with the category
    readonly businessCategoryId: any[];
    readonly email: string;
    readonly status: boolean;
    readonly storeOnline: boolean;
    readonly storeCustomId: string;
    readonly phoneNo: string;
    readonly address1: string;
    readonly address2: string;
    readonly landmark: string;
    readonly tradeLicence: string;
    readonly tradeLicenceExpDate: Date;
    readonly location: Ilocation;
    readonly storeImage: Iimage;
    readonly logo: Iimage;
    readonly gstNumber: string;
    readonly accountDetails: Iaccount;
    readonly invoiceDetails: Iinvoice;
    readonly SEO :ISEO;
    readonly createdAt: Date;
    readonly timeing: ITiming;
    readonly acceptDelivery: boolean;
    readonly storeType: IStoreType;
    readonly minTimingToDeliver: MinTimingTODeliver;
    readonly mapFullAddress: string;
    readonly openTimings: OpenTimings;
    readonly deliveryConfig?: IDeliveryConfig;
};

interface MinTimingTODeliver {
    time: string;
    timeUnit: string;
}



interface Ilocation {
    type: string;
    coordinates: number[]
}


interface ITiming {
    startTime: string,
    endTime: string,
    timeOffset: number // So you keep track on the offset with the base timezone 
}
 interface OpenTimings {
    readonly day: number;
    readonly timings: Timings;
    readonly isHoliday: boolean;
    readonly nameOfDay: string;
}

interface Timings {
    readonly startTime: string,
    readonly endTime: string,
    readonly startTimeMin: string,
    readonly endTimeMin: string, 
}


interface IStoreType {
    _id: any,
    name: string,
}

interface Iimage {
    readonly filePath: string;
    readonly type: string;
};

interface Iaccount {
    readonly accountNumber: string;
    readonly AccountName: string;
};

interface Iinvoice {
    readonly invoiceNumber: string;
    readonly invoicePrefix: string;
    readonly TrnNumber: string;
};

interface ISEO {
    readonly keyWords: string[],
    readonly description: string
}


interface IDeliveryConfig {
  minDeliveryPrice: number;
  thresholdDeliveryKm: number;
  thresholdFlatCharges: number;
  deliveryChargePerKm: number;
}