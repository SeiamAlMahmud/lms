import { EnrollmentStatus, UserRole, UserStatus } from "@prisma/client";
import { prisma } from "../../config/prisma";

const lastNDates = (days: number) => {
  const dates: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().slice(0, 10));
  }
  return dates;
};

export const analyticsService = {
  getGlobalAnalytics: async () => {
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 9);

    const [totalCourses, totalActiveStudents, rawGrowth, rawPopular, rawRevenue, courseList] =
      await Promise.all([
        prisma.course.count({ where: { isDeleted: false } }),
        prisma.user.count({ where: { role: UserRole.STUDENT, status: UserStatus.ACTIVE } }),
        prisma.$runCommandRaw({
          aggregate: "Enrollment",
          pipeline: [
            { $match: { enrolledAt: { $gte: tenDaysAgo } } },
            {
              $group: {
                _id: {
                  $dateToString: { format: "%Y-%m-%d", date: "$enrolledAt" },
                },
                count: { $sum: 1 },
              },
            },
            { $sort: { _id: 1 } },
          ],
          cursor: {},
        }),
        prisma.$runCommandRaw({
          aggregate: "Enrollment",
          pipeline: [
            { $group: { _id: "$courseId", totalEnrollments: { $sum: 1 } } },
            { $sort: { totalEnrollments: -1 } },
            { $limit: 5 },
          ],
          cursor: {},
        }),
        prisma.$runCommandRaw({
          aggregate: "Enrollment",
          pipeline: [
            { $group: { _id: "$courseId", revenue: { $sum: "$paidAmount" } } },
            { $sort: { revenue: -1 } },
          ],
          cursor: {},
        }),
        prisma.course.findMany({
          where: { isDeleted: false },
          select: {
            id: true,
            title: true,
            instructorId: true,
          },
        }),
      ]);

    const growthDocs = ((rawGrowth as any)?.cursor?.firstBatch ?? []) as Array<{ _id: string; count: number }>;
    const growthMap = new Map(growthDocs.map((row) => [row._id, row.count]));
    const enrollmentGrowth = lastNDates(10).map((date) => ({
      date,
      count: growthMap.get(date) ?? 0,
    }));

    const popularDocs = ((rawPopular as any)?.cursor?.firstBatch ?? []) as Array<{
      _id: string;
      totalEnrollments: number;
    }>;

    const revenueDocs = ((rawRevenue as any)?.cursor?.firstBatch ?? []) as Array<{
      _id: string;
      revenue: number;
    }>;

    const courseMap = new Map(courseList.map((course) => [course.id, course]));

    const topPopularCourses = popularDocs.map((item) => ({
      courseId: item._id,
      title: courseMap.get(item._id)?.title ?? "Unknown course",
      totalEnrollments: item.totalEnrollments,
    }));

    const revenuePerCourse = revenueDocs.map((item) => ({
      courseId: item._id,
      title: courseMap.get(item._id)?.title ?? "Unknown course",
      revenue: Number(item.revenue.toFixed ? item.revenue.toFixed(2) : item.revenue),
    }));

    const completionStats = await prisma.enrollment.groupBy({
      by: ["courseId", "status"],
      _count: {
        _all: true,
      },
    });

    const instructorAgg = new Map<string, { instructorId: string; completed: number; total: number }>();

    for (const stat of completionStats) {
      const course = courseMap.get(stat.courseId);
      if (!course) {
        continue;
      }

      const current = instructorAgg.get(course.instructorId) ?? {
        instructorId: course.instructorId,
        completed: 0,
        total: 0,
      };

      current.total += stat._count._all;
      if (stat.status === EnrollmentStatus.COMPLETED) {
        current.completed += stat._count._all;
      }

      instructorAgg.set(course.instructorId, current);
    }

    const instructors = await prisma.user.findMany({
      where: { id: { in: [...instructorAgg.keys()] } },
      select: {
        id: true,
        fullName: true,
        email: true,
      },
    });

    const instructorMap = new Map(instructors.map((x) => [x.id, x]));

    const completionRatePerInstructor = [...instructorAgg.values()].map((item) => ({
      instructorId: item.instructorId,
      instructorName: instructorMap.get(item.instructorId)?.fullName ?? "Unknown",
      completionRate: item.total === 0 ? 0 : Number(((item.completed / item.total) * 100).toFixed(2)),
      totalEnrollments: item.total,
      completedEnrollments: item.completed,
    }));

    return {
      totalCourses,
      totalActiveStudents,
      enrollmentGrowth,
      topPopularCourses,
      revenuePerCourse,
      completionRatePerInstructor,
    };
  },

  getInstructorAnalytics: async (instructorId: string) => {
    const courses = await prisma.course.findMany({
      where: {
        instructorId,
        isDeleted: false,
      },
      select: {
        id: true,
        title: true,
      },
    });

    if (!courses.length) {
      return {
        totalCourses: 0,
        totalStudents: 0,
        totalRevenue: 0,
        completionRate: 0,
        revenuePerCourse: [],
      };
    }

    const courseIds = courses.map((c) => c.id);

    const stats = await prisma.enrollment.groupBy({
      by: ["courseId", "status"],
      where: {
        courseId: { in: courseIds },
      },
      _count: { _all: true },
      _sum: { paidAmount: true },
    });

    let totalStudents = 0;
    let completed = 0;
    let totalRevenue = 0;

    const courseMap = new Map(courses.map((c) => [c.id, c.title]));
    const revenueMap = new Map<string, number>();

    for (const stat of stats) {
      totalStudents += stat._count._all;
      if (stat.status === EnrollmentStatus.COMPLETED) {
        completed += stat._count._all;
      }

      const existing = revenueMap.get(stat.courseId) ?? 0;
      revenueMap.set(stat.courseId, existing + (stat._sum.paidAmount ?? 0));
      totalRevenue += stat._sum.paidAmount ?? 0;
    }

    const revenuePerCourse = [...revenueMap.entries()].map(([courseId, revenue]) => ({
      courseId,
      title: courseMap.get(courseId) ?? "Unknown",
      revenue: Number(revenue.toFixed(2)),
    }));

    return {
      totalCourses: courses.length,
      totalStudents,
      totalRevenue: Number(totalRevenue.toFixed(2)),
      completionRate: totalStudents === 0 ? 0 : Number(((completed / totalStudents) * 100).toFixed(2)),
      revenuePerCourse,
    };
  },
};
