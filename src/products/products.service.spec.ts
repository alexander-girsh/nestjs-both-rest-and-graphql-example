import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { ProductsRepository } from './products.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductDto } from './dto/product.dto';
import { StorageProvider } from '../storage/storage.provider';

jest.mock('./products.repository');

describe('ProductsService', () => {
  let service: ProductsService;
  let spyRepository: ProductsRepository;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [ProductsService, ProductsRepository, StorageProvider],
    }).compile();

    service = moduleRef.get<ProductsService>(ProductsService);
    spyRepository = moduleRef.get<ProductsRepository>(ProductsRepository);
  });

  describe('implements create() method', () => {
    it('calls the ProductsRepository.save()', async () => {
      const dto = new CreateProductDto();
      await service.create(dto);
      expect(spyRepository.save).toBeCalledWith(dto);
    });
  });

  describe('implements find() method', () => {
    it('calls the ProductsRepository.find()', async () => {
      const dto = new ProductDto();
      await service.find(dto);
      expect(spyRepository.find).toBeCalledWith(dto);
    });
  });

  describe('implements update() method', () => {
    it('calls the ProductsRepository.update()', async () => {
      const dto = new ProductDto();
      await service.update(dto.productId, dto);
      expect(spyRepository.update).toBeCalledWith(dto.productId, dto);
    });
  });
});
