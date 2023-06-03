import { useRef, useContext, useState } from "react";
import "./profile-page.css";
import { Button, Form } from "react-bootstrap";
import AuthContext from "../../auth/auth-context/auth-context";
import { useHistory } from "react-router-dom";

function ProfilePage() {
  const history = useHistory();
  const [err, setErr] = useState(false);
  const [urlErr, setUrlErr] = useState(false);
  const [profileUpdated, setProfileUpdated] = useState(false);
  const authCtx = useContext(AuthContext);
  const nameInputRef = useRef();
  const photoUrlRef = useRef();

  const updateProfileHandler = () => {
    const enteredName = nameInputRef.current.value;
    const enteredPhotoUrl = photoUrlRef.current.value.trim();

    if (enteredName.trim().length < 5) {
      console.log("checking");
      setErr(true);
      setTimeout(() => {
        setErr(false);
      }, 3000);
      return;
    } else if (!enteredPhotoUrl.includes("http")) {
      setUrlErr(true);
      setTimeout(() => {
        setUrlErr(false);
      },3000);
      return;
    } else {
      fetch(
        "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyA3AbBTqHOLSTMDbMunfXa_oG8FAq8PlX4",
        {
          method: "POST",
          body: JSON.stringify({
            idToken: authCtx.token,
            displayName: enteredName,
            photoUrl: enteredPhotoUrl,
            returnSecureToken: true,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => {
          if (res.ok) {
            setProfileUpdated(true);
            setTimeout(() => {
              setProfileUpdated(false);
            }, 3000);
            return res.json();
          } else {
            return res.json().then((data) => {
              let newError = data.error.message;
              throw new Error(newError);
            });
          }
        })
        .then((data) => {
          console.log(data);
        })
        .catch((err) => {
          alert(err.message);
        });
      nameInputRef.current.value = null;
      photoUrlRef.current.value = null;
    }
  };

  const cancelHandler = () => {
    history.replace("/homePage");
  };

  if(authCtx.isLoggedIn){
    window.onload=()=>{
      fetch('https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyA3AbBTqHOLSTMDbMunfXa_oG8FAq8PlX4',{
        method:'POST',
        body:JSON.stringify({
          idToken:authCtx.token,
        }),
        headers:{
          'Content-Type':'application/json'
        }
      }).then(res=>{
        if(res.ok){
          return res.json();
        }
        else{
          return res.json().then((data)=>{
              throw new Error(data.error.message);
          })
        }
      }).then((data)=>{
        console.log(data);
        nameInputRef.current.value=data.users[0].displayName;
        photoUrlRef.current.value=data.users[0].photoUrl;
      }).catch((err)=>{
        alert(err.message);
      })
    }
  }

  return (
    <div>
      <div className="profilePage">
        <h1 className="contact">Contact details</h1>
        <Button variant="outline-danger" onClick={cancelHandler}>
          cancel
        </Button>
      </div>
      <div className="profileForm">
        <Form>
          <label className="labell">Full Name:</label>
          <input type="text" ref={nameInputRef} />
          <label className="labell">Profile Photo Url:</label>
          <input type="url" ref={photoUrlRef} />
        </Form>
      </div>
      {profileUpdated && (
        <p className="profileUpdated">Your profile has been updated!</p>
      )}
      {err && <p className="error01">Name must be greater than 5</p>}
      {urlErr && <p className="error01">enter valid Url!</p>}
      <div className="updateButton">
        <Button onClick={updateProfileHandler}>Update</Button>
      </div>
    </div>
  );
}
export default ProfilePage;
