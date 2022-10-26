import { useNavigate } from "react-router-dom";

export default function Navigationbar() {
    const navigate = useNavigate();
  
    return (
    <div>
      <h1> Maps </h1>
      <button
          onClick={() => {navigate("/Home");}}>Home
      </button>
  
      <button
          onClick={() => {navigate("/Chat");}}>Chat
      </button>
  
      <button
          onClick={() => {navigate("/Login");}}>Logout
      </button>
    </div>
    )
  }