import { Outlet } from "react-router-dom";
import styled from "styled-components";
import Header from "./Header";
import Sidebar from "./Sidebar";

const StyledAppLayout = styled.div`
  display: grid;
  grid-template-columns: 26rem 1fr;
  grid-template-rows: auto 1fr;
  height: 100vh;
  background:
    radial-gradient(circle at top, rgba(127, 90, 240, 0.12) 0, transparent 55%),
    radial-gradient(circle at bottom, rgba(10, 6, 20, 0.95) 0, #05030a 60%);
`;

const Main = styled.main`
  background-color: transparent;
  padding: 4rem 4.8rem 6.4rem;
  overflow: auto;
`;

const Container = styled.div`
  max-width: 120rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 3.2rem;
  background-color: rgba(15, 14, 26, 0.9);
  border-radius: var(--border-radius-lg);
  padding: 3.2rem;
  box-shadow: var(--shadow-lg);
`;

function AppLayout() {
  return (
    <StyledAppLayout>
      <Header />
      <Sidebar />
      <Main>
        <Container>
          <Outlet />
        </Container>
      </Main>
    </StyledAppLayout>
  );
}

export default AppLayout;
