import * as fs from "fs";
import CommonList from "@/components/fileList";

let store = {
  token: "",
};

/**
 * 判断auth.txt里面是否有内容
 * @returns boolean
 */
const hasAuth = (): boolean | string => {
  //如果全局变量中有token，直接返回
  if (store.token && store.token !== "") {
    return store.token;
  }
  try {
    const auth = fs.readFileSync("auth.txt", "utf-8");
    store.token = auth;
    return auth;
  } catch (error) {
    console.log("err======>", error);
    return false;
  }
};

/**
 *获取文件夹下的文件
 * @param path string
 * @returns string[]
 */
const getFiles = async (path: string) => {
  // /drives/{drive-id}/root:/{path-relative-to-root}:/children
  const url = `https://graph.microsoft.com/v1.0/me/drive/root:/${path}:/children`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${store.token}`,
    },
  });
  const json = await res.json();
  return json;
};

export async function getServerSideProps(context: any) {
  //没有token，跳转到首页
  console.log("context======>", context);
  if (!hasAuth()) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  //获取文件夹下的文件
  const data = await getFiles(context.resolvedUrl).then((res) => {
    //如果请求失败，清除token
    if (res.error) {
      store.token = "";
      //文件内容清空
      fs.writeFileSync("auth.txt", "");
      return [];
    }
    return res;
  });
  return {
    props: {
      data,
    },
  };
}

const Post = (props: { data: any }) => {
  return (
    <CommonList
      dataSource={props.data.value?.length > 0 ? props.data.value : []}
    />
  );
};

export default Post;
