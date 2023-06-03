import { Navbar,Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import AuthContext from "../../auth/auth-context/auth-context";
import { useContext } from "react";
import './Navbar.css';

function NavBar() {
  const history = useHistory();

  const authCtx = useContext(AuthContext);

  const verifyEmailHandler = () => {
    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyA3AbBTqHOLSTMDbMunfXa_oG8FAq8PlX4",
      {
        method: "POST",
        body: JSON.stringify({
          idToken: authCtx.token,
          requestType: "VERIFY_EMAIL",
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

  const logOutHandler=()=>{
    authCtx.logout();
    history.replace('/signin-page');
  }


  return (
    <Navbar
      bg="light"
      variant="dark"
      style={{ borderBottom: "1px solid black",display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center' }}

    >
      <div className="headingwelcome">
        <h1>Welcome to expense tracker!!!</h1>
      </div>

      <div className='butttonsss'>
        <Button variant="outline-secondary" onClick={verifyEmailHandler} className='buttonn'>
          verify email
        </Button>
        <Button variant="outline-primary" onClick={openProfile} className='buttonn'>
          complete your profile
        </Button>
        <Button variant="danger" className='buttonn' onClick={logOutHandler}>Log out</Button>
      </div>
    </Navbar>
  );
}
export default NavBar;
