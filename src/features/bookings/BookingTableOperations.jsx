import SortBy from "../../ui/SortBy";
import Filter from "../../ui/Filter";
import TableOperations from "../../ui/TableOperations";

function BookingTableOperations() {
  return (
    <TableOperations>
      <Filter
        filterField="status"
        options={[
          { value: "all", label: "All stays" },
          { value: "checked-out", label: "Departed" },
          { value: "checked-in", label: "Currently in-house" },
          { value: "unconfirmed", label: "Not yet arrived" },
        ]}
      />

      <SortBy
        options={[
          { value: "startDate-desc", label: "Arrival (latest first)" },
          { value: "startDate-asc", label: "Arrival (earliest first)" },
          {
            value: "totalPrice-desc",
            label: "Total due (highest first)",
          },
          { value: "totalPrice-asc", label: "Total due (lowest first)" },
        ]}
      />
    </TableOperations>
  );
}

export default BookingTableOperations;
