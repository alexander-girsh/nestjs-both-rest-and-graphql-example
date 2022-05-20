import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

jest.mock('./categories.service');

describe('CategoriesController', () => {
  let controller: CategoriesController;
  let spyService: CategoriesService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [CategoriesService],
    }).compile();

    controller = moduleRef.get<CategoriesController>(CategoriesController);
    spyService = moduleRef.get<CategoriesService>(CategoriesService);
  });

  describe('implements create() method', () => {
    it('calls the CategoriesService.create()', async () => {
      const dto = new CreateCategoryDto();
      await controller.create(dto);
      expect(spyService.create).toBeCalledWith(dto);
    });
  });

  describe('implements find() method', () => {
    it('calls the CategoriesService.find()', async () => {
      const dto = new CreateCategoryDto();
      await controller.find(dto);
      expect(spyService.find).toBeCalledWith(dto);
    });
  });

  describe('implements update() method', () => {
    it('calls the CategoriesService.update()', async () => {
      const dto = new UpdateCategoryDto();
      await controller.update(dto.categoryName, dto);
      expect(spyService.update).toBeCalledWith(dto.categoryName, dto);
    });
  });

  describe('implements remove() method', () => {
    it('calls the CategoriesService.remove()', async () => {
      const dto = new UpdateCategoryDto();
      await controller.remove(dto.categoryName);
      expect(spyService.remove).toBeCalledWith(dto.categoryName);
    });
  });
});
