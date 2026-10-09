import { useRef, useState } from "react";
import {
    CircleCheck,
   CircleX,
  Star,
  Pencil,
  LogOut,
  Camera,
  Save,

} from "lucide-react";
import "../styles/profile.css";

const DEFAULT_AVATAR =
  "https://images.pexels.com/photos/28442318/pexels-photo-28442318.jpeg?auto=compress&cs=tinysrgb&h=300&w=300";

const ORGANIZATION = "Fandahom";

export default function Profile() {
  const [profile, setProfile] = useState({
    avatar: DEFAULT_AVATAR,
    name: "James Carter",
    email: "james.carter@fandahom.com",
  });
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(profile);
  const [touched, setTouched] = useState({
  name: false,
  email: false,
});

const isValidName = draft.name.trim().length >= 2;

const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
  draft.email.trim()
);

  const fileRef = useRef(null);

  const startEdit = () => {
    setDraft(profile);
    setEditing(true);
  };

  const cancelEdit = () => {
    setDraft(profile);
    setEditing(false);
  };

  const saveChanges = (e) => {
    e.preventDefault();
    setProfile(draft);
    setEditing(false);
  };

  const onPickPhoto = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setDraft((d) => ({ ...d, avatar: URL.createObjectURL(file) }));
    }
  };

  return (
    <div className="re-page re-profile">
      <div className="re-profile__card">
        {/* Avatar (editable in edit mode) */}
        <div className="re-profile__avatar-wrap">
          <div className="re-profile__avatar">
            <img
              src={editing ? draft.avatar : profile.avatar}
              alt="Profile"
            />
          </div>
          {editing && (
            <button
              type="button"
              className="re-profile__avatar-edit"
              onClick={() => fileRef.current?.click()}
              aria-label="Change profile photo"
            >
              <Camera size={16} />
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={onPickPhoto}
            hidden
          />
        </div>

        {!editing ? (
          <>
            <h1 className="re-profile__name">{profile.name}</h1>
            <p className="re-profile__email">{profile.email}</p>
            <p className="re-profile__org">{ORGANIZATION}</p>

            <div className="re-profile__stars" aria-hidden="true">
              <Star size={16} className="re-profile__star" fill="currentColor" />
              <Star size={16} className="re-profile__star" fill="currentColor" />
              <Star size={16} className="re-profile__star" fill="currentColor" />
              <Star size={16} className="re-profile__star" fill="currentColor" />
              <Star size={16} className="re-profile__star" fill="currentColor" />
            </div>

            <div className="re-profile__actions">
              <button
                className="re-btn re-btn--primary"
                type="button"
                onClick={startEdit}
              >
                <Pencil size={15} /> Edit Profile
              </button>
              <button className="re-btn re-btn--ghost" type="button">
                <LogOut size={15} /> Logout
              </button>
            </div>
          </>
        ) : (
          <form className="re-profile__form" onSubmit={saveChanges}>

           <div className="re-field">
  <label htmlFor="pf-name">Full Name</label>

  <div className="re-field__input-wrap">
    <input
      id="pf-name"
      type="text"
      value={draft.name}
      onChange={(e) => {
        setDraft({ ...draft, name: e.target.value });
        setTouched((t) => ({ ...t, name: true }));
      }}
      placeholder="Full name"
      required
    />

    {touched.name &&
      (isValidName ? (
        <CircleCheck className="re-field__status re-field__status--valid" size={18} />
      ) : (
        <CircleX className="re-field__status re-field__status--invalid" size={18} />
      ))}
  </div>
</div>

     <div className="re-field">
  <label htmlFor="pf-email">Email Address</label>

  <div className="re-field__input-wrap">
    <input
      id="pf-email"
      type="email"
      value={draft.email}
      onChange={(e) => {
        setDraft({ ...draft, email: e.target.value });
        setTouched((t) => ({ ...t, email: true }));
      }}
      placeholder="Email address"
      required
    />

    {touched.email &&
      (isValidEmail ? (
        <CircleCheck
          className="re-field__status re-field__status--valid"
          size={18}
        />
      ) : (
        <CircleX
          className="re-field__status re-field__status--invalid"
          size={18}
        />
      ))}
  </div>
</div>
{touched.email && !isValidEmail && (
  <span className="re-field__error">
    Email format is incorrect
  </span>
)}
            <div className="re-field">
              <label htmlFor="pf-org">Organization</label>
              <input id="pf-org" type="text" value={ORGANIZATION} readOnly />
            </div>

            <div className="re-profile__actions">
              <button className="re-btn re-btn--primary" type="submit">
                <Save size={15} /> Save Changes
              </button>
              <button
                className="re-btn re-btn--ghost"
                type="button"
                onClick={cancelEdit}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
