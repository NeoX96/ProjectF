import React from 'react';

const LogoutButton = () => {
  const handleLogout = () => {
    document.cookie = "sessionID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    // replace "token" with the name of your cookie
    // set the expires date to the past to make the cookie expire immediately
    window.location.reload(); // reload the page to clear any remaining data
  };

  return (
    <button onClick={handleLogout}>Logout</button>
  );
};

export default LogoutButton;
