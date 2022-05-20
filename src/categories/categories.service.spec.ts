import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesService } from './categories.service';
import { CategoriesRepository } from './categories.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { FindCategoryDto } from './dto/find-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryDto } from './dto/category.dto';

jest.mock('./categories.repository');

describe('CategoriesService', () => {
  let service: CategoriesService;
  let spyRepository: CategoriesRepository;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [CategoriesService, CategoriesRepository],
    }).compile();

    service = moduleRef.get<CategoriesService>(CategoriesService);
    spyRepository = moduleRef.get<CategoriesRepository>(CategoriesRepository);
  });

  describe('implements create() method', () => {
    it('calls the CategoriesRepository.save()', async () => {
      const dto = new CreateCategoryDto();
      await service.create(dto);
      expect(spyRepository.save).toBeCalledWith(dto);
    });
  });

  describe('implements find() method', () => {
    it('calls the CategoriesRepository.find()', async () => {
      const dto = new FindCategoryDto();
      await service.find(dto);
      expect(spyRepository.find).toBeCalledWith(dto);
    });
  });

  describe('implements update() method', () => {
    it('calls the CategoriesRepository.update()', async () => {
      const dto = new UpdateCategoryDto();
      await service.update(dto.categoryName, dto);
      expect(spyRepository.update).toBeCalledWith(dto.categoryName, dto);
    });
  });

  describe('implements remove() method', () => {
    it('calls the CategoriesRepository.remove()', async () => {
      const dto = new CategoryDto();
      await service.remove(dto.categoryName);
      expect(spyRepository.remove).toBeCalledWith(dto.categoryName);
    });
  });
});
