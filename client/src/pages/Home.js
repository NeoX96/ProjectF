import React, { useContext, useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import images from "./assets/home/index";
import { useNavigate } from "react-router-dom";
import { Carousel } from "react-bootstrap";
import "./css/Home.css";
import { IndexContext } from "../App";
import Cookies from "js-cookie";
import { Box, Container, Fab, Grid, Typography } from "@mui/material";
import NavigationIcon from "@mui/icons-material/Navigation";

const FadeInBox = ({ children }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
  }, []);

  return (
    <Box
      sx={{
        backdropFilter: "blur(5px)",
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        borderRadius: 5,
        p: 2,
        boxShadow: 20,
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(300px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}
    >
      {children}
    </Box>
  );
};

const HoverGrowFab = () => {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
  };

  return (
    <Fab
      variant="extended"
      aria-label="Go"
      onClick={() => navigate("/Maps")}
      sx={{
        fontSize: "1.2rem",
        borderRadius: 5,
        backgroundColor: "rgba(0, 255, 255, 0.1)",
        boxShadow: 5,
        transition: "transform 0.2s ease",
        transform: hovered ? "scale(1.1)" : "scale(1)",
        "&:hover": {
          backgroundColor: "rgba(0, 255, 255, 0.3)",
          transform: "scale(1.1)",
        },
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <NavigationIcon sx={{ mr: 1 }} />
      Gonkle
    </Fab>
  );
};

function Home() {
  const { index, setIndex } = useContext(IndexContext);
  const vorname = Cookies.get("vorname");
  
  const theme = useTheme();
  const navigate = useNavigate();

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex);
  };

  console.log("index: " + index);

  return (
    <div
      style={{
        height: "calc(100vh - 150px)",
        minWidth: "360px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container>
        <FadeInBox>
          <Grid container justifyContent="center" mb={3}>
            <Grid item>
              <Box
                sx={{
                  p: 2,
                  [theme.breakpoints.down("sm")]: {
                    p: 1,
                  },
                  borderRadius: 5,
                  backgroundColor: "rgba(0, 255, 255, 0.08)",
                  boxShadow: 3,
                  display: "flex",
                  gap: "0.5rem",
                }}
              >
                <Typography
                  onClick={() => navigate("/Home")}
                  sx={{
                    fontSize: "3rem",
                    [theme.breakpoints.down("sm")]: {
                      fontSize: "2rem",
                    },
                    color: "red",
                    fontWeight: "bold",
                    fontFamily: "Montserrat, sans-serif",
                    textShadow: "4px 4px 4px rgba(100, 0, 0, 0.95)",
                    textDecoration: "none",
                    cursor: "pointer",
                  }}
                >
                  Hey,
                </Typography>
                <Typography
                  onClick={() => navigate("/Home")}
                  sx={{
                                        fontSize: "3rem",
                    [theme.breakpoints.down("sm")]: {
                      fontSize: "2rem",
                    },
                    fontWeight: "bold",
                    fontFamily: "Montserrat, sans-serif",
                    textShadow: "4px 4px 4px rgba(30, 30, 30, 0.6)",
                    textDecoration: "none",
                    cursor: "pointer",
                  }}
                >
                   {vorname}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          <Grid container justifyContent="center">
            <Grid item>
              <h6>Wähle deine Sportart aus:</h6>
            </Grid>
          </Grid>

          <Grid
            container
            justifyContent="center"
            alignItems="center"
            className="mb-3 "
          >
            <Grid item>
              <Box
                sx={{
                  borderRadius: 5,
                  backgroundColor: "rgba(0, 150, 255, 0.15)",
                  boxShadow: 3,
                  border: "2px dashed grey",
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
              <HoverGrowFab />
            </Grid>
          </Grid>
        </FadeInBox>
      </Container>
    </div>
  );
}

export default Home;
