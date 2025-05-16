const {
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
  findCustomerActivity,
} = require("../services/statService");

const categoryStat = async (req, res) => {
  try {
    const result = await amountOfMenuItemsToCategory();
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while fetching category statistics." });
  }
};

const dashboardStat = async (req, res) => {
  try {
    const [
      totalSalesResult,
      averageOrderValueResult, // Rename this variable
      topSellingItemResult,
      newlyAddedMenuItemsResult,
    ] = await Promise.all([
      todaysSales(),
      averageOrderValue(), // Keep the function call as is
      topSellingItem(),
      newlyAddedMenuItems(),
    ]);

    res.status(200).json({
      totalSales: totalSalesResult,
      averageOrderValue: averageOrderValueResult,
      topSellingItem: topSellingItemResult,
      newlyAddedMenuItems: newlyAddedMenuItemsResult,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res
      .status(500)
      .json({
        error: "An error occurred while fetching dashboard statistics.",
      });
  }
};

const salesWithFilter = async (req, res) => {
  try {
    // Automatically set the date range to the last 30 days
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 30);
    end.setHours(23, 59, 59, 999); // Set to the end of the current day

    // Fetch sales data for the last 30 days
    const sales = await salesByFilter(start, end);

    res.status(200).json({ totalSales: sales });
  } catch (error) {
    console.error("Error fetching sales by filter:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching sales by filter." });
  }
};

const getReportStat = async (req, res) => {
  const { type } = req.query;
  switch (type) {
    case "Today":
        const totalSalesToday = await totalSalesThisDay();
        const totalTransactionsToday = await totalTransactionsThisDay();   
        const averageTransactionToday = await averageTransactionThisDay();
        const peakHourSales = await peakHourSalesToday();
        return res.status(200).json({
            totalSales: totalSalesToday,
            totalTransactions: totalTransactionsToday,
            averageTransaction: averageTransactionToday,
            peakHourSales: peakHourSales,
          });

    case "ThisWeek":
      const thisWeekSales = await totalSalesThisWeek();
      const thisWeekTransactions = await totalTransactionsThisWeek();
      const averageTransaction = await averageTransactionThisWeek();
      return res.status(200).json({ totalSales: thisWeekSales, totalTransactions: thisWeekTransactions, averageTransaction });

    case "ThisMonth":
      const thisMonthSales = await totalSalesThisMonth();
      const thisMonthTransactions = await totalTransactionsThisMonth();
      
      return res.status(200).json({ totalSales: thisMonthSales, totalTransactions: thisMonthTransactions });

    case "ThisYear":
      const thisYearSales = await totalSalesThisYear();
      const thisYearTransactions = await totalTransactionsThisYear();
      return res.status(200).json({ totalSales: thisYearSales, totalTransactions: thisYearTransactions });

   case "Last3Years":
      const this3YearsSales = await totalSalesLast3Years();
      const this3YearsTransactions = await totalTransactionsLast3Years();
      return res.status(200).json({ totalSales: this3YearsSales, totalTransactions: this3YearsTransactions });
    
    default:
      return res.status(400).json({ error: "Invalid report type" });
  }

};

const getSalesTrend = async (req, res) => {
  const { type } = req.query;
  switch (type) {
    case "Today":
      const thisDaySalesTrend = await salesTrendToday();
      return res.status(200).json(thisDaySalesTrend);
    case "ThisWeek":
      const salesTrendThisWeek = await salesTrendThisWeek();
      return res.status(200).json(salesTrendThisWeek);
    case "ThisMonth":
      const salesTrendThisMonth = await salesTrendThisMonth();
      return res.status(200).json(salesTrendThisMonth);
    case "ThisYear":
      const salesTrendThisYear = await salesTrendThisYear();
      return res.status(200).json(salesTrendThisYear);
    default:
      return res.status(400).json({ error: "Invalid report type" });
  }
};

const getTopCategories = async (req, res) => {
  const {outputType} = req.query;

  switch (outputType) {
    case "quantity":
        const topCategoriesIfQuantity = await topCategoriesByQuantity()
        return res.status(200).json(topCategoriesIfQuantity);
     
    case "revenue":
        const topCategoriesIfRevenue = await topCategoriesByRevenue()
        return res.status(200).json(topCategoriesIfRevenue);
     
    default:
        return res.status(400).json({ error: "Invalid report type" });
     
  }
}

const getCustomerActivity = async (req, res) => {
  try {
    const activity = await findCustomerActivity();
    res.status(200).json(activity);
  } catch (error) {
    console.error('Error fetching customer activity:', error);
    res.status(500).json({ error: 'Failed to fetch customer activity' });
  }
}

module.exports = {
  categoryStat,
  dashboardStat,
  salesWithFilter,
  getReportStat,
  getSalesTrend,
  getTopCategories,
  getCustomerActivity,
};
