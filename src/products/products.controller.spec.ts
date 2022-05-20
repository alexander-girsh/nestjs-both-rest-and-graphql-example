import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductDto } from './dto/product.dto';

jest.mock('./products.service.ts');

describe('ProductsController', () => {
  let controller: ProductsController;
  let spyService: ProductsService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [ProductsService],
    }).compile();

    controller = moduleRef.get<ProductsController>(ProductsController);
    spyService = moduleRef.get<ProductsService>(ProductsService);
  });

  describe('implements create() method', () => {
    it('calls the ProductsService.create()', async () => {
      const dto = new CreateProductDto();
      await controller.create(dto);
      expect(spyService.create).toBeCalledWith(dto);
    });
  });

  describe('implements find() method', () => {
    it('calls the ProductsService.find()', async () => {
      const dto = new ProductDto();
      await controller.find(dto);
      expect(spyService.find).toBeCalledWith(dto);
    });
  });

  describe('implements update() method', () => {
    it('calls the ProductsService.update()', async () => {
      const dto = new ProductDto();
      await controller.update(dto.productId, dto);
      expect(spyService.update).toBeCalledWith(dto.productId, dto);
    });
  });
});
