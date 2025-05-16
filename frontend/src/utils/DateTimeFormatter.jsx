const FormatDateTime = (rawTime) => {
    const date = new Date(rawTime);
    const pad = (n) => n.toString().padStart(2, '0');
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const year = pad(date.getFullYear() % 100);
    let hours = date.getHours();
    const minutes = pad(date.getMinutes());
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;

    return `${month}-${day}-${year} / ${pad(hours)}:${minutes} ${ampm}`;
  };

export default FormatDateTime