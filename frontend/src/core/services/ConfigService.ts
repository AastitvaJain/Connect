import { getChannelPartnersApi, getNewProjectNamesApi, getSoldProjectNamesApi } from "../api/configApi";
import { getChannelPartnersStore, getNewProjectNamesStore, getSoldProjectNamesStore, setChannelPartners, setNewProjectNames, setSoldProjectNames } from "../utils/config";

export const refreshConfig = async () => {
    
    const [partners, newNames, soldNames] = await Promise.all([
      getChannelPartnersApi(),
      getNewProjectNamesApi(),
      getSoldProjectNamesApi()
    ]);
  
    setChannelPartners(partners);
    setNewProjectNames(newNames.map(p => p.projectName || ''));
    setSoldProjectNames(soldNames.map(p => p.projectName || ''));
};

export const getChannelPartners = () => {

    if(getChannelPartnersStore().length === 0) {
        refreshConfig();
    }

    return getChannelPartnersStore();
};

export const getNewProjectNames = () => {

    if(getNewProjectNamesStore().length === 0) {
        refreshConfig();
    }
    
    return getNewProjectNamesStore();
};

export const getSoldProjectNames = () => {
    
    if(getSoldProjectNamesStore().length === 0) {
        refreshConfig();
    }
    
    return getSoldProjectNamesStore();
};