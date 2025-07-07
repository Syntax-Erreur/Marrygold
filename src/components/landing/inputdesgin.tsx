"use client";

import React, { useEffect } from "react";
import CreateEventModal from "./createEventmodal";
import { setLastFormSubmission, type EventFormData } from "./placeholder-node";

interface InputDesignProps {
  onClose?: () => void;
  onSubmit?: (formData: EventFormData) => void;
}

function InputDesign({ onClose, onSubmit }: InputDesignProps = {}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleSubmit = (formData: EventFormData) => {
    console.log("Form submitted:", formData);
    
     setLastFormSubmission(formData);
    
     const addEventButton = document.querySelector('[data-add-event-button]');
    if (addEventButton) {
      (addEventButton as HTMLButtonElement).click();
    }
    
    // Call callbacks
    if (onSubmit) {
      onSubmit(formData);
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <CreateEventModal onClose={onClose} onSubmit={handleSubmit} />
  );
}

export default InputDesign;
