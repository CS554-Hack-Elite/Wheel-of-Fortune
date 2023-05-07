import React, { useEffect } from "react";

export const TimeoutComponent = ({
  show,
  setShow,
  seconds = 2000,
  children,
}) => {
  useEffect(() => {
    if (show) {
      const timeout = setTimeout(() => {
        setShow(false);
      }, seconds);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [show]);

  return <div>{show && children}</div>;
};
