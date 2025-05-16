import { useEffect } from "react";
import useStatStore from "../stores/useStatStore";
import ReactApexChart from "react-apexcharts";

export default function ReportSalesTrend() {
  const { type, fetchSalesTrend, salesTrend } = useStatStore();

  useEffect(() => {
    fetchSalesTrend(type);
  }, [fetchSalesTrend, type]);

  // Filter and prepare data for 1am to 11pm (hours 1-23)
  const filteredData = salesTrend?.data
    ? salesTrend.data.filter(item => item.hour >= 1 && item.hour <= 23)
    : [];
  
  // Prepare chart data when salesTrend is available
  const chartOptions = {
    chart: {
      type: 'area',
      height: 350,
      toolbar: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
      width: 2,
    },
    xaxis: {
      categories: filteredData.map(item => `${item.hour}:00`),
      title: {
        text: 'Hour of Day',
      },
      labels: {
        formatter: (val) => {
          const hour = parseInt(val);
          return `${hour}:00`;
        }
      }
    },
    yaxis: {
      title: {
        text: 'Sales (₱)',
      },
      labels: {
        formatter: (val) => {
          return `₱${val.toLocaleString()}`;
        }
      }
    },
    colors: [salesTrend?.isPositive ? '#00C853' : '#FF5252'],
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.3,
      },
    },
    tooltip: {
      y: {
        formatter: function(val) {
          return `₱${val.toLocaleString()}`;
        },
      },
    },
  };

  const chartSeries = [
    {
      name: 'Sales',
      data: filteredData.map(item => item.totalSales),
    },
  ];

  // Display percentage change with appropriate color and arrow
  const renderPercentChange = () => {
    if (!salesTrend) return null;
    
    const isPositive = salesTrend.isPositive;
    const percentChange = salesTrend.percentChange;
    
    return (
      <span className={`py-[5px] px-1.5 inline-flex items-center gap-x-1 text-xs font-medium rounded-md ${
        isPositive 
          ? 'bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-500'
          : 'bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-500'
      }`}>
        <svg 
          className="inline-block size-3.5" 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          {isPositive ? (
            // Up arrow for positive change
            <>
              <path d="M12 19V5" />
              <path d="m5 12 7-7 7 7" />
            </>
          ) : (
            // Down arrow for negative change
            <>
              <path d="M12 5v14" />
              <path d="m19 12-7 7-7-7" />
            </>
          )}
        </svg>
        {percentChange}%
      </span>
    );
  };

  return (
    <div>
      {/* Card */}
      <div className="p-4 md:p-5 min-h-102.5 flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-2">
          <div>
            <h2 className="text-sm text-gray-500 dark:text-neutral-500">
              Sales Trend
            </h2>
          </div>
          
          <div>
            {renderPercentChange()}
          </div>
        </div>
        {/* End Header */}
        
        {/* Chart */}
        <div className="flex-grow">
          {salesTrend ? (
            <ReactApexChart 
              options={chartOptions} 
              series={chartSeries} 
              type="area" 
              height="100%" 
              width="100%" 
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500">Loading sales data...</p>
            </div>
          )}
        </div>
        
        {/* Summary Stats */}
        {salesTrend && (
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-xs text-gray-500">Today</p>
              <p className="font-medium">₱{salesTrend.totalToday}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-gray-500">Yesterday</p>
              <p className="font-medium">₱{salesTrend.totalYesterday}</p>
            </div>
          </div>
        )}
      </div>
      {/* End Card */}
    </div>
  );
}