import axios from 'axios';

export function getUrl(){
  let url=window.location.origin
  console.log(url);
  console.log(url.indexOf("localhost"));

  if(url.indexOf("localhost")!=-1){
    return "http://localhost:8081";
  }

  return url;
}

export function getUrlParam(paraName:any) {
  let url = window.location.toString();
  let arrObj = url.split("?");

  if (arrObj.length > 1) {
    let arrPara = arrObj[1].split("&");
    let arr;

    for (let i = 0; i < arrPara.length; i++) {
      arr = arrPara[i].split("=");

      if (arr != null && arr[0] == paraName) {
        return arr[1];
      }
    }
    return "";
  }
  else {
    return "";
  }
}

export function doHttp(url:any,data:any,method:any,successCallBack:any,failCallBack:any){
  let headers={
    "token": getUrlParam("token"),
    "content-type": "application/json"
  }
  axios({
    url,
    method,
    headers,
    data
  }).then(res=> {
    console.log(res);
    var result=res.data
    if(result.status!=0){
      alert(result.msg)

      if(failCallBack){
        failCallBack(result);
      }
      return ;
    }

    if(successCallBack){
      successCallBack(result);
    }
  }).catch(err=> {
    console.log(err);
    alert(err)

    if(failCallBack){
      failCallBack(err);
    }
  });
}