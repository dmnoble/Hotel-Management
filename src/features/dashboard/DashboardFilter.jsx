import Filter from "../../ui/Filter";

function DashboardFilter() {
  return (
    <Filter
      filterField="last"
      options={[
        { value: "7", label: "Last 7 nights" },
        { value: "30", label: "Last 30 nights" },
        { value: "90", label: "Last 90 nights" },
      ]}
    />
  );
}

export default DashboardFilter;
