import React, { useEffect } from 'react'
import useStatStore from '../stores/useStatStore'
import Chart from 'react-apexcharts'

export default function DashboardCustomerActivityChart() {
  const { customerActivity, fetchCustomerActivity } = useStatStore()

  useEffect(() => {
    fetchCustomerActivity()
  }, [fetchCustomerActivity])

  const categories = customerActivity.map((item) => item.date)
  const registeredData = customerActivity.map((item) => item.registered)
  const orderedData = customerActivity.map((item) => item.ordered)

  const chartOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: { show: false }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
        borderRadius: 4,
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories,
      labels: {
        rotate: -45,
        style: {
          fontSize: '12px',
          colors: '#6B7280' // Tailwind gray-500
        }
      }
    },
    yaxis: {
      title: {
        text: 'Count'
      }
    },
    fill: {
      opacity: 1
    },
    colors: ['#3B82F6', '#10B981'], // Blue for registered, Green for ordered
    tooltip: {
      y: {
        formatter: (val) => val
      }
    },
    legend: {
      position: 'top'
    }
  }

  const series = [
    {
      name: 'Registered',
      data: registeredData
    },
    {
      name: 'Ordered',
      data: orderedData
    }
  ]

  return (
    <div className="p-4 md:p-5 min-h-102.5 flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl dark:bg-neutral-800 dark:border-neutral-700">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
        <div>
          <h2 className="text-sm text-gray-500 dark:text-neutral-500">Customer Activity</h2>
          <p className="text-xl sm:text-2xl font-medium text-gray-800 dark:text-neutral-200">
            Last 30 Days
          </p>
        </div>

        <div>
          <select disabled className="bg-white dark:bg-neutral-800 border border-gray-300 dark:border-neutral-600 rounded px-2 py-1 text-sm">
            <option value="last-30-days">Last 30 days</option>
          </select>
        </div>
      </div>

      {/* Chart */}
      <div>
        <Chart options={chartOptions} series={series} type="bar" height={350} />
      </div>
    </div>
  )
}
