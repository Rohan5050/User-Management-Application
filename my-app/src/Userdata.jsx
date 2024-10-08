import { useEffect, useState } from "react";
import axios from "axios";
import "./index.css";
import { MdEditSquare } from "react-icons/md";
import { MdDelete } from "react-icons/md";

const API_URL = "https://jsonplaceholder.typicode.com/users";

const App = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: { street: "", city: "" },
  });
  const [errors, setErrors] = useState({ name: "", phone: "" });
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch users from API
  /*
  useEffect(() => {
    setLoading(true);
    axios
      .get(API_URL)
      .then((response) => setUsers(response.data))
      .catch((error) => console.error("API Request failed:", error));
  }, []);*/

  useEffect(() => {
    setLoading(true); // Start loading
    axios
      .get(API_URL)
      .then((response) => {
        setUsers(response.data);
        setLoading(false); // Stop loading once data is fetched
      })
      .catch((error) => {
        console.error("API Request failed:", error);
        setLoading(false); // Stop loading even if there's an error
      });
  }, []);

  const Spinner = () => (
    <tr>
      <td colSpan="4" style={{ textAlign: "center" }}>
        <div className="spinner">
          <div className="loader"></div>
        </div>
      </td>
    </tr>
  );

  const validateForm = () => {
    let valid = true;
    let tempErrors = { name: "", phone: "" };

    if (formData.name.length < 3) {
      tempErrors.name = "Name must be atleast 3 characters long";
      valid = false;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      tempErrors.phone = "Phone number is not valid";
      valid = false;
    }

    setErrors(tempErrors);
    return valid;
  };

  // Handles form input changes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Create or Update user
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (editingUser) {
      // Updates user
      axios.put(`${API_URL}/${editingUser.id}`, formData).then((response) => {
        setUsers(
          users.map((user) =>
            user.id === editingUser.id ? response.data : user
          )
        );
        setEditingUser(null);
        setFormData({
          name: "",
          email: "",
          phone: "",
          address: { street: "", city: "" },
        });
      });
    } else {
      // Creates new user
      axios.post(API_URL, formData).then((response) => {
        setUsers([...users, { ...response.data, id: users.length + 1 }]);
        setFormData({
          name: "",
          email: "",
          phone: "",
          address: { street: "", city: "" },
        });
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
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      street: user.address.street,
      city: user.address.city,
    });
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
            disabled={!!editingUser}
            onChange={handleInputChange}
            required
          />
          {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
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
          {errors.phone && <p style={{ color: "red" }}>{errors.phone}</p>}
          <input
            type="text"
            name="Street"
            placeholder="Street"
            value={formData.street}
            onChange={handleInputChange}
            required
          />

          <input
            type="text"
            name="City"
            placeholder="City"
            value={formData.city}
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
          {loading ? (
            <Spinner /> // Show spinner while loading
          ) : (
            users.map((user) => (
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
            ))
          )}
        </tbody>
      </table>
      <footer>
        <p>&copy; 2024 | Designed by Rohan Vohra </p>
      </footer>
    </div>
  );
};

export default App;
