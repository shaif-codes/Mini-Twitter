function formatDate(dateStr) {
    const dateObj = new Date(dateStr);
    const now = new Date();
  
    const diffInSeconds = Math.floor((now - dateObj) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
  
    if (diffInMinutes < 1) {
      return `few seconds`;
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours`;
    } else if (diffInDays < 7) {
      return `${diffInDays} days`;
    } else {
      const options = { day: '2-digit', month: 'short', year: '2-digit' };
      return dateObj.toLocaleDateString('en-GB', options).replace(/ /g, ' ');
    }
  }

export default formatDate;