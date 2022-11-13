import Head from "next/head";
import * as fs from "fs";
import { Modal, Form, Input, Button, } from "antd";
import React, { useState } from "react";
import styles from "@/styles/home.module.css";
import CommonList from "@/components/fileList/CommonList";

//node全局变量
let store = {
  client_id: "",
  client_secret: "",
  redirect_uri: "",
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
    return auth;
  } catch (error) {
    console.log("err======>", error);
    return false;
  }
};

/**
 * 获取Microsoft Graph API的code
 * @returns string
 */
const getCode = (): string => {
  //从 mobx 中获取client_id 和 redirect_uri
  const client_id = store.client_id;
  const redirect_uri = store.redirect_uri;
  const url = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${client_id}&response_type=code&redirect_uri=${redirect_uri}&response_mode=query&scope=openid%20offline_access%20https%3A%2F%2Fgraph.microsoft.com%2Fmail.read&state=12345`;
  return url;
};

/**
 * 获取Microsoft Graph API的token
 * @param code string
 * @returns string
 */
const getToken = async (code: string) => {
  const url = `https://login.microsoftonline.com/common/oauth2/v2.0/token`;
  const data = {
    client_id: store.client_id,
    client_secret: store.client_secret,
    code,
    redirect_uri: store.redirect_uri,
    grant_type: "authorization_code",
    //失效时间
    expires_in: "99999999999999999999999999",
  };
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams(data),
  });
  const json = await res.json();
  //返回token
  return json.access_token;
};

/**
 *请求请求Microsoft Graph API OneDrive
 * @param token string
 * @returns data
 */
const getOneDrive = async (token: string) => {
  const url = `https://graph.microsoft.com/v1.0/me/drive/root/children`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await res.json();
  return json;
};

/**
 * 获取redirect_uri
 * @returns void
 * @param req
 */
const getRedirect = (req: any) => {
  const protocol = req.headers["x-forwarded-proto"] || "http";
  const redirect = protocol + "://" + req.headers.host;
  store.redirect_uri = redirect;
  return redirect;
};


export async function getServerSideProps(context: any) {
  const Auth = hasAuth();
  if (typeof Auth === "string" && Auth.length > 0) {
    //请求Microsoft Graph API OneDrive
    const data = await getOneDrive(Auth).then((res) => {
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
        redirect_uri: getRedirect(context.req),
      },
    };
  } else {
    if (context.query.code) {
      const code = context.query.code;
      //获取token
      const token = await getToken(code);
      //写入auth.txt
      fs.writeFileSync("auth.txt", token);
      //刷新页面
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    } //从 get请求中 中提取 client_id client_secret
    else if (context.query.client_id && context.query.client_secret) {
      store.client_id = context.query.client_id;
      store.client_secret = context.query.client_secret;
      //获取code
      const url = getCode();
      return {
        redirect: {
          destination: url,
          permanent: false,
        },
      };
    } else {
      return {
        props: {
          data: null,
          redirect_uri: getRedirect(context.req),
        },
      };
    }
  }
}

export default function Home(props: { data: any; redirect_uri: any }) {
  const [visible, setVisible] = useState(false);
  const [client_id, setClient_id] = useState(
    "8394c553-3693-41d2-a69b-fccdebc8cb5f"
  );
  const [client_secret, setClient_secret] = useState(
    "Dwh8Q~hgbdYMxeSvjn.YiEzpiKvqDO80RY2_tb3y"
  );
  React.useEffect(() => {
    setVisible(true);
  }, []);
  const handleOk = () => {
    setVisible(false);
    //将client_id 和 client_secret 给自己发请求
    window.open(
      `${props.redirect_uri}?client_id=${client_id}&client_secret=${client_secret}`,
      "_self"
    );
  };
  // 如果data里面有内容，就显示文件列表
  return (
    <div className={styles.body}>
      <Head>
        <title>FileShare</title>
        <meta name="description" content="share files from OneDrive" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        {/* 如果data里面有内容，就显示文件列表 */}
        {props.data && props.data.value?.length > 0 ? (
          <CommonList dataSource={props.data.value}></CommonList>
        ) : (
          <Modal
            title="授权"
            open={visible}
            closable={false}
            footer={
              <Button
                type="primary"
                className={styles.button}
                onClick={handleOk}
              >
                提交
              </Button>
            }
          >
            <Form
              name="authInfo"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 16 }}
            >
              <Form.Item label="client_id">
                <Input
                  className={styles.input}
                  defaultValue={client_id}
                  onChange={(e) => setClient_id(e.target.value)}
                />
              </Form.Item>
              <Form.Item label="client_secret">
                <Input.Password
                  className={styles.input}
                  defaultValue={client_secret}
                  visibilityToggle={false}
                  onChange={(e) => setClient_secret(e.target.value)}
                />
              </Form.Item>
            </Form>
          </Modal>
        )}
      </main>
      <footer className={styles.footer}>Powered by AttractiveBoy</footer>
    </div>
  );
}
