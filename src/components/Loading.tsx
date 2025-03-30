import { CircularProgress, Container } from "@mui/material";

const Loading = () => {
  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh"
      }}
    >
      <CircularProgress />
    </Container>
  );
};

export default Loading;
