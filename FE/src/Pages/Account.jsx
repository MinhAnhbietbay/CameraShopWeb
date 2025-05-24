import React from "react";
import styles from "./Account.module.css";
import Sidebar from "../Components/Sidebar";

import write from "../assets/icons/write.svg";

function InformationSection({ title, showEditIcon, children }) {
  return (
    <section className={styles.infoSection}>
      <header className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        {showEditIcon && (
          <img
            src={write}
            alt="Edit"
            className={styles.editIcon}
          />
        )}
      </header>
      <div className={styles.sectionContent}>{children}</div>
    </section>
  );
}

function DashboardContent() {
  return (
    <div className={styles.dashboardContent}>
      <h1 className={styles.dashboardTitle}>My Dashboard</h1>
      <p className={styles.dashboardDescription}>
        From your My Account Dashboard you have the ability to view a snapshot
        of your recent account activity and update your account information.
        Select a link below to view or edit information.
      </p>
      <main className={styles.infoContainer}>
        <InformationSection title="Contact Information" showEditIcon={true}>
          <span>Pham Minh Anh</span>
          <br />
          <span>minhanhip38gmail.com</span>
          <br />
          <br />
          <a href="#" className={styles.link}>
            Change Password?
          </a>
        </InformationSection>

        <InformationSection title="Default Delivery Address" showEditIcon={true}>
          You have not set a default delivery address.
        </InformationSection>

        <InformationSection title="Newsletters" showEditIcon={false}>
          You aren't subscribed to our newsletter.
        </InformationSection>
      </main>
    </div>
  );
}

function InputDesign() {
  return (
    <div className={styles.container}>
      <h2 className={styles.sidebarTitle}>Have a good time</h2>
      <Sidebar />
      <DashboardContent />
    </div>
  );
}

export default InputDesign;