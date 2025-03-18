import css from "styled-jsx/css";

export default css`
  header {
    display: flex;
    justify-content: space-between;
    align-items: stretch;
  }

  button {
    width: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    border: none;
  }

  button {
    border-left: var(--lineWidth) solid var(--lightGreen);
  }

  h3 {
    text-align: left;
    font-size: 16px;
    font-weight: 500;
    padding: 1em;
    margin: 0;
  }

  code {
    display: block;
    padding: 2em;
    text-align: center;
    white-space: nowrap;
    overflow-x: scroll;
  }

  code {
    border-top: var(--lineWidth) solid var(--lightGreen);
    background-color: var(--mistyGrey);
  }

  section {
    margin-bottom: 25px;
  }

  @media screen and (min-width: 900px) {
    section {
      margin-bottom: 50px;
    }
  }

  section {
    border: var(--lineWidth) solid var(--lightGreen);
  }
`;
