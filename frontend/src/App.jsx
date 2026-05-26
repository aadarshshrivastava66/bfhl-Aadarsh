import {
  useEffect,
  useState,
} from "react";

import API from "./services/api";

import Board from "./components/Board";

import CreateTicket from "./components/CreateTicket";

import Filters from "./components/Filters";

import Stats from "./components/Stats";

function App() {
  const [tickets, setTickets] =
    useState([]);

  const [stats, setStats] =
    useState({});

  const [
    priorityFilter,
    setPriorityFilter,
  ] = useState("");

  const [
    breachedOnly,
    setBreachedOnly,
  ] = useState(false);





  const fetchTickets =
    async () => {
      try {
        let query = [];

        if (priorityFilter) {
          query.push(
            `priority=${priorityFilter}`
          );
        }

        if (breachedOnly) {
          query.push(
            `breached=true`
          );
        }

        const queryString =
          query.length > 0
            ? `?${query.join(
                "&"
              )}`
            : "";

        const res =
          await API.get(
            `/tickets${queryString}`
          );

        setTickets(res.data);
      } catch (error) {
        console.log(error);
      }
    };





  const fetchStats =
    async () => {
      try {
        const res =
          await API.get(
            "/tickets/stats"
          );

        setStats(res.data);
      } catch (error) {
        console.log(error);
      }
    };





  useEffect(() => {
    fetchTickets();

    fetchStats();
  }, [
    priorityFilter,
    breachedOnly,
  ]);





  const updateStatus =
    async (
      id,
      status
    ) => {
      try {
        await API.patch(
          `/tickets/${id}`,
          {
            status,
          }
        );

        fetchTickets();

        fetchStats();
      } catch (error) {
        alert(
          error.response?.data
            ?.message
        );
      }
    };





  return (
    <div className="container">

      <h1>
        DeskFlow Support Board
      </h1>

      <Stats stats={stats} />

      <Filters
        priorityFilter={
          priorityFilter
        }
        setPriorityFilter={
          setPriorityFilter
        }
        breachedOnly={
          breachedOnly
        }
        setBreachedOnly={
          setBreachedOnly
        }
      />

      <CreateTicket
        fetchTickets={
          fetchTickets
        }
        fetchStats={
          fetchStats
        }
      />

      <Board
        tickets={tickets}
        updateStatus={
          updateStatus
        }
      />

    </div>
  );
}

export default App;