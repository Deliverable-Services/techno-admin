import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  backButton: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  completed: {
    color: "red",
  },
}));

function getSteps() {
  return [
    "Confirmed",
    "Reached",
    "Picked",
    "Transit",
    "Processing",
    "Fulfilled",
  ];
}

function setValue(status) {
  switch (status) {
    case "confirmed":
      return 1;
    case "reached":
      return 2;
    case "picked":
      return 3;
    case "transit":
      return 4;
    case "processing":
      return 5;
    case "fulfilled":
      return 6;
    default:
      return -1;
  }
}

export default function ProgressBar({ orderStatus }) {
  const classes = useStyles();
  const [activeStep, setActiveStep] = React.useState(setValue(orderStatus));
  const steps = getSteps();

  if (activeStep === -1) return <span></span>;

  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
        {/* {activeStep === steps.length ? (
          <div>
            <Typography className={classes.instructions}>
              All steps completed
            </Typography>
            <Button onClick={handleReset}>Reset</Button>
          </div>
        ) : (
          <div>
            <Typography className={classes.instructions}>
              {getStepContent(activeStep)}
            </Typography>
            <div>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                className={classes.backButton}
              >
                Back
              </Button>
              <Button variant="contained" color="primary" onClick={handleNext}>
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
              </Button>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
}
