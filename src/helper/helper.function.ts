import { validate, validateOrReject } from 'class-validator';

export const getSkipNumber = (pageNumber: number, pageSize: number) => {
  return (pageNumber - 1) * pageSize;
};

export const getPagesCounts = (totalCount: number, pageSize: number) => {
  return Math.ceil(totalCount / pageSize);
};

export const outputModel = (totalCount, pageSize, pageNumber) => {
  return {
    pagesCount: getPagesCounts(totalCount, pageSize),
    page: pageNumber,
    pageSize: pageSize,
    totalCount: totalCount,
  };
};

export const validateOrRejectModel = async (
  model: any,
  classConstructor: { new (): any },
) => {
  if (model instanceof classConstructor === false) {
    throw new Error('Incorrect input data');
  }
  try {
    await validateOrReject(model); // Валидиация на принятые данные
  } catch (error) {
    throw new Error(error);
  }
};
