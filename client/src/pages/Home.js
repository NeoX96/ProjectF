import React, {  useContext } from "react";
import images from './assets/home/index';
import { useNavigate } from "react-router-dom";
import { Carousel, Button } from 'react-bootstrap';
import "./css/Home.css";
import {IndexContext} from "../App";
// import box from mui
import { Box } from '@mui/material';

function Home() {
    const navigate = useNavigate();

    const {index, setIndex} = useContext(IndexContext);

    const handleSelect = (selectedIndex, e) => {
      setIndex(selectedIndex);
    };

    console.log("index: " + index);

    return (
        <div className="justify-content-center container home">
          <div className="Überschrift justify-content-center d-flex m-5">
            <h1>WELCOME TO Gonkle</h1>
          </div>

          <div className="justify-content-center d-flex">
            <h6>Wähle deine Sportart aus</h6>
          </div>

          <div className="justify-content-center d-flex align-items-center">
            <Box  >
            <Carousel  interval={null} touch={true} keyboard={true} activeIndex={index} onSelect={handleSelect}>
                <Carousel.Item>
                  <img src={images.frisbee} alt="Frisbee" className="photo"/>
                </Carousel.Item>

                <Carousel.Item>
                  <img src={images.fussball} alt="Fußball" className="photo"/>
                 
                </Carousel.Item>

                <Carousel.Item>
                  <img src={images.volleyball} alt="Volleyball" className="photo"/>
                
                </Carousel.Item>

                <Carousel.Item>
                  <img src={images.baskettball} alt="Baskettball" className="photo"/>
                 
                </Carousel.Item>

                <Carousel.Item>
                  <img src={images.tischtennis} alt="Tischtennis" className="photo"/>
                 
                </Carousel.Item>

                <Carousel.Item>
                  <img src={images.skateboard} alt="Skateboard" className="photo"/>
                 
                </Carousel.Item>
            </Carousel>
            </Box>
          </div>
            
            <div className="justify-content-center d-flex mt-5">
              <Button  onClick={() => {navigate("/Maps")}} className="btn btn-secondary justify-content-center d-flex" >LET´S PLAY !</Button>
            </div>
        </div>
      
    );
}

export default Home;