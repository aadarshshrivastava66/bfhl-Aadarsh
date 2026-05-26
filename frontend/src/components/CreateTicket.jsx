import { useState } from "react";

import API from "../services/api";

function CreateTicket({
  fetchTickets,
  fetchStats,
}) {
  const [subject, setSubject] =
    useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  const [email, setEmail] =
    useState("");

  const [priority, setPriority] =
    useState("low");





  const handleSubmit =
    async (e) => {
      e.preventDefault();

      try {
        await API.post(
          "/tickets",
          {
            subject,
            description,
            customerEmail:
              email,
            priority,
          }
        );

        setSubject("");

        setDescription("");

        setEmail("");

        setPriority("low");

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
    <form
      className="form"
      onSubmit={handleSubmit}
    >

      <input
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={(e) =>
          setSubject(
            e.target.value
          )
        }
        required
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) =>
          setDescription(
            e.target.value
          )
        }
        required
      />

      <input
        type="email"
        placeholder="Customer Email"
        value={email}
        onChange={(e) =>
          setEmail(
            e.target.value
          )
        }
        required
      />

      <select
        value={priority}
        onChange={(e) =>
          setPriority(
            e.target.value
          )
        }
      >
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

      <button type="submit">
        Create Ticket
      </button>

    </form>
  );
}

export default CreateTicket;