import DashboardCustomerActivityChart from "../components/DashboardCustomerActivityChart";
import DashboardSalesChart from "../components/DashboardSalesChart";
import DashboardStat from "../components/DashboardStat";
import Layout from "../layouts/Layout";

export default function Dashboard() {
  return (
    <Layout>
      <DashboardStat />

      <div className="max-w-[85rem] px-4 py-2 sm:px-6 lg:px-8 lg:py-2 mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="col-span-2 lg:col-span-2">
            <DashboardSalesChart />
          </div>
          <div className="col-span-2 lg:col-span-2">
            <DashboardCustomerActivityChart />
          </div>
        </div>
      </div>
    </Layout>
  );
}
