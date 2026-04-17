import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import './Contact.css';

export default function Contact() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = e => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>{t.contact.title}</h1>
          <p>{t.contact.subtitle}</p>
        </div>
      </div>

      <div className="section-py">
        <div className="container">
          <div className="contact-layout">
            {/* Info Cards */}
            <div className="contact-info">
              <div className="contact-brand">
                <span className="contact-crown">👑</span>
                <div>
                  <h2 style={{ color: 'var(--green-primary)', marginBottom: '0.25rem' }}>Royal Ghee & Sweets</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>رائل گھی اور مٹھائی</p>
                </div>
              </div>

              {[
                { icon: '📱', label: t.contact.phone, value: '+92 344 127 2427', href: 'tel:+923441272427' },
                { icon: '📧', label: t.contact.email, value: 'adiln8n@gmail.com', href: 'mailto:adiln8n@gmail.com' },
                { icon: '💬', label: t.contact.whatsapp, value: 'wa.me/923441272427', href: 'https://wa.me/923441272427' },
                { icon: '🕐', label: t.contact.hours, value: t.contact.hoursValue, href: null },
              ].map(({ icon, label, value, href }) => (
                <div key={label} className="contact-card">
                  <div className="contact-card-icon">{icon}</div>
                  <div>
                    <div className="contact-card-label">{label}</div>
                    {href ? (
                      <a href={href} target={href.startsWith('http') ? '_blank' : undefined}
                        rel="noopener noreferrer" className="contact-card-value link">{value}</a>
                    ) : (
                      <span className="contact-card-value">{value}</span>
                    )}
                  </div>
                </div>
              ))}

              {/* WhatsApp CTA */}
              <a
                href="https://wa.me/923441272427"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-lg contact-wa-btn"
                id="contact-whatsapp-btn"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22" style={{flexShrink:0}}>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Chat on WhatsApp
              </a>
            </div>

            {/* Message Form */}
            <div className="contact-form-wrap">
              <div className="contact-form-card">
                <h3 className="contact-form-title">{t.contact.sendMessage}</h3>

                {sent && (
                  <div className="success-alert">
                    ✅ Message sent! We'll get back to you shortly.
                  </div>
                )}

                <form onSubmit={handleSubmit} id="contact-message-form">
                  <div className="form-group">
                    <label htmlFor="cname">{t.contact.yourName}</label>
                    <input id="cname" className="form-control" value={form.name}
                      onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      placeholder="Muhammad Ali" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="cemail">{t.contact.yourEmail}</label>
                    <input id="cemail" type="email" className="form-control" value={form.email}
                      onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      placeholder="ali@example.com" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="cmessage">{t.contact.message}</label>
                    <textarea id="cmessage" className="form-control" rows={5} value={form.message}
                      onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                      placeholder="How can we help you?" required />
                  </div>
                  <button type="submit" id="contact-send-btn" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center' }}>
                    📤 {t.contact.send}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
