import React from "react";
import images from './assets/index';
import { useNavigate } from "react-router-dom";

import { Carousel } from 'react-bootstrap';

/*
von APP.js moved to Home.js

import AliceCarousel from 'react-alice-carousel';
import 'react-alice-carousel/lib/alice-carousel.css';

const handleDragStart = (e) => e.preventDefault();

const items = [
  <img src="./assets/index" onDragStart={handleDragStart} role="presentation" />,
  <img src="./assets/index" onDragStart={handleDragStart} role="presentation" />,
  <img src="./assets/index" onDragStart={handleDragStart} role="presentation" />,
];

const Gallery = () => {
  return (
    <AliceCarousel mouseTracking items={items} />
  );
}
*/

function Home() {
    const navigate = useNavigate();

    return (
        <div>
            <h1> SportsConnect</h1>
            <button
                onClick={() => { navigate("/Chat"); }}>Chat
            </button>

            <button
                onClick={() => { navigate("/Maps"); }}>Maps
            </button>

            <button
                onClick={() => { navigate("/Login"); }}>Logout
            </button>
            <button
                onClick={() => { navigate("/Settings"); }}>Settings|geoCache
            </button>
            <br></br>

            <Carousel>
                <Carousel.Item>
                    <div>
                        <img src={images.frisbee} alt="Frisbee"/>
                        <p className="legend">Sportart 1</p>
                    </div>
                </Carousel.Item>

                <Carousel.Item>
                     <div>
                        <img src={images.fussball} alt="Fußball"/>
                        <p className="legend">Sportart 2</p>
                    </div>
                </Carousel.Item>

                <Carousel.Item>
                    <div>
                        <img src={images.volleyball} alt="Volleyball"/>
                        <p className="legend">Sportart 3</p>
                    </div>
                </Carousel.Item>
            </Carousel>
        </div>


    );
}

export default Home;

/*

                <div>
                    <img src={images.b}/>
                    <p className="legend1">Sportart 2</p>
                
                    <img src={images.c}/>
                    <p className="legend2">Sportart 3</p>
                </div>
                
            </Carousel>
            <Carousel  showArrows={true}>
                <div>
                    <img src={images.a} />
                    <p className="legend">Sportart 1</p>
                </div>
                <div>
                    <img src={images.b}/>
                    <p className="legend1">Sportart 2</p>
                
                    <img src={images.c}/>
                    <p className="legend2">Sportart 3</p>
                </div>
                
                */