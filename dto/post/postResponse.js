export const postResponse = ({
  user,
  files,
  description,
  hashtag,
  createdAt,
  updatedAt,
}) => {
  return {
    user,
    files,
    description,
    hashtag,
    createdAt,
    updatedAt,
  };
};
