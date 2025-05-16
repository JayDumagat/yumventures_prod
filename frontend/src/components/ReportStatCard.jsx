import { useEffect } from "react";
import useStatStore from "../stores/useStatStore";
import { ArrowBigUpDash, ArrowBigDownDash } from "lucide-react";

export default function ReportStatCard() {
  const { reportStat, fetchReportStat, type } = useStatStore();

  useEffect(() => {
    if (type) {
      fetchReportStat(type);
    }
  }, [type, fetchReportStat]);

  // Handle percentage values for sales
  const rawChangeInPercentage = reportStat?.totalSales?.changeInPercentage || 0;

  // Convert string percentage to number by removing % and parsing
  const changeInPercentage = typeof rawChangeInPercentage === 'string' 
    ? parseFloat(rawChangeInPercentage.replace('%', '')) 
    : rawChangeInPercentage;

  const isPositiveChange = changeInPercentage >= 0;

  // Dynamic values based on type for sales
  const typeMapping = {
    Today: { currentKey: "today", previousLabel: "yesterday", previousKey: "yesterday" },
    ThisWeek: { currentKey: "thisWeek", previousLabel: "last week", previousKey: "lastWeek" },
    ThisMonth: { currentKey: "thisMonth", previousLabel: "last month", previousKey: "lastMonth" },
    ThisYear: { currentKey: "thisYear", previousLabel: "last year", previousKey: "lastYear" },
    Last3Years: { currentKey: "this3Year", previousLabel: "last 3 years", previousKey: "last3Year" },
  };

  const currentPeriod = typeMapping[type] || typeMapping["Today"];

  const currentSalesValue = reportStat?.totalSales?.[currentPeriod.currentKey] || 0;
  const previousSalesValue = reportStat?.totalSales?.[currentPeriod.previousKey] || 0;

  // Transactions section
  const rawTransactionsChangeInPercentage = reportStat?.totalTransactions?.changeInPercentage || 0;
  const transactionsChangeInPercentage = typeof rawTransactionsChangeInPercentage === 'string' 
    ? parseFloat(rawTransactionsChangeInPercentage.replace('%', '')) 
    : rawTransactionsChangeInPercentage;

  const isTransactionsPositiveChange = transactionsChangeInPercentage >= 0;

  const currentTransactionsValue = reportStat?.totalTransactions?.[currentPeriod.currentKey] || 0;
  const previousTransactionsValue = reportStat?.totalTransactions?.[currentPeriod.previousKey] || 0;

  // Average Transaction section
const rawAvgTransChangeInPercentage = reportStat?.averageTransaction?.trendPercentage || 0;

const avgTransChangeInPercentage = typeof rawAvgTransChangeInPercentage === "string"
  ? parseFloat(rawAvgTransChangeInPercentage.replace("%", ""))
  : rawAvgTransChangeInPercentage;

const isAvgTransPositive = avgTransChangeInPercentage >= 0;

const currentAverageTransactionValue =
  reportStat?.averageTransaction?.[`${currentPeriod.currentKey === "today" ? "averageTransactionToday" : currentPeriod.currentKey === "thisWeek" ? "averageTransactionThisWeek" : currentPeriod.currentKey === "thisMonth" ? "averageTransactionThisMonth" : currentPeriod.currentKey === "thisYear" ? "averageTransactionThisYear" : "averageTransactionToday"}`] || 0;

const previousAverageTransactionValue =
  reportStat?.averageTransaction?.[`${currentPeriod.previousKey === "yesterday" ? "averageTransactionYesterday" : currentPeriod.previousKey === "lastWeek" ? "averageTransactionLastWeek" : currentPeriod.previousKey === "lastMonth" ? "averageTransactionLastMonth" : currentPeriod.previousKey === "lastYear" ? "averageTransactionLastYear" : "averageTransactionYesterday"}`] || 0;


  // Peak Hour Sales section
  const peakHourToday = reportStat?.peakHourSales?.peakHourToday || null;
  const peakHourYesterday = reportStat?.peakHourSales?.peakHourYesterday || null;
  const rawPeakHourChangeInPercentage = reportStat?.peakHourSales?.changeInPercentage || "0%";
  
  const peakHourChangeInPercentage = typeof rawPeakHourChangeInPercentage === "string"
    ? parseFloat(rawPeakHourChangeInPercentage.replace("%", ""))
    : rawPeakHourChangeInPercentage;
  
  const isPeakHourPositive = peakHourChangeInPercentage >= 0;
  
  // Format hour to 12-hour format with AM/PM
  const formatHour = (hour) => {
    if (hour === null || hour === undefined) return "-";
    const h = parseInt(hour);
    return h === 0 ? "12 AM" : h === 12 ? "12 PM" : h < 12 ? `${h} AM` : `${h-12} PM`;
  };

  return (
    <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Sales Card */}
        <div className="flex flex-col gap-y-3 lg:gap-y-5 p-4 md:p-5 bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-900 dark:border-neutral-800">
          <div className="inline-flex justify-center items-center">
            <span className="text-xs font-semibold uppercase text-gray-600 dark:text-neutral-400">Total sales</span>
          </div>

          <div className="text-center">
            <h3 className="text-2xl sm:text-xl lg:text-3xl font-semibold text-gray-800 dark:text-neutral-200">
              {currentSalesValue.toLocaleString("en-US", {
                style: "currency",
                currency: "PHP",
              })}
            </h3>
          </div>

          <dl className="flex justify-center items-center divide-x divide-gray-200 dark:divide-neutral-800">
            <dt className="pe-3">
              <span className={isPositiveChange ? "text-green-600" : "text-red-600"}>
                {isPositiveChange ? 
                  <ArrowBigUpDash className="inline-block size-4 self-center" /> : 
                  <ArrowBigDownDash className="inline-block size-4 self-center" />
                }
                <span className="inline-block text-sm">
                  {typeof rawChangeInPercentage === 'string' 
                    ? rawChangeInPercentage 
                    : `${Math.abs(changeInPercentage)}%`}
                </span>
              </span>
              <span className="block text-sm text-gray-500 dark:text-neutral-500">change</span>
            </dt>
            <dd className="text-start ps-3">
              <span className="text-sm font-semibold text-gray-800 dark:text-neutral-200">
                {previousSalesValue.toLocaleString("en-US", {
                  style: "currency",
                  currency: "PHP",
                })}
              </span>
              <span className="block text-sm text-gray-500 dark:text-neutral-500">{currentPeriod.previousLabel}</span>
            </dd>
          </dl>
        </div>

        {/* Transactions Card */}
        <div className="flex flex-col gap-y-3 lg:gap-y-5 p-4 md:p-5 bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-900 dark:border-neutral-800">
          <div className="inline-flex justify-center items-center">
            <span className="text-xs font-semibold uppercase text-gray-600 dark:text-neutral-400">Transactions</span>
          </div>
          <div className="text-center">
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-800 dark:text-neutral-200">
              {currentTransactionsValue.toLocaleString("en-US")}
            </h3>
          </div>
          <dl className="flex justify-center items-center divide-x divide-gray-200 dark:divide-neutral-800">
            <dt className="pe-3">
              <span className={isTransactionsPositiveChange ? "text-green-600" : "text-red-600"}>
                {isTransactionsPositiveChange ? 
                  <ArrowBigUpDash className="inline-block size-4 self-center" /> : 
                  <ArrowBigDownDash className="inline-block size-4 self-center" />
                }
                <span className="inline-block text-sm">
                  {typeof rawTransactionsChangeInPercentage === 'string' 
                    ? rawTransactionsChangeInPercentage 
                    : `${Math.abs(transactionsChangeInPercentage)}%`}
                </span>
              </span>
              <span className="block text-sm text-gray-500 dark:text-neutral-500">change</span>
            </dt>
            <dd className="text-start ps-3">
              <span className="text-sm font-semibold text-gray-800 dark:text-neutral-200">
                {previousTransactionsValue.toLocaleString("en-US")}
              </span>
              <span className="block text-sm text-gray-500 dark:text-neutral-500">{currentPeriod.previousLabel}</span>
            </dd>
          </dl>
        </div>

        {/* You can duplicate and make the other cards dynamic similarly if needed */}
        <div className="flex flex-col gap-y-3 lg:gap-y-5 p-4 md:p-5 bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-900 dark:border-neutral-800">
          <div className="inline-flex justify-center items-center">
            <span className="text-xs font-semibold uppercase text-gray-600 dark:text-neutral-400">Avg. Transaction</span>
          </div>
          <div className="text-center">
            <h3 className="text-2xl sm:text-xl lg:text-3xl font-semibold text-gray-800 dark:text-neutral-200"> {currentAverageTransactionValue.toLocaleString("en-US", {
        style: "currency",
        currency: "PHP",
      })}</h3>
          </div>
          <dl className="flex justify-center items-center divide-x divide-gray-200 dark:divide-neutral-800">
            <dt className="pe-3">
            <span className={isAvgTransPositive ? "text-green-600" : "text-red-600"}>
        {isAvgTransPositive ? (
          <ArrowBigUpDash className="inline-block size-4 self-center" />
        ) : (
          <ArrowBigDownDash className="inline-block size-4 self-center" />
        )}
        <span className="inline-block text-sm">
          {typeof rawAvgTransChangeInPercentage === "string"
            ? rawAvgTransChangeInPercentage
            : `${Math.abs(avgTransChangeInPercentage).toFixed(2)}%`}
        </span>
      </span>
              <span className="block text-sm text-gray-500 dark:text-neutral-500">change</span>
            </dt>
            <dd className="text-start ps-3">
            <span className="text-sm font-semibold text-gray-800 dark:text-neutral-200">
        {previousAverageTransactionValue.toLocaleString("en-US", {
          style: "currency",
          currency: "PHP",
        })}
      </span>
      <span className="block text-sm text-gray-500 dark:text-neutral-500">{currentPeriod.previousLabel}</span>
    </dd>
          </dl>
        </div>

        <div className="flex flex-col gap-y-3 lg:gap-y-5 p-4 md:p-5 bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-900 dark:border-neutral-800">
          <div className="inline-flex justify-center items-center">
            <span className="text-xs font-semibold uppercase text-gray-600 dark:text-neutral-400">Peak hour</span>
          </div>
          <div className="text-center">
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-gray-800 dark:text-neutral-200">{formatHour(peakHourToday)}</h3>
          </div>
          <dl className="flex justify-center items-center divide-x divide-gray-200 dark:divide-neutral-800">
            <dt className="pe-3">
            <span className={isPeakHourPositive ? "text-green-600" : "text-red-600"}>
                {isPeakHourPositive ? (
                  <ArrowBigUpDash className="inline-block size-4 self-center" />
                ) : (
                  <ArrowBigDownDash className="inline-block size-4 self-center" />
                )}
                <span className="inline-block text-sm">
                  {rawPeakHourChangeInPercentage}
                </span>
              </span>
              <span className="block text-sm text-gray-500 dark:text-neutral-500">change</span>
            </dt>
            <dd className="text-start ps-3">
              <span className="text-sm font-semibold text-gray-800 dark:text-neutral-200">{formatHour(peakHourYesterday)}</span>
              <span className="block text-sm text-gray-500 dark:text-neutral-500">{currentPeriod.previousLabel}</span>
            </dd>
          </dl>
        </div>
      </div>
    </div>
  );
}
