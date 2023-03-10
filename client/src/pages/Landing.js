import { useNavigate } from "react-router-dom";
import { useState, View, Image } from "react";
import { Button, Form } from "react-bootstrap";
import Cookies from "js-cookie";
import axios from "axios";
import images from './assets/home/index';
import Navbar from '../components/navigationbar';
//öimport "./css/Landing.css";

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const isDisabled =
        email.trim() === "" || password.trim() === "" || !email.includes("@");

    const changeAuthMode = () => {
        navigate("/Register");
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const { data } = await axios.post("http://localhost:4000/login", {
                email,
                password,
            });

            if (data.accessToken) {
                Cookies.set("sessionID", data.accessToken, {
                    expires: 1,
                    sameSite: "none",
                    secure: true,
                });

                window.location.href = "/Home";
            } else {
                alert("Access token is not returned");
            }
        } catch (error) {
            console.log(error.response);
            alert("Error logging in. Please try again.");
            Cookies.remove("sessionID");
        }
    };

    return (


        <div className="d-flex justify-content-center mt-5">
            <div className="">
              
                <header class="bg-primary-subtle d-flex justify-content-center mt-5 rounded">
                    <Form className="w-75" onSubmit={handleLogin}>
                        <div className="d-flex justify-content-center align-items-center">
                            <div>
                                <Form.Control
                                    className="mt-1"
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div class="mx-3">
                                <Form.Control
                                    className="mt-1"
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    id="password"
                                />
                            </div>
                            <div class="d-flex justify-content-center align-items-center border-box">
                                <Button className="btn btn-primary mx-3 h-25"
                                    variant={isDisabled ? "secondary" : "primary"}
                                    type="submit"
                                    disabled={isDisabled}
                                >
                                    Login
                                </Button>
                                <Button className="btn btn-primary h-25" onClick={changeAuthMode}>Signup</Button>
                            </div>
                        </div>
                    </Form>
                </header>
                <div class="d-flex flex-column align-items-center">
                    <img class="w-75 mt-5 rounded" src={images.gonkle} alt="erklärung"/>
                    <img class="w-25 mt-5 rounded" src={images.frisbee} alt="sportart"/>
                </div>
            </div>
            <Navbar />
        </div>
    );
}

export default Login;
