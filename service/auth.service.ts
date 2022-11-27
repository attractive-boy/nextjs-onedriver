// 鉴权服务

let client_id = process.env.client_id;

let client_secret = process.env.client_secret;

let redirect_uri = "";


  /**
   * 获取redirect_uri
   * @param req
   */
   const getRedirect = (req: any) => {

    const redirect = "https" + "://" + req.headers.host;
    redirect_uri = redirect;
  };

  /**
   * 获取Microsoft Graph API的code
   * @return {string}
   */
   export const getCode = (req:any): string => {
    getRedirect(req);
    const url = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${client_id}&response_type=code&redirect_uri=${redirect_uri}&response_mode=query&scope=openid%20offline_access%20https%3A%2F%2Fgraph.microsoft.com%2Fmail.read&state=12345`;
    return url;
  };

  /**
   * 获取Microsoft Graph API的token
   */
  export const getToken = async (code:string) => {
    //判断数据是否都有
    if (
      client_id &&
      client_secret &&
      redirect_uri &&
      code
    ) {
      const url = `https://login.microsoftonline.com/common/oauth2/v2.0/token`;
      const data = {
        client_id,
        client_secret,
        code,
        redirect_uri,
        grant_type: "authorization_code",
      };
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(data),
      });
      const json = await res.json();
      return json;
    }
  };

  /**
   * 刷新token
   * @param refresh_token
   * @return {Promise<unknown>}
   */
  export const refreshToken = async (): Promise<unknown> => {
    //判断数据是否都有
    if (
      client_id &&
      client_secret &&
      redirect_uri &&
      process.env.refresh_token
    ) {
      const url = `https://login.microsoftonline.com/common/oauth2/v2.0/token`;
      const data = {
        client_id,
        client_secret,
        refresh_token: process.env.refresh_token,
        redirect_uri,
        grant_type: "refresh_token",
      };
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(data),
      });
      const json = await res.json();
      //错误处理
      if (json.error) {
        //获取token失败
        return false;
      }
      process.env.access_token = json.access_token;
      process.env.refresh_token = json.refresh_token;
      return true;
    }
  }
