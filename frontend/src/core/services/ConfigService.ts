import { getChannelPartnersApi, getNewProjectNamesApi, getSoldProjectNamesApi } from "../api/configApi";
import { setChannelPartners, setNewProjectNames, setSoldProjectNames } from "../utils/config";

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
    return getChannelPartnersApi();
};

export const getNewProjectNames = () => {
    return getNewProjectNamesApi();
};

export const getSoldProjectNames = () => {
    return getSoldProjectNamesApi();
};