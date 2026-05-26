function Filters({
  priorityFilter,
  setPriorityFilter,
  breachedOnly,
  setBreachedOnly,
}) {
  return (
    <div className="filters">

      <select
        value={priorityFilter}
        onChange={(e) =>
          setPriorityFilter(
            e.target.value
          )
        }
      >
        <option value="">
          All Priorities
        </option>

        <option value="low">
          Low
        </option>

        <option value="medium">
          Medium
        </option>

        <option value="high">
          High
        </option>

        <option value="urgent">
          Urgent
        </option>
      </select>





      <label>

        <input
          type="checkbox"
          checked={breachedOnly}
          onChange={(e) =>
            setBreachedOnly(
              e.target.checked
            )
          }
        />

        Breached Only

      </label>

    </div>
  );
}

export default Filters;