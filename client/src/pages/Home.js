import React, { useState } from "react";
import images from './assets/home/index';
import { useNavigate } from "react-router-dom";
import { Carousel } from 'react-bootstrap';
import "./css/Home.css";

function Home() {
    const navigate = useNavigate();

    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex, e) => {
      setIndex(selectedIndex);
    };

    return (
        <div >
          <div className="justify-content-center d-flex">
            <h6>Wähle deine Sportart aus</h6>
          </div>

          <div className="justify-content-center d-flex">
            <Carousel wrap={true} touch={true} keyboard={true} activeIndex={index} onSelect={handleSelect}>
                <Carousel.Item>
                  <img src={images.frisbee} alt="Frisbee" className="photo"/>
                  <Carousel.Caption><h6>NR 1 Frisbee</h6></Carousel.Caption>
                </Carousel.Item>

                <Carousel.Item>
                  <img src={images.fussball} alt="Fußball" className="photo"/>
                  <Carousel.Caption><h6>NR 2 Fußball</h6></Carousel.Caption>
                </Carousel.Item>

                <Carousel.Item>
                  <img src={images.volleyball} alt="Volleyball" className="photo"/>
                  <Carousel.Caption><h6>NR 3 Volleyball</h6></Carousel.Caption>
                </Carousel.Item>

                <Carousel.Item>
                  <img src={images.baskettball} alt="Baskettball" className="photo"/>
                  <Carousel.Caption><h6>NR 4 Baskettball</h6></Carousel.Caption>
                </Carousel.Item>

                <Carousel.Item>
                  <img src={images.tischtennis} alt="Tischtennis" className="photo"/>
                  <Carousel.Caption><h6>NR 5 Tischtennis</h6></Carousel.Caption>
                </Carousel.Item>

                <Carousel.Item>
                  <img src={images.skateboard} alt="Skateboard" className="photo"/>
                  <Carousel.Caption><h6>NR 6 Skateboard</h6></Carousel.Caption>
                </Carousel.Item>
            </Carousel>
          </div>
            
            <div className="justify-content-center d-flex mt-5">
              <button  onClick={() => {navigate("/Maps")}} className="btn btn-secondary justify-content-center d-flex" >LET´S PLAY !</button>
            </div>
        </div>
      
    );
}

export default Home;