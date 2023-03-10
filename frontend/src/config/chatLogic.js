export const getSender = (loggedUser, chat) => {
  if (!chat.isGroupChat) {
    return chat.users[0]._id === loggedUser._id ? chat.users[1] : chat.users[0];
  }
};
