import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

export default function Navigationbar() {
    const navigate = useNavigate();
  
    return (
      <div className="navigationbar ml-2">
        <Button variant="primary" onClick={() => navigate("/Home")}>Home</Button>

        <Button variant="primary" onClick={() => navigate("/Chat")}>Chat</Button>

        <Button variant="primary" onClick={() => navigate("/Maps")}>Maps</Button>

        <Button variant="primary" onClick={() => navigate("/Settings")}>Settings</Button>
      </div>
    );
}
