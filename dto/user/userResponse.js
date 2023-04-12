export const userResponse = ({
  firstName,
  lastName,
  email,
  picturePath,
  friends,
  viewedProfile,
  impressions,
}) => {
  return {
    firstName,
    lastName,
    email,
    picturePath,
    friends,
    viewedProfile,
    impressions,
  };
};
