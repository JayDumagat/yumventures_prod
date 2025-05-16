import React from "react";
import Layout from "../layouts/Layout";
import ReportStatCard from "../components/ReportStatCard";
import ReportSalesTrend from "../components/ReportSalesTrend";
import DashboardCustomerActivityChart from "../components/DashboardCustomerActivityChart";
import ReportTopProduct from "../components/ReportTopProduct";
import ReportPeriodButtons from "../components/ReportPeriodButton";
import ReportPieChart from "../components/ReportPieChart";

export default function Reports() {
  return (
    <Layout>
      <ReportPeriodButtons />
      <ReportStatCard />
      <div className="max-w-[85rem] px-4 py-2 sm:px-6 lg:px-8 lg:py-2 mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
          <div className="col-span-2 lg:col-span-3">
            <ReportSalesTrend />
          </div>
          <div className="col-span-2 lg:col-span-2">
            <ReportPieChart/>
          </div>
          
        </div>
      </div>
      <ReportTopProduct/>
    </Layout>
  );
}
