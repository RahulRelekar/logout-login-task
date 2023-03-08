import React, {useState} from "react"
import "./login.css"
import axios from "axios"
import { useNavigate } from "react-router-dom"


const Login = ({ setLoginUser}) => {

    const navigate = useNavigate()

    const [ user, setUser] = useState({
        email:"",
        password:""
    })

    const handleChange = e => {
        const { name, value } = e.target
        setUser({
            ...user,
            [name]: value
        })
    }

    const login = () => {
      axios
        .post("http://localhost:9002/login", user)
        .then(res => {
          const { user, token } = res.data;
          if (token) {
            const currentTime = Date.now() / 1000;
            if (token.exp > currentTime) {
              // Token is not expired
              localStorage.setItem("token", JSON.stringify(token)); // Store token in local storage
              axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
              setLoginUser(user);
              navigate("/");
            } else {
              // Token is expired
              alert("Token expired, please log in again.");
            }
          } else {
            // No token received from server
            alert(res.data.message);
          }
        })
        .catch(err => console.log(err));
    };
    
    return (
        <div className="login">
            <h1>Login</h1>
            <input type="text" name="email" value={user.email} onChange={handleChange} placeholder="Enter your Email"></input>
            <input type="password" name="password" value={user.password} onChange={handleChange}  placeholder="Enter your Password" ></input>
            <div className="button" onClick={login}>Login</div>
            <div>or</div>
            <div className="button" onClick={() => navigate("/register")}>Register</div>
        </div>
    )
}

export default Login