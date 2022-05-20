export const CategoriesRepository = jest.fn().mockReturnValue({
  save: jest.fn().mockResolvedValue({}),
  find: jest.fn().mockResolvedValue([]),
  update: jest.fn().mockResolvedValue({}),
  remove: jest.fn().mockResolvedValue({}),
});
