<template>
  <div class="footer-page">
    
    <!-- OPTIONAL: High-End Photo/Instagram Grid above footer -->
    <!-- <div class="photo-grid">
      <div class="grid-item" v-for="n in 6" :key="n">
        <img :src="`/picture/grid-${n}.jpg`" alt="Resort Gallery" class="grid-img" />
        <div class="grid-overlay"><i class="fab fa-instagram"></i></div>
      </div>
    </div> -->

    <footer class="footer glass-footer">
      <div class="footer-container">
        
        <!-- 1. Brand & Copyright -->
        <div class="footer-section logo-section">
          <div class="logo-center" @click="$router.push('/')">
            <div class="logo-box"><img src="/logo/logo.png" alt="Logo" /></div>
            <!-- <div class="logo-title">CHAMNAB</div>
            <div class="logo-subtitle">Resort</div> -->
          </div>
          <p class="copyright-text">&copy; 2026 CHAMNAB Resort. <br>All rights reserved.</p>
        </div>

        <!-- 2. Quick Links -->
        <div class="footer-section quick-links-section">
          <h4>Explore</h4>
          <ul>
            <li><router-link to="/">Home</router-link></li>
            <li><router-link to="/rooms">Rooms & Suites</router-link></li>
            <li><router-link to="/amenities">Spa & Wellness</router-link></li>
            <li><router-link to="/dining">Fine Dining</router-link></li>
            <li><router-link to="/booking">Book a Room</router-link></li>
          </ul>
        </div>
        
        <!-- 3. Contact Information -->
        <div class="footer-section contact-section">
          <h4>Get in Touch</h4>
          <p>
            Chamkar Ta Chambat, near Checkpoint 400, Vireak Chey Village, Samlout Commune, Samlout District,
            Battambang Province. 
          </p>
          <p class="contact-methods">
            <a href="mailto:reservations@montanaresort.com">voeun_chamnab168@yahoo.com</a><br>
            <a href="tel:+855 96 553 3359">096 553 3359</a>
          </p>
        </div>

        <!-- 4. Newsletter & Socials -->
        <div class="footer-section social-section">
          <h4>Newsletter</h4>
          <!-- <p class="newsletter-desc">Subscribe to receive exclusive offers and mountain retreat inspiration.</p> -->
          
          <form class="newsletter-form" @submit.prevent>
            <input type="email" placeholder="Your email address" required />
            <button type="submit">Subscribe</button>
          </form>

          <div class="social-list">
            <a href="#" target="_blank" class="social-item"><i class="fab fa-facebook-f"></i></a>
            <a href="#" target="_blank" class="social-item"><i class="fab fa-instagram"></i></a>
            <a href="#" target="_blank" class="social-item"><i class="fab fa-twitter"></i></a>
          </div>
        </div>

      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: "FooterPage",
};
</script>

<style scoped>
.footer-page {
  width: 100%;
  position: relative;
  /* Uncomment the next line if you have a page background image you want to blur through the footer */
  /* background: url('/picture/footer-bg.jpg') center/cover no-repeat fixed; */
}

/* --- Photo Grid Section --- */
.photo-grid {
  display: flex;
  width: 100%;
  height: 150px;
}

.grid-item {
  flex: 1;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.grid-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
  background-color: #1a1a1a; /* Fallback color if image is missing */
}

.grid-overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 191, 255, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.grid-overlay i {
  color: #fff;
  font-size: 24px;
}

.grid-item:hover .grid-img {
  transform: scale(1.1);
}

.grid-item:hover .grid-overlay {
  opacity: 1;
}

/* --- Base Footer Styling with Glass Effect --- */
.footer {
  /* Semi-transparent background for the blur effect to work */
  background: rgba(10, 10, 10, 0.92); 
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  
  color: #ffffff;
  padding: 80px 20px 40px;
  font-family: 'Inter', sans-serif;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1.5fr; 
  gap: 40px; 
  max-width: 1200px;
  margin: 0 auto;
}

.footer-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
}

/* Typography & Links */
.footer-section h4 {
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 25px;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.footer-section p {
  font-size: 0.95rem;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 15px; 
}

.footer a {
  color: rgba(255, 255, 255, 0.7); 
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer a:hover {
  color: #00bfff;
}

/* Quick Links List */
.footer-section ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.footer-section li {
  margin-bottom: 12px;
  font-size: 0.95rem;
}

/* Logo Styling */
.logo-center {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  cursor: pointer;
  color: #ffffff;
  margin-bottom: 20px;
}

.logo-box {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  margin-bottom: 4px;
}

.logo-title {
  font-size: 24px;
  font-weight: 400;
  letter-spacing: 1px;
  line-height: 1.1;
}

.logo-subtitle {
  font-size: 8px;
  letter-spacing: 3px;
  text-transform: uppercase;
  opacity: 0.6;
}

.copyright-text {
  font-size: 0.85rem !important;
  margin-top: 20px;
}

/* Newsletter Form */
.newsletter-desc {
  margin-bottom: 20px !important;
}

.newsletter-form {
  display: flex;
  width: 100%;
  margin-bottom: 30px;
}

.newsletter-form input {
  flex: 1;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 12px 15px;
  color: #ffffff;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  outline: none;
  border-radius: 4px 0 0 4px;
  transition: border-color 0.3s ease;
}

.newsletter-form input:focus {
  border-color: #00bfff;
}

.newsletter-form input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.newsletter-form button {
  background: #00bfff;
  color: #ffffff;
  border: none;
  padding: 0 20px;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  border-radius: 0 4px 4px 0;
  transition: background-color 0.3s ease;
}

.newsletter-form button:hover {
  background: #009ce0;
}

/* Social Icons Horizontal Row */
.social-list {
  display: flex;
  gap: 15px;
}

.social-item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.05);
  color: #ffffff;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.social-item:hover {
  background-color: #00bfff;
  color: #ffffff;
  transform: translateY(-3px);
}

/* --- COMPREHENSIVE RESPONSIVE STYLES --- */

/* Laptops / Small Desktops (max-width: 1024px) */
@media (max-width: 1024px) {
  .footer-container {
    gap: 30px;
  }
}

/* Tablets Landscape & Portrait (max-width: 992px) */
@media (max-width: 992px) {
  .footer-container {
    grid-template-columns: 1fr 1fr; /* Drops to 2 columns */
    gap: 50px;
  }
  .photo-grid {
    height: 120px;
  }
}

/* Large Mobile / Phablets (max-width: 768px) */
@media (max-width: 768px) {
  .footer {
    padding: 60px 20px 30px;
  }
  
  .footer-container {
    grid-template-columns: 1fr; /* Stacks to 1 column */
    gap: 40px;
  }

  .footer-section {
    align-items: center; /* Center aligns everything for better mobile readability */
    text-align: center;
  }

  .logo-center {
    align-items: center;
  }

  .newsletter-form {
    max-width: 400px;
    margin: 0 auto 30px auto;
  }

  /* Hide half the grid items on mobile so they aren't too small */
  .grid-item:nth-child(n+4) {
    display: none;
  }
  .photo-grid {
    height: 100px;
  }
}

/* Small Mobile Phones (max-width: 480px) */
@media (max-width: 480px) {
  .footer {
    padding: 50px 15px 20px;
  }

  .newsletter-form {
    flex-direction: column; /* Stack input and button */
    width: 100%;
  }
  
  .newsletter-form input {
    border-radius: 4px;
    margin-bottom: 10px;
  }
  
  .newsletter-form button {
    border-radius: 4px;
    padding: 14px;
    width: 100%;
  }

  .footer-section h4 {
    font-size: 1rem;
    margin-bottom: 15px;
  }

  .photo-grid {
    display: none; /* Hide grid entirely on very small screens to save space */
  }
}
</style>