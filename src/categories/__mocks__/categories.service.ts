export const CategoriesService = jest.fn().mockReturnValue({
  create: jest.fn().mockReturnValue({}),
  find: jest.fn().mockReturnValue([]),
  update: jest.fn().mockReturnValue({}),
  remove: jest.fn().mockReturnValue({}),
});
