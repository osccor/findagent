import styled from 'styled-components';

// Answer-first block aimed at AI/LLM answer engines: a direct question heading,
// a concise factual paragraph, then the ranked top-3 as a real ordered list.
const Box = styled.section`
  background: #fff;
  border: 1px solid ${({ theme }) => theme.colors.grey20};
  border-left: 5px solid ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.card};
  padding: 24px 28px;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: 20px;
  }
`;

const Question = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.grey90};
  margin-bottom: 10px;
`;

const Para = styled.p`
  font-size: 16px;
  line-height: 26px;
  color: ${({ theme }) => theme.colors.grey70};
`;

const TopList = styled.ol`
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  counter-reset: top;
`;

const Row = styled.li`
  position: relative;
  padding-left: 38px;
  font-size: 15px;
  line-height: 22px;
  color: ${({ theme }) => theme.colors.grey70};
  counter-increment: top;

  &::before {
    content: counter(top);
    position: absolute;
    left: 0;
    top: 0;
    width: 26px;
    height: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primaryTint};
    color: ${({ theme }) => theme.colors.primaryDark};
    font-weight: 700;
    font-size: 14px;
  }

  strong {
    color: ${({ theme }) => theme.colors.grey90};
  }
  span {
    color: ${({ theme }) => theme.colors.grey60};
  }
`;

const Updated = styled.p`
  margin-top: 16px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.grey40};
`;

export default function AnswerBox({ answer, updatedLabel }) {
  return (
    <Box>
      <Question>{answer.question}</Question>
      <Para>{answer.paragraph}</Para>
      {answer.list.length ? (
        <TopList>
          {answer.list.map((item) => (
            <Row key={item.name}>
              <strong>{item.name}</strong> – {item.agency}. <span>{item.reason}</span>
            </Row>
          ))}
        </TopList>
      ) : null}
      <Updated>Senast uppdaterad {updatedLabel}. Baserad på offentlig försäljningsstatistik.</Updated>
    </Box>
  );
}
