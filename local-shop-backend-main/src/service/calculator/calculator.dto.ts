import { IDeliveryConfig } from "../../modules/store/store.dto";

export interface IDistanceMatrix {
    distance: number;
    duration: number;
}

export interface IDurationCalculation{
    duration: number;
    durationUnit: string;
    distance: number;
    distanceUnit: string;
    deliveryCharge: number;
    deliveryConfig: IDeliveryConfig,
    isthresholdDeliveryKm: boolean;
}

export interface ITotalStoreCommision {
        totalStoreCommisionCost: number;
        totalStoreOrderCost: number;
}