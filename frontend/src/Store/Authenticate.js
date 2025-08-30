import LocalStore from "./LocalStore"

class Authenticate {
    isAuthenticated() {
        const tokenData = LocalStore.getToken();
        return tokenData && tokenData.token ? true : false;
    }

    getRole() {
        const tokenData = LocalStore.getToken();
        return tokenData ? tokenData.role : null;
    }

    logoutUser() {
        LocalStore.removeToken();
    }

    getUserInfo() {
        const tokenData = LocalStore.getToken();
        return tokenData ? tokenData.userData : null;
    }
}
export default Authenticate = new Authenticate()