import TableOperations from "../../ui/TableOperations";
import Filter from "../../ui/Filter";
import SortBy from "../../ui/SortBy";

function CabinTableOperations() {
  return (
    <TableOperations>
      <Filter
        filterField="discount"
        options={[
          { value: "all", label: "All chambers" },
          { value: "no-discount", label: "Standard rate" },
          { value: "with-discount", label: "On special rate" },
        ]}
      />

      <SortBy
        options={[
          { value: "name-asc", label: "Name (A–Z)" },
          { value: "name-desc", label: "Name (Z–A)" },
          { value: "regularPrice-asc", label: "Rate (low to high)" },
          { value: "regularPrice-desc", label: "Rate (high to low)" },
          { value: "maxCapacity-asc", label: "Capacity (fewer souls first)" },
          { value: "maxCapacity-desc", label: "Capacity (more souls first)" },
        ]}
      />
    </TableOperations>
  );
}

export default CabinTableOperations;
