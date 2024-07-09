import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./styles.module.css";

const SingleEventPage = () => {
  const [postInfo, setPostInfo] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetch(`http://localhost:8080/api/events/${id}`).then((response) => {
      response.json().then((data) => {
        setPostInfo(data);
      });
    });
  }, [id]);

  if (!postInfo) return "Loading...";

  return (
    <div className={styles.container}>
      <div className={styles.image}>
        <img
          src={`http://localhost:8080/${postInfo.cover}`}
          alt={postInfo.title}
        />
      </div>
      <h1 className={styles.header}>{postInfo.title}</h1>
      <p className={styles.summary}>{postInfo.summary}</p>
      <p className={styles.venue}>{postInfo.venue}</p>
      <p className={styles.date}>{postInfo.date}</p>
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: postInfo.content }}
      ></div>
    </div>
  );
};

export default SingleEventPage;
