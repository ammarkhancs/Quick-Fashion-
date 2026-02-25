import { useParams } from "react-router-dom";

const Profile = () => {
  const { username } = useParams();

  return (
    <div>
      <h1>Profile Page</h1>
      <p>Viewing user: {username}</p>
    </div>
  );
};

export default Profile;
