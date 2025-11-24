import styled from "styled-components";

const DashboardBox = styled.div`
  /* Box */
  background: radial-gradient(circle at top, rgba(127, 90, 240, 0.16) 0, rgba(10, 6, 20, 0.96) 55%);
  border: 1px solid rgba(148, 163, 184, 0.4);
  border-radius: var(--border-radius-md);

  padding: 3.2rem;

  display: flex;
  flex-direction: column;
  gap: 2.4rem;

  box-shadow: 0 0 32px rgba(15, 23, 42, 0.9);
`;

export default DashboardBox;
