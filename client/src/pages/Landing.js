import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import Cookies from "js-cookie";
import axios from "axios";
import images from './assets/home/index';

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
        <div className="d-flex justify-content-center text-center">
            <div className="">
                <div>
                    <h6>Welcome to Gonkle</h6>

                </div>
                <Form onSubmit={handleLogin}>
                    <div className="">
                        <div className="mt-3">
                            <Form.Control
                                className="mt-1"
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="mt-3">
                            <Form.Control
                                className="mt-1"
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                id="password"
                            />
                        </div>
                        <div className="d-flex justify-content-center mt-3">
                            <Button
                                variant={isDisabled ? "secondary" : "primary"}
                                type="submit"
                                disabled={isDisabled}
                            >
                                Login
                            </Button>
                            <Button onClick={changeAuthMode}>Sign Up</Button>
                        </div>
                    </div>
                </Form>
                <img src={images.gonkle2} className="photo" />



                <div className="mt-5">Was ist Gonkle ?</div>
                <div className="mt-5">Gonkle ist eine Social-Media-Platform für Freizeit-Sportler</div><hr></hr>
                <div className="mt-5">... eine kleine Anleitung ...</div>
                <hr></hr>
                <div>
                    <div><img src={images.intro1} alt="intro1" className="pic" /></div><div><h1>Wähle deine Lieblingssportart</h1>
                        Wähle aus verschiedenen Sportarten deine Favoriten – hier ist für jeden etwas dabei.
                    </div></div><hr></hr>
                <div><img src={images.intro2} alt="intro1" className="pic" /></div><div><h1>Finde Mitspieler</h1>
                    Plane Deine Partien im Voraus und lade deine Freunde dazu ein. Wähle den Ort, die Uhrzeit und die Sportart.
                </div><hr></hr>
                <div><img src={images.intro3} alt="intro1" className="pic" /></div><div><h1>

                    Tritt Partien bei</h1>
                    Auf der Karte werden Dir Spiele in deiner Nähe angezeigt. Tritt ihnen bei und lerne neue Leute kennen!

                </div><hr></hr>
                <div><img src={images.intro4} alt="intro1" className="pic" /></div><div><h1>Bleib im Kontakt</h1>
                    Einzel- und Gruppenchats ermöglichen den entspannten Austausch zwischen Dir und Deinen Mitspielern.

                </div><hr></hr>
                <div className="mt-5">Dates were yesterday. Today you Gonkle</div>
            </div>
        </div>
    );
}

export default Login;
