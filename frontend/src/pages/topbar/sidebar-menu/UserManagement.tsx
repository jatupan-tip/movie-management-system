import { useEffect, useMemo, useState } from "react";
import api from "../../../services/api";

type User = {
  id: number;
  username: string;
  email: string;
  role: "MANAGER" | "TEAMLEADER" | "FLOORSTAFF";
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
};

type Props = {};

export default function UserManagement({}: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [dateSort, setDateSort] = useState<"newest" | "oldest">("oldest");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  async function fetchUsers() {
    try {
      const token = localStorage.getItem("token");
      const response = await api.get("/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(response.data.data);
    } catch (error) {
      console.log(error);
      alert("Load users failed");
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  async function updateRole(id: number, role: string) {
    const confirmed = window.confirm(`Change role to "${role}" ?`);

    if (!confirmed) {
      fetchUsers();
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await api.patch(
        `/users/${id}/role`,
        { role },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      fetchUsers();
    } catch (error) {
      console.log(error);
      alert("Update role failed");
      fetchUsers();
    }
  }

  async function updateStatus(user: User) {
    const nextStatus = user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    const confirmed = window.confirm(`${nextStatus} "${user.username}" ?`);

    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      await api.patch(
        `/users/${user.id}/status`,
        {
          status: nextStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      fetchUsers();
    } catch (error) {
      console.log(error);
      alert("Update status failed");
    }
  }

  const filteredUsers = useMemo(() => {
    return users
      .filter((user) => {
        const matchSearch =
          user.username?.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase());

        const matchRole = roleFilter === "ALL" || user.role === roleFilter;

        const matchStatus =
          statusFilter === "ALL" || user.status === statusFilter;

        return matchSearch && matchRole && matchStatus;
      })
      .sort((a, b) => {
        if (dateSort === "newest") {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }

        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      });
  }, [users, search, roleFilter, statusFilter, dateSort]);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const startIndex = (currentPage - 1) * usersPerPage;

  const currentUsers = filteredUsers.slice(
    startIndex,
    startIndex + usersPerPage,
  );

  return (
    <div className="user-page">
      <div className="user-topic">
        <div className="user-search-box">
          <input
            type="text"
            placeholder="Search username or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      <div className="user-topic-button">
        <div className="users-filter-bar">
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="ALL">All Roles</option>
            <option value="MANAGER">MANAGER</option>
            <option value="TEAMLEADER">TEAMLEADER</option>
            <option value="FLOORSTAFF">FLOORSTAFF</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>
      </div>

      <div className="users-table-wrapper">
        <table className="users-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th
                style={{ cursor: "pointer" }}
                onClick={() =>
                  setDateSort((prev) =>
                    prev === "oldest" ? "newest" : "oldest",
                  )
                }
              >
                Created At {dateSort === "newest" ? "↓" : "↑"}
              </th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => updateRole(user.id, e.target.value)}
                    className="role-select"
                  >
                    <option value="MANAGER">MANAGER</option>
                    <option value="TEAMLEADER">TEAMLEADER</option>
                    <option value="FLOORSTAFF">FLOORSTAFF</option>
                  </select>
                </td>
                <td>
                  <span
                    className={`status-badge ${
                      user.status === "ACTIVE"
                        ? "status-active"
                        : "status-inactive"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  {![
                    "manager@test.com",
                    "leader@test.com",
                    "staff@test.com",
                  ].includes(user.email.toLowerCase()) && (
                    <button
                      className={
                        user.status === "ACTIVE"
                          ? "deactivate-button"
                          : "activate-button"
                      }
                      onClick={() => updateStatus(user)}
                    >
                      {user.status === "ACTIVE" ? "Deactivate" : "Activate"}
                    </button>
                  )}
                </td>
              </tr>
            ))}

            {currentUsers.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  style={{
                    textAlign: "center",
                    padding: "30px",
                  }}
                >
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => prev - 1)}
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={currentPage === index + 1 ? "active-page" : ""}
            onClick={() => setCurrentPage(index + 1)}
          >
            {index + 1}
          </button>
        ))}

        <button
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
