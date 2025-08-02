"use client";

interface MapProps {
  location?: string;
}

export default function Map({ location }: MapProps) {
  const query = location ? encodeURIComponent(location) : "Philippines";
  const iframeSrc = `https://www.google.com/maps?q=${query}&output=embed`;

  return (
    <iframe
      width="100%"
      height="100%"
      loading="lazy"
      style={{ border: 0 }}
      src={iframeSrc}
      allowFullScreen
    ></iframe>
  );
}
