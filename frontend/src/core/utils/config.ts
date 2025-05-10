import { save, clear, load } from "./store";

  
  // Channel Partners
  export const setChannelPartners = (list: any[]) => save('channelPartners', list);
  export const getChannelPartnersStore = () => load<any>('channelPartners');
  export const clearChannelPartners = () => clear('channelPartners');
  
  // New Project Names
  export const setNewProjectNames = (list: any[]) => save('newProjectNames', list);
  export const getNewProjectNamesStore = () => load<any>('newProjectNames');
  export const clearNewProjectNames = () => clear('newProjectNames');
  
  // Sold Project Names
  export const setSoldProjectNames = (list: any[]) => save('soldProjectNames', list);
  export const getSoldProjectNamesStore = () => load<any>('soldProjectNames');
  export const clearSoldProjectNames = () => clear('soldProjectNames');
  