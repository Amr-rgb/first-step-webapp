"use client";

import { useState } from "react";
import ServiceTypeToggle from "@/components/general/ServiceTypeToggle";
import Services from "@/components/general/Services";
import Headline from "@/components/general/Headline";
import { Service } from "@/types";

interface ServicesClientWrapperProps {
  parentServices: Service[];
  centerServices: Service[];
}

const ServicesClientWrapper = ({ parentServices, centerServices }: ServicesClientWrapperProps) => {
  const [selectedType, setSelectedType] = useState<"parent" | "center">(
    "parent"
  );

  // Select services based on selectedType
  const services = selectedType === "parent" ? parentServices : centerServices;

  return (
    <main>
      <ServiceTypeToggle
        selectedType={selectedType}
        onToggle={setSelectedType}
      />
      <Headline />
      <Services key={selectedType} services={services} />
    </main>
  );
};

export default ServicesClientWrapper;
