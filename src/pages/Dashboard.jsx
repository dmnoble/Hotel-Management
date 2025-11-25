import DashboardLayout from "../features/dashboard/DashboardLayout";
import DashboardFilter from "../features/dashboard/DashboardFilter";
import Heading from "../ui/Heading";
import Row from "../ui/Row";

function Dashboard() {
  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Tonight’s Ledger</Heading>
        <DashboardFilter />
      </Row>

      <Row type="vertical">
        <Heading as="h3">Tonight&apos;s omens & occupancy</Heading>
        <p>
          Track who&apos;s checked in, which rooms whisper, and how the house is
          earning its keep.
        </p>
      </Row>

      <DashboardLayout />
    </>
  );
}

export default Dashboard;
