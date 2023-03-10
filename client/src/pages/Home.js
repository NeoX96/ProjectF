import React, { useContext } from "react";
import images from "./assets/home/index";
import { useNavigate } from "react-router-dom";
import { Carousel } from "react-bootstrap";
import "./css/Home.css";
import { IndexContext } from "../App";
import Cookies from "js-cookie";
import { Box, Container, Fab, Grid } from "@mui/material";
import NavigationIcon from "@mui/icons-material/Navigation";

function Home() {
  const navigate = useNavigate();

  const { index, setIndex } = useContext(IndexContext);
  const vorname = Cookies.get("vorname");

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  console.log("index: " + index);

  return (
    <div
      style={{
        height: "calc(100vh - 150px)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px",
      }}
    >
      <Container>
        <Box
          sx={{
            backdropFilter: "blur(5px)",
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            borderRadius: 5,
            p: 2,
            boxShadow: 20,
          }}
        >
          <Grid container justifyContent="center" mb={3}>
            <Grid item>
              <Box
                sx={{
                  p: 2,
                  border: "1px dashed grey",
                  borderRadius: 5,
                  backgroundColor: "rgba(0, 255, 255, 0.15)",
                  boxShadow: 3,
                }}
              >
                <h1>Hey, {vorname}</h1>
              </Box>
            </Grid>
          </Grid>

          <Grid container justifyContent="center" className="mb-3">
            <Grid item>
              <h6>Wähle deine Sportart aus</h6>
            </Grid>
          </Grid>

          <Grid
            container
            justifyContent="center"
            alignItems="center"
            className="mb-3"
          >
            <Grid item>
              <Box
                sx={{
                  borderRadius: 5,
                  backgroundColor: "rgba(0, 255, 255, 0.1)",
                  boxShadow: 3,
                }}
              >
                <Carousel
                  interval={null}
                  touch={true}
                  keyboard={true}
                  activeIndex={index}
                  onSelect={handleSelect}
                  style={{ width: "300px" }}
                >
                  <Carousel.Item>
                    <img src={images.frisbee} alt="Frisbee" className="photo" />
                  </Carousel.Item>

                  <Carousel.Item>
                    <img
                      src={images.fussball}
                      alt="Fußball"
                      className="photo"
                    />
                  </Carousel.Item>

                  <Carousel.Item>
                    <img
                      src={images.volleyball}
                      alt="Volleyball"
                      className="photo"
                    />
                  </Carousel.Item>

                  <Carousel.Item>
                    <img
                      src={images.baskettball}
                      alt="Baskettball"
                      className="photo"
                    />
                  </Carousel.Item>

                  <Carousel.Item>
                    <img
                      src={images.tischtennis}
                      alt="Tischtennis"
                      className="photo"
                    />
                  </Carousel.Item>

                  <Carousel.Item>
                    <img
                      src={images.skateboard}
                      alt="Skateboard"
                      className="photo"
                    />
                  </Carousel.Item>
                </Carousel>
              </Box>
            </Grid>
          </Grid>

          <Grid container justifyContent="center" mt={4}>
            <Grid item>
              <Fab
                color="primary"
                variant="extended"
                aria-label="Go"
                onClick={() => navigate("/Maps")}
              >
                <NavigationIcon sx={{ mr: 1 }} />
                Gonkle
              </Fab>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </div>
  );
}

export default Home;
