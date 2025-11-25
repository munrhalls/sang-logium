import React from "react";

type State = "initial" | "loading" | "final" | "error";

interface InstantFeedbackProps {
  renderState: (state: State) => React.ReactNode;
}

const InstantFeedback: React.FC<InstantFeedbackProps> = ({ renderState }) => {
  const states: State[] = ["initial", "loading", "final", "error"];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gap: "16px",
      }}
    >
      {states.map((state) => (
        <div key={state} style={{ border: "1px solid #ccc", padding: "16px" }}>
          <h3>{state.charAt(0).toUpperCase() + state.slice(1)} State</h3>
          {renderState(state)}
        </div>
      ))}
    </div>
  );
};

export default InstantFeedback;
