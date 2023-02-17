import React from 'react';
import {Editor, ShortcutKey} from 'amis-editor';
import {inject, observer} from 'mobx-react';
import {RouteComponentProps} from 'react-router-dom';
import {toast,Select} from 'amis';
import {Icon} from '../icons/index';
import {IMainStore} from '../store';
import '../editor/DisabledEditorPlugin'; // 用于隐藏一些不需要的Editor预置组件
import '../renderer/MyRenderer';
import '../editor/MyRenderer';

// @ts-ignore
import {doHttp,getUrl,getUrlParam} from '../utils/httpUtil'
import {amisEnv} from "../amisEnv";

export default inject('store')(
  observer(function ({
    store,
    location,
    history,
    match
  }: {store: IMainStore} & RouteComponentProps<{id: string}>) {

    if(!store.schema){
      const type=getUrlParam("type")
      let url=getUrl()+ '/api/admin/processUi/getById?id='+getUrlParam("id");
      if(type=="page"){
        url=getUrl()+ '/api/admin/uiPage/getById?id='+getUrlParam("id")
      }

      // @ts-ignore
      doHttp(url,{},"get",(result:any)=>{
        let v=result.data.content;
        console.log(v)
        if(!v){
          v={
            "type": "page",
            "title": "标题",
            "body": "Hello World!",
            "regions": [
              "body"
            ]
          };
        }else{
          v=JSON.parse(v)
        }
        store.updateSchema(v)
      });
    }

    function save() {
      const type=getUrlParam("type")
      let url=getUrl()+ '/api/admin/processUi/save';
      if(type=="page"){
        url=getUrl()+ '/api/admin/uiPage/save'
      }

      // @ts-ignore
      doHttp(url,{
        "id":getUrlParam("id"),
        "content":store.schema
      },"post",(result:any)=>{
        toast.success('保存成功', '提示');
      });
    }

    function onChange(value: any) {
      store.updateSchema(value);
    }

    return (
      <div className="Editor-Demo">
        <div className="Editor-header">
          <div className="Editor-title">可视化编辑器</div>
          <div className="Editor-view-mode-group-container">
            <div className="Editor-view-mode-group">
              <div
                className={`Editor-view-mode-btn editor-header-icon ${
                  !store.isMobile ? 'is-active' : ''
                }`}
                onClick={() => {
                  store.setIsMobile(false);
                }}
              >
                <Icon icon="pc-preview" title="PC模式" />
              </div>
              <div
                className={`Editor-view-mode-btn editor-header-icon ${
                  store.isMobile ? 'is-active' : ''
                }`}
                onClick={() => {
                  store.setIsMobile(true);
                }}
              >
                <Icon icon="h5-preview" title="移动模式" />
              </div>
            </div>
          </div>

          <div className="Editor-header-actions">
            <div
              className={`header-action-btn m-1 ${
                store.preview ? 'primary' : ''
              }`}
              onClick={() => {
                store.setPreview(!store.preview);
              }}
            >
              {store.preview ? '编辑' : '预览'}
            </div>
            {!store.preview && (
              <div className={`header-action-btn exit-btn`} onClick={save}>
                保存
              </div>
            )}
          </div>
        </div>
        <div className="Editor-inner">
          <Editor
            theme={'cxd'}
            preview={store.preview}
            isMobile={store.isMobile}
            value={store.schema}
            onChange={onChange}
            onPreview={() => {
              store.setPreview(true);
            }}
            onSave={save}
            className="is-fixed"
            showCustomRenderersPanel={true}
            amisEnv={{
              replaceText: amisEnv.replaceText,
              replaceTextKeys: amisEnv.replaceTextKeys,
              fetcher: amisEnv.fetcher,
              notify: store.notify,
              alert: store.alert,
              copy: store.copy,
            }}
          />
        </div>
      </div>
    );
  })
);
