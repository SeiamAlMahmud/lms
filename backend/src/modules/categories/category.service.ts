import slugify from "slugify";
import { AppError } from "../../shared/errors/AppError";
import { categoryRepository } from "./category.repository";

export const categoryService = {
  create: async (payload: { name: string }) => {
    const existing = await categoryRepository.findByName(payload.name);
    if (existing) {
      throw new AppError("Category already exists", 409);
    }

    return categoryRepository.create({
      name: payload.name,
      slug: slugify(payload.name, { lower: true, strict: true }),
    });
  },

  update: async (id: string, payload: { name?: string; isActive?: boolean }) => {
    const category = await categoryRepository.findById(id);
    if (!category) {
      throw new AppError("Category not found", 404);
    }

    const updateData: { name?: string; slug?: string; isActive?: boolean } = {
      isActive: payload.isActive,
    };

    if (payload.name && payload.name !== category.name) {
      const existing = await categoryRepository.findByName(payload.name);
      if (existing) {
        throw new AppError("Category already exists", 409);
      }

      updateData.name = payload.name;
      updateData.slug = slugify(payload.name, { lower: true, strict: true });
    }

    return categoryRepository.update(id, updateData);
  },

  list: (query: { cursor?: string; limit: number; isActive?: boolean }) => categoryRepository.list(query),
};
