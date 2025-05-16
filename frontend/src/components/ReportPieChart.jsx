import React, { useEffect, useState } from 'react';
import useStatStore from '../stores/useStatStore';
import ReactApexChart from 'react-apexcharts';

export default function ReportPieChart() {
  const { topCategories, fetchTopCategories } = useStatStore();
  const [categoryType, setCategoryType] = useState('quantity');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    setIsLoading(true);
    // Fetch with the selected category type
    fetchTopCategories(categoryType)
      .then(() => setIsLoading(false))
      .catch(() => setIsLoading(false));
  }, [fetchTopCategories, categoryType]);

  // Prepare chart data when topCategories is available
  const chartData = React.useMemo(() => {
    if (!topCategories || !topCategories.length) {
      return {
        labels: [],
        series: []
      };
    }

    // Use different property based on category type
    const valueProperty = categoryType === 'revenue' ? 'totalRevenue' : 'totalQuantity';
    
    return {
      labels: topCategories.map(item => item.name),
      // Parse as float for revenue (might have decimals) or int for quantity
      series: topCategories.map(item => {
        const value = item[valueProperty];
        return categoryType === 'revenue' ? 
          parseFloat(value || 0) : 
          parseInt(value || 0);
      })
    };
  }, [topCategories, categoryType]);

  // Chart options
  const chartOptions = {
    chart: {
      type: 'pie',
      height: 350,
    },
    labels: chartData.labels,
    colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0', '#3F51B5'],
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 300
        },
        legend: {
          position: 'bottom'
        }
      }
    }],
    tooltip: {
      y: {
        formatter: function(value) {
          if (categoryType === 'revenue') {
            return `₱${value.toLocaleString()}`;
          } else {
            return `${value} units`;
          }
        }
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '50%',
        },
        dataLabels: {
          offset: -5
        }
      }
    },
    dataLabels: {
      formatter: function(val, opts) {
        return opts.w.config.labels[opts.seriesIndex] + ': ' + val.toFixed(1) + '%';
      }
    }
  };

  return (
    <div>
      <div className="p-4 md:p-5 min-h-102.5 flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
          <div>
            <h2 className="text-sm text-gray-500 dark:text-neutral-500">
              Top Categories
            </h2>
          </div>
          
          {/* Add the dropdown back */}
          <div>
            <select 
              value={categoryType} 
              onChange={(e) => setCategoryType(e.target.value)}
              className="py-2 px-3 pe-9 block border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-slate-900 dark:border-gray-700 dark:text-neutral-400"
              disabled={isLoading}
            >
              <option value="quantity">By Quantity</option>
              <option value="revenue">By Revenue</option>
            </select>
          </div>
        </div>
        {/* End Header */}
      
        {/* Chart */}
        <div className="flex-grow">
          {isLoading ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500">Loading category data...</p>
            </div>
          ) : topCategories && topCategories.length > 0 ? (
            <ReactApexChart 
              options={chartOptions} 
              series={chartData.series} 
              type="pie" 
              height={350}
              key={categoryType} // Force re-render when type changes
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-500">No category data available</p>
            </div>
          )}
        </div>

        {/* Legend for small screens */}
        {!isLoading && topCategories && topCategories.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-2 md:hidden">
            {chartData.labels.map((label, index) => (
              <div key={label} className="flex items-center">
                <span 
                  className="inline-block w-3 h-3 mr-2 rounded-full" 
                  style={{backgroundColor: chartOptions.colors[index % chartOptions.colors.length]}}
                ></span>
                <span className="text-xs">{label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
