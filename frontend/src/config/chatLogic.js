export const getSender = (loggedUser, chat) => {
  if (!chat.isGroupChat) {
    return chat.users[0]._id === loggedUser._id ? chat.users[1] : chat.users[0];
  }
};
export const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    m.sender._id !== userId
  );
};
export const isSameSenderMargin = (messages, m, i, userId) => {
  // console.log(i === messages.length - 1);

  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 33;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 0;
  else return "auto";
};
export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};
export const isSameUser = (messages, m, i) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};
export const changeTime = (str) => {
  let date = new Date(str);
  let offset = date.getTimezoneOffset();
  let indiaTime = new Date(
    date.getTime() + offset * 60 * 1000 + 330 * 60 * 1000
  );

  let day = date.getDate();
  let month = date.getMonth()+1;
  let year = date.getFullYear();
  let hours = indiaTime.getHours();
  let minutes = indiaTime.getMinutes();

  let ampm = hours >= 12 ? "PM" : "AM";

  hours %= 12;
  hours = hours || 12; // the hour '0' should be '12'

  minutes = minutes < 10 ? "0" + minutes : minutes;

  return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
};
