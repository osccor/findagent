import { useState, useEffect } from 'react';
import styled from 'styled-components';

// "Om mäklaren" — the agent's own profile text. Editable inline.
// Prototype: persisted to localStorage. Production: a field on the agent record,
// saved via fetchApi (PUT) behind the agent's own login.
const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`;

const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  h2 {
    font-size: 18px;
    line-height: 28px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.grey70};
  }
`;

const EditBtn = styled.button`
  appearance: none;
  border: 1px solid ${({ theme }) => theme.colors.grey20};
  background: #fff;
  color: ${({ theme }) => theme.colors.grey70};
  padding: 7px 14px;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 14px;
  font-weight: 600;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Body = styled.p`
  font-size: 16px;
  line-height: 27px;
  color: ${({ theme }) => theme.colors.grey70};
  white-space: pre-line;
`;

const Area = styled.textarea`
  width: 100%;
  min-height: 160px;
  resize: vertical;
  padding: 14px 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.grey20};
  font-family: inherit;
  font-size: 16px;
  line-height: 26px;
  color: ${({ theme }) => theme.colors.grey90};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  .count {
    margin-left: auto;
    font-size: 13px;
    color: ${({ theme }) => theme.colors.grey40};
  }
`;

const Save = styled.button`
  appearance: none;
  border: none;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  padding: 9px 18px;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 14px;
  font-weight: 600;

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const Cancel = styled.button`
  appearance: none;
  border: 1px solid ${({ theme }) => theme.colors.grey20};
  background: #fff;
  color: ${({ theme }) => theme.colors.grey60};
  padding: 9px 18px;
  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 14px;
  font-weight: 600;
`;

const Hint = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.grey40};
`;

const MAX = 800;

export default function ProfileBio({ slug, defaultBio }) {
  const [bio, setBio] = useState(defaultBio);
  const [draft, setDraft] = useState(defaultBio);
  const [editing, setEditing] = useState(false);
  const storageKey = `boneo:bio:${slug}`;

  // Load the agent's saved text after hydration (SSR renders the default, so the
  // first client render matches — no hydration mismatch).
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) setBio(saved);
    } catch {
      /* ignore */
    }
  }, [storageKey]);

  const startEdit = () => {
    setDraft(bio);
    setEditing(true);
  };

  const save = () => {
    const next = draft.trim().slice(0, MAX);
    setBio(next);
    try {
      window.localStorage.setItem(storageKey, next);
    } catch {
      /* ignore */
    }
    setEditing(false);
  };

  return (
    <Section>
      <Head>
        <h2>Om mäklaren</h2>
        {!editing ? <EditBtn type="button" onClick={startEdit}>Redigera profiltext</EditBtn> : null}
      </Head>

      {editing ? (
        <>
          <Area
            value={draft}
            maxLength={MAX}
            onChange={(e) => setDraft(e.target.value)}
            aria-label="Profiltext"
            placeholder="Berätta om dig själv, din erfarenhet och hur du arbetar…"
          />
          <Toolbar>
            <Save type="button" onClick={save}>Spara</Save>
            <Cancel type="button" onClick={() => setEditing(false)}>Avbryt</Cancel>
            <span className="count">
              {draft.length}/{MAX}
            </span>
          </Toolbar>
          <Hint>Detta är mäklarens egna text. I prototypen sparas den lokalt i din webbläsare.</Hint>
        </>
      ) : (
        <Body>{bio}</Body>
      )}
    </Section>
  );
}
