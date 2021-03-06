import React from 'react';
import ImageCompressor from 'image-compressor.js';
import PropTypes from 'prop-types'

import './index.css';
import Crop from './cropper';
import Modal from './modal';


export const changeStyle = (isMobile, className) => {
  if (isMobile) {
    return className + 'App'
  } else {
    return className
  }
}

class ReactDemo extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showCropper: false,
      fileUrl: '',
      defaultCompress: {
        maxWidth: 300,
        maxHeight: 300,
        convertSize: 10000,
        isShowToast:false,
        isError:false
      }
    }
    this.onFileChange = this.onFileChange.bind(this)
    this.getBase64 = this.getBase64.bind(this);
    this.changeShowCropper = this.changeShowCropper.bind(this);

  }

  getBase64 (img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  onFileChange (e) {
    this.setState({
      isShowToast:true
    })
    const { files } = e.target;
    const { compress,maxSize } = this.props;
    const { defaultCompress } = this.state;
    const resCompress = { ...defaultCompress, ...compress };
    const fileSize = files[0].size || 0
    if(fileSize>maxSize*1024*1024){
      this.setState({
        isError:true,
      })
      setTimeout(()=>
      this.setState({
        isShowToast:false
      }),2000)
      return
    }

    if (files) {
      const imageCompressor = new ImageCompressor();
      imageCompressor
        .compress(files[0], resCompress)
        .then(result => {
          this.getBase64(result, res => {
            this.setState({
              isShowToast:false,
              fileUrl: res,
              showCropper: true,
            });
          });
        });
    }
  }

  changeShowCropper (showCropper) {
    this.setState({
      showCropper
    })
  }



  render () {
    const { showCropper, fileUrl,isShowToast ,isError} = this.state;
    const { btnText,infoText,errorText, accept, uploadText,isMobile, imgSrc, onChange, minCropBoxWidth, minCropBoxHeight, width, height, toDataURLtype, btnBackText, btnConfirmText } = this.props;
     return (
      <div className={changeStyle(isMobile, 'wrapper')}>
        {!isShowToast?
          <div>
          {!showCropper &&
            <div className={changeStyle(isMobile, 'content')}>
              <div className={changeStyle(isMobile, 'image')}>
                <img className={changeStyle(isMobile, 'img')} src={imgSrc} alt="" />
  
              </div>
              <div className={changeStyle(isMobile, 'btnGroup')}>
                <div className={changeStyle(isMobile, 'fileBtn')}>
                  <input className={changeStyle(isMobile, 'file')} type="file" onChange={this.onFileChange} accept={accept} capture="camera" />
                  <div className={changeStyle(isMobile, 'btn')}>
                    {btnText}
                  </div>
                </div>
              </div>
              <div className={changeStyle(isMobile, 'tips')}>
                <div className={changeStyle(isMobile, 'tip')}>{infoText}</div>
              </div>
            </div>
          }
          {showCropper &&
            <div className={changeStyle(isMobile, 'content')}>
              <Crop
                fileUrl={fileUrl}
                onChange={onChange}
                minCropBoxWidth={minCropBoxWidth}
                minCropBoxHeight={minCropBoxHeight}
                width={width}
                height={height}
                toDataURLtype={toDataURLtype}
                btnBackText={btnBackText}
                btnConfirmText={btnConfirmText}
                infoText={infoText}
                isMobile={isMobile}
                onChangeShowCropper={showCropper => this.changeShowCropper(showCropper)}
                onChangeShowCropper={showCropper => this.changeShowCropper(showCropper)}
              />
            </div>
          }
          </div>:
          <Modal uploadText={uploadText} isError={isError} errorText={errorText}/>
          
}
      </div >)
  }
}

ReactDemo.defaultProps = {
  btnText: '选择照片',
  btnBackText: '返回',
  btnConfirmText: '确认',
  infoText: '上传照片用于人脸识别开门或者签到',
  compress: {
    maxWidth: 300,
    maxHeight: 300,
    convertSize: 10000,
  },
  accept: '.jpg, .jpeg, .png',
  onChange: (e) => { console.log('result', e) },
  minCropBoxWidth: 100,
  minCropBoxHeight: 100,
  width: 300,
  height: 300,
  toDataURLtype: 'image/jpeg',
  imgSrc: '',
  isMobile: false,
  uploadText:'正在上传',
  errorText:'上传大小不能超过10M',
  maxSize:10
  
}

ReactDemo.propTypes = {
  btnText: PropTypes.string,
  btnBackText: PropTypes.string,
  btnConfirmText: PropTypes.string,
  infoText: PropTypes.string,
  uploadText: PropTypes.string,
  compress: PropTypes.object,
  accept: PropTypes.string,
  onChange: PropTypes.func,
  minCropBoxWidth: PropTypes.number,
  minCropBoxHeight: PropTypes.number,
  width: PropTypes.number,
  height: PropTypes.number,
  maxSize: PropTypes.number,
  toDataURLtype: PropTypes.string,
  imgSrc: PropTypes.string,
  errorText: PropTypes.string,
  isMobile: PropTypes.bool,
}



export default ReactDemo;
