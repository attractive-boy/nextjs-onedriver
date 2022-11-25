import { refreshToken } from "./auth.service";
const baseUrl = "https://graph.microsoft.com/v1.0";

export const getdir = async (path?: string) => {
  const url = path ? `${baseUrl}/me/drive/root:/${path}:/children` : `${baseUrl}/me/drive/root/children`;
  const res = await fetch(url, { method: "GET",  headers: {
    Authorization: `Bearer ${process.env.access_token}`,
    }});
  const json = await res.json();
  //错误处理
  if (json.error) {
    //如果token过期，重新获取token
    if (json.error.code == "InvalidAuthenticationToken") {
        const status = await refreshToken();
        if (status) {
        await getdir(path);
        } else {
        return 'refresh';
        }
    }
  }
  return json;
};

//下载文件
export const download = async (path: string) => {
    const url = `${baseUrl}/me/drive/root:/${path}:/content`;
    const res = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${process.env.access_token}`,
        },
    });
    return res;
};


