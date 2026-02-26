import "./ChatInterface.css";

export default function ChatInterface() {
  return (
    <div className="app">
      <div className="chat-container">

        {/* Browser bar */}
        <div className="browser-bar">
          <div className="browser-pill">
            <span className="material-symbols-outlined lock">lock</span>
            yourdomainname.com
          </div>
        </div>

        {/* Header */}
        <div className="header">
          <div className="agent">
            <div className="avatar">
              F
              <span className="status-dot" />
            </div>
            <div>
              <h1>Franklin</h1>
              <span>Support Agent</span>
            </div>
          </div>

          <div className="user">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBo31h7smRGai6UOzuOD66m281sbdi7wUxmP2mnc4b7KHM4I6llhKdOjfBReG8o5W4jbJvT3-BnqDK3BObkcWjUjszA6rabL4TPqWp7bkIY4Nkrvy-H8LXzhnkcLMMIXoLWewIDBeB2ZNC9KEp9b0EUjMbrIDCfT-l8DGR9m8C2KZFP5G9SDLxhwycJKcA80nHWEFoDPjiC59MaBE73QeJWwnkGFu1uzdrCbaoIh8wRqNNcY3Zpoq2NUZkZXskDXYldm2yM-tbxAbk"
              alt="Jane Doe"
            />
            <div>
              <strong>Jane Doe</strong>
              <small>Online</small>
            </div>
            <button className="icon-btn">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        {/* Back */}
        <div className="back">
          <span className="material-symbols-outlined">arrow_back</span>
          Back to Chats
        </div>

        {/* Chat body */}
        <div className="chat-body">
          <div className="message-card">
            <div className="dates">
              {["22","23","24","25","26","27"].map(d => (
                <span key={d} className={d === "24" ? "active" : ""}>{d}</span>
              ))}
            </div>

            <div className="slots">
              {["9:00 AM", "10:30 AM", "2:00 PM", "3:30 PM"].map(t => (
                <button key={t}>{t}</button>
              ))}
            </div>
          </div>

          <div className="meta">
            <strong>Franklin</strong> just now
          </div>
        </div>

        {/* Input */}
        <div className="input-bar">
          <input placeholder="Message Franklin..." />
          <button>
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>

        {/* Bottom nav */}
        <div className="bottom-nav">
          <NavItem icon="home" label="Home" />
          <NavItem icon="chat_bubble" label="Chat" active />
          <NavItem icon="help" label="FAQs" />
          <NavItem icon="sms" label="Feedback" />
        </div>

        {/* Footer */}
        <div className="footer">
          Powered by <strong>Franklin</strong>
        </div>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active }) {
  return (
    <div className={`nav-item ${active ? "active" : ""}`}>
      <span className="material-symbols-outlined">{icon}</span>
      <span>{label}</span>
    </div>
  );
}
