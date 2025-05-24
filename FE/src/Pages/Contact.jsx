import React from "react";
import styles from "./Contact.module.css";

function Contact() {
  return (
    <div className={styles.contactContainer}>
      <h1>Contact Us</h1>
      <p>
        If you have any questions, comments, or feedback, feel free to reach out to us.
      </p>
      
      <div className={styles.contactInfo}>
        <div className={styles.infoBlock}>
          <h2>Address</h2>
          <p>
            123 Camera Shop Road<br />
            Photoville, CA 90210
          </p>
        </div>
        <div className={styles.infoBlock}>
          <h2>Phone</h2>
          <p>(123) 456-7890</p>
        </div>
        <div className={styles.infoBlock}>
          <h2>Email</h2>
          <p>support@camerashop.com</p>
        </div>
        <div className={styles.infoBlock}>
          <h2>Working Hours</h2>
          <p>
            Monday - Thursday: 9:00AM - 7:00PM<br />
            Friday: 9:00AM - 4:00PM<br />
            Saturday: Closed<br />
            Sunday: 9:30AM - 5:00PM
          </p>
        </div>
      </div>
    </div>
  );
}

export default Contact;