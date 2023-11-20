import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Badge, TabProps } from "@mui/material";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, index, value, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
type TabExtraData = {
  label: string;
};
type TabsProps = {
  tabsinject: TabExtraData[];
};

type ControlledTabsProps = {
  value: number;
  handleChange: (event: React.SyntheticEvent, newValue: number) => void;
  children: React.ReactNode;
  style?: React.CSSProperties;
  badgeContent?: number
  orientation: "horizontal" | "vertical" | undefined
};

type CombinedProps = ControlledTabsProps & TabsProps ;

export const ControlledTabs: React.FC<CombinedProps> = ({
  value,
  handleChange,
  tabsinject,
  children,
  badgeContent,
  orientation,
  ...rest
}) => {
  return (
    <Box sx={ orientation == 'horizontal' ? {width: '100%'}: { flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: 224 }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
        orientation={orientation}
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          {...rest}
        >
          {tabsinject.map((item: any, index: any) => (
            <Tab
             label={
              <Badge badgeContent={badgeContent} color='primary'>
                {item.label}
              </Badge>
            } 
            {...a11yProps(index)} key={index} />
          ))}
        </Tabs>
      </Box>
      {children}
    </Box>
  );
};
