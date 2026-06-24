import styled from 'styled-components';

// Native <details> accordion: works without JS, accessible, and the Q/A text is
// mirrored into FAQPageJsonLd on the page for rich results + AI answers.
const Section = styled.section`
  h2 {
    font-size: 22px;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.grey90};
    margin-bottom: 16px;
  }
`;

const Item = styled.details`
  background: #fff;
  border: 1px solid ${({ theme }) => theme.colors.grey20};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 0 18px;
  margin-bottom: 10px;

  &[open] {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  summary {
    list-style: none;
    cursor: pointer;
    padding: 16px 0;
    font-size: 16px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.grey90};
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
  }
  summary::-webkit-details-marker {
    display: none;
  }
  summary::after {
    content: '+';
    font-size: 22px;
    font-weight: 400;
    color: ${({ theme }) => theme.colors.primary};
  }
  &[open] summary::after {
    content: '−';
  }

  .answer {
    padding: 0 0 18px;
    font-size: 15px;
    line-height: 24px;
    color: ${({ theme }) => theme.colors.grey70};
  }
`;

export default function Faq({ faq, placeName }) {
  if (!faq?.length) return null;
  return (
    <Section aria-label="Vanliga frågor">
      <h2>Vanliga frågor om mäklare i {placeName}</h2>
      {faq.map((item) => (
        <Item key={item.question}>
          <summary>{item.question}</summary>
          <div className="answer">{item.answer}</div>
        </Item>
      ))}
    </Section>
  );
}
