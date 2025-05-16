const {
  Category,
  MenuItem,
  Order,
  OrderItem,
  sequelize,
  User
} = require("../models");
const { Op, fn, col, literal } = require("sequelize");
const dayjs = require('dayjs');
const amountOfMenuItemsToCategory = async () => {
  try {
    const categories = await Category.findAll({
      attributes: [
        "id",
        "name",
        [
          sequelize.fn("COUNT", sequelize.col("menuItems.id")),
          "amountOfMenuItems",
        ],
      ],
      include: [
        {
          model: MenuItem,
          attributes: [],
          as: "menuItems",
          required: false,
        },
      ],
      group: ["Category.id", "Category.name"],
      raw: true,
    });

    const formattedResult = {};
    categories.forEach((category) => {
      formattedResult[category.name] = parseInt(category.amountOfMenuItems);
    });

    return formattedResult;
  } catch (error) {
    throw error;
  }
};

const todaysSales = async () => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const sales = await Order.findAll({
      where: {
        createdAt: {
          [Op.gte]: startOfToday,
        },
      },
      attributes: [[sequelize.fn("SUM", sequelize.col("total")), "totalSales"]],
      raw: true,
    });

    return sales[0]?.totalSales ? parseFloat(sales[0].totalSales) : 0;
  } catch (error) {
    throw error;
  }
};

const averageOrderValue = async () => {
  try {
    const averageOrderValue = await Order.findAll({
      attributes: [
        [sequelize.fn("AVG", sequelize.col("total")), "averageOrderValue"],
      ],
      raw: true,
    });
    return averageOrderValue[0]?.averageOrderValue
      ? parseFloat(averageOrderValue[0].averageOrderValue)
      : 0;
  } catch (error) {
    throw error;
  }
};

const topSellingItem = async () => {
  try {
    const topSellingItem = await OrderItem.findAll({
      attributes: [
        "menuItemId",
        [sequelize.fn("SUM", sequelize.col("quantity")), "totalQuantity"],
      ],
      group: ["menuItemId"],
      order: [[sequelize.fn("SUM", sequelize.col("quantity")), "DESC"]],
      limit: 1,
      raw: true,
    });

    if (!topSellingItem[0]?.menuItemId) return null;

    // Fetch the MenuItem to get its name
    const menuItem = await MenuItem.findByPk(topSellingItem[0].menuItemId);
    return menuItem?.name || null;
  } catch (error) {
    throw error;
  }
};

const newlyAddedMenuItems = async () => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const latestItem = await MenuItem.findOne({
      where: {
        createdAt: {
          [Op.gte]: startOfToday,
        },
      },
      attributes: ["name"],
      order: [["createdAt", "DESC"]],
      raw: true,
    });

    return latestItem ? latestItem.name : null;
  } catch (error) {
    throw error;
  }
};

const salesByFilter = async (startDate, endDate) => {
  try {
    const salesData = [];

    let currentDate = new Date(startDate);
    currentDate.setHours(0, 0, 0, 0); // Start at beginning of day

    const finalDate = new Date(endDate);
    finalDate.setHours(23, 59, 59, 999); // End at end of day

    while (currentDate <= finalDate) {
      // Clone start and end times for the current day
      const dayStart = new Date(currentDate);
      dayStart.setHours(0, 0, 0, 0);

      const dayEnd = new Date(currentDate);
      dayEnd.setHours(23, 59, 59, 999);

      const sales = await Order.findAll({
        where: {
          createdAt: {
            [Op.between]: [dayStart, dayEnd],
          },
        },
        attributes: [
          [sequelize.fn("SUM", sequelize.col("total")), "totalSales"],
        ],
        raw: true,
      });

      salesData.push({
        day: dayStart.toISOString().split("T")[0],
        sales: sales[0]?.totalSales ? parseFloat(sales[0].totalSales) : 0,
      });

      // Move to the next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return salesData;
  } catch (error) {
    throw error;
  }
};

const totalSalesThisDay = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1); // Start of tomorrow

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1); // Start of yesterday

    // Total sales for today
    const todaySales = await Order.findAll({
      where: {
        createdAt: {
          [Op.gte]: today,
          [Op.lt]: tomorrow,
        },
      },
      attributes: [[sequelize.fn("SUM", sequelize.col("total")), "totalSales"]],
      raw: true,
    });

    // Total sales for yesterday
    const yesterdaySales = await Order.findAll({
      where: {
        createdAt: {
          [Op.gte]: yesterday,
          [Op.lt]: today,
        },
      },
      attributes: [[sequelize.fn("SUM", sequelize.col("total")), "totalSales"]],
      raw: true,
    });

    const changeInPercentage =
      ((todaySales[0]?.totalSales - yesterdaySales[0]?.totalSales) /
        (yesterdaySales[0]?.totalSales || 1)) *
      100;

    return {
      today: todaySales[0]?.totalSales
        ? parseFloat(todaySales[0].totalSales)
        : 0,
      yesterday: yesterdaySales[0]?.totalSales
        ? parseFloat(yesterdaySales[0].totalSales)
        : 0,
      changeInPercentage: changeInPercentage.toFixed(2) + "%",
    };
  } catch (error) {
    throw error;
  }
};

const totalSalesThisWeek = async () => {
  try {
    const today = new Date();

    // Start of this week (Sunday)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    // End of this week (Saturday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 7); // exclusive upper bound
    endOfWeek.setHours(0, 0, 0, 0);

    // Start of last week
    const startOfLastWeek = new Date(startOfWeek);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

    // End of last week
    const endOfLastWeek = new Date(startOfLastWeek);
    endOfLastWeek.setDate(endOfLastWeek.getDate() + 7);

    const thisWeekSales = await Order.findAll({
      where: {
        createdAt: {
          [Op.gte]: startOfWeek,
          [Op.lt]: endOfWeek,
        },
      },
      attributes: [[sequelize.fn("SUM", sequelize.col("total")), "totalSales"]],
      raw: true,
    });

    const lastWeekSales = await Order.findAll({
      where: {
        createdAt: {
          [Op.gte]: startOfLastWeek,
          [Op.lt]: endOfLastWeek,
        },
      },
      attributes: [[sequelize.fn("SUM", sequelize.col("total")), "totalSales"]],
      raw: true,
    });

    const changeInPercentage =
      ((thisWeekSales[0]?.totalSales - lastWeekSales[0]?.totalSales) /
        (lastWeekSales[0]?.totalSales || 1)) *
      100;

    return {
      thisWeek: thisWeekSales[0]?.totalSales
        ? parseFloat(thisWeekSales[0].totalSales)
        : 0,
      lastWeek: lastWeekSales[0]?.totalSales
        ? parseFloat(lastWeekSales[0].totalSales)
        : 0,
      changeInPercentage: changeInPercentage.toFixed(2) + "%",
    };
  } catch (error) {
    throw error;
  }
};

const totalSalesThisMonth = async () => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0); // Start of the month

    const salesThisMonth = await Order.findAll({
      where: {
        createdAt: {
          [Op.gte]: startOfMonth,
        },
      },
      attributes: [[sequelize.fn("SUM", sequelize.col("total")), "totalSales"]],
      raw: true,
    });

    const startOfLastMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1
    );
    startOfLastMonth.setHours(0, 0, 0, 0); // Start of last month

    const salesLastMonth = await Order.findAll({
      where: {
        createdAt: {
          [Op.gte]: startOfLastMonth,
          [Op.lt]: startOfMonth,
        },
      },
      attributes: [[sequelize.fn("SUM", sequelize.col("total")), "totalSales"]],
      raw: true,
    });

    const changeInPercentage =
      ((salesThisMonth[0]?.totalSales - salesLastMonth[0]?.totalSales) /
        (salesLastMonth[0]?.totalSales || 1)) *
      100;

    return {
      thisMonth: salesThisMonth[0]?.totalSales
        ? parseFloat(salesThisMonth[0].totalSales)
        : 0,
      lastMonth: salesLastMonth[0]?.totalSales
        ? parseFloat(salesLastMonth[0].totalSales)
        : 0,
      changeInPercentage: changeInPercentage.toFixed(2) + "%",
    };
  } catch (error) {
    throw error;
  }
};

const totalSalesThisYear = async () => {
  try {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    startOfYear.setHours(0, 0, 0, 0); // Start of the year

    const salesThisYear = await Order.findAll({
      where: {
        createdAt: {
          [Op.gte]: startOfYear,
        },
      },
      attributes: [[sequelize.fn("SUM", sequelize.col("total")), "totalSales"]],
      raw: true,
    });

    const startOfLastYear = new Date(today.getFullYear() - 1, 0, 1);
    startOfLastYear.setHours(0, 0, 0, 0); // Start of last year

    const salesLastYear = await Order.findAll({
      where: {
        createdAt: {
          [Op.gte]: startOfLastYear,
          [Op.lt]: startOfYear,
        },
      },
      attributes: [[sequelize.fn("SUM", sequelize.col("total")), "totalSales"]],
      raw: true,
    });

    const changeInPercentage =
      ((salesThisYear[0]?.totalSales - salesLastYear[0]?.totalSales) /
        (salesLastYear[0]?.totalSales || 1)) *
      100;

    return {
      thisYear: salesThisYear[0]?.totalSales
        ? parseFloat(salesThisYear[0].totalSales)
        : 0,
      lastYear: salesLastYear[0]?.totalSales
        ? parseFloat(salesLastYear[0].totalSales)
        : 0,
      changeInPercentage: changeInPercentage.toFixed(2) + "%",
    };
  } catch (error) {
    throw error;
  }
};

const totalSalesLast3Years = async () => {
  try {
    const currentYear = new Date().getFullYear();

    // Get date ranges
    const startOfPrevious3Years = new Date(currentYear - 6, 0, 1); // Jan 1 of 6 years ago
    const endOfPrevious3Years = new Date(
      currentYear - 3,
      11,
      31,
      23,
      59,
      59,
      999
    ); // End of 3 years ago

    const startOfLast3Years = new Date(currentYear - 3, 0, 1); // Jan 1 of 3 years ago
    const endOfLastYear = new Date(currentYear - 1, 11, 31, 23, 59, 59, 999); // End of last year

    // Fetch previous 3 years
    const previous3YearsSales = await Order.findAll({
      where: {
        createdAt: {
          [Op.between]: [startOfPrevious3Years, endOfPrevious3Years],
        },
      },
      attributes: [[sequelize.fn("SUM", sequelize.col("total")), "totalSales"]],
      raw: true,
    });

    // Fetch last 3 years
    const last3YearsSales = await Order.findAll({
      where: {
        createdAt: {
          [Op.between]: [startOfLast3Years, endOfLastYear],
        },
      },
      attributes: [[sequelize.fn("SUM", sequelize.col("total")), "totalSales"]],
      raw: true,
    });

    const thisYear = last3YearsSales[0]?.totalSales
      ? parseFloat(last3YearsSales[0].totalSales)
      : 0;
    const lastYear = previous3YearsSales[0]?.totalSales
      ? parseFloat(previous3YearsSales[0].totalSales)
      : 0;

    const changeInPercentage =
      lastYear === 0 ? 100 : ((thisYear - lastYear) / lastYear) * 100;

    return {
      this3Year: thisYear, // last 3 years total
      last3Year: lastYear, // previous 3 years total
      changeInPercentage: changeInPercentage.toFixed(2) + "%",
    };
  } catch (error) {
    throw error;
  }
};

const totalTransactionsThisDay = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1); // Start of tomorrow

    // Create a new date object for yesterday to avoid modifying the 'today' date
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1); // Set to the same time yesterday

    // Fetch transactions for today
    const transactionsToday = await Order.findAll({
      where: {
        createdAt: {
          [Op.gte]: today,
          [Op.lt]: tomorrow,
        },
      },
      attributes: [
        [sequelize.fn("COUNT", sequelize.col("id")), "totalTransactions"],
      ],
      raw: true,
    });

    // Fetch transactions for yesterday
    const transactionsYesterday = await Order.findAll({
      where: {
        createdAt: {
          [Op.gte]: yesterday,
          [Op.lt]: today, // Use the 'today' variable as the end of the range for yesterday
        },
      },
      attributes: [
        [sequelize.fn("COUNT", sequelize.col("id")), "totalTransactions"],
      ],
      raw: true,
    });

    // Calculate change in percentage
    const changeInPercentage =
      ((transactionsToday[0]?.totalTransactions -
        transactionsYesterday[0]?.totalTransactions) /
        (transactionsYesterday[0]?.totalTransactions || 1)) *
      100;

    return {
      today: transactionsToday[0]?.totalTransactions
        ? parseInt(transactionsToday[0].totalTransactions)
        : 0,
      yesterday: transactionsYesterday[0]?.totalTransactions
        ? parseInt(transactionsYesterday[0].totalTransactions)
        : 0,
      changeInPercentage: changeInPercentage.toFixed(2) + "%",
    };
  } catch (error) {
    throw error;
  }
};

const totalTransactionsThisWeek = async () => {
  try {
    const today = new Date();

    // Start of this week (Sunday)
    const startOfWeek = new Date(today);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    // End of this week (Saturday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 7); // exclusive upper bound
    endOfWeek.setHours(0, 0, 0, 0);

    // Start of last week
    const startOfLastWeek = new Date(startOfWeek);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

    // End of last week
    const endOfLastWeek = new Date(startOfLastWeek);
    endOfLastWeek.setDate(endOfLastWeek.getDate() + 7);

    const thisWeekTransactions = await Order.findAll({
      where: {
        createdAt: {
          [Op.gte]: startOfWeek,
          [Op.lt]: endOfWeek,
        },
      },
      attributes: [
        [sequelize.fn("COUNT", sequelize.col("id")), "totalTransactions"],
      ],
      raw: true,
    });

    const lastWeekTransactions = await Order.findAll({
      where: {
        createdAt: {
          [Op.gte]: startOfLastWeek,
          [Op.lt]: endOfLastWeek,
        },
      },
      attributes: [
        [sequelize.fn("COUNT", sequelize.col("id")), "totalTransactions"],
      ],
      raw: true,
    });

    const changeInPercentage =
      ((thisWeekTransactions[0]?.totalTransactions -
        lastWeekTransactions[0]?.totalTransactions) /
        (lastWeekTransactions[0]?.totalTransactions || 1)) *
      100;

    return {
      thisWeek: thisWeekTransactions[0]?.totalTransactions
        ? parseInt(thisWeekTransactions[0].totalTransactions)
        : 0,
      lastWeek: lastWeekTransactions[0]?.totalTransactions
        ? parseInt(lastWeekTransactions[0].totalTransactions)
        : 0,
      changeInPercentage: changeInPercentage.toFixed(2) + "%",
    };
  } catch (error) {
    throw error;
  }
};

const totalTransactionsThisMonth = async () => {
  try {
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    startOfMonth.setHours(0, 0, 0, 0); // Start of the month

    const transactionsThisMonth = await Order.findAll({
      where: {
        createdAt: {
          [Op.gte]: startOfMonth,
        },
      },
      attributes: [
        [sequelize.fn("COUNT", sequelize.col("id")), "totalTransactions"],
      ],
      raw: true,
    });

    const startOfLastMonth = new Date(
      today.getFullYear(),
      today.getMonth() - 1,
      1
    );
    startOfLastMonth.setHours(0, 0, 0, 0); // Start of last month

    const transactionsLastMonth = await Order.findAll({
      where: {
        createdAt: {
          [Op.gte]: startOfLastMonth,
          [Op.lt]: startOfMonth,
        },
      },
      attributes: [
        [sequelize.fn("COUNT", sequelize.col("id")), "totalTransactions"],
      ],
      raw: true,
    });

    const changeInPercentage =
      ((transactionsThisMonth[0]?.totalTransactions -
        transactionsLastMonth[0]?.totalTransactions) /
        (transactionsLastMonth[0]?.totalTransactions || 1)) *
      100;

    return {
      thisMonth: transactionsThisMonth[0]?.totalTransactions
        ? parseInt(transactionsThisMonth[0].totalTransactions)
        : 0,
      lastMonth: transactionsLastMonth[0]?.totalTransactions
        ? parseInt(transactionsLastMonth[0].totalTransactions)
        : 0,
      changeInPercentage: changeInPercentage.toFixed(2) + "%",
    };
  } catch (error) {
    throw error;
  }
};

const totalTransactionsThisYear = async () => {
  try {
    const today = new Date();
    const startOfYear = new Date(today.getFullYear(), 0, 1);
    startOfYear.setHours(0, 0, 0, 0); // Start of the year

    const transactionsThisYear = await Order.findAll({
      where: {
        createdAt: {
          [Op.gte]: startOfYear,
        },
      },
      attributes: [
        [sequelize.fn("COUNT", sequelize.col("id")), "totalTransactions"],
      ],
      raw: true,
    });

    const startOfLastYear = new Date(today.getFullYear() - 1, 0, 1);
    startOfLastYear.setHours(0, 0, 0, 0); // Start of last year

    const transactionsLastYear = await Order.findAll({
      where: {
        createdAt: {
          [Op.gte]: startOfLastYear,
          [Op.lt]: startOfYear,
        },
      },
      attributes: [
        [sequelize.fn("COUNT", sequelize.col("id")), "totalTransactions"],
      ],
      raw: true,
    });

    const changeInPercentage =
      ((transactionsThisYear[0]?.totalTransactions -
        transactionsLastYear[0]?.totalTransactions) /
        (transactionsLastYear[0]?.totalTransactions || 1)) *
      100;

    return {
      thisYear: transactionsThisYear[0]?.totalTransactions
        ? parseInt(transactionsThisYear[0].totalTransactions)
        : 0,
      lastYear: transactionsLastYear[0]?.totalTransactions
        ? parseInt(transactionsLastYear[0].totalTransactions)
        : 0,
      changeInPercentage: changeInPercentage.toFixed(2) + "%",
    };
  } catch (error) {
    throw error;
  }
};

const totalTransactionsLast3Years = async () => {
  try {
    const currentYear = new Date().getFullYear();

    // Get date ranges
    const startOfPrevious3Years = new Date(currentYear - 6, 0, 1); // Jan 1 of 6 years ago
    const endOfPrevious3Years = new Date(
      currentYear - 3,
      11,
      31,
      23,
      59,
      59,
      999
    ); // End of 3 years ago

    const startOfLast3Years = new Date(currentYear - 3, 0, 1); // Jan 1 of 3 years ago
    const endOfLastYear = new Date(currentYear - 1, 11, 31, 23, 59, 59, 999); // End of last year

    // Fetch previous 3 years
    const previous3YearsTransactions = await Order.findAll({
      where: {
        createdAt: {
          [Op.between]: [startOfPrevious3Years, endOfPrevious3Years],
        },
      },
      attributes: [
        [sequelize.fn("COUNT", sequelize.col("id")), "totalTransactions"],
      ],
      raw: true,
    });

    // Fetch last 3 years
    const last3YearsTransactions = await Order.findAll({
      where: {
        createdAt: {
          [Op.between]: [startOfLast3Years, endOfLastYear],
        },
      },
      attributes: [
        [sequelize.fn("COUNT", sequelize.col("id")), "totalTransactions"],
      ],
      raw: true,
    });

    const thisYear = last3YearsTransactions[0]?.totalTransactions
      ? parseInt(last3YearsTransactions[0].totalTransactions)
      : 0;
    const lastYear = previous3YearsTransactions[0]?.totalTransactions
      ? parseInt(previous3YearsTransactions[0].totalTransactions)
      : 0;

    const changeInPercentage =
      lastYear === 0 ? 100 : ((thisYear - lastYear) / lastYear) * 100;

    return {
      this3Year: thisYear, // last 3 years total
      last3Year: lastYear, // previous 3 years total
      changeInPercentage: changeInPercentage.toFixed(2) + "%",
    };
  } catch (error) {
    throw error;
  }
};

const averageTransactionThisDay = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
  
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
  
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
  
      const twoDaysAgo = new Date(today);
      twoDaysAgo.setDate(today.getDate() - 2);
  
      // Today
      const [transactionsToday, salesToday] = await Promise.all([
        Order.count({
          where: {
            createdAt: {
              [Op.gte]: today,
              [Op.lt]: tomorrow,
            },
          },
        }),
        Order.sum("total", {
          where: {
            createdAt: {
              [Op.gte]: today,
              [Op.lt]: tomorrow,
            },
          },
        }),
      ]);
  
      // Yesterday
      const [transactionsYesterday, salesYesterday] = await Promise.all([
        Order.count({
          where: {
            createdAt: {
              [Op.gte]: yesterday,
              [Op.lt]: today,
            },
          },
        }),
        Order.sum("total", {
          where: {
            createdAt: {
              [Op.gte]: yesterday,
              [Op.lt]: today,
            },
          },
        }),
      ]);
  
      const avgToday = salesToday / transactionsToday || 0;
      const avgYesterday = salesYesterday / transactionsYesterday || 0;
  
      let trend = 0;
      if (avgYesterday !== 0) {
        trend = ((avgToday - avgYesterday) / Math.abs(avgYesterday)) * 100;
      }
  
      return {
        averageTransactionToday: avgToday,
        averageTransactionYesterday: avgYesterday,
        trendPercentage: Number(trend.toFixed(2)),
      };
    } catch (error) {
      throw error;
    }
  };

  const averageTransactionThisWeek = async () => {
    try {
      const today = new Date();
  
      // Start of this week (Sunday)
      const startOfWeek = new Date(today);
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
  
      // End of this week (Saturday)
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 7); // exclusive upper bound
      endOfWeek.setHours(0, 0, 0, 0);
  
      // Start of last week
      const startOfLastWeek = new Date(startOfWeek);
      startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);
  
      // End of last week
      const endOfLastWeek = new Date(startOfLastWeek);
      endOfLastWeek.setDate(endOfLastWeek.getDate() + 7);
  
      const [thisWeekTransactions, thisWeekSales] = await Promise.all([
        Order.count({
          where: {
            createdAt: {
              [Op.gte]: startOfWeek,
              [Op.lt]: endOfWeek,
            },
          },
        }),
        Order.sum("total", {
          where: {
            createdAt: {
              [Op.gte]: startOfWeek,
              [Op.lt]: endOfWeek,
            },
          },
        }),
      ]);
  
      const [lastWeekTransactions, lastWeekSales] = await Promise.all([
        Order.count({
          where: {
            createdAt: {
              [Op.gte]: startOfLastWeek,
              [Op.lt]: endOfLastWeek,
            },
          },
        }),
        Order.sum("total", {
          where: {
            createdAt: {
              [Op.gte]: startOfLastWeek,
              [Op.lt]: endOfLastWeek,
            },
          },
        }),
      ]);
  
      const avgThisWeek = thisWeekSales / thisWeekTransactions || 0;
      const avgLastWeek = lastWeekSales / lastWeekTransactions || 0;
  
      let trend = 0;
      if (avgLastWeek !== 0) {
        trend = ((avgThisWeek - avgLastWeek) / Math.abs(avgLastWeek)) *
          100;
      }
  
      return {
        averageTransactionThisWeek: avgThisWeek,
        averageTransactionLastWeek: avgLastWeek,
        trendPercentage: Number(trend.toFixed(2)),
      };
    } catch (error) {
      throw error;
    }
  };

 const peakHourSalesToday = async () => {
    
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Start of today
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1); // Start of tomorrow
    
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1); // Start of yesterday
    
        const peakHourSalesToday = await Order.findAll({
            where: {
            createdAt: {
                [Op.gte]: today,
                [Op.lt]: tomorrow,
            },
            },
            attributes: [
            [sequelize.fn("HOUR", sequelize.col("createdAt")), "hour"],
            [sequelize.fn("SUM", sequelize.col("total")), "totalSales"],
            ],
            group: ["hour"],
            order: [[sequelize.fn("SUM", sequelize.col("total")), "DESC"]],
            limit: 1,
            raw: true,
        });
    
        const peakHourSalesYesterday = await Order.findAll({
            where: {
            createdAt: {
                [Op.gte]: yesterday,
                [Op.lt]: today,
            },
            },
            attributes: [
            [sequelize.fn("HOUR", sequelize.col("createdAt")), "hour"],
            [sequelize.fn("SUM", sequelize.col("total")), "totalSales"],
            ],
            group: ["hour"],
            order: [[sequelize.fn("SUM", sequelize.col("total")), "DESC"]],
            limit: 1,
            raw: true,
        });
    
        const changeInPercentage =
            ((peakHourSalesToday[0]?.totalSales -
            peakHourSalesYesterday[0]?.totalSales) /
            (peakHourSalesYesterday[0]?.totalSales || 1)) *
            100;
    
        return {
            peakHourToday: peakHourSalesToday[0]?.hour || null,
            peakHourYesterday: peakHourSalesYesterday[0]?.hour || null,
            changeInPercentage: changeInPercentage.toFixed(2) + "%",
        };
        }
    catch (error) {
        console.error("Error fetching peak hour sales:", error);
        throw error;
    }
}

const salesTrendToday = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
  
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
  
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
  
      // Query hourly sales today
      const salesByHour = await Order.findAll({
        where: {
          createdAt: {
            [Op.gte]: today,
            [Op.lt]: tomorrow,
          },
        },
        attributes: [
          [sequelize.fn("HOUR", sequelize.col("createdAt")), "hour"],
          [sequelize.fn("SUM", sequelize.col("total")), "totalSales"],
        ],
        group: ["hour"],
        order: [["hour", "ASC"]],
        raw: true,
      });
  
      // Normalize sales map
      const salesMap = {};
      salesByHour.forEach(item => {
        salesMap[parseInt(item.hour)] = parseFloat(item.totalSales);
      });
  
      // Get yesterday's total
      const yesterdaySales = await Order.findOne({
        where: {
          createdAt: {
            [Op.gte]: yesterday,
            [Op.lt]: today,
          },
        },
        attributes: [
          [sequelize.fn("SUM", sequelize.col("total")), "totalSales"],
        ],
        raw: true,
      });
  
      const yesterdayTotal = parseFloat(yesterdaySales?.totalSales || 0);
      const todayTotal = Object.values(salesMap).reduce((sum, val) => sum + val, 0);
  
      const percentChange = yesterdayTotal > 0
        ? ((todayTotal - yesterdayTotal) / yesterdayTotal * 100).toFixed(1)
        : "0";
  
      // Ensure full 24 hours
      const completeHourlyData = [];
      for (let hour = 0; hour < 24; hour++) {
        completeHourlyData.push({
          hour,
          totalSales: parseFloat(salesMap[hour] || 0),
        });
      }
  
      return {
        data: completeHourlyData,
        totalToday: todayTotal.toFixed(2),
        totalYesterday: yesterdayTotal.toFixed(2),
        percentChange,
        isPositive: todayTotal >= yesterdayTotal,
      };
    } catch (error) {
      console.error("Error fetching sales trend:", error);
      throw error;
    }
  };
  
  const topCategoriesByQuantity = async () => {
    try {
      // Get the top categories by summing quantities of menu items in each category
      const topCategories = await OrderItem.findAll({
        include: [
          {
            model: MenuItem,
            as: 'menuItem', // Add this line with the correct alias
            attributes: [],
            required: true,
            include: [
              {
                model: Category,
                as: 'category', // If Category is also aliased in the model
                attributes: [],
                required: true,
              },
            ],
          },
        ],
        attributes: [
          [sequelize.col('menuItem.categoryId'), 'categoryId'], // Update this to match the alias
          [sequelize.fn('SUM', sequelize.col('quantity')), 'totalQuantity'],
        ],
        group: ['menuItem.categoryId'], // Update this to match the alias
        order: [[sequelize.fn('SUM', sequelize.col('quantity')), 'DESC']],
        limit: 5,
        raw: true,
      });
  
      // Rest of your code remains the same
      const categoryIds = topCategories.map(item => item.categoryId);
      
      // Get the actual category names
      const categories = await Category.findAll({
        where: {
          id: {
            [Op.in]: categoryIds,
          },
        },
        attributes: ['id', 'name'],
        raw: true,
      });
  
      return topCategories.map(item => ({
        ...item,
        name: categories.find(cat => cat.id === item.categoryId)?.name || null,
      }));
    } catch (error) {
      console.error("Error fetching top categories by quantity:", error);
      throw error;
    }
  };
  
  const topCategoriesByRevenue = async () => {
    try {
      // Get the top categories by summing revenue of menu items in each category
      const topCategories = await OrderItem.findAll({
        include: [
          {
            model: MenuItem,
            as: 'menuItem', // Add the alias here
            attributes: [],
            required: true,
            include: [
              {
                model: Category,
                as: 'category', // Add the category alias here
                attributes: [],
                required: true,
              },
            ],
          },
        ],
        attributes: [
          [sequelize.col('menuItem.categoryId'), 'categoryId'], // Update column reference to use alias
          [sequelize.fn('SUM', sequelize.literal('OrderItem.price * OrderItem.quantity')), 'totalRevenue'],
        ],
        group: ['menuItem.categoryId'], // Update group by to use alias
        order: [[sequelize.fn('SUM', sequelize.literal('OrderItem.price * OrderItem.quantity')), 'DESC']],
        limit: 5,
        raw: true,
      });
  
      const categoryIds = topCategories.map(item => item.categoryId);
  
      // Get the actual category names
      const categories = await Category.findAll({
        where: {
          id: {
            [Op.in]: categoryIds,
          },
        },
        attributes: ['id', 'name'],
        raw: true,
      });
  
      return topCategories.map(item => ({
        ...item,
        name: categories.find(cat => cat.id === item.categoryId)?.name || null,
      }));
    } catch (error) {
      console.error("Error fetching top categories by revenue:", error);
      throw error;
    }
  };

 

const findCustomerActivity = async () => {
 const today = dayjs().startOf('day')
  const past30Days = dayjs().subtract(29, 'day').startOf('day')

  const users = await User.findAll({
    where: {
      createdAt: {
        [Op.between]: [past30Days.toDate(), today.add(1, 'day').toDate()],
      },
    },
    attributes: ['createdAt'],
  })

  const orders = await Order.findAll({
    where: {
      createdAt: {
        [Op.between]: [past30Days.toDate(), today.add(1, 'day').toDate()],
      },
    },
    attributes: ['createdAt'],
  })

  const result = []
  for (let i = 0; i < 30; i++) {
    const date = past30Days.add(i, 'day').format('YYYY-MM-DD')
    const registered = users.filter(u => dayjs(u.createdAt).format('YYYY-MM-DD') === date).length
    const ordered = orders.filter(o => dayjs(o.createdAt).format('YYYY-MM-DD') === date).length
    result.push({ date, registered, ordered })
  }

  return result
}




module.exports = {
  amountOfMenuItemsToCategory,
  todaysSales,
  averageOrderValue,
  topSellingItem,
  newlyAddedMenuItems,
  salesByFilter,
  totalSalesThisDay,
  totalSalesThisWeek,
  totalSalesThisMonth,
  totalSalesThisYear,
  totalSalesLast3Years,
  totalTransactionsThisDay,
  totalTransactionsThisWeek,
  totalTransactionsThisMonth,
  totalTransactionsThisYear,
  totalTransactionsLast3Years,
    averageTransactionThisDay,
    averageTransactionThisWeek,
    peakHourSalesToday,
    salesTrendToday,
    topCategoriesByQuantity,
    topCategoriesByRevenue,
    findCustomerActivity
};
