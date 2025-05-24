import React from "react";
import "./AboutUs.css"; 

function AboutUs() {
  return (
    <div className="about-us-container">
      {/* Hero Section */}
      <header className="hero-container">
        <div className="hero-content">
          <h1 className="hero-title">BUY WITH MANH</h1>
          <section className="welcome-section">
            <p className="welcome-heading">Welcome to</p>
            <p className="brand-name">MANH</p>
            <p className="welcome-subheading">WE'RE THRILLED YOU'RE HERE</p>
            <p className="welcome-text">
              Since our founding, MANH has been the trusted destination for
              photography lovers and creative professionals in Vietnam. We started
              with a deep passion for cameras and photography, and over time, our
              expertise has expanded into videography, audio equipment, drones,
              and more.
            </p>
            <p className="welcome-text">
              From beginners to professionals, we are here to equip and inspire
              you. Whether you're capturing life's most beautiful moments,
              creating cinematic masterpieces, or pushing the boundaries of
              creativity,
            </p>
            <p className="brand-emphasis">MANH</p>
            <p className="welcome-text">
              is with you every step of the way.
            </p>
            <p className="welcome-text">Let's create, no matter what!</p>
          </section>
        </div>
      </header>

      <section className="equipment-section">
        <div className="equipment-content">
          <h2 className="equipment-title">We See It Your Way</h2>
          <p className="equipment-description">
            If you're going to manifest your creative vision, you need the right
            equipment. Shop MANH for a powerhouse lineup of cameras, lenses,
            cinematography gear, studio lighting, tripods, pro audio and every
            cutting-edge accessory you need to create triumphant work.
          </p>
        </div>
        <div className="equipment-gallery">
          <figure className="gallery-item">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/e1266877e2cc2059fab4eb61af0066969d86fa62"
              alt="Camera equipment"
              className="img"
            />
          </figure>
          <figure className="gallery-item">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/6904f03c332587d8280707ac0a76e89d30246ad4"
              alt="Photography gear"
              className="img"
            />
          </figure>
          <figure className="gallery-item">
            <img
              src="https://cdn.builder.io/api/v1/image/assets/TEMP/3776e76b0142ac0049bf23d1e7573d26b8638f10"
              alt="Professional equipment"
              className="img"
            />
          </figure>
        </div>
      </section>

      {/* Feature Section */}
      <section className="feature-section">
        <figure className="feature-image">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/c6c8b1784b692e478d1dd0ae0856577ff6da8dd4"
            alt="Photographer with camera"
            className="img"
          />
        </figure>
        <article className="feature-content">
          <h2 className="feature-title">
            <span>Better Than New.</span>
            <br />
            <span>Better for your budget.</span>
          </h2>
          <p className="feature-description">
            <span>
              At MANH, buying pre-owned is better than new — every single time. We
              offer high-quality cameras and gear at the best prices, ensuring you
              get the most value for your money.
            </span>
            <br />
            <span>Capture more while spending less!</span>
          </p>
        </article>
      </section>
    </div>
  );
}

export default AboutUs;