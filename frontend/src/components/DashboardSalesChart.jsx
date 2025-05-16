import { useEffect } from "react";
import ApexCharts from "react-apexcharts";
import useDashboardStore from "../stores/useDashboardStore";

export default function DashboardSalesChart() {
  const {fetchThirtyDaysSales, thirtyDaySaleData} = useDashboardStore()

  useEffect(() => {
    fetchThirtyDaysSales()
  }, [fetchThirtyDaysSales])

  const options = {
    chart: {
      type: "area",
      height: 350,
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    legend: {
      show: false,
    },
    series: [
      {
        name: "Sales",
        data: thirtyDaySaleData.map((item) => item.sales),
      },
    
    ],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "straight",
      width: 2,
    },
    grid: {
      strokeDashArray: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        type: "vertical",
        shadeIntensity: 1,
        opacityFrom: 0.1,
        opacityTo: 0.8,
      },
    },
    xaxis: {
      type: "day",
      tickPlacement: "on",
      categories: thirtyDaySaleData.map((item) => {
        const date = new Date(item.day);
        const day = date.getDate();
        const month = date.toLocaleString("en-US", { month: "short", timeZone: "Asia/Manila" });
        return `${day} ${month}`;
      })
      
    },
    yaxis: {
      labels: {
        align: "left",
        minWidth: 0,
        maxWidth: 140,
        style: {
          colors: "#9ca3af",
          fontSize: "13px",
          fontFamily: "Inter, ui-sans-serif",
          fontWeight: 400,
        },
        formatter: (value) => (value >= 1000 ? `${value / 1000}k` : value),
      },
    },
   
    tooltip: {
      x: {
        format: "MMMM yyyy", 
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    crosshairs: {
      stroke: {
        dashArray: 0,
      },
      dropShadow: {
        show: false,
      },
    },
    
  };

  const salesAmount = thirtyDaySaleData.reduce((acc, item) => acc + item.sales, 0);

  return (
    <div className="p-4 md:p-5 min-h-102.5 flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-sm text-gray-500 dark:text-neutral-500">Sales in a month</h2>
          <p className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
            {(salesAmount).toLocaleString("en-PH", {
              style: "currency",
              currency: "PHP",
            })}
          </p>
        </div>
      </div>
      <div id="hs-single-area-chart">
        <ApexCharts options={options} series={options.series} type="area" height={350} />
      </div>
    </div>
  );
}
