import React, { useState } from "react";
import axios from "./axios";
import "./App.css";

const App: React.FC = () => {
  const [formData, setFormData] = useState<any>({});
  const [response, setResponse] = useState<any>({});
  const [token, setToken] = useState<string>("");

  const handleRegister = async (url: string, method: string) => {
    const { email, username, password, admin } = formData;
    const payload = {
      email,
      username,
      password,
      admin,
    };
    url = admin ? "/api/admin/create" : "/api/users/registration";
    console.log("url", url);

    try {
      const response = await axios({
        method,
        url,
        data: payload,
      });

      console.log("Registration successful:", response.data);
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (endpoint: string, method: string) => {
    console.log("token", token);
    try {
      const config = {
        headers: { Authorization: `Bearer ${localStorage.token}` },
      };
      const res = await axios({
        url: endpoint,
        method,
        data: {
          ...formData,
          adminId: "66ea9851f2bcf21a18f4d0b1",
          tables: [
            {
              establishment_id: "63e72cf2f8a4a6d4b4f9a2e5",
              table_number: "2",
              enabled: false,
            },
            {
              establishment_id: "63e72cf2f8a4a6d4b4f9a2e6",
              table_number: "3",
              enabled: true,
            },
          ],
        },
        ...config,
      });
      setResponse(res.data);
      setToken(response.token);
      if (response.token) localStorage.setItem("token", response.token);
    } catch (error: any) {
      setResponse(error.response?.data || { message: "Error occurred" });
    }
  };

  return (
    <div className="container">
      <h1>API Testing</h1>

      {/* Registration */}
      <section>
        <h2>Register</h2>
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="username" placeholder="Username" onChange={handleChange} />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <input
          type="checkbox"
          name="admin"
          onChange={(e) =>
            setFormData({ ...formData, [e.target.name]: e.target.checked })
          }
        />
        <button
          onClick={() => handleRegister("/api/users/registration", "POST")}
        >
          Register
        </button>
      </section>

      {/* Login */}
      <section>
        <h2>Login</h2>
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="username" placeholder="Username" onChange={handleChange} />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <button onClick={() => handleSubmit("/api/users/login", "POST")}>
          Login
        </button>
      </section>

      {/* Login */}
      <section>
        <h2>Login as admin</h2>
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="username" placeholder="Username" onChange={handleChange} />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <button onClick={() => handleSubmit("/api/admin/login", "POST")}>
          Login
        </button>
      </section>

      {/* Logout */}
      <section>
        <h2>Logout</h2>
        <button
          onClick={() => {
            setToken("");
            setFormData({});
            setResponse({});
            localStorage.removeItem("token");
          }}
        >
          Logout
        </button>
      </section>

      {/* Send Verification Code */}
      <section>
        <h2>Send Verification Code</h2>
        <input name="email" placeholder="Email" onChange={handleChange} />
        <button onClick={() => handleSubmit("/api/users/send-code", "PUT")}>
          Send Code
        </button>
      </section>

      {/* Verify Code */}
      <section>
        <h2>Verify Code</h2>
        <input name="code" placeholder="Code" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <button onClick={() => handleSubmit("/api/users/verify", "PUT")}>
          Verify Code
        </button>
      </section>

      {/* Change Password */}
      <section>
        <h2>Change Password</h2>
        <input
          name="current_password"
          type="password"
          placeholder="Current Password"
          onChange={handleChange}
        />
        <input
          name="new_password"
          type="password"
          placeholder="New Password"
          onChange={handleChange}
        />
        <input
          name="confirm_password"
          type="password"
          placeholder="Confirm Password"
          onChange={handleChange}
        />
        <button
          onClick={() => handleSubmit("/api/users/change-password", "PUT")}
        >
          Change Password
        </button>
      </section>

      {/* Fetch User */}
      <section>
        <h2>Get User</h2>
        <input name="id" placeholder="User ID" onChange={handleChange} />
        <button
          onClick={() => handleSubmit(`/api/users/user/${formData.id}`, "GET")}
        >
          Get User
        </button>
      </section>

      {/* Create Establishment */}
      <section>
        <h2>Create Establishment</h2>
        <input
          name="establishment_name"
          placeholder="Establishment Name"
          onChange={handleChange}
        />
        <input
          name="description"
          placeholder="Description"
          onChange={handleChange}
        />
        <input
          name="instagram_link"
          placeholder="Instagram Link"
          onChange={handleChange}
        />
        <input
          name="tiktok_link"
          placeholder="TikTok Link"
          onChange={handleChange}
        />
        <button
          onClick={() => handleSubmit("/api/establishments/create", "POST")}
        >
          Create Establishment
        </button>
      </section>

      {/* Delete Establishment */}
      <section>
        <h2>Delete Establishment</h2>
        <input
          name="establishment_id"
          placeholder="Establishment ID"
          onChange={handleChange}
        />
        <button
          onClick={() =>
            handleSubmit(
              `/api/establishments/delete/${formData.establishment_id}`,
              "DELETE"
            )
          }
        >
          Delete Establishment
        </button>
      </section>

      {/* Create Table */}
      <section>
        <h2>Create Table</h2>
        <input
          name="establishment_id"
          placeholder="Establishment ID"
          onChange={handleChange}
        />
        <input
          name="table_number"
          placeholder="Table Number"
          onChange={handleChange}
        />
        <input
          name="qrcode_text"
          placeholder="QR Code Text"
          onChange={handleChange}
        />
        <button onClick={() => handleSubmit("/api/tables/create", "POST")}>
          Create Table
        </button>
      </section>

      {/* Edit Table */}
      <section>
        <h2>Edit Table</h2>
        <input name="table_id" placeholder="Table ID" onChange={handleChange} />

        <input
          name="establishment_id"
          placeholder="Establishment ID"
          onChange={handleChange}
        />
        <input
          name="table_number"
          placeholder="Table Number"
          onChange={handleChange}
        />
        <input
          name="qrcode_text"
          placeholder="QR Code Text"
          onChange={handleChange}
        />
        <button
          onClick={() =>
            handleSubmit(`/api/tables/edit/${formData.table_id}`, "PUT")
          }
        >
          Edit Table
        </button>
      </section>

      {/* Delete Table */}
      <section>
        <h2>Delete Table</h2>
        <input name="table_id" placeholder="Table ID" onChange={handleChange} />
        <button
          onClick={() =>
            handleSubmit(`/api/tables/delete/${formData.table_id}`, "DELETE")
          }
        >
          Delete Table
        </button>
      </section>

      {/* Add Button */}
      <section>
        <h2>Add Button</h2>
        <input
          name="establishment_id"
          placeholder="Establishment ID"
          onChange={handleChange}
        />
        <input
          name="button_name"
          placeholder="Button Name"
          onChange={handleChange}
        />
        <input
          name="button_message"
          placeholder="Button Message"
          onChange={handleChange}
        />
        <input
          name="button_color"
          placeholder="Button Color"
          onChange={handleChange}
        />
        <button onClick={() => handleSubmit("/api/buttons/create", "POST")}>
          Add Button
        </button>
      </section>

      {/* Delete Button */}
      <section>
        <h2>Delete Button</h2>
        <input
          name="button_id"
          placeholder="Button ID"
          onChange={handleChange}
        />
        <button
          onClick={() =>
            handleSubmit(`/api/buttons/delete/${formData.button_id}`, "DELETE")
          }
        >
          Delete Button
        </button>
      </section>

      {/* Edit Button */}
      <section>
        <h2>Edit Button</h2>
        <input
          name="button_id"
          placeholder="Button ID"
          onChange={handleChange}
        />
        <input
          name="establishment_id"
          placeholder="Establishment ID"
          onChange={handleChange}
        />
        <input
          name="button_name"
          placeholder="Button Name"
          onChange={handleChange}
        />
        <input
          name="button_message"
          placeholder="Button Message"
          onChange={handleChange}
        />
        <input
          name="button_color"
          placeholder="Button Color"
          onChange={handleChange}
        />
        <button
          onClick={() =>
            handleSubmit(`/api/buttons/edit/${formData.button_id}`, "PUT")
          }
        >
          Edit Button
        </button>
      </section>

      {/* Add Menu */}
      <section>
        <h2>Add Menu</h2>
        <input
          name="establishment_id"
          placeholder="Establishment ID"
          onChange={handleChange}
        />
        <input name="link" placeholder="Link" onChange={handleChange} />
        <input name="file" placeholder="File" onChange={handleChange} />
        <button onClick={() => handleSubmit("/api/menu/create", "POST")}>
          Add Menu
        </button>
      </section>

      {/* Delete Menu */}
      <section>
        <h2>Delete Menu</h2>
        <input
          name="establishment_id"
          placeholder="Establishment ID"
          onChange={handleChange}
        />
        <button
          onClick={() =>
            handleSubmit(
              `/api/menu/delete/${formData.establishment_id}`,
              "DELETE"
            )
          }
        >
          Delete Menu
        </button>
      </section>

      {/* Create Staff */}
      <section>
        <h2>Create Staff</h2>
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="username" placeholder="Username" onChange={handleChange} />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <button onClick={() => handleSubmit("/api/staffs/create", "POST")}>
          Create Staff
        </button>
      </section>

      {/* Delete Staff */}
      <section>
        <h2>Delete Staff</h2>
        <input name="id" placeholder="Staff ID" onChange={handleChange} />
        <button
          onClick={() =>
            handleSubmit(`/api/staffs/delete/${formData.id}`, "DELETE")
          }
        >
          Delete Staff
        </button>
      </section>

      {/* Edit Staff */}
      <section>
        <h2>Edit Staff</h2>
        <input name="id" placeholder="Staff ID" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="username" placeholder="Username" onChange={handleChange} />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
        />
        <button
          onClick={() => handleSubmit(`/api/staffs/edit/${formData.id}`, "PUT")}
        >
          Edit Staff
        </button>
      </section>

      {/* Select Tables for Staff */}
      <section>
        <h2>Select Tables for Staff</h2>
        <input name="id" placeholder="Staff ID" onChange={handleChange} />
        <textarea
          name="tables"
          placeholder="Tables JSON"
          onChange={handleChange}
        />
        <button
          onClick={() =>
            handleSubmit(`/api/staffs/select-tables/${formData.id}`, "PUT")
          }
        >
          Select Tables
        </button>
      </section>

      {/* Display Response */}
      <section>
        <h2>Response</h2>
        <pre>{JSON.stringify(response, null, 2)}</pre>
      </section>
    </div>
  );
};

export default App;
