import { Test, TestingModule } from '@nestjs/testing';
import { ExcelUploadController } from './excel-upload.controller';

describe('ExcelUpload Controller', () => {
  let controller: ExcelUploadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExcelUploadController],
    }).compile();

    controller = module.get<ExcelUploadController>(ExcelUploadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
