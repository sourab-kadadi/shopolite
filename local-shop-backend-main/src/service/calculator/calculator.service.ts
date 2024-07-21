import { Injectable } from '@nestjs/common';
import { IDeliveryConfig } from '../../modules/store/store.dto';
import { MapService } from '../map/map.service';
import { IDistanceMatrix, IDurationCalculation, ITotalStoreCommision } from './calculator.dto';
export interface  Discount {
    readonly type: DiscountType,
    readonly value: number
}

export enum DiscountType {
    AMOUNT="AMOUNT",
    PERCENTAGE="PERCENTAGE"
}

export interface IThresholdCharges {
  isthresholdDeliveryKm: boolean;
  deliveryCharge: number;
}
@Injectable()
export class CalculatorService {

    constructor(private mapService: MapService) {
    }

    public sellingPrice(originalPrice: number, discount: Discount): number {
        let sellingPrice = 0;
        if (discount?.type == DiscountType.AMOUNT) {
          sellingPrice = originalPrice - discount.value;
        } else if (discount?.type == DiscountType.PERCENTAGE) {
          sellingPrice = originalPrice - (originalPrice * discount.value / 100);
        } else {
          sellingPrice = originalPrice;
        }
        
        return this.decimalCount(sellingPrice) === 0 ? sellingPrice : Number(sellingPrice.toFixed(2));
      }

    decimalCount(num: number): number {
        // Convert to String
        const numStr = String(num);
        // String Contains Decimal
        if (numStr.includes('.')) {
           return numStr.split('.')[1].length;
        };
        // String Does Not Contain Decimal
        return 0;
     }

     async deliveryCharge(pricePerKm: number, deliveryConfig: IDeliveryConfig,   origin: number[], destination: number[]): Promise<IDurationCalculation>    {
      let getDistanceMatrix: any = await this.distanceMatrix(origin, destination);
      const {deliveryCharge, isthresholdDeliveryKm } = this.deliveryRate(getDistanceMatrix.distance, pricePerKm, deliveryConfig);
      return {
        distance: getDistanceMatrix.distance,
        distanceUnit: "Km",
        duration: getDistanceMatrix.duration,
        durationUnit: "Min",
        deliveryCharge: deliveryCharge,
        deliveryConfig,
        isthresholdDeliveryKm
      };
     }

     totalCustomerCartCost(totalCartCost: number, deliveryCharge:number, couponCost: number) : number {
      return (totalCartCost - couponCost) + deliveryCharge;
     }

     totalStoreCommision(totalCartCost: number, storeCommisionRate:number, couponCost: number): ITotalStoreCommision {
      const totalStoreCommisionCost = (totalCartCost * storeCommisionRate/100);
      const totalStoreOrderCost = (totalCartCost - couponCost) - totalStoreCommisionCost;
      return {
        totalStoreCommisionCost: totalStoreCommisionCost,
        totalStoreOrderCost: totalStoreOrderCost
      };
     }

     private deliveryRate(totalNumberOfKm: number, pricePerKm: number, deliveryConfig: IDeliveryConfig,): IThresholdCharges  {
      if (deliveryConfig?.thresholdDeliveryKm >= totalNumberOfKm) {
        return { isthresholdDeliveryKm: true, deliveryCharge: deliveryConfig?.thresholdFlatCharges || 0};
      }
      const totalDeliveryCharge = totalNumberOfKm * pricePerKm;
      const deliveryCharge = totalDeliveryCharge < deliveryConfig?.minDeliveryPrice ? deliveryConfig?.minDeliveryPrice : totalDeliveryCharge
      return { isthresholdDeliveryKm: false, deliveryCharge };
     }

     private async distanceMatrix(origin: number[], destination: number[]): Promise<IDistanceMatrix> {
        const [originLat, originLong] = origin;
        const [destinationLat, destinationLong] = destination;
        let getMapDistance = await this.mapService.distanceMatrix({
          origin: `${originLat},${originLong}`,
          destination: `${destinationLat},${destinationLong}`,
        });
        getMapDistance = getMapDistance.data;
        // if (getMapDistance?.status == "OK") {
        const distance = Math.ceil(getMapDistance.rows?.[0].elements?.[0].distance?.value  / 1000);
        const duration = Math.ceil(getMapDistance.rows?.[0].elements?.[0].duration?.value / 60);
        return { distance: distance || 0, duration: duration || 0};
        // } else {
        //   throw Error("Invalid Location");
        // }
     }




}
