import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import {
  MapPin,
  Phone,
  Mail,
  Send,
  CheckCircle2,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Clock,
} from "lucide-react";
import "leaflet/dist/leaflet.css";
import "../styles/contact.css";

const OFFICE = { lat: 6.6823835, lng: 3.300265, label: "Fandahom HQ, Lagos" };

const officeIcon = L.divIcon({
  className: "re-contact-pin",
  html: '<div class="re-contact-pin__inner"></div>',
  iconSize: [34, 34],
  iconAnchor: [17, 34],
  popupAnchor: [0, -32],
});

const initialForm = { name: "", email: "", subject: "", message: "" };

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Please enter your name";
    if (!form.email.trim()) e.email = "Please enter your email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email address";
    if (!form.subject.trim()) e.subject = "Please add a subject";
    if (!form.message.trim()) e.message = "Please write a message";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) return;
    setSending(true);
    // Simulate async submission
    setTimeout(() => {
      setSending(false);
      setSent(true);
      setForm(initialForm);
    }, 700);
  };

  const resetSent = () => setSent(false);

  return (
    <div className="re-page re-contact">
      <div className="re-contact__inner">
        {/* Heading */}
        <header className="re-contact__head">
          <span className="re-contact__eyebrow">Get in touch</span>
          <h1>Lets find your next home</h1>
          <p>
            Have a question about a listing or want to schedule a viewing? Our
            team is ready to help.
          </p>
        </header>

        <div className="re-contact__grid">
          {/* Info column */}
          <div className="re-contact__info">
            <div className="re-contact__info-cards">
              <div className="re-contact__info-card">
                <div className="re-contact__info-icon re-contact__info-icon--primary">
                  <MapPin size={20} />
                </div>
                <div>
                  <h3>Office Address</h3>
                  <p>106 Agbado Road, Jankara Ijaye ojokoro Lagos, Nigeria</p>
                </div>
              </div>
              <div className="re-contact__info-card">
                <div className="re-contact__info-icon re-contact__info-icon--accent">
                  <Phone size={20} />
                </div>
                <div>
                  <h3>Phone Number</h3>
                  <p>
                    <a href="tel:+2348145446512">+234 (814) 544-6512</a>
                  </p>
                </div>
              </div>
              <div className="re-contact__info-card">
                <div className="re-contact__info-icon re-contact__info-icon--success">
                  <Mail size={20} />
                </div>
                <div>
                  <h3>Email Address</h3>
                  <p>
                    <a href="mailto:hello@estatepro.com">hello@fandahom.com</a>
                  </p>
                </div>
              </div>
              <div className="re-contact__info-card">
                <div className="re-contact__info-icon re-contact__info-icon--dark">
                  <Clock size={20} />
                </div>
                <div>
                  <h3>Working Hours</h3>
                  <p>Mon – Sat · 9:00 AM – 7:00 PM</p>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="re-contact__map">
              <MapContainer
                center={[OFFICE.lat, OFFICE.lng]}
                zoom={14}
                scrollWheelZoom={false}
                className="re-leaflet"
              >
              <TileLayer
                 attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                 url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
               />
                <Marker position={[OFFICE.lat, OFFICE.lng]} icon={officeIcon}>
                  <Popup>{OFFICE.label}</Popup>
                </Marker>
              </MapContainer>
            </div>

            {/* Socials */}
            <div className="re-contact__socials">
              <a href="#" aria-label="Facebook"><Facebook size={18} /></a>
              <a href="#" aria-label="Twitter"><Twitter size={18} /></a>
              <a href="#" aria-label="Instagram"><Instagram size={18} /></a>
              <a href="#" aria-label="LinkedIn"><Linkedin size={18} /></a>
            </div>
          </div>

          {/* Form column */}
          <div className="re-contact__formwrap">
            {sent ? (
              <div className="re-contact__success">
                <CheckCircle2 size={56} />
                <h2>Message sent!</h2>
                <p>
                  Thanks for reaching out. One of our agents will get back to you
                  within 24 hours.
                </p>
                <button className="re-btn re-btn--primary" type="button" onClick={resetSent}>
                  Send another message
                </button>
              </div>
            ) : (
              <form className="re-contact__form" onSubmit={handleSubmit} noValidate>
                <h2>Send us a message</h2>

                <div className="re-field">
                  <label htmlFor="c-name">Full Name</label>
                  <input
                    id="c-name"
                    name="name"
                    type="text"
                    placeholder="Tunde Bello"
                    value={form.name}
                    onChange={handleChange}
                    aria-invalid={!!errors.name}
                  />
                  {errors.name && <span className="re-field__error">{errors.name}</span>}
                </div>

                <div className="re-field">
                  <label htmlFor="c-email">Email Address</label>
                  <input
                    id="c-email"
                    name="email"
                    type="email"
                    placeholder="tunde@example.com"
                    value={form.email}
                    onChange={handleChange}
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && <span className="re-field__error">{errors.email}</span>}
                </div>

                <div className="re-field">
                  <label htmlFor="c-subject">Subject</label>
                  <input
                    id="c-subject"
                    name="subject"
                    type="text"
                    placeholder="I'd like to schedule a viewing"
                    value={form.subject}
                    onChange={handleChange}
                    aria-invalid={!!errors.subject}
                  />
                  {errors.subject && <span className="re-field__error">{errors.subject}</span>}
                </div>

                <div className="re-field">
                  <label htmlFor="c-message">Message</label>
                  <textarea
                    id="c-message"
                    name="message"
                    rows={5}
                    placeholder="Tell us a bit about what you're looking for…"
                    value={form.message}
                    onChange={handleChange}
                    aria-invalid={!!errors.message}
                  />
                  {errors.message && <span className="re-field__error">{errors.message}</span>}
                </div>

                <button
                  className="re-btn re-btn--primary re-contact__submit"
                  type="submit"
                  disabled={sending}
                >
                  {sending ? (
                    "Sending…"
                  ) : (
                    <>
                      <Send size={16} /> Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
