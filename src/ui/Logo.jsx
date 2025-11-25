import styled from "styled-components";
import { useDarkMode } from "../context/DarkModeContext";

const StyledLogo = styled.div`
  text-align: center;
`;

const Img = styled.img`
  height: 9.6rem;
  width: auto;
`;

const Title = styled.div`
  font-family: "Cinzel", "Times New Roman", serif;
  font-size: 2.4rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-brand-500);
`;

const Subtitle = styled.div`
  font-size: 1.2rem;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  color: var(--color-grey-500);
  margin-top: 0.4rem;
`;

function Logo() {
  const { isDarkMode } = useDarkMode();

  const src = isDarkMode ? "/logo-for-franken-jrpg3.png" : "/logo-for-franken-jrpg3.png";

  return (
    <StyledLogo>
      {/* If the images exist, show them; otherwise show text */}
      {src ? (
        <Img src={src} alt="The Gloaming House logo" />
      ) : (
        <>
          <Title>The Gloaming House</Title>
          <Subtitle>Inn Management Board</Subtitle>
        </>
      )}
    </StyledLogo>
  );
}

export default Logo;
