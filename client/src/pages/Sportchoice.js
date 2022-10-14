import React from "react";
import images from './assets/index';
import { useNavigate } from "react-router-dom";

import { Carousel } from 'react-bootstrap';



function Home() {
    const navigate = useNavigate();

    return (
        <div >
            <h6>sportchoice.js</h6>


<div class="justify-content-center d-flex">
            <Carousel slide={true} wrap={true} touch={true} keyboard={true} interval={6000} >
                
           
                <Carousel.Item>
                    <div onClick={() => {navigate("/Settings")}}>
                        
                        <p className="legend">Sportart 1</p>
                        <img src={images.frisbee} alt="Frisbee"/>
                        

                        <Carousel.Caption><h3>Frisbee</h3></Carousel.Caption>
                    </div>
                </Carousel.Item>

                <Carousel.Item>
                     <div onClick={() => {navigate("/Maps")}}>
                        <img src={images.fussball} alt="Fußball"/>
                        <p className="legend">Sportart 2</p>
                        <Carousel.Caption><h3>Soccer</h3></Carousel.Caption>
                    </div>
                </Carousel.Item>

                <Carousel.Item>
                    <div>
                        <img src={images.volleyball} alt="Volleyball"/>
                        <p className="legend">Sportart 3</p>
                        <Carousel.Caption><h3>Volleyball</h3></Carousel.Caption>
                    </div>
                </Carousel.Item>
                <Carousel.Item>
                    <div>
                        <img src={images.baskettball} alt="Baskettball"/>
                        <p className="legend">Sportart 4</p>
                        <Carousel.Caption><h3>Baskettball</h3></Carousel.Caption>
                    </div>
                </Carousel.Item>
                <Carousel.Item>
                    <div>
                        <img src={images.tischtennis} alt="Tischtennis"/>
                        <p className="legend">Sportart 4</p>
                        <Carousel.Caption><h3>Football</h3></Carousel.Caption>
                    </div>
                </Carousel.Item>
                <Carousel.Item>
                    <div>
                        <img src={images.skateboard} alt="Skateboard"/>
                        <p className="legend">Sportart 4</p>
                        <Carousel.Caption><h3>Skateboard</h3></Carousel.Caption>
                    </div>
                </Carousel.Item>
            </Carousel>
            </div>
        </div>


    );
}

export default Home;

