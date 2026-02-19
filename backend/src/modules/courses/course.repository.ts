import { CourseStatus, Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma";

export const courseRepository = {
  create: (data: Prisma.CourseCreateInput) => prisma.course.create({ data }),

  findById: (id: string) =>
    prisma.course.findUnique({
      where: { id },
      include: {
        instructor: {
          select: { id: true, fullName: true, email: true },
        },
        category: true,
        _count: {
          select: { lessons: true, enrollments: true },
        },
      },
    }),

  update: (id: string, data: Prisma.CourseUpdateInput) =>
    prisma.course.update({ where: { id }, data }),

  list: async (query: {
    cursor?: string;
    limit: number;
    search?: string;
    status?: CourseStatus;
    categoryId?: string;
    instructorId?: string;
    isFree?: boolean;
    sortBy: "createdAt" | "title" | "price";
    sortOrder: "asc" | "desc";
  }) => {
    const where: Prisma.CourseWhereInput = {
      isDeleted: false,
      ...(query.search ? { title: { contains: query.search } } : {}),
      ...(query.status ? { status: query.status } : {}),
      ...(query.categoryId ? { categoryId: query.categoryId } : {}),
      ...(query.instructorId ? { instructorId: query.instructorId } : {}),
      ...(query.isFree === undefined ? {} : { isFree: query.isFree }),
    };

    const orderBy = {
      [query.sortBy]: query.sortOrder,
    } as Prisma.CourseOrderByWithRelationInput;

    const rows = await prisma.course.findMany({
      where,
      orderBy,
      take: query.limit + 1,
      ...(query.cursor
        ? {
            skip: 1,
            cursor: { id: query.cursor },
          }
        : {}),
      include: {
        instructor: {
          select: { id: true, fullName: true },
        },
        category: {
          select: { id: true, name: true, slug: true },
        },
        _count: {
          select: { lessons: true, enrollments: true },
        },
      },
    });

    const hasNext = rows.length > query.limit;
    const data = hasNext ? rows.slice(0, -1) : rows;

    return {
      data,
      nextCursor: hasNext ? data[data.length - 1]?.id : null,
    };
  },
};
