export interface IConfig {
    baseUrl: string;
    apiEndpoints: {
        register?: string;
        changePassword?: string;
        recoveryPassword?: string;
        resetPassword?: string;
        login?: string;
        logout?: string;
        refreshToken?:  string;
        getMe?: string;
      };
    appRoutes: {
      loginPage?: string;
      baseRootForAuthUsers?: string;
      redirectUrlWithNoPermission?: string;
    };
}
