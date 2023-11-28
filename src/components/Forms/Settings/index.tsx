import { ControlledTabs } from "@/components/Tabs/Tabs";
import { useState } from "react";
import { SettingsAdditionalDetails } from "./forms";
export const SettingsContent = () => {
  const [tabsValue, setTabsValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabsValue(newValue);
  };
  return (
    <>
      <ControlledTabs
        orientation="horizontal"
        value={tabsValue}
        handleChange={handleChange}
        style={{
          marginTop: "10px",
          padding: "10px",
        }}
        tabsinject={[
          {
            label: "Holidays / Closing Management",
          },
        ]}
      >
        {tabsValue == 0 && <SettingsAdditionalDetails />}
      </ControlledTabs>
    </>
  );
};
