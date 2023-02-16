import React from "react";
import {Editor} from 'amis-editor';

import {doHttp,getUrl,getUrlParam} from '../utils/httpUtil'
import {toast} from "amis";
import {Icon} from "../icons";
import {amisEnv} from "../amisEnv";

class EditorPageState{
  schema:any
  isMobile:boolean
  preview:boolean
}
export default class EditorPage extends React.Component {
  constructor(props:any) {
    super(props);
    this.state = {
      schema: "",
      isMobile: false,
      preview: false
    } as EditorPageState;
  }

  componentDidMount(){
    // @ts-ignore
    doHttp(getUrl()+ '/api/admin/processUi/getById?id='+getUrlParam("id"),{},"get",(result:any)=>{
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
      this.change(v)
    });
  }

  getState(){
    return this.state as EditorPageState;
  }
  save() {
    // @ts-ignore
    doHttp(getUrl()+ '/api/admin/processUi/save',{
      "id":getUrlParam("id"),
      "content":this.getState().schema
    },"post",(result:any)=>{
      toast.success('保存成功', '提示');
    });
  }

  change(value: any){
    console.log("change")
    this.setState({...this.state,
      schema:value
    })
  }

  setIsMobile(v:any){
    this.setState({...this.state,
      isMobile:v
    })
  }

  setPreview(v:any){
    this.setState({...this.state,
      preview:v
    })
  }

  render() {
    return <div className="Editor-Demo">
      <div className="Editor-header">
        <div className="Editor-title">可视化编辑器</div>
        <div className="Editor-view-mode-group-container">
          <div className="Editor-view-mode-group">
            <div
                className={`Editor-view-mode-btn editor-header-icon ${!this.getState().isMobile ? 'is-active' : ''}`}
                onClick={() => {this.setIsMobile(false);}}
            >
              <Icon icon="pc-preview" title="PC模式" />
            </div>
            <div
                className={`Editor-view-mode-btn editor-header-icon ${this.getState().isMobile ? 'is-active' : ''}`}
                onClick={() => {this.setIsMobile(true);}}
            >
              <Icon icon="h5-preview" title="移动模式" />
            </div>
          </div>
        </div>

        <div className="Editor-header-actions">
          <div
              className={`header-action-btn m-1 ${this.getState().preview ? 'primary' : ''}`}
              onClick={() => {this.setPreview(!this.getState().preview);}}
          >
            {this.getState().preview ? '编辑' : '预览'}
          </div>
          {!this.getState().preview && (
              <div className={`header-action-btn exit-btn`} onClick={()=>this.save()}>
                保存
              </div>
          )}
        </div>
      </div>
      <div className="Editor-inner">
        <Editor
            theme={'cxd'}
            preview={this.getState().preview}
            isMobile={this.getState().isMobile}
            value={this.getState().schema}
            onChange={(v)=>this.change(v)}
            onPreview={() => {this.setPreview(true);}}
            onSave={this.save}
            className="is-fixed"
            showCustomRenderersPanel={true}
            amisEnv={amisEnv}
            // amisEnv={{
            //   fetcher: store.fetcher,
            //   notify: store.notify,
            //   alert: store.alert,
            //   copy: store.copy,
            // }}
        />
      </div>
    </div>;
  }
}