import { Navbar, Container, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import AuthContext from "../../auth/auth-context/auth-context";
import { useContext } from "react";

function NavBar() {
  const history = useHistory();

  const authCtx = useContext(AuthContext);

  const verifyEmailHandler = () => {
    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyA3AbBTqHOLSTMDbMunfXa_oG8FAq8PlX4",
      {
        method: "POST",
        body: JSON.stringify({
          idToken:authCtx.token,
          requestType:"VERIFY_EMAIL",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          return res.json().then((data) => {
            throw new Error(data.error.message);
          });
        }
      })
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  const openProfile = () => {
    history.replace("/profilePage");
  };
  return (
    <Navbar
      bg="light"
      variant="dark"
      style={{ borderBottom: "1px solid black" }}
    >
      <Container>
        <h1>Welcome to expense tracker!!!</h1>
      </Container>

      <Container>
        <Button variant="outline-secondary" onClick={verifyEmailHandler}>
          verify email
        </Button>
        <Button variant="outline-primary" onClick={openProfile}>
          complete your profile
        </Button>
      </Container>
    </Navbar>
  );
}
export default NavBar;
