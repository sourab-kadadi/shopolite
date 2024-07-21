import { Module } from '@nestjs/common';
import { MapModule } from '../map/map.module';
import { MapService } from '../map/map.service';
import { CalculatorService } from './calculator.service';

@Module({
    imports: [MapModule],
    providers: [CalculatorService, MapService],
    exports: [CalculatorService, MapService]
})
export class CalculatorModule {}