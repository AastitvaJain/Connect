import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ChannelPartnerDto, ProjectNameDto } from '../core/models/ConfigDto';

interface ConfigContextType {
  channelPartners: ChannelPartnerDto[];
  newProjectNames: ProjectNameDto[];
  soldProjectNames: ProjectNameDto[];
  setConfig: (config: {
    channelPartners: ChannelPartnerDto[];
    newProjectNames: ProjectNameDto[];
    soldProjectNames: ProjectNameDto[];
  }) => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
  const [channelPartners, setChannelPartners] = useState<ChannelPartnerDto[]>([]);
  const [newProjectNames, setNewProjectNames] = useState<ProjectNameDto[]>([]);
  const [soldProjectNames, setSoldProjectNames] = useState<ProjectNameDto[]>([]);

  const setConfig = ({ channelPartners, newProjectNames, soldProjectNames }: {
    channelPartners: ChannelPartnerDto[];
    newProjectNames: ProjectNameDto[];
    soldProjectNames: ProjectNameDto[];
  }) => {
    setChannelPartners(channelPartners);
    setNewProjectNames(newProjectNames);
    setSoldProjectNames(soldProjectNames);
  };

  return (
    <ConfigContext.Provider value={{ channelPartners, newProjectNames, soldProjectNames, setConfig }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
}; 