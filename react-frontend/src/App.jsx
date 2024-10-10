import { useEffect, useState, Component } from "react";
import './App.css'
import Typography from "@mui/material/Typography";
//import Button from '@ingka/button';
//import Hyperlink from '@ingka/hyperlink';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import SendIcon from '@mui/icons-material/Send';
import Stack from '@mui/material/Stack';


  function App() {
    const [users, setUsers] = useState([]);
    const hostUrl ="http://localhost:8080/";
  
    const fetchUsers = async () => {
      const response = await fetch(`${hostUrl}api/users`);
      const usersToJson = await response.json();
      console.log(usersToJson)
      setUsers(usersToJson);
    };

    const createUser = async (e) => {
      e.preventDefault()
      const response = await fetch(`${hostUrl}api/users`, {
      method: "POST",
      headers: {
          "Content-type": "application/json",
      },
      body: JSON.stringify({ 
        name: e.target.name.value, 
        isManager: e.target.isManager.checked, 
        site: e.target.site.value
        }),
      });
      const newUser = await response.json();
  
      setUsers([...users, newUser]);
  }
  

    useEffect(() => {
      fetchUsers();
    }, []);

    const deleteUser = async (e) => {
      await fetch(`${hostUrl}api/users/${e.target.dataset.id}`, {
      method: "DELETE",
      headers: {
          "Content-type": "application/json",
      },
      });
      await fetchUsers();
  }
  

      return (
        <>
        <h1>New User</h1>
        <form onSubmit={createUser}>
          <label htmlFor="name">Name</label>
          <input type="text" name="name" id="name" />
          <label htmlFor="isManager">Manager</label>
          <input type="checkbox" name="isManager" />
          <label htmlFor="site">Site</label>
          <input type="text" name="site"/> 
          <input type="submit"/>
         </form>

        <h1>Users</h1>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Manager</th>
              <th>Site</th>
              <th>Delete user</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.isManager.toString()}</td>
                <td>{user.site}</td>
                <td>
                  <IconButton aria-label="delete" color="secondary" data-id={user.id} onClick={deleteUser}> 
                  <DeleteIcon />
                  </IconButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </>
    );
  
}
  
  export default App;
  
