import { AppConfig, UserSession } from '@stacks/connect';
export const useUserSession = () => {
    const appConfig = new AppConfig(['store_write', 'publish_data']);
    const userSession = new UserSession({ appConfig });
    return userSession;
}
