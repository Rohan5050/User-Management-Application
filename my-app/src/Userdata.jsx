import { useEffect, useState } from "react";
import axios from "axios";
import "./index.css";
import { MdEditSquare } from "react-icons/md";
import { MdDelete } from "react-icons/md";

const API_URL = "https://jsonplaceholder.typicode.com/users";

const App = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [editingUser, setEditingUser] = useState(null);

  // Fetch users from API
  useEffect(() => {
    axios
      .get(API_URL)
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("API Request failed:", error));
  }, []);

  // Handles form input changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Create or Update user
  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingUser) {
      // Updates user
      axios.put(`${API_URL}/${editingUser.id}`, formData).then((response) => {
        setUsers(
          users.map((user) =>
            user.id === editingUser.id ? response.data : user
          )
        );
        setEditingUser(null);
        setFormData({ name: "", email: "", phone: "" });
      });
    } else {
      // Creates new user
      axios.post(API_URL, formData).then((response) => {
        setUsers([...users, { ...response.data, id: users.length + 1 }]);
        setFormData({ name: "", email: "", phone: "" });
      });
    }
  };

  // Deletes user
  const handleDelete = (id) => {
    axios
      .delete(`${API_URL}/${id}`)
      .then(() => setUsers(users.filter((user) => user.id !== id)))
      .catch((error) => console.error("Error deleting user:", error));
  };

  // Edits user data
  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, phone: user.phone });
  };

  return (
    <div className="App">
      <div className="form-container">
        <h1 className="hd-aln">User Management Application</h1>
        <form className="aln-txtbox" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleInputChange}
            required
          />
          <button className="btn-aln" type="submit">
            {editingUser ? "Update User" : "Add User"}
          </button>
        </form>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td className="btns">
                <button
                  className="btn-style-1"
                  onClick={() => handleEdit(user)}
                >
                  <MdEditSquare />
                </button>
                <button
                  className="btn-style-2"
                  onClick={() => handleDelete(user.id)}
                >
                  <MdDelete />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <footer>
        <p>&copy; 2024 | Designed by Rohan Vohra </p>
      </footer>
    </div>
  );
};

export default App;
