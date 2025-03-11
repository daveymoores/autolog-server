import React from "react";
import useSystemTheme from "react-use-system-theme";

import palette from "../../utils/palette";
import styles from "./Command.styles";

export interface CommandProps {
  code: string;
  heading: string;
}

const Command: React.FC<CommandProps> = ({ code, heading }) => {
  const systemTheme = useSystemTheme("dark");
  return (
    <>
      <section>
        <header>
          <h3>{heading}</h3>
          <button>
            <svg
              width="29px"
              height="29px"
              viewBox="0 0 29 29"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
            >
              <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                <g
                  transform="translate(-448.000000, -11.000000)"
                  stroke={
                    systemTheme === "dark"
                      ? palette.LIGHT_GREEN
                      : palette.DARK_GREY
                  }
                  strokeWidth="3"
                >
                  <g transform="translate(448.000000, 11.000000)">
                    <rect x="1.5" y="1.5" width="19" height="19" rx="2" />
                    <rect
                      fill={
                        systemTheme === "dark"
                          ? palette.MISTY_GREY
                          : palette.MISTY_GREEN
                      }
                      x="8.5"
                      y="8.5"
                      width="19"
                      height="19"
                      rx="2"
                    />
                  </g>
                </g>
              </g>
            </svg>
          </button>
        </header>
        <code>{`> ${code}`}</code>
      </section>
      <style jsx>{styles}</style>
    </>
  );
};

export default Command;
