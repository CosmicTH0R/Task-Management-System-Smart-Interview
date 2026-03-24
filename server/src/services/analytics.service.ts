import Task from "../models/Task";
import { Types } from "mongoose";

export async function getAnalytics(userId: string) {
  const userObjectId = new Types.ObjectId(userId);

  const result = await Task.aggregate([
    // Match only this user's tasks
    { $match: { user: userObjectId } },

    // Facet allows multiple sub-pipelines in one pass
    {
      $facet: {
        // Overall counts grouped by status
        statusBreakdown: [
          {
            $group: {
              _id: "$status",
              count: { $sum: 1 },
            },
          },
        ],
        // Priority breakdown
        priorityBreakdown: [
          {
            $group: {
              _id: "$priority",
              count: { $sum: 1 },
            },
          },
        ],
        // Total count
        total: [{ $count: "count" }],
      },
    },
  ]);

  const facet = result[0];

  // Build status map
  const statusMap: Record<string, number> = { Todo: 0, "In Progress": 0, Done: 0 };
  for (const entry of facet.statusBreakdown) {
    statusMap[entry._id] = entry.count;
  }

  // Build priority map
  const priorityMap: Record<string, number> = { Low: 0, Medium: 0, High: 0 };
  for (const entry of facet.priorityBreakdown) {
    priorityMap[entry._id] = entry.count;
  }

  const totalTasks: number = facet.total[0]?.count ?? 0;
  const completedTasks: number = statusMap["Done"];
  const pendingTasks: number = totalTasks - completedTasks;
  const completionPercentage: number =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return {
    totalTasks,
    completedTasks,
    pendingTasks,
    completionPercentage,
    statusBreakdown: [
      { status: "Todo", count: statusMap["Todo"] },
      { status: "In Progress", count: statusMap["In Progress"] },
      { status: "Done", count: statusMap["Done"] },
    ],
    priorityBreakdown: [
      { priority: "Low", count: priorityMap["Low"] },
      { priority: "Medium", count: priorityMap["Medium"] },
      { priority: "High", count: priorityMap["High"] },
    ],
  };
}
